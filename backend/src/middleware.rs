use axum::{
    async_trait,
    extract::{FromRequestParts, Request},
    http::{request::Parts, StatusCode},
    middleware::Next,
    response::{Response, IntoResponse},
};
use jsonwebtoken::{decode, DecodingKey, Validation};
use serde::{Deserialize, Serialize};
use std::env;
use std::collections::HashMap;
use std::sync::{Arc, Mutex, LazyLock};
use std::time::{Duration, Instant};

#[derive(Clone)]
pub struct RateLimiter {
    records: Arc<Mutex<HashMap<String, (u32, Instant)>>>,
    max_requests: u32,
    window: Duration,
}

impl RateLimiter {
    pub fn new(max_requests: u32, window_secs: u64) -> Self {
        Self {
            records: Arc::new(Mutex::new(HashMap::new())),
            max_requests,
            window: Duration::from_secs(window_secs),
        }
    }
}

pub static AUTH_LIMITER: LazyLock<RateLimiter> = LazyLock::new(|| {
    RateLimiter::new(10, 60) // Max 10 requests per 60 seconds per IP
});

pub async fn rate_limit(
    req: Request,
    next: Next,
) -> Response {
    let client_ip = req
        .headers()
        .get("x-forwarded-for")
        .and_then(|h| h.to_str().ok())
        .and_then(|s| s.split(',').next())
        .map(|s| s.trim().to_string())
        .or_else(|| {
            req.headers()
                .get("x-real-ip")
                .and_then(|h| h.to_str().ok())
                .map(|s| s.to_string())
        })
        .unwrap_or_else(|| "unknown".to_string());

    let limit_exceeded = {
        let now = Instant::now();
        let mut records = AUTH_LIMITER.records.lock().unwrap();
        let entry = records.entry(client_ip).or_insert((0, now));
        if now.duration_since(entry.1) > AUTH_LIMITER.window {
            *entry = (1, now);
        } else {
            entry.0 += 1;
        }
        entry.0 > AUTH_LIMITER.max_requests
    };

    if limit_exceeded {
        return StatusCode::TOO_MANY_REQUESTS.into_response();
    }

    next.run(req).await
}

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
        let auth_header = parts
            .headers
            .get("Authorization")
            .and_then(|value| value.to_str().ok());

        let token = match auth_header {
            Some(header) if header.starts_with("Bearer ") => &header[7..],
            _ => return Err((StatusCode::UNAUTHORIZED, "Access denied. No token provided.".to_string())),
        };

        let secret = env::var("JWT_SECRET").unwrap_or_else(|_| "super_secret_saiyan_key_1337_force".to_string());
        
        let token_data = decode::<Claims>(
            token,
            &DecodingKey::from_secret(secret.as_bytes()),
            &Validation::default(),
        )
        .map_err(|_| (StatusCode::FORBIDDEN, "Invalid or expired token.".to_string()))?;

        Ok(AuthUser {
            user_id: token_data.claims.userId,
        })
    }
}
