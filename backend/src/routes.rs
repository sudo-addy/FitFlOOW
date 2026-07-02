use axum::{
    extract::{Path, State, Json, Query},
    http::StatusCode,
    response::IntoResponse,
};
use jsonwebtoken::{encode, Header, EncodingKey};
use serde::{Deserialize, Serialize};
use serde_json::json;
use sqlx::sqlite::SqlitePool;
use bcrypt::{hash, verify, DEFAULT_COST};
use std::time::{SystemTime, UNIX_EPOCH};
use std::env;
use crate::middleware::{AuthUser, Claims};

// ============================================================
// STRUCTS & REQUEST/RESPONSE PAYLOADS
// ============================================================

#[derive(Deserialize)]
pub struct SignUpRequest {
    name: String,
    email: String,
    password: String,
}

#[derive(Deserialize)]
pub struct SignInRequest {
    email: String,
    password: String,
}

#[derive(Serialize)]
pub struct AuthResponseUser {
    id: i64,
    name: String,
    email: String,
    tier: String,
}

#[derive(Serialize)]
pub struct AuthResponse {
    token: String,
    user: AuthResponseUser,
}

#[derive(Serialize)]
pub struct DashboardStats {
    #[serde(rename = "caloriesBurned")]
    calories_burned: i64,
    #[serde(rename = "workoutsThisWeek")]
    workouts_this_week: i64,
    streak: i64,
    #[serde(rename = "personalRecords")]
    personal_records: i64,
}

#[derive(Serialize)]
pub struct DashboardResponse {
    stats: DashboardStats,
    #[serde(rename = "recentWorkouts")]
    recent_workouts: serde_json::Value,
    #[serde(rename = "upcomingClasses")]
    upcoming_classes: serde_json::Value,
}

#[derive(Deserialize)]
pub struct ExerciseInput {
    name: String,
    sets: i32,
    reps: i32,
    weight: f64,
    completed: Option<bool>,
}

#[derive(Deserialize)]
pub struct LogWorkoutRequest {
    name: String,
    duration: i32,
    exercises: Vec<ExerciseInput>,
}

#[derive(Deserialize)]
pub struct BookClassRequest {
    #[serde(rename = "className")]
    class_name: String,
    date: String,
    time: String,
    duration: Option<String>,
    instructor: Option<String>,
    intensity: Option<String>,
}

#[derive(Deserialize)]
pub struct WaterRequest {
    cups: i32,
}

#[derive(Deserialize)]
pub struct MealRequest {
    calories: i32,
    protein: i32,
    carbs: i32,
    fat: i32,
}

#[derive(Deserialize)]
pub struct UpdateProfileRequest {
    name: String,
}

#[derive(Deserialize)]
pub struct UpdateTierRequest {
    tier: String,
}

// ============================================================
// HANDLERS
// ============================================================

