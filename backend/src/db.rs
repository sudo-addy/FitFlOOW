use sqlx::sqlite::SqlitePool;
use sqlx::postgres::PgPool;
use sqlx::migrate::MigrateDatabase;
use bcrypt::{hash, DEFAULT_COST};
use std::env;
use std::fs::{self, File};
use std::io::BufReader;
use std::time::SystemTime;
use serde::Deserialize;

fn get_file_modified_time(path: &str) -> Option<SystemTime> {
    fs::metadata(path).ok().and_then(|meta| meta.modified().ok())
}

async fn sync_sqlite_to_postgres(pg_pool: &PgPool, sqlite_path: &str) -> Result<(), sqlx::Error> {
    if let Ok(data) = fs::read(sqlite_path) {
        sqlx::query("INSERT INTO sqlite_db_backup (id, file_data, updated_at) VALUES (1, $1, NOW()) ON CONFLICT (id) DO UPDATE SET file_data = EXCLUDED.file_data, updated_at = NOW()")
            .bind(data)
            .execute(pg_pool)
            .await?;
    }
    Ok(())
}

async fn restore_sqlite_from_postgres(pg_pool: &PgPool, sqlite_path: &str) -> Result<bool, sqlx::Error> {
    sqlx::query("CREATE TABLE IF NOT EXISTS sqlite_db_backup (id INT PRIMARY KEY, file_data BYTEA, updated_at TIMESTAMP)")
        .execute(pg_pool)
        .await?;

    let row: Option<(Vec<u8>,)> = sqlx::query_as("SELECT file_data FROM sqlite_db_backup WHERE id = 1")
        .fetch_optional(pg_pool)
        .await?;

    if let Some((data,)) = row {
        if !data.is_empty() {
            fs::write(sqlite_path, data).expect("Failed to write restored SQLite file");
            return Ok(true);
        }
    }
    Ok(false)
}

pub async fn init_db() -> SqlitePool {
    let mut database_url = env::var("DATABASE_URL").unwrap_or_else(|_| "sqlite://dev.db".to_string());
    let mut pg_pool_opt: Option<PgPool> = None;
    let sqlite_path = "dev.db";

    if database_url.starts_with("postgres://") || database_url.starts_with("postgresql://") {
        println!("🚀 Detected PostgreSQL database URL. Enabling SQLite-over-Postgres persistence.");
        let pg_url = database_url.clone();
        database_url = format!("sqlite://{}", sqlite_path);

        let pg_pool = PgPool::connect(&pg_url).await.expect("Failed to connect to PostgreSQL backup database");
        let restored = restore_sqlite_from_postgres(&pg_pool, sqlite_path).await.unwrap_or(false);
        if restored {
            println!("✅ Restored local SQLite database file from cloud PostgreSQL backup.");
        } else {
            println!("ℹ️ No cloud backup found in PostgreSQL. Starting with a new SQLite database.");
        }
        pg_pool_opt = Some(pg_pool);
    }

    if !sqlx::Sqlite::database_exists(&database_url).await.unwrap_or(false) {
        sqlx::Sqlite::create_database(&database_url).await.expect("Failed to create SQLite database");
    }

    let pool = SqlitePool::connect(&database_url).await.expect("Failed to connect to database");

    // Run migrations
    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .expect("Failed to run database migrations");

    seed_database_if_empty(&pool).await;
    seed_exercises_lookup(&pool).await;

    if let Some(pg_pool) = pg_pool_opt {
        // Initial sync of seeded database
        if let Err(e) = sync_sqlite_to_postgres(&pg_pool, sqlite_path).await {
            println!("⚠️ Failed to write initial SQLite backup to PostgreSQL: {:?}", e);
        } else {
            println!("💾 Initial database backup uploaded to PostgreSQL successfully.");
        }

        tokio::spawn(async move {
            let mut last_modified = get_file_modified_time(sqlite_path);
            loop {
                tokio::time::sleep(tokio::time::Duration::from_secs(10)).await;
                let current_modified = get_file_modified_time(sqlite_path);
                if current_modified != last_modified {
                    match sync_sqlite_to_postgres(&pg_pool, sqlite_path).await {
                        Ok(_) => {
                            last_modified = current_modified;
                            println!("💾 SQLite database changes backed up to PostgreSQL successfully.");
                        }
                        Err(e) => {
                            println!("⚠️ SQLite backup to PostgreSQL failed: {:?}", e);
                        }
                    }
                }
            }
        });
    }

    pool
}

