CREATE TABLE IF NOT EXISTS exercises_lookup (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    body_part TEXT NOT NULL,
    equipment TEXT NOT NULL,
    muscle_group TEXT NOT NULL,
    target TEXT NOT NULL,
    steps TEXT NOT NULL
);
