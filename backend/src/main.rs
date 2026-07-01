use axum::{
    http,
    routing::{get, post, delete, put},
    Router,
};
use std::net::SocketAddr;
use tower_http::cors::{CorsLayer, Any};
use tower_http::compression::CompressionLayer;
use dotenvy::dotenv;
use std::env;

mod db;
mod middleware;
mod routes;

#[tokio::main]
async fn main() {
    dotenv().ok();

    let jwt_secret = env::var("JWT_SECRET").unwrap_or_default();
    if jwt_secret.is_empty() || jwt_secret == "super_secret_saiyan_key_1337_force" {
        println!("⚠️  [WARNING]: JWT_SECRET is empty or using the default insecure fallback. Please set a secure value in production.");
    }

    // Initialize database pool & seed if empty
    let pool = db::init_db().await;

    // CORS configuration — restrict in production via CORS_ORIGIN env var
    let cors = match env::var("CORS_ORIGIN") {
        Ok(origin) => {
            let mut cleaned_origin = origin.trim().to_string();
            if cleaned_origin.ends_with('/') {
                cleaned_origin.pop();
            }
            println!("CORS: restricting to origin {}", cleaned_origin);
            CorsLayer::new()
                .allow_origin(cleaned_origin.parse::<http::HeaderValue>().expect("Invalid CORS_ORIGIN value"))
                .allow_methods(Any)
                .allow_headers(Any)
        }
        Err(_) => {
            println!("CORS: allowing all origins (development mode)");
            CorsLayer::new()
                .allow_origin(Any)
                .allow_methods(Any)
                .allow_headers(Any)
        }
    };

    // Router mapping
    let app = Router::new()
        // Auth
        .route("/api/auth/signup", post(routes::sign_up))
        .route("/api/auth/login", post(routes::sign_in))
        .route("/api/auth/forgot-password", post(routes::forgot_password))
        .route("/api/auth/reset-password", post(routes::reset_password))
        // Dashboard
        .route("/api/dashboard/stats", get(routes::get_dashboard_stats))
        // Workouts
        .route("/api/workouts", get(routes::get_workouts_history).post(routes::log_workout))
        .route("/api/workouts/templates", get(routes::get_workout_templates).post(routes::create_workout_template))
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
        .layer(cors)
        .layer(CompressionLayer::new());

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