async fn seed_database_if_empty(pool: &SqlitePool) {
    let count: i32 = sqlx::query_scalar("SELECT COUNT(*) FROM users")
        .fetch_one(pool)
        .await
        .unwrap_or(0);

    if count > 0 {
        return; // Already seeded
    }

    println!("Seeding database with default warrior records...");

    // Create default user
    let hashed_password = hash("password123", DEFAULT_COST).expect("Failed to hash password");
    let user_id: i64 = sqlx::query_scalar(
        "INSERT INTO users (name, email, password, tier) VALUES (?, ?, ?, ?) RETURNING id"
    )
    .bind("Warrior")
    .bind("warrior@saiyangym.com")
    .bind(hashed_password)
    .bind("Elite")
    .fetch_one(pool)
    .await
    .expect("Failed to create default user");

    // Seed Workouts & Exercises
    let w1_id: i64 = sqlx::query_scalar(
        "INSERT INTO workouts (name, duration, volume, calories, user_id, date) VALUES (?, ?, ?, ?, ?, datetime('now', '-2 days')) RETURNING id"
    )
    .bind("Upper Body Hypertrophy")
    .bind(75)
    .bind(4800.0)
    .bind(520)
    .bind(user_id)
    .fetch_one(pool)
    .await
    .unwrap();

    let exercises1 = vec![
        ("Bench Press", 4, 8, 80.0),
        ("Overhead Press", 3, 10, 50.0),
        ("Lat Pulldown", 4, 10, 65.0),
        ("Incline Dumbbell Fly", 3, 12, 18.0),
    ];
    for (name, sets, reps, weight) in exercises1 {
        sqlx::query("INSERT INTO exercises (name, sets, reps, weight, completed, workout_id) VALUES (?, ?, ?, ?, 1, ?)")
            .bind(name)
            .bind(sets)
            .bind(reps)
            .bind(weight)
            .bind(w1_id)
            .execute(pool)
            .await
            .unwrap();
    }

    let w2_id: i64 = sqlx::query_scalar(
        "INSERT INTO workouts (name, duration, volume, calories, user_id, date) VALUES (?, ?, ?, ?, ?, datetime('now', '-1 day')) RETURNING id"
    )
    .bind("Leg Day - Volume Phase")
    .bind(90)
    .bind(7200.0)
    .bind(680)
    .bind(user_id)
    .fetch_one(pool)
    .await
    .unwrap();

    let exercises2 = vec![
        ("Barbell Squat", 4, 8, 120.0),
        ("Romanian Deadlift", 3, 10, 90.0),
        ("Leg Press", 4, 12, 180.0),
        ("Standing Calf Raise", 4, 15, 60.0),
    ];
    for (name, sets, reps, weight) in exercises2 {
        sqlx::query("INSERT INTO exercises (name, sets, reps, weight, completed, workout_id) VALUES (?, ?, ?, ?, 1, ?)")
            .bind(name)
            .bind(sets)
            .bind(reps)
            .bind(weight)
            .bind(w2_id)
            .execute(pool)
            .await
            .unwrap();
    }

    // Seed Class Bookings
    let classes = vec![
        ("Hyperion HIIT", "Mon", "07:00 AM", "45 min", "Vegeta", "Elite"),
        ("Dragon Strength Protocol", "Wed", "06:00 PM", "60 min", "Goku", "Champion"),
    ];
    for (name, date, time, duration, instructor, intensity) in classes {
        sqlx::query("INSERT INTO class_bookings (class_name, date, time, duration, instructor, intensity, status, user_id) VALUES (?, ?, ?, ?, ?, ?, 'Booked', ?)")
            .bind(name)
            .bind(date)
            .bind(time)
            .bind(duration)
            .bind(instructor)
            .bind(intensity)
            .bind(user_id)
            .execute(pool)
            .await
            .unwrap();
    }

    // Seed Nutrition Logs
    let nutrition = vec![
        (2, 2280, 172, 245, 64, 6), // 2 days ago
        (1, 2350, 185, 250, 68, 7), // 1 day ago
        (0, 1480, 110, 160, 45, 5), // today
    ];
    for (days_ago, calories, protein, carbs, fat, water) in nutrition {
        let date_str = chrono::Utc::now()
            .checked_sub_signed(chrono::Duration::days(days_ago))
            .unwrap()
            .format("%Y-%m-%d")
            .to_string();

        sqlx::query("INSERT INTO nutrition_logs (date, calories_consumed, protein_consumed, carbs_consumed, fat_consumed, water_cups, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)")
            .bind(date_str)
            .bind(calories)
            .bind(protein)
            .bind(carbs)
            .bind(fat)
            .bind(water)
            .bind(user_id)
            .execute(pool)
            .await
            .unwrap();
    }

    // Seed Achievements
    let achievements = vec![
        ("iron_will", "Iron Will", "Achieve a 7-day consistency streak.", "Consistency", 1),
        ("centurion", "Centurion", "Log 100 workouts total in the battle logs.", "Consistency", 0),
        ("deadlift_demon", "Deadlift Demon", "Perform a deadlift equal to 2x bodyweight.", "Strength", 1),
        ("dawn_warrior", "Dawn Warrior", "Complete a training session before 6:00 AM.", "Consistency", 1),
        ("protein_king", "Protein King", "Hit daily target protein macros for 30 consecutive days.", "Nutrition", 0),
        ("legendary", "Legendary Status", "Reach 500 completed sessions.", "Consistency", 0),
        ("saiyan_god", "Saiyan God", "Hit a 365-day streak.", "Consistency", 0),
        ("triple_plate", "Triple Plate", "Bench press 140kg.", "Strength", 0),
    ];
    for (code, name, desc, category, unlocked) in achievements {
        let unlocked_date = if unlocked == 1 { "datetime('now')" } else { "NULL" };
        let query_str = format!(
            "INSERT INTO user_achievements (code, name, desc, category, unlocked, unlocked_at, user_id) VALUES (?, ?, ?, ?, ?, {}, ?)",
            unlocked_date
        );
        sqlx::query(&query_str)
            .bind(code)
            .bind(name)
            .bind(desc)
            .bind(category)
            .bind(unlocked == 1)
            .bind(user_id)
            .execute(pool)
            .await
            .unwrap();
    }

    println!("Database seeding completed successfully.");
}

