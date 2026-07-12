-- IvanasAlchemy Database Initialization
-- Run: psql -d your_database < db-init.sql

CREATE TABLE IF NOT EXISTS horoscopes (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS readings (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  technologies TEXT[],
  github_url VARCHAR(500),
  live_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255),
  content TEXT NOT NULL,
  summary VARCHAR(500),
  generated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO projects (name, description, technologies, github_url, status) VALUES
  ('IvanasAlchemy', 'אתר מיסטיקה מקצועי - הורוסקופים, רונות, טארוט וחיזוי עתיד', ARRAY['Node.js','Express','PostgreSQL','Ollama'], 'https://github.com/ivanamikush92-dot/Ivana-s-Alchemy-', 'active')
ON CONFLICT DO NOTHING;
