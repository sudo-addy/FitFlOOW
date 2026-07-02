CREATE INDEX IF NOT EXISTS idx_workouts_user_id    ON workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_date        ON workouts(date);
CREATE INDEX IF NOT EXISTS idx_exercises_workout_id ON exercises(workout_id);
CREATE INDEX IF NOT EXISTS idx_class_bookings_user  ON class_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_user_date  ON nutrition_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_achievements_user    ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_exercises_lookup_name ON exercises_lookup(name);
