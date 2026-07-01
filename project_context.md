# ⚔️ FitFlOOW — Complete Project Context & Full Codebase Specification

This document contains the complete system architecture, database schemas, full source code of key backend files, API endpoints, frontend routing, utility files, and details of all components.

---

## 1. System Architecture

```
                  ┌──────────────────────┐
                  │  React / Vite App    │ (Port 5173)
                  │  (Frontend Portal)   │
                  └──────────┬───────────┘
                             │ (JSON REST API)
                             ▼
                  ┌──────────────────────┐
                  │  Axum / Tokio App    │ (Port 5005)
                  │  (Rust Backend)      │
                  └──────────┬───────────┘
                             │ (SQLx Queries)
                             ▼
                  ┌──────────────────────┐
                  │    SQLite Database   │ (backend/dev.db)
                  │    (7 data tables)   │
                  └──────────────────────┘
```

---

## 2. Database Schema & Migrations

### Migration 1: `migrations/20260701000000_init.sql`
```sql
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    tier TEXT DEFAULT 'Elite'
);

CREATE TABLE IF NOT EXISTS workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    duration INTEGER NOT NULL,
    volume REAL NOT NULL,
    calories INTEGER NOT NULL,
    date TEXT DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sets INTEGER NOT NULL,
    reps INTEGER NOT NULL,
    weight REAL NOT NULL,
    completed BOOLEAN DEFAULT 0,
    workout_id INTEGER NOT NULL,
    FOREIGN KEY(workout_id) REFERENCES workouts(id)
);

CREATE TABLE IF NOT EXISTS class_bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_name TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    duration TEXT NOT NULL,
    instructor TEXT NOT NULL,
    intensity TEXT NOT NULL,
    status TEXT DEFAULT 'Booked',
    user_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS nutrition_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    calories_consumed INTEGER NOT NULL,
    protein_consumed INTEGER NOT NULL,
    carbs_consumed INTEGER NOT NULL,
    fat_consumed INTEGER NOT NULL,
    water_cups INTEGER DEFAULT 0,
    user_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS user_achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    desc TEXT NOT NULL,
    category TEXT NOT NULL,
    unlocked BOOLEAN DEFAULT 0,
    unlocked_at TEXT,
    user_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
```

### Migration 2: `migrations/20260701000001_exercises.sql`
```sql
CREATE TABLE IF NOT EXISTS exercises_lookup (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    body_part TEXT NOT NULL,
    equipment TEXT NOT NULL,
    muscle_group TEXT NOT NULL,
    target TEXT NOT NULL,
    steps TEXT NOT NULL
);
```

---

## 3. Full Backend Source Code (Rust)

### A. Server Launcher: `backend/src/main.rs`
```rust
use axum::{
    routing::{get, post, delete, put},
    Router,
};
use std::net::SocketAddr;
use tower_http::cors::{CorsLayer, Any};
use dotenvy::dotenv;
use std::env;

mod db;
mod middleware;
mod routes;

#[tokio::main]
async fn main() {
    dotenv().ok();

    // Initialize database pool & seed if empty
    let pool = db::init_db().await;

    // CORS configuration
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // Router mapping
    let app = Router::new()
        // Auth
        .route("/api/auth/signup", post(routes::sign_up))
        .route("/api/auth/login", post(routes::sign_in))
        // Dashboard
        .route("/api/dashboard/stats", get(routes::get_dashboard_stats))
        // Workouts
        .route("/api/workouts", get(routes::get_workouts_history).post(routes::log_workout))
        // Classes
        .route("/api/classes", get(routes::get_booked_classes))
        .route("/api/classes/book", post(routes::book_class))
        .route("/api/classes/cancel/:booking_id", delete(routes::cancel_class_booking))
        // Nutrition
        .route("/api/nutrition", get(routes::get_nutrition_logs))
        .route("/api/nutrition/water", post(routes::update_water))
        .route("/api/nutrition/meal", post(routes::log_meal))
        // Profile & Achievements
        .route("/api/profile", get(routes::get_profile).put(routes::update_profile))
        .route("/api/profile/tier", put(routes::update_tier))
        .route("/api/achievements", get(routes::get_achievements))
        // Exercise Library Lookup
        .route("/api/exercises/search", get(routes::search_exercises))
        // Health check
        .route("/health", get(health_check))
        .with_state(pool)
        .layer(cors);

    let port = env::var("PORT").unwrap_or_else(|_| "5005".to_string());
    let addr: SocketAddr = format!("0.0.0.0:{}", port)
        .parse()
        .expect("Failed to parse socket address");

    println!("⚡ [Saiyan Gym API] Server running at http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn health_check() -> &'static str {
    "healthy"
}
```

### B. Database & Seeding: `backend/src/db.rs`
```rust
use sqlx::sqlite::SqlitePool;
use sqlx::migrate::MigrateDatabase;
use bcrypt::{hash, DEFAULT_COST};
use std::env;
use std::fs::File;
use std::io::BufReader;
use serde::Deserialize;

pub async fn init_db() -> SqlitePool {
    let database_url = env::var("DATABASE_URL").unwrap_or_else(|_| "sqlite://dev.db".to_string());
    
    // Create the DB file if it doesn't exist
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

    let file_path = "/home/abhi/Downloads/exercises-dataset-main/data/exercises.json";
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
```