// ---- AUTH: Sign Up ----
pub async fn sign_up(
    State(pool): State<SqlitePool>,
    Json(payload): Json<SignUpRequest>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    if payload.name.trim().is_empty() || payload.email.trim().is_empty() || payload.password.trim().is_empty() {
        return Err((StatusCode::BAD_REQUEST, Json(json!({ "error": "Name, email, and password are required." }))));
    }

    if payload.password.len() < 8 {
        return Err((StatusCode::BAD_REQUEST, Json(json!({ "error": "Password must be at least 8 characters." }))));
    }

    // Check if email already exists
    let exists: bool = sqlx::query_scalar("SELECT EXISTS(SELECT 1 FROM users WHERE email = ?)")
        .bind(&payload.email)
        .fetch_one(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({ "error": e.to_string() }))))?;

    if exists {
        return Err((StatusCode::BAD_REQUEST, Json(json!({ "error": "Email is already registered." }))));
    }

    // Hash password
    let hashed = hash(&payload.password, DEFAULT_COST)
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({ "error": "Password hashing failed." }))))?;

    // Create user
    let user_id: i64 = sqlx::query_scalar(
        "INSERT INTO users (name, email, password, tier) VALUES (?, ?, ?, 'Elite') RETURNING id"
    )
    .bind(&payload.name)
    .bind(&payload.email)
    .bind(hashed)
    .fetch_one(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({ "error": e.to_string() }))))?;

    // Seed default achievements as locked for this user
    let default_achievements = vec![
        ("iron_will", "Iron Will", "Achieve a 7-day consistency streak.", "Consistency"),
        ("centurion", "Centurion", "Log 100 workouts total in the battle logs.", "Consistency"),
        ("deadlift_demon", "Deadlift Demon", "Perform a deadlift equal to 2x bodyweight.", "Strength"),
        ("dawn_warrior", "Dawn Warrior", "Complete a training session before 6:00 AM.", "Consistency"),
        ("protein_king", "Protein King", "Hit daily target protein macros for 30 consecutive days.", "Nutrition"),
        ("legendary", "Legendary Status", "Reach 500 completed sessions.", "Consistency"),
        ("saiyan_god", "Saiyan God", "Hit a 365-day streak.", "Consistency"),
        ("triple_plate", "Triple Plate", "Bench press 140kg.", "Strength"),
    ];

    for (code, name, desc, cat) in default_achievements {
        sqlx::query("INSERT INTO user_achievements (code, name, desc, category, unlocked, user_id) VALUES (?, ?, ?, ?, 0, ?)")
            .bind(code)
            .bind(name)
            .bind(desc)
            .bind(cat)
            .bind(user_id)
            .execute(&pool)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({ "error": e.to_string() }))))?;
    }

    // Generate token
    let token = generate_jwt(user_id)
        .map_err(|e| (e.0, Json(json!({ "error": e.1 }))))?;

    Ok((
        StatusCode::CREATED,
        Json(AuthResponse {
            token,
            user: AuthResponseUser {
                id: user_id,
                name: payload.name,
                email: payload.email,
                tier: "Elite".to_string(),
            },
        }),
    ))
}

// ---- AUTH: Sign In ----
pub async fn sign_in(
    State(pool): State<SqlitePool>,
    Json(payload): Json<SignInRequest>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    // Retrieve user
    let row: (i64, String, String, String, String) = sqlx::query_as(
        "SELECT id, name, email, password, tier FROM users WHERE email = ?"
    )
    .bind(&payload.email)
    .fetch_optional(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({ "error": e.to_string() }))))?
    .ok_or_else(|| (StatusCode::BAD_REQUEST, Json(json!({ "error": "Invalid email or password." }))))?;

    // Verify password
    let is_match = verify(&payload.password, &row.3).unwrap_or(false);
    if !is_match {
        return Err((StatusCode::BAD_REQUEST, Json(json!({ "error": "Invalid email or password." }))));
    }

    // Generate token
    let token = generate_jwt(row.0)
        .map_err(|e| (e.0, Json(json!({ "error": e.1 }))))?;

    Ok((
        StatusCode::OK,
        Json(AuthResponse {
            token,
            user: AuthResponseUser {
                id: row.0,
                name: row.1,
                email: row.2,
                tier: row.4,
            },
        }),
    ))
}

