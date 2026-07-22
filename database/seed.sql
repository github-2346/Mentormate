-- Seed data for development
-- Passwords are bcrypt of 'password123'
INSERT INTO users (name, email, password, role) VALUES
  ('Alice Mentor',  'alice@example.com',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'MENTOR'),
  ('Bob Student',   'bob@example.com',    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'STUDENT'),
  ('Carol Mentor',  'carol@example.com',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'MENTOR'),
  ('Dan Student',   'dan@example.com',    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'STUDENT')
ON CONFLICT (email) DO NOTHING;