### C. JWT Auth Middleware: `backend/src/middleware.rs`
```rust
use axum::{
    async_trait,
    extract::FromRequestParts,
    http::{request::Parts, StatusCode},
};
use jsonwebtoken::{decode, DecodingKey, Validation};
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Debug, Serialize, Deserialize)]
#[allow(non_snake_case)]
pub struct Claims {
    pub userId: i64,
    pub exp: usize,
}

pub struct AuthUser {
    pub user_id: i64,
}

#[async_trait]
impl<S> FromRequestParts<S> for AuthUser
where
    S: Send + Sync,
{
    type Rejection = (StatusCode, String);

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        // Extract Authorization header
        let auth_header = parts
            .headers
            .get("Authorization")
            .and_then(|value| value.to_str().ok())
            .ok_or((StatusCode::UNAUTHORIZED, "Missing authorization header".to_string()))?;

        if !auth_header.starts_with("Bearer ") {
            return Err((StatusCode::UNAUTHORIZED, "Invalid token type".to_string()));
        }

        let token = &auth_header[7..];
        let secret = env::var("JWT_SECRET").unwrap_or_else(|_| "super_secret_saiyan_key_1337_force".to_string());

        let token_data = decode::<Claims>(
            token,
            &DecodingKey::from_secret(secret.as_bytes()),
            &Validation::default(),
        )
        .map_err(|e| (StatusCode::UNAUTHORIZED, format!("Invalid token: {}", e)))?;

        Ok(AuthUser {
            user_id: token_data.claims.userId,
        })
    }
}
```

### D. Key Handler Actions: `backend/src/routes.rs` *(Search Exercises & Sign Up)*
```rust
// Below is the Search Endpoint that fetches matching exercises dynamically:
#[derive(Deserialize)]
pub struct SearchParams {
    pub q: Option<String>,
}

pub async fn search_exercises(
    _auth: AuthUser,
    State(pool): State<SqlitePool>,
    Query(params): Query<SearchParams>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let query_str = params.q.unwrap_or_default();
    let like_pattern = format!("%{}%", query_str.trim().to_lowercase());

    let rows: Vec<(String, String, String, String, String, String, String)> = sqlx::query_as(
        "SELECT id, name, body_part, equipment, muscle_group, target, steps FROM exercises_lookup WHERE name LIKE ? LIMIT 15"
    )
    .bind(like_pattern)
    .fetch_all(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let exercises = json!(rows.iter().map(|r| {
        let steps: Vec<String> = serde_json::from_str(&r.6).unwrap_or_default();
        json!({
            "id": r.0,
            "name": r.1,
            "bodyPart": r.2,
            "equipment": r.3,
            "muscleGroup": r.4,
            "target": r.5,
            "steps": steps,
        })
    }).collect::<Vec<_>>());

    Ok(Json(json!({ "exercises": exercises })))
}
```

---

## 4. Frontend Specs & Key Files

### A. API Wrapper Interface: `frontend/Landiingpage/src/utils/api.js`
```javascript
const API_BASE = 'http://localhost:5005/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  signup: async (name, email, password) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Signup failed');
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Dashboard
  getDashboard: async () => {
    const res = await fetch(`${API_BASE}/dashboard/stats`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to load dashboard.');
    return res.json();
  },

  // Workouts
  getWorkouts: async () => {
    const res = await fetch(`${API_BASE}/workouts`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to load workouts.');
    return res.json();
  },

  logWorkout: async (workoutData) => {
    const res = await fetch(`${API_BASE}/workouts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(workoutData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to save workout session.');
    return data;
  },

  // Exercise Search
  searchExercises: async (query) => {
    const res = await fetch(`${API_BASE}/exercises/search?q=${encodeURIComponent(query)}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to search exercises.');
    return res.json();
  },
};
```

### B. Workout Logger Logic: `src/components/portal/WorkoutLogger.jsx` *(Suggestions Dropdown & Modal)*
```javascript
// autocomplete states initialized inside component:
const [suggestions, setSuggestions] = useState([]);
const [showSuggestions, setShowSuggestions] = useState(false);
const [selectedSteps, setSelectedSteps] = useState([]);

// fetch handler mapping with 250ms debounce:
useEffect(() => {
  if (addExName.trim().length < 2) {
    setSuggestions([]);
    return;
  }
  const delayDebounce = setTimeout(() => {
    api.searchExercises(addExName)
      .then((res) => {
        setSuggestions(res.exercises || []);
      })
      .catch(console.error);
  }, 250);

  return () => clearTimeout(delayDebounce);
}, [addExName]);

// suggestion item selected handler:
const selectSuggestion = (sug) => {
  setAddExName(sug.name);
  setAddMuscleGroup(mapBodyPartToMuscle(sug.bodyPart));
  setSelectedSteps(sug.steps || []);
  setSuggestions([]);
  setShowSuggestions(false);
};
```

### C. Registration Form Component: `src/components/SignUpPage.jsx`
```javascript
// validates and registers a user, logging them in automatically on success:
const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = validate();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }
  setErrors({});
  setIsLoading(true);
  try {
    await api.signup(name.trim(), email.trim(), password);
    setIsLoading(false);
    setSubmitSuccess(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  } catch (error) {
    setIsLoading(false);
    setErrors({ form: error.message || 'Registration failed.' });
  }
};
```

---

## 5. Deployment Guide

### Cloudflare Pages (Frontend)
1. Build command: `npm run build`
2. Publish folder: `dist`
3. Connect your GitHub repository to Cloudflare Pages panel to enable global edge content deployment.

### API Host (Backend)
1. Serve the Rust compiled binary (`target/release/fitfloow-backend`) on a Linux VPS or cloud container (Render/Railway).
2. Attach a **Persistent Volume Disk** to store the SQLite `dev.db` database file across server restarts.
3. Configure **Cloudflare DNS** to proxy traffic (enable SSL/DDoS security) to the backend server.