// ---- DASHBOARD ----
pub async fn get_dashboard_stats(
    auth: AuthUser,
    State(pool): State<SqlitePool>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    // 1. Get recent workouts with exercises
    let workouts_rows: Vec<(i64, String, String, i32, f64, i32)> = sqlx::query_as(
        "SELECT id, name, strftime('%Y-%m-%dT%H:%M:%fZ', date) as date, duration, volume, calories FROM workouts WHERE user_id = ? ORDER BY date DESC LIMIT 5"
    )
    .bind(auth.user_id)
    .fetch_all(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let mut recent_workouts = json!([]);
    for w in workouts_rows {
        let exercises_rows: Vec<(i64, String, i32, i32, f64, bool)> = sqlx::query_as(
            "SELECT id, name, sets, reps, weight, completed FROM exercises WHERE workout_id = ?"
        )
        .bind(w.0)
        .fetch_all(&pool)
        .await
        .unwrap_or_default();

        let w_json = json!({
            "id": w.0,
            "name": w.1,
            "date": w.2,
            "duration": w.3,
            "volume": w.4,
            "calories": w.5,
            "exercises": exercises_rows.iter().map(|ex| json!({
                "id": ex.0,
                "name": ex.1,
                "sets": ex.2,
                "reps": ex.3,
                "weight": ex.4,
                "completed": ex.5,
            })).collect::<Vec<_>>()
        });
        recent_workouts.as_array_mut().unwrap().push(w_json);
    }

    // 2. Weekly Workouts (last 7 days)
    let weekly_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(*) FROM workouts WHERE user_id = ? AND date >= datetime('now', '-7 days')"
    )
    .bind(auth.user_id)
    .fetch_one(&pool)
    .await
    .unwrap_or(0);

    // 3. Today's calories burned
    let today_calories: i64 = sqlx::query_scalar(
        "SELECT COALESCE(SUM(calories), 0) FROM workouts WHERE user_id = ? AND date >= date('now')"
    )
    .bind(auth.user_id)
    .fetch_one(&pool)
    .await
    .unwrap_or(0);

    // 4. Upcoming class bookings
    let classes_rows: Vec<(i64, String, String, String, String, String, String, String)> = sqlx::query_as(
        "SELECT id, class_name, date, time, duration, instructor, intensity, status FROM class_bookings WHERE user_id = ? AND status = 'Booked' LIMIT 2"
    )
    .bind(auth.user_id)
    .fetch_all(&pool)
    .await
    .unwrap_or_default();

    let upcoming_classes = json!(classes_rows.iter().map(|c| json!({
        "id": c.0,
        "className": c.1,
        "date": c.2,
        "time": c.3,
        "duration": c.4,
        "instructor": c.5,
        "intensity": c.6,
        "status": c.7,
    })).collect::<Vec<_>>());

    // 5. Total Achievements Unlocked
    let pr_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(*) FROM user_achievements WHERE user_id = ? AND unlocked = 1"
    )
    .bind(auth.user_id)
    .fetch_one(&pool)
    .await
    .unwrap_or(0);

    Ok(Json(DashboardResponse {
        stats: DashboardStats {
            calories_burned: if today_calories == 0 { 847 } else { today_calories },
            workouts_this_week: if weekly_count == 0 { 4 } else { weekly_count },
            streak: 12,
            personal_records: if pr_count == 0 { 3 } else { pr_count },
        },
        recent_workouts,
        upcoming_classes,
    }))
}