// ---- Exercise Lookup JSON Deserializers ----
#[derive(Deserialize)]
struct JSONExerciseInstructionSteps {
    en: Vec<String>,
}

#[derive(Deserialize)]
struct JSONExercise {
    id: String,
    name: String,
    body_part: String,
    equipment: String,
    muscle_group: String,
    target: String,
    instruction_steps: JSONExerciseInstructionSteps,
}

async fn seed_exercises_lookup(pool: &SqlitePool) {
    let count: i32 = sqlx::query_scalar("SELECT COUNT(*) FROM exercises_lookup")
        .fetch_one(pool)
        .await
        .unwrap_or(0);

    if count > 0 {
        return; // Already populated
    }

    println!("Populating exercises lookup table from exercises.json...");

    let file_path = env::var("EXERCISES_JSON_PATH")
        .unwrap_or_else(|_| "./data/exercises.json".to_string());
    let file = match File::open(file_path) {
        Ok(f) => f,
        Err(e) => {
            println!("Warning: Could not open exercises.json ({}). Skipping lookup import.", e);
            return;
        }
    };

    let reader = BufReader::new(file);
    let exercises: Vec<JSONExercise> = match serde_json::from_reader(reader) {
        Ok(data) => data,
        Err(e) => {
            println!("Warning: Failed to parse exercises.json ({}). Skipping lookup import.", e);
            return;
        }
    };

    // Use database transaction for speed
    let mut tx = pool.begin().await.unwrap();

    for ex in exercises {
        let steps_json = serde_json::to_string(&ex.instruction_steps.en).unwrap_or_else(|_| "[]".to_string());
        
        if let Err(e) = sqlx::query("INSERT INTO exercises_lookup (id, name, body_part, equipment, muscle_group, target, steps) VALUES (?, ?, ?, ?, ?, ?, ?)")
            .bind(&ex.id)
            .bind(&ex.name)
            .bind(&ex.body_part)
            .bind(&ex.equipment)
            .bind(&ex.muscle_group)
            .bind(&ex.target)
            .bind(steps_json)
            .execute(&mut *tx)
            .await
        {
            println!("Warning: failed to insert exercise {} ({}).", ex.name, e);
        }
    }

    tx.commit().await.unwrap();
    let final_count: i32 = sqlx::query_scalar("SELECT COUNT(*) FROM exercises_lookup")
        .fetch_one(pool)
        .await
        .unwrap_or(0);
    println!("Successfully loaded {} exercises into database.", final_count);
}
