use axum::{
    http,
    routing::{get, post, delete, put},
    Router,
};
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;
use tower_http::compression::CompressionLayer;
use std::env;
use std::sync::Arc;
use tower_governor::{governor::GovernorConfigBuilder, GovernorLayer};

mod db;
mod middleware;
mod routes;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();

    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "fitfloow_backend=info,tower_http=info".into()),
        )
        .init();

    let _ = env::var("JWT_SECRET").expect("FATAL: JWT_SECRET env var is not set");

    // Initialize database pool & seed if empty
    let pool = db::init_db().await;

    // CORS configuration — restrict to allowed origins (development local and production domain)
    let mut allowed_origins = vec![
        "http://localhost:5173".parse::<http::HeaderValue>().unwrap(),
    ];

    if let Ok(origin) = env::var("CORS_ORIGIN") {
        let mut cleaned_origin = origin.trim().to_string();
        if cleaned_origin.ends_with('/') {
            cleaned_origin.pop();
        }
        if !cleaned_origin.is_empty() {
            if let Ok(hv) = cleaned_origin.parse::<http::HeaderValue>() {
                tracing::info!("CORS: adding allowed origin {}", cleaned_origin);
                allowed_origins.push(hv);
            }
        }
    } else {
        allowed_origins.push("https://yourdomain.com".parse::<http::HeaderValue>().unwrap());
    }

    let cors = CorsLayer::new()
        .allow_origin(allowed_origins)
        .allow_methods([
            http::Method::GET,
            http::Method::POST,
            http::Method::PUT,
            http::Method::DELETE,
        ])
        .allow_headers([
            http::header::AUTHORIZATION,
            http::header::CONTENT_TYPE,
        ]);

    let governor_conf = GovernorConfigBuilder::default()
        .per_second(12)
        .burst_size(5)
        .finish()
        .unwrap();

    let auth_routes = Router::new()
        .route("/signup", post(routes::sign_up))
        .route("/login", post(routes::sign_in))
        .route("/forgot-password", post(routes::forgot_password))
        .route("/reset-password", post(routes::reset_password))
        .layer(GovernorLayer { config: Arc::new(governor_conf) });

    // Router mapping
    let app = Router::new()
        .nest("/api/auth", auth_routes)
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
        .route("/api/payments/create-session", post(routes::create_payment_session))
        .route("/api/body-weight", get(routes::get_body_weight_logs).post(routes::log_body_weight))
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

    tracing::info!("⚡ [Saiyan Gym API] Server running at http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn health_check(
    axum::extract::State(pool): axum::extract::State<sqlx::SqlitePool>,
) -> impl axum::response::IntoResponse {
    let db_ok = sqlx::query("SELECT 1").fetch_one(&pool).await.is_ok();
    if db_ok {
        (
            axum::http::StatusCode::OK,
            axum::Json(serde_json::json!({ "status": "healthy", "db": "connected" })),
        )
    } else {
        (
            axum::http::StatusCode::SERVICE_UNAVAILABLE,
            axum::Json(serde_json::json!({ "status": "unhealthy", "db": "disconnected" })),
        )
    }
}