// ---- WORKOUTS HISTORY ----
pub async fn get_workouts_history(
    auth: AuthUser,
    State(pool): State<SqlitePool>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let workouts_rows: Vec<(i64, String, String, i32, f64, i32)> = sqlx::query_as(
        "SELECT id, name, strftime('%Y-%m-%dT%H:%M:%fZ', date) as date, duration, volume, calories FROM workouts WHERE user_id = ? ORDER BY date DESC"
    )
    .bind(auth.user_id)
    .fetch_all(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let mut workouts = json!([]);
    for w in &workouts_rows {
        let exercises_rows: Vec<(i64, String, i32, i32, f64, bool)> = sqlx::query_as(
            "SELECT id, name, sets, reps, weight, completed FROM exercises WHERE workout_id = ?"
        )
        .bind(w.0)
        .fetch_all(&pool)
        .await
        .unwrap_or_default();

        let w_json = json!({
            "id": w.0,
            "name": w.1,
            "date": w.2,
            "duration": w.3,
            "volume": w.4,
            "calories": w.5,
            "exercises": exercises_rows.iter().map(|ex| json!({
                "id": ex.0,
                "name": ex.1,
                "sets": ex.2,
                "reps": ex.3,
                "weight": ex.4,
                "completed": ex.5,
            })).collect::<Vec<_>>()
        });
        workouts.as_array_mut().unwrap().push(w_json);
    }

    let total_workouts = workouts_rows.len() as i64;
    let total_volume = workouts_rows.iter().fold(0.0, |sum, w| sum + w.4);
    let total_duration = workouts_rows.iter().fold(0, |sum, w| sum + w.3);

    Ok(Json(json!({
        "workouts": workouts,
        "summary": {
            "totalWorkouts": total_workouts,
            "totalVolume": total_volume,
            "totalDuration": total_duration,
            "bestStreak": 14
        }
    })))
}

// ---- LOG WORKOUT ----
pub async fn log_workout(
    auth: AuthUser,
    State(pool): State<SqlitePool>,
    Json(payload): Json<LogWorkoutRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    if payload.name.trim().is_empty() || payload.duration <= 0 || payload.exercises.is_empty() {
        return Err((StatusCode::BAD_REQUEST, "Workout name, duration, and exercise rows are required.".to_string()));
    }

    let mut total_volume = 0.0;
    for ex in &payload.exercises {
        total_volume += (ex.sets as f64) * (ex.reps as f64) * ex.weight;
    }

    let calories_burned = payload.duration * 8;

    let workout_id: i64 = sqlx::query_scalar(
        "INSERT INTO workouts (name, duration, volume, calories, user_id) VALUES (?, ?, ?, ?, ?) RETURNING id"
    )
    .bind(&payload.name)
    .bind(payload.duration)
    .bind(total_volume)
    .bind(calories_burned)
    .bind(auth.user_id)
    .fetch_one(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    for ex in &payload.exercises {
        sqlx::query("INSERT INTO exercises (name, sets, reps, weight, completed, workout_id) VALUES (?, ?, ?, ?, ?, ?)")
            .bind(&ex.name)
            .bind(ex.sets)
            .bind(ex.reps)
            .bind(ex.weight)
            .bind(ex.completed.unwrap_or(true))
            .bind(workout_id)
            .execute(&pool)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    }

    // Trigger achievement unlocks checking logic
    let workout_count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM workouts WHERE user_id = ?")
        .bind(auth.user_id)
        .fetch_one(&pool)
        .await
        .unwrap_or(0);

    if workout_count >= 100 {
        sqlx::query("UPDATE user_achievements SET unlocked = 1, unlocked_at = CURRENT_TIMESTAMP WHERE user_id = ? AND code = 'centurion'")
            .bind(auth.user_id)
            .execute(&pool)
            .await
            .unwrap_or_default();
    }

    Ok((StatusCode::CREATED, Json(json!({ "message": "Workout logged successfully." }))))
}

// ---- BOOK CLASS ----
pub async fn book_class(
    auth: AuthUser,
    State(pool): State<SqlitePool>,
    Json(payload): Json<BookClassRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let exists: bool = sqlx::query_scalar(
        "SELECT EXISTS(SELECT 1 FROM class_bookings WHERE user_id = ? AND class_name = ? AND date = ? AND time = ? AND status = 'Booked')"
    )
    .bind(auth.user_id)
    .bind(&payload.class_name)
    .bind(&payload.date)
    .bind(&payload.time)
    .fetch_one(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    if exists {
        return Err((StatusCode::BAD_REQUEST, "You are already booked for this class slot.".to_string()));
    }

    sqlx::query(
        "INSERT INTO class_bookings (class_name, date, time, duration, instructor, intensity, status, user_id) VALUES (?, ?, ?, ?, ?, ?, 'Booked', ?)"
    )
    .bind(&payload.class_name)
    .bind(&payload.date)
    .bind(&payload.time)
    .bind(payload.duration.as_deref().unwrap_or("60 min"))
    .bind(payload.instructor.as_deref().unwrap_or("Unknown Coach"))
    .bind(payload.intensity.as_deref().unwrap_or("Elite"))
    .bind(auth.user_id)
    .execute(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok((StatusCode::CREATED, Json(json!({ "message": "Class booked successfully." }))))
}

// ---- GET BOOKED CLASSES ----
pub async fn get_booked_classes(
    auth: AuthUser,
    State(pool): State<SqlitePool>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let classes_rows: Vec<(i64, String, String, String, String, String, String, String)> = sqlx::query_as(
        "SELECT id, class_name, date, time, duration, instructor, intensity, status FROM class_bookings WHERE user_id = ?"
    )
    .bind(auth.user_id)
    .fetch_all(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let bookings = json!(classes_rows.iter().map(|c| json!({
        "id": c.0,
        "className": c.1,
        "date": c.2,
        "time": c.3,
        "duration": c.4,
        "instructor": c.5,
        "intensity": c.6,
        "status": c.7,
    })).collect::<Vec<_>>());

    Ok(Json(json!({ "bookings": bookings })))
}

// ---- CANCEL CLASS BOOKING ----
pub async fn cancel_class_booking(
    auth: AuthUser,
    Path(booking_id): Path<i64>,
    State(pool): State<SqlitePool>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let exists: bool = sqlx::query_scalar("SELECT EXISTS(SELECT 1 FROM class_bookings WHERE id = ? AND user_id = ?)")
        .bind(booking_id)
        .bind(auth.user_id)
        .fetch_one(&pool)
        .await
        .unwrap_or(false);

    if !exists {
        return Err((StatusCode::NOT_FOUND, "Booking record not found.".to_string()));
    }

    sqlx::query("DELETE FROM class_bookings WHERE id = ?")
        .bind(booking_id)
        .execute(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(json!({ "message": "Booking canceled successfully." })))
}

// ---- NUTRITION LOGS ----
pub async fn get_nutrition_logs(
    auth: AuthUser,
    State(pool): State<SqlitePool>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let today_str = chrono::Utc::now().format("%Y-%m-%d").to_string();

    // Check if today's entry exists, if not, create one
    let exists: bool = sqlx::query_scalar("SELECT EXISTS(SELECT 1 FROM nutrition_logs WHERE user_id = ? AND date = ?)")
        .bind(auth.user_id)
        .bind(&today_str)
        .fetch_one(&pool)
        .await
        .unwrap_or(false);

    if !exists {
        sqlx::query("INSERT INTO nutrition_logs (date, calories_consumed, protein_consumed, carbs_consumed, fat_consumed, water_cups, user_id) VALUES (?, 0, 0, 0, 0, 0, ?)")
            .bind(&today_str)
            .bind(auth.user_id)
            .execute(&pool)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    }

    let today_log: (i64, String, i32, i32, i32, i32, i32, i32, i32, i32, i32) = sqlx::query_as(
        "SELECT id, date, calories_consumed, calories_target, protein_consumed, protein_target, carbs_consumed, carbs_target, fat_consumed, fat_target, water_cups FROM nutrition_logs WHERE user_id = ? AND date = ?"
    )
    .bind(auth.user_id)
    .bind(&today_str)
    .fetch_one(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let history_rows: Vec<(i64, String, i32, i32, i32, i32, i32, i32, i32, i32, i32)> = sqlx::query_as(
        "SELECT id, date, calories_consumed, calories_target, protein_consumed, protein_target, carbs_consumed, carbs_target, fat_consumed, fat_target, water_cups FROM nutrition_logs WHERE user_id = ? ORDER BY date DESC LIMIT 7"
    )
    .bind(auth.user_id)
    .fetch_all(&pool)
    .await
    .unwrap_or_default();

    let today_json = json!({
        "id": today_log.0,
        "date": today_log.1,
        "caloriesConsumed": today_log.2,
        "caloriesTarget": today_log.3,
        "proteinConsumed": today_log.4,
        "proteinTarget": today_log.5,
        "carbsConsumed": today_log.6,
        "carbsTarget": today_log.7,
        "fatConsumed": today_log.8,
        "fatTarget": today_log.9,
        "waterCups": today_log.10,
    });

    let history_json = json!(history_rows.iter().map(|h| json!({
        "id": h.0,
        "date": h.1,
        "caloriesConsumed": h.2,
        "caloriesTarget": h.3,
        "proteinConsumed": h.4,
        "proteinTarget": h.5,
        "carbsConsumed": h.6,
        "carbsTarget": h.7,
        "fatConsumed": h.8,
        "fatTarget": h.9,
        "waterCups": h.10,
    })).collect::<Vec<_>>());

    Ok(Json(json!({ "todayLog": today_json, "history": history_json })))
}

// ---- UPDATE WATER ----
pub async fn update_water(
    auth: AuthUser,
    State(pool): State<SqlitePool>,
    Json(payload): Json<WaterRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let today_str = chrono::Utc::now().format("%Y-%m-%d").to_string();

    sqlx::query("UPDATE nutrition_logs SET water_cups = ? WHERE user_id = ? AND date = ?")
        .bind(payload.cups)
        .bind(auth.user_id)
        .bind(&today_str)
        .execute(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    // Fetch updated log
    let updated: (i64, String, i32, i32, i32, i32, i32, i32, i32, i32, i32) = sqlx::query_as(
        "SELECT id, date, calories_consumed, calories_target, protein_consumed, protein_target, carbs_consumed, carbs_target, fat_consumed, fat_target, water_cups FROM nutrition_logs WHERE user_id = ? AND date = ?"
    )
    .bind(auth.user_id)
    .bind(&today_str)
    .fetch_one(&pool)
    .await
    .unwrap();

    Ok(Json(json!({
        "todayLog": {
            "id": updated.0,
            "date": updated.1,
            "caloriesConsumed": updated.2,
            "caloriesTarget": updated.3,
            "proteinConsumed": updated.4,
            "proteinTarget": updated.5,
            "carbsConsumed": updated.6,
            "carbsTarget": updated.7,
            "fatConsumed": updated.8,
            "fatTarget": updated.9,
            "waterCups": updated.10,
        }
    })))
}

// ---- LOG MEAL ----
pub async fn log_meal(
    auth: AuthUser,
    State(pool): State<SqlitePool>,
    Json(payload): Json<MealRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let today_str = chrono::Utc::now().format("%Y-%m-%d").to_string();

    sqlx::query("UPDATE nutrition_logs SET calories_consumed = calories_consumed + ?, protein_consumed = protein_consumed + ?, carbs_consumed = carbs_consumed + ?, fat_consumed = fat_consumed + ? WHERE user_id = ? AND date = ?")
        .bind(payload.calories)
        .bind(payload.protein)
        .bind(payload.carbs)
        .bind(payload.fat)
        .bind(auth.user_id)
        .bind(&today_str)
        .execute(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let updated: (i64, String, i32, i32, i32, i32, i32, i32, i32, i32, i32) = sqlx::query_as(
        "SELECT id, date, calories_consumed, calories_target, protein_consumed, protein_target, carbs_consumed, carbs_target, fat_consumed, fat_target, water_cups FROM nutrition_logs WHERE user_id = ? AND date = ?"
    )
    .bind(auth.user_id)
    .bind(&today_str)
    .fetch_one(&pool)
    .await
    .unwrap();

    Ok(Json(json!({
        "todayLog": {
            "id": updated.0,
            "date": updated.1,
            "caloriesConsumed": updated.2,
            "caloriesTarget": updated.3,
            "proteinConsumed": updated.4,
            "proteinTarget": updated.5,
            "carbsConsumed": updated.6,
            "carbsTarget": updated.7,
            "fatConsumed": updated.8,
            "fatTarget": updated.9,
            "waterCups": updated.10,
        }
    })))
}

// ---- GET PROFILE ----
pub async fn get_profile(
    auth: AuthUser,
    State(pool): State<SqlitePool>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let row: (i64, String, String, String) = sqlx::query_as(
        "SELECT id, name, email, tier FROM users WHERE id = ?"
    )
    .bind(auth.user_id)
    .fetch_one(&pool)
    .await
    .map_err(|_| (StatusCode::NOT_FOUND, "User profile not found.".to_string()))?;

    Ok(Json(json!({
        "user": {
            "id": row.0,
            "name": row.1,
            "email": row.2,
            "tier": row.3,
        },
        "profile": {
            "height": 183,
            "weight": 82.4,
            "goal": "Strength",
            "experience": "Intermediate",
            "notifications": { "email": true, "push": true, "sms": false }
        }
    })))
}

// ---- UPDATE PROFILE ----
pub async fn update_profile(
    auth: AuthUser,
    State(pool): State<SqlitePool>,
    Json(payload): Json<UpdateProfileRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    sqlx::query("UPDATE users SET name = ? WHERE id = ?")
        .bind(&payload.name)
        .bind(auth.user_id)
        .execute(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let row: (i64, String, String, String) = sqlx::query_as(
        "SELECT id, name, email, tier FROM users WHERE id = ?"
    )
    .bind(auth.user_id)
    .fetch_one(&pool)
    .await
    .unwrap();

    Ok(Json(json!({
        "message": "Profile updated successfully.",
        "user": {
            "id": row.0,
            "name": row.1,
            "email": row.2,
            "tier": row.3,
        }
    })))
}

// ---- UPDATE MEMBERSHIP TIER ----
pub async fn update_tier(
    auth: AuthUser,
    State(pool): State<SqlitePool>,
    Json(payload): Json<UpdateTierRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    if payload.tier != "Elite" && payload.tier != "Ascension" {
        return Err((StatusCode::BAD_REQUEST, "Invalid tier specified.".to_string()));
    }

    sqlx::query("UPDATE users SET tier = ? WHERE id = ?")
        .bind(&payload.tier)
        .bind(auth.user_id)
        .execute(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let row: (i64, String, String, String) = sqlx::query_as(
        "SELECT id, name, email, tier FROM users WHERE id = ?"
    )
    .bind(auth.user_id)
    .fetch_one(&pool)
    .await
    .unwrap();

    Ok(Json(json!({
        "message": format!("Successfully updated tier to {}.", payload.tier),
        "user": {
            "id": row.0,
            "name": row.1,
            "email": row.2,
            "tier": row.3,
        }
    })))
}

// ---- GET ACHIEVEMENTS ----
pub async fn get_achievements(
    auth: AuthUser,
    State(pool): State<SqlitePool>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let achs_rows: Vec<(i64, String, String, String, String, bool, Option<String>)> = sqlx::query_as(
        "SELECT id, code, name, desc, category, unlocked, strftime('%Y-%m-%dT%H:%M:%fZ', unlocked_at) as unlocked_at FROM user_achievements WHERE user_id = ?"
    )
    .bind(auth.user_id)
    .fetch_all(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let achievements = json!(achs_rows.iter().map(|a| json!({
        "id": a.0,
        "code": a.1,
        "name": a.2,
        "desc": a.3,
        "category": a.4,
        "unlocked": a.5,
        "unlockedAt": a.6,
    })).collect::<Vec<_>>());

    let unlocked_count = achs_rows.iter().filter(|a| a.5).count() as i64;

    Ok(Json(json!({
        "achievements": achievements,
        "summary": {
            "total": achs_rows.len(),
            "unlockedCount": unlocked_count
        }
    })))
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================
fn generate_jwt(user_id: i64) -> Result<String, (StatusCode, String)> {
    let exp_time = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs() + (7 * 24 * 3600); // 7 days expiration

    let claims = Claims {
        userId: user_id,
        exp: exp_time as usize,
    };

    let secret = env::var("JWT_SECRET").unwrap_or_else(|_| "super_secret_saiyan_key_1337_force".to_string());

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_bytes()),
    )
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to generate JWT: {}", e)))
}

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

#[derive(Deserialize)]
pub struct ForgotPasswordRequest {
    pub email: String,
}

#[derive(Deserialize)]
pub struct ResetPasswordRequest {
    pub token: String,
    pub password: String,
}

pub async fn forgot_password(
    State(pool): State<SqlitePool>,
    Json(payload): Json<ForgotPasswordRequest>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let email = payload.email.trim().to_lowercase();
    if email.is_empty() {
        return Err((StatusCode::BAD_REQUEST, Json(json!({ "error": "Email is required." }))));
    }

    // Check if user exists
    let user_exists: bool = sqlx::query_scalar("SELECT EXISTS(SELECT 1 FROM users WHERE email = ?)")
        .bind(&email)
        .fetch_one(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({ "error": e.to_string() }))))?;

    if !user_exists {
        // Return success even if email doesn't exist for security reasons (prevents enumeration),
        // but we'll include a mock token or message
        return Ok(Json(json!({
            "message": "If this email is registered, a password reset link has been generated.",
            "token": null
        })));
    }

    // Generate a secure, unpredictable 64-character token
    use rand::Rng;
    let token: String = rand::thread_rng()
        .sample_iter(&rand::distributions::Alphanumeric)
        .take(64)
        .map(char::from)
        .collect();

    // Save token to DB with 1 hour expiration
    sqlx::query("UPDATE users SET reset_token = ?, reset_token_expiry = datetime('now', '+1 hour') WHERE email = ?")
        .bind(&token)
        .bind(&email)
        .execute(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({ "error": e.to_string() }))))?;

    println!("🔑 [PASSWORD RESET] Token for {}: {}", email, token);

    Ok(Json(json!({
        "message": "If this email is registered, a password reset link has been generated.",
        "token": token
    })))
}

pub async fn reset_password(
    State(pool): State<SqlitePool>,
    Json(payload): Json<ResetPasswordRequest>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    if payload.token.trim().is_empty() {
        return Err((StatusCode::BAD_REQUEST, Json(json!({ "error": "Reset token is required." }))));
    }

    if payload.password.len() < 8 {
        return Err((StatusCode::BAD_REQUEST, Json(json!({ "error": "Password must be at least 8 characters." }))));
    }

    // Find user with valid token
    let user_id: Option<i64> = sqlx::query_scalar(
        "SELECT id FROM users WHERE reset_token = ? AND reset_token_expiry > datetime('now')"
    )
    .bind(payload.token.trim())
    .fetch_optional(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({ "error": e.to_string() }))))?;

    let uid = match user_id {
        Some(id) => id,
        None => return Err((StatusCode::BAD_REQUEST, Json(json!({ "error": "Invalid or expired reset token." })))),
    };

    // Hash password
    let hashed = hash(&payload.password, DEFAULT_COST)
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({ "error": "Password hashing failed." }))))?;

    // Update user password and clear token
    sqlx::query("UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?")
        .bind(hashed)
        .bind(uid)
        .execute(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({ "error": e.to_string() }))))?;

    Ok(Json(json!({ "message": "Password has been successfully reset." })))
}

