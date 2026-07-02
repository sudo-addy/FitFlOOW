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
    #[serde(rename = "bestStreak")]
    best_streak: i64,
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
    intensity: Option<String>, // "low" | "moderate" | "high"
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
    height: f64,
    weight: f64,
    goal: String,
    experience: String,
}

#[derive(Deserialize)]
pub struct UpdateTierRequest {
    tier: String,
    payment_confirmed: bool,
    payment_token: String,
}

#[derive(Deserialize)]
pub struct BodyWeightRequest {
    weight: f64,
    date: Option<String>,
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

    use once_cell::sync::Lazy;
    use regex::Regex;
    static EMAIL_RE: Lazy<Regex> = Lazy::new(|| {
        Regex::new(r"^[^@\s]+@[^@\s]+\.[^@\s]+$").unwrap()
    });

    if !EMAIL_RE.is_match(&payload.email) {
        return Err((StatusCode::BAD_REQUEST, Json(json!({ "error": "Invalid email format." }))));
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

fn calculate_streaks(dates: &[String]) -> (i64, i64) {
    let mut current_streak = 0;

    let today = chrono::Utc::now().naive_utc().date();
    let yesterday = today.pred_opt().unwrap_or(today);

    let mut parsed_dates = Vec::new();
    for d_str in dates {
        if let Ok(d) = chrono::NaiveDate::parse_from_str(d_str, "%Y-%m-%d") {
            parsed_dates.push(d);
        }
    }

    if parsed_dates.is_empty() {
        return (0, 0);
    }

    parsed_dates.sort_by(|a, b| b.cmp(a));
    parsed_dates.dedup();

    let first_date = parsed_dates[0];
    if first_date == today || first_date == yesterday {
        current_streak = 1;
        let mut current = first_date;
        for next_date in parsed_dates.iter().skip(1) {
            if current.pred_opt() == Some(*next_date) {
                current_streak += 1;
                current = *next_date;
            } else {
                break;
            }
        }
    }

    let mut temp_streak = 1;
    let mut best_streak = 1;
    let mut current = parsed_dates[0];
    for next_date in parsed_dates.iter().skip(1) {
        if current.pred_opt() == Some(*next_date) {
            temp_streak += 1;
            current = *next_date;
        } else {
            if temp_streak > best_streak {
                best_streak = temp_streak;
            }
            temp_streak = 1;
            current = *next_date;
        }
    }
    if temp_streak > best_streak {
        best_streak = temp_streak;
    }

    (current_streak, best_streak)
}

// ---- DASHBOARD ----
pub async fn get_dashboard_stats(
    auth: AuthUser,
    State(pool): State<SqlitePool>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    // 1. Get recent workouts with exercises (using a subquery to limit to 5 workouts, then LEFT JOIN)
    let rows: Vec<(i64, String, String, i32, f64, i32, Option<i64>, Option<String>, Option<i32>, Option<i32>, Option<f64>, Option<bool>)> = sqlx::query_as(
        "SELECT w.id, w.name, strftime('%Y-%m-%dT%H:%M:%fZ', w.date), w.duration, w.volume, w.calories,
                e.id, e.name, e.sets, e.reps, e.weight, e.completed
         FROM (
             SELECT * FROM workouts WHERE user_id = ? ORDER BY date DESC LIMIT 5
         ) w
         LEFT JOIN exercises e ON e.workout_id = w.id
         ORDER BY w.date DESC, w.id DESC, e.id ASC"
    )
    .bind(auth.user_id)
    .fetch_all(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let mut recent_workouts = json!([]);
    let mut current_workout: Option<serde_json::Value> = None;

    for r in rows {
        let (w_id, w_name, w_date, w_duration, w_volume, w_calories, e_id, e_name, e_sets, e_reps, e_weight, e_completed) = r;

        if current_workout.is_none() || current_workout.as_ref().unwrap()["id"].as_i64() != Some(w_id) {
            if let Some(cw) = current_workout.take() {
                recent_workouts.as_array_mut().unwrap().push(cw);
            }
            current_workout = Some(json!({
                "id": w_id,
                "name": w_name,
                "date": w_date,
                "duration": w_duration,
                "volume": w_volume,
                "calories": w_calories,
                "exercises": []
            }));
        }

        if let (Some(eid), Some(ename), Some(esets), Some(ereps), Some(eweight), Some(ecompleted)) = (e_id, e_name, e_sets, e_reps, e_weight, e_completed) {
            current_workout.as_mut().unwrap()["exercises"].as_array_mut().unwrap().push(json!({
                "id": eid,
                "name": ename,
                "sets": esets,
                "reps": ereps,
                "weight": eweight,
                "completed": ecompleted,
            }));
        }
    }

    if let Some(cw) = current_workout {
        recent_workouts.as_array_mut().unwrap().push(cw);
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

    // Streak: calculate consecutive days with at least 1 workout
    let dates: Vec<String> = sqlx::query_scalar(
        "SELECT DISTINCT date(date) FROM workouts WHERE user_id = ? ORDER BY date(date) DESC"
    )
    .bind(auth.user_id)
    .fetch_all(&pool)
    .await
    .unwrap_or_default();

    let (current_streak, best_streak) = calculate_streaks(&dates);

    Ok(Json(DashboardResponse {
        stats: DashboardStats {
            calories_burned: today_calories,
            workouts_this_week: weekly_count,
            streak: current_streak,
            best_streak,
            personal_records: pr_count,
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
    let rows: Vec<(i64, String, String, i32, f64, i32, Option<i64>, Option<String>, Option<i32>, Option<i32>, Option<f64>, Option<bool>)> = sqlx::query_as(
        "SELECT w.id, w.name, strftime('%Y-%m-%dT%H:%M:%fZ', w.date), w.duration, w.volume, w.calories,
                e.id, e.name, e.sets, e.reps, e.weight, e.completed
         FROM workouts w
         LEFT JOIN exercises e ON e.workout_id = w.id
         WHERE w.user_id = ?
         ORDER BY w.date DESC, w.id DESC, e.id ASC"
    )
    .bind(auth.user_id)
    .fetch_all(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let mut workouts = json!([]);
    let mut current_workout: Option<serde_json::Value> = None;
    let mut total_workouts = 0;
    let mut total_volume = 0.0;
    let mut total_duration = 0;
    let mut seen_workouts = std::collections::HashSet::new();

    for r in rows {
        let (w_id, w_name, w_date, w_duration, w_volume, w_calories, e_id, e_name, e_sets, e_reps, e_weight, e_completed) = r;

        if seen_workouts.insert(w_id) {
            total_workouts += 1;
            total_volume += w_volume;
            total_duration += w_duration;
        }

        if current_workout.is_none() || current_workout.as_ref().unwrap()["id"].as_i64() != Some(w_id) {
            if let Some(cw) = current_workout.take() {
                workouts.as_array_mut().unwrap().push(cw);
            }
            current_workout = Some(json!({
                "id": w_id,
                "name": w_name,
                "date": w_date,
                "duration": w_duration,
                "volume": w_volume,
                "calories": w_calories,
                "exercises": []
            }));
        }

        if let (Some(eid), Some(ename), Some(esets), Some(ereps), Some(eweight), Some(ecompleted)) = (e_id, e_name, e_sets, e_reps, e_weight, e_completed) {
            current_workout.as_mut().unwrap()["exercises"].as_array_mut().unwrap().push(json!({
                "id": eid,
                "name": ename,
                "sets": esets,
                "reps": ereps,
                "weight": eweight,
                "completed": ecompleted,
            }));
        }
    }

    if let Some(cw) = current_workout {
        workouts.as_array_mut().unwrap().push(cw);
    }

    // Streak: calculate consecutive days with at least 1 workout
    let dates: Vec<String> = sqlx::query_scalar(
        "SELECT DISTINCT date(date) FROM workouts WHERE user_id = ? ORDER BY date(date) DESC"
    )
    .bind(auth.user_id)
    .fetch_all(&pool)
    .await
    .unwrap_or_default();

    let (_current_streak, best_streak) = calculate_streaks(&dates);

    Ok(Json(json!({
        "workouts": workouts,
        "summary": {
            "totalWorkouts": total_workouts,
            "totalVolume": total_volume,
            "totalDuration": total_duration,
            "bestStreak": best_streak
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

    let met: f64 = match payload.intensity.as_deref().unwrap_or("moderate") {
        "low"      => 4.0,
        "high"     => 10.0,
        _          => 6.0, // moderate
    };
    // Assume 75kg avg weight if no profile weight stored
    let calories_burned = ((met * 3.5 * 75.0) / 200.0 * payload.duration as f64) as i32;

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

    // Auto-detect Personal Records (PRs)
    let mut new_prs = Vec::new();
    for ex in &payload.exercises {
        let prev_best: Option<f64> = sqlx::query_scalar(
            "SELECT MAX(e.weight) FROM exercises e
             JOIN workouts w ON w.id = e.workout_id
             WHERE w.user_id = ? AND LOWER(e.name) = LOWER(?) AND w.id != ?"
        )
        .bind(auth.user_id)
        .bind(&ex.name)
        .bind(workout_id)
        .fetch_optional(&pool)
        .await
        .unwrap_or(None);

        if let Some(best) = prev_best {
            if ex.weight > best {
                new_prs.push(json!({
                    "exercise": ex.name.clone(),
                    "old_best": best,
                    "new_best": ex.weight,
                }));
            }
        }
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

    Ok((StatusCode::CREATED, Json(json!({
        "message": "Workout logged successfully.",
        "new_prs": new_prs
    }))))
}

fn get_database_capacity_limit(class_name: &str) -> i64 {
    match class_name {
        "Hyperion HIIT" => 3,
        "Dragon Strength Protocol" => 7,
        "Zenith Mobility Flow" => 10,
        "Combat Conditioning" => 1,
        "Power Ascension" => 6,
        "Iron Endurance" => 5,
        "Apex Calisthenics" => 8,
        "Inferno Cardio" => 19,
        "Saiyan Surge (Full Body)" => 2,
        "Recovery & Restore" => 18,
        _ => 5, // Default limit
    }
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

    // Check capacity limit
    let booked_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(*) FROM class_bookings WHERE class_name = ? AND date = ? AND time = ? AND status = 'Booked'"
    )
    .bind(&payload.class_name)
    .bind(&payload.date)
    .bind(&payload.time)
    .fetch_one(&pool)
    .await
    .unwrap_or(0);

    let limit = get_database_capacity_limit(&payload.class_name);
    if booked_count >= limit {
        return Err((StatusCode::BAD_REQUEST, "This class session is fully booked.".to_string()));
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

    let counts_rows: Vec<(String, String, String, i32)> = sqlx::query_as(
        "SELECT class_name, date, time, COUNT(*) FROM class_bookings WHERE status = 'Booked' GROUP BY class_name, date, time"
    )
    .fetch_all(&pool)
    .await
    .unwrap_or_default();

    let mut class_counts = serde_json::Map::new();
    for (name, date, time, count) in counts_rows {
        let key = format!("{}|{}|{}", name, date, time);
        class_counts.insert(key, serde_json::Value::Number(count.into()));
    }

    Ok(Json(json!({
        "bookings": bookings,
        "classCounts": class_counts
    })))
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
    let row: (i64, String, String, String, f64, f64, String, String) = sqlx::query_as(
        "SELECT id, name, email, tier, height, weight, goal, experience FROM users WHERE id = ?"
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
            "height": row.4,
            "weight": row.5,
            "goal": row.6,
            "experience": row.7,
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
    sqlx::query("UPDATE users SET name = ?, height = ?, weight = ?, goal = ?, experience = ? WHERE id = ?")
        .bind(&payload.name)
        .bind(payload.height)
        .bind(payload.weight)
        .bind(&payload.goal)
        .bind(&payload.experience)
        .bind(auth.user_id)
        .execute(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let row: (i64, String, String, String, f64, f64, String, String) = sqlx::query_as(
        "SELECT id, name, email, tier, height, weight, goal, experience FROM users WHERE id = ?"
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
        },
        "profile": {
            "height": row.4,
            "weight": row.5,
            "goal": row.6,
            "experience": row.7,
            "notifications": { "email": true, "push": true, "sms": false }
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

    if !payload.payment_confirmed {
        return Err((StatusCode::PAYMENT_REQUIRED, "Payment has not been confirmed.".to_string()));
    }

    // Verify the payment token
    let secret = env::var("JWT_SECRET").expect("JWT_SECRET must be set in environment");
    let token_data = jsonwebtoken::decode::<PaymentClaims>(
        &payload.payment_token,
        &jsonwebtoken::DecodingKey::from_secret(secret.as_bytes()),
        &jsonwebtoken::Validation::default(),
    )
    .map_err(|e| (StatusCode::BAD_REQUEST, format!("Invalid or expired payment token: {}", e)))?;

    let claims = token_data.claims;
    if claims.user_id != auth.user_id {
        return Err((StatusCode::FORBIDDEN, "Payment token does not match user.".to_string()));
    }

    if claims.tier != payload.tier {
        return Err((StatusCode::BAD_REQUEST, "Payment token tier mismatch.".to_string()));
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

#[derive(Debug, Serialize, Deserialize)]
pub struct PaymentClaims {
    pub user_id: i64,
    pub tier: String,
    pub exp: usize,
}

#[derive(Deserialize)]
pub struct CreatePaymentSessionRequest {
    tier: String,
}

#[derive(Serialize)]
pub struct CreatePaymentSessionResponse {
    payment_token: String,
}

// ---- CREATE PAYMENT SESSION ----
pub async fn create_payment_session(
    auth: AuthUser,
    Json(payload): Json<CreatePaymentSessionRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    if payload.tier != "Elite" && payload.tier != "Ascension" {
        return Err((StatusCode::BAD_REQUEST, "Invalid tier specified.".to_string()));
    }

    let exp_time = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs() + 1800; // 30 mins expiration for payment session

    let claims = PaymentClaims {
        user_id: auth.user_id,
        tier: payload.tier,
        exp: exp_time as usize,
    };

    let secret = env::var("JWT_SECRET").expect("JWT_SECRET must be set in environment");

    let payment_token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_bytes()),
    )
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to generate payment token: {}", e)))?;

    Ok(Json(CreatePaymentSessionResponse { payment_token }))
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

    let secret = env::var("JWT_SECRET").expect("JWT_SECRET must be set in environment");

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

    Ok((
        [(axum::http::header::CACHE_CONTROL, "public, max-age=3600")],
        Json(json!({ "exercises": exercises })),
    ))
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

// ---- GET BODY WEIGHT LOGS ----
pub async fn get_body_weight_logs(
    auth: AuthUser,
    State(pool): State<SqlitePool>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let logs: Vec<(i64, f64, String)> = sqlx::query_as(
        "SELECT id, weight, date FROM body_weight_logs WHERE user_id = ? ORDER BY date ASC"
    )
    .bind(auth.user_id)
    .fetch_all(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let response: Vec<serde_json::Value> = logs.into_iter().map(|l| {
        json!({
            "id": l.0,
            "weight": l.1,
            "date": l.2,
        })
    }).collect();

    Ok(Json(response))
}

// ---- LOG BODY WEIGHT ----
pub async fn log_body_weight(
    auth: AuthUser,
    State(pool): State<SqlitePool>,
    Json(payload): Json<BodyWeightRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    if payload.weight <= 0.0 {
        return Err((StatusCode::BAD_REQUEST, "Weight must be greater than zero.".to_string()));
    }

    let date_str = payload.date.unwrap_or_else(|| {
        chrono::Utc::now().format("%Y-%m-%d").to_string()
    });

    let id = sqlx::query(
        "INSERT INTO body_weight_logs (weight, date, user_id) VALUES (?, ?, ?)"
    )
    .bind(payload.weight)
    .bind(&date_str)
    .bind(auth.user_id)
    .execute(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
    .last_insert_rowid();

    // Keep user profile weight in sync
    sqlx::query("UPDATE users SET weight = ? WHERE id = ?")
        .bind(payload.weight)
        .bind(auth.user_id)
        .execute(&pool)
        .await
        .ok();

    Ok(Json(json!({
        "message": "Body weight logged successfully.",
        "log": {
            "id": id,
            "weight": payload.weight,
            "date": date_str,
        }
    })))
}