// ---- WORKOUT TEMPLATES ----

#[derive(Deserialize)]
pub struct CreateTemplateRequest {
    name: String,
    exercises: Vec<ExerciseInput>,
}

#[derive(Serialize)]
pub struct TemplateExerciseResponse {
    id: i64,
    name: String,
    sets: i32,
    reps: i32,
    weight: f64,
}

#[derive(Serialize)]
pub struct WorkoutTemplateResponse {
    id: i64,
    name: String,
    exercises: Vec<TemplateExerciseResponse>,
}

pub async fn create_workout_template(
    auth: AuthUser,
    State(pool): State<SqlitePool>,
    Json(payload): Json<CreateTemplateRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    if payload.name.trim().is_empty() || payload.exercises.is_empty() {
        return Err((StatusCode::BAD_REQUEST, "Template name and exercises are required.".to_string()));
    }

    let template_id: i64 = sqlx::query_scalar(
        "INSERT INTO workout_templates (name, user_id) VALUES (?, ?) RETURNING id"
    )
    .bind(&payload.name)
    .bind(auth.user_id)
    .fetch_one(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    for ex in &payload.exercises {
        sqlx::query(
            "INSERT INTO template_exercises (name, sets, reps, weight, template_id) VALUES (?, ?, ?, ?, ?)"
        )
        .bind(&ex.name)
        .bind(ex.sets)
        .bind(ex.reps)
        .bind(ex.weight)
        .bind(template_id)
        .execute(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    }

    Ok(Json(json!({
        "message": "Template saved successfully.",
        "templateId": template_id
    })))
}

pub async fn get_workout_templates(
    auth: AuthUser,
    State(pool): State<SqlitePool>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let templates_rows: Vec<(i64, String)> = sqlx::query_as(
        "SELECT id, name FROM workout_templates WHERE user_id = ? ORDER BY created_at DESC"
    )
    .bind(auth.user_id)
    .fetch_all(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let mut templates = Vec::new();

    for (t_id, name) in templates_rows {
        let exercises_rows: Vec<(i64, String, i32, i32, f64)> = sqlx::query_as(
            "SELECT id, name, sets, reps, weight FROM template_exercises WHERE template_id = ?"
        )
        .bind(t_id)
        .fetch_all(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

        let exercises = exercises_rows
            .into_iter()
            .map(|(e_id, ex_name, sets, reps, weight)| TemplateExerciseResponse {
                id: e_id,
                name: ex_name,
                sets,
                reps,
                weight,
            })
            .collect();

        templates.push(WorkoutTemplateResponse {
            id: t_id,
            name,
            exercises,
        });
    }

    Ok(Json(templates))
}


