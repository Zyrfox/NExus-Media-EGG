-- ═══════════════════════════════════════════════════════════════
-- NEXUS MEDIA — Complete Initial Schema
-- Easy Going Group | Version 1.0
-- ═══════════════════════════════════════════════════════════════

-- ── Helper function: updated_at ──────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ══════════════════════════════════════
-- 1. OUTLETS
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS outlets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(255) NOT NULL,
  slug        VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  brand_color VARCHAR(7) NOT NULL DEFAULT '#c9a84c',
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_outlets_updated_at
  BEFORE UPDATE ON outlets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed data
INSERT INTO outlets (name, slug, description, brand_color) VALUES
  ('Taman Sari Forest', 'tsf', 'Wisata alam, kebun binatang mini, dan F&B', '#4caf7a'),
  ('Back to Mie Kitchen', 'btm', 'Restoran F&B mie dan makanan Indonesia', '#4c7ac9'),
  ('Easy Going Coffee', 'egc', 'Coffee shop dan minuman', '#c9a84c')
ON CONFLICT (slug) DO NOTHING;

-- ══════════════════════════════════════
-- 2. PROFILES (extends auth.users)
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  outlet_id   UUID NOT NULL REFERENCES outlets(id) ON DELETE RESTRICT,
  full_name   VARCHAR(255) NOT NULL DEFAULT '',
  avatar_url  VARCHAR(500),
  role        VARCHAR(50) NOT NULL DEFAULT 'staff_media'
                CHECK (role IN ('admin','manager','spv','staff_media','guest')),
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on signup (uses first outlet as default)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_outlet_id UUID;
BEGIN
  SELECT id INTO default_outlet_id FROM outlets WHERE is_active = true ORDER BY created_at LIMIT 1;
  INSERT INTO profiles (id, outlet_id, full_name)
  VALUES (
    NEW.id,
    default_outlet_id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ══════════════════════════════════════
-- 3. USER OUTLET ASSIGNMENTS
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS user_outlet_assignments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  outlet_id   UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
  role        VARCHAR(50) NOT NULL DEFAULT 'staff_media',
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, outlet_id)
);

-- ══════════════════════════════════════
-- 4. TASKS
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS tasks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outlet_id    UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
  category     VARCHAR(50) NOT NULL
                 CHECK (category IN ('video','design','copy','event','sales','partner')),
  title        VARCHAR(255) NOT NULL,
  description  TEXT,
  status       VARCHAR(50) NOT NULL DEFAULT 'draft'
                 CHECK (status IN ('draft','in_progress','review','completed','overdue')),
  priority     VARCHAR(20) NOT NULL DEFAULT 'medium'
                 CHECK (priority IN ('low','medium','high')),
  assigned_to  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_by   UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  due_date     TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto set completed_at when status = completed
CREATE OR REPLACE FUNCTION handle_task_completed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_task_completed
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION handle_task_completed();

-- ══════════════════════════════════════
-- 5. TASK STEP LOGS
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS task_step_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id         UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  step_code       VARCHAR(50) NOT NULL,
  step_name       VARCHAR(100) NOT NULL,
  step_order      INT NOT NULL,
  progress_weight INT NOT NULL DEFAULT 0,
  is_final        BOOLEAN NOT NULL DEFAULT false,
  status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','completed')),
  completed_by    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ══════════════════════════════════════
-- 6. TASK COMMENTS
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS task_comments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id    UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_task_comments_updated_at
  BEFORE UPDATE ON task_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ══════════════════════════════════════
-- 7. CONTENT CARDS
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS content_cards (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outlet_id       UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
  title           VARCHAR(255) NOT NULL,
  description     TEXT,
  status          VARCHAR(50) NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft','planned','in_production','ready','published')),
  type            VARCHAR(50) NOT NULL DEFAULT 'post'
                    CHECK (type IN ('post','story','reel','carousel','blog')),
  target_platform VARCHAR(50) NOT NULL DEFAULT 'instagram'
                    CHECK (target_platform IN ('instagram','tiktok','facebook','all')),
  scheduled_date  TIMESTAMPTZ,
  published_date  TIMESTAMPTZ,
  created_by      UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_content_cards_updated_at
  BEFORE UPDATE ON content_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ══════════════════════════════════════
-- 8. CONTENT IDEAS
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS content_ideas (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outlet_id    UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
  title        VARCHAR(255) NOT NULL,
  description  TEXT,
  status       VARCHAR(50) NOT NULL DEFAULT 'brainstorm'
                 CHECK (status IN ('brainstorm','approved','rejected','in_backlog')),
  votes        INT NOT NULL DEFAULT 0,
  suggested_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_content_ideas_updated_at
  BEFORE UPDATE ON content_ideas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ══════════════════════════════════════
-- 9. IDEA VOTES
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS idea_votes (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id  UUID NOT NULL REFERENCES content_ideas(id) ON DELETE CASCADE,
  user_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  voted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(idea_id, user_id)
);

-- ══════════════════════════════════════
-- 10. NOTIFICATIONS
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS notifications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title           VARCHAR(255) NOT NULL,
  message         TEXT NOT NULL,
  type            VARCHAR(50) NOT NULL DEFAULT 'task_assigned'
                    CHECK (type IN ('task_assigned','overdue','deadline','approve_needed','achievement')),
  related_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  is_read         BOOLEAN NOT NULL DEFAULT false,
  copied_to_wa    BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ══════════════════════════════════════
-- 11. USER XP
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS user_xp (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  total_xp            INT NOT NULL DEFAULT 0 CHECK (total_xp >= 0),
  current_level       INT NOT NULL DEFAULT 1,
  xp_in_current_level INT NOT NULL DEFAULT 0,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ══════════════════════════════════════
-- 12. ACHIEVEMENT DEFINITIONS
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS achievement_definitions (
  id          VARCHAR(50) PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  icon        VARCHAR(50) NOT NULL DEFAULT '🏆',
  requirement TEXT NOT NULL,
  xp_reward   INT NOT NULL DEFAULT 0,
  badge_color VARCHAR(7) NOT NULL DEFAULT '#c9a84c',
  is_active   BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO achievement_definitions (id, name, description, icon, requirement, xp_reward, badge_color) VALUES
  ('first_blood',     'First Blood',       'Selesaikan task pertamamu',                         '⚔️',  'Selesaikan 1 task',                    10, '#c9504c'),
  ('boss_slayer',     'Boss Slayer',        'Selesaikan 5 final step (boss mission)',             '☠️',  'Selesaikan 5 boss mission',            50, '#c9504c'),
  ('speed_run',       'Speed Run',          'Selesaikan task sebelum deadline',                  '⚡',  'Selesaikan task > 1 hari sebelum DL',  20, '#c9a84c'),
  ('perfect_week',    'Perfect Week',       'Tidak ada task overdue dalam 1 minggu',             '✨',  '7 hari tanpa overdue',                 30, '#4caf7a'),
  ('content_king',    'Content King',       'Publish 10 konten',                                 '👑',  'Publish 10 content cards',             40, '#c9a84c'),
  ('team_player',     'Team Player',        'Assign task ke 3 orang berbeda',                    '🤝',  'Assign ke 3 member berbeda',           15, '#4c7ac9'),
  ('overachiever',    'Overachiever',       'Capai 500 XP total',                                '🚀',  'Kumpulkan 500 XP',                     100,'#c9a84c'),
  ('early_bird',      'Early Bird',         'Login sebelum jam 8 pagi 5 kali',                   '🌅',  '5x login sebelum 08:00',               25, '#c9904c'),
  ('deadline_hunter', 'Deadline Hunter',    'Selesaikan 10 task sebelum deadline',               '🎯',  '10 task selesai sebelum deadline',     50, '#4caf7a'),
  ('veteran',         'Veteran',            'Gunakan platform selama 30 hari',                   '🎖️', '30 hari aktif di platform',            75, '#a09a8e')
ON CONFLICT (id) DO NOTHING;

-- ══════════════════════════════════════
-- 13. ACHIEVEMENTS (earned)
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS achievements (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id VARCHAR(50) NOT NULL REFERENCES achievement_definitions(id),
  unlocked_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- ══════════════════════════════════════
-- 14. ASSETS
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS assets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outlet_id       UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
  filename        VARCHAR(255) NOT NULL,
  file_type       VARCHAR(10) NOT NULL
                    CHECK (file_type IN ('ai','psd','svg','png','jpg','eps','pdf')),
  file_size       INT,
  google_drive_id VARCHAR(255),
  created_by      UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_assets_updated_at
  BEFORE UPDATE ON assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ══════════════════════════════════════
-- 15. AI GENERATIONS
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS ai_generations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outlet_id           UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
  task_id             UUID REFERENCES tasks(id) ON DELETE SET NULL,
  prompt              TEXT NOT NULL,
  model               VARCHAR(50) NOT NULL DEFAULT 'flux',
  generated_image_url VARCHAR(500),
  seed                INT,
  created_by          UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  cost_usd            DECIMAL(5,2) DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ══════════════════════════════════════
-- 16. BRAND GUIDELINES
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS brand_guidelines (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outlet_id  UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
  section    VARCHAR(50) NOT NULL
               CHECK (section IN ('colors','typography','logo','social','tone')),
  content    TEXT NOT NULL DEFAULT '{}',
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(outlet_id, section)
);

CREATE TRIGGER update_brand_guidelines_updated_at
  BEFORE UPDATE ON brand_guidelines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ══════════════════════════════════════
-- 17. AUDIT LOGS
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  action      VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id   UUID,
  old_values  JSONB,
  new_values  JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Immutable audit log
CREATE OR REPLACE RULE audit_logs_no_update AS ON UPDATE TO audit_logs DO INSTEAD NOTHING;
CREATE OR REPLACE RULE audit_logs_no_delete AS ON DELETE TO audit_logs DO INSTEAD NOTHING;

-- ══════════════════════════════════════
-- INDEXES (Performance)
-- ══════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_tasks_outlet_status     ON tasks(outlet_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to       ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date          ON tasks(due_date) WHERE status != 'completed';
CREATE INDEX IF NOT EXISTS idx_content_outlet_date     ON content_cards(outlet_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_assets_outlet_type      ON assets(outlet_id, file_type);
CREATE INDEX IF NOT EXISTS idx_audit_user_created      ON audit_logs(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_task_steps_task_id      ON task_step_logs(task_id, step_order);
CREATE INDEX IF NOT EXISTS idx_profiles_outlet         ON profiles(outlet_id);

-- ══════════════════════════════════════
-- VIEWS
-- ══════════════════════════════════════
CREATE OR REPLACE VIEW task_summary_by_outlet AS
SELECT
  outlet_id,
  COUNT(*) AS total_tasks,
  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_tasks,
  SUM(CASE WHEN status = 'overdue'   THEN 1 ELSE 0 END) AS overdue_tasks,
  SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress_tasks,
  CASE WHEN COUNT(*) > 0
    THEN ROUND(100.0 * SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) / COUNT(*), 2)
    ELSE 0
  END AS completion_rate
FROM tasks
GROUP BY outlet_id;

CREATE OR REPLACE VIEW leaderboard AS
SELECT
  p.id AS user_id,
  p.full_name,
  p.outlet_id,
  p.role,
  COALESCE(x.total_xp, 0) AS total_xp,
  COALESCE(x.current_level, 1) AS current_level,
  ROW_NUMBER() OVER (ORDER BY COALESCE(x.total_xp, 0) DESC) AS rank_overall,
  ROW_NUMBER() OVER (PARTITION BY p.outlet_id ORDER BY COALESCE(x.total_xp, 0) DESC) AS rank_outlet
FROM profiles p
LEFT JOIN user_xp x ON x.user_id = p.id
WHERE p.is_active = true;

CREATE OR REPLACE VIEW upcoming_deadlines AS
SELECT
  id, title, assigned_to, due_date, outlet_id, status, priority
FROM tasks
WHERE
  due_date BETWEEN NOW() AND NOW() + INTERVAL '7 days'
  AND status NOT IN ('completed')
ORDER BY due_date ASC;

CREATE OR REPLACE VIEW ai_daily_usage AS
SELECT
  DATE(created_at) AS usage_date,
  outlet_id,
  COUNT(*) AS generations,
  SUM(cost_usd) AS daily_cost
FROM ai_generations
GROUP BY DATE(created_at), outlet_id
ORDER BY usage_date DESC;

-- ══════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ══════════════════════════════════════
ALTER TABLE outlets              ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_outlet_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks                ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_step_logs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_cards        ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_ideas        ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_votes           ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications        ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_xp              ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements         ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets               ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generations       ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_guidelines     ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs           ENABLE ROW LEVEL SECURITY;

-- Helper function: get user's outlets
CREATE OR REPLACE FUNCTION get_user_outlet_ids(uid UUID)
RETURNS UUID[] AS $$
  SELECT ARRAY_AGG(outlet_id)
  FROM user_outlet_assignments
  WHERE user_id = uid
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function: get user role
CREATE OR REPLACE FUNCTION get_user_role(uid UUID)
RETURNS VARCHAR AS $$
  SELECT role FROM profiles WHERE id = uid
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- outlets: everyone authenticated can read
CREATE POLICY "outlets_read" ON outlets FOR SELECT TO authenticated USING (true);
CREATE POLICY "outlets_admin_write" ON outlets FOR ALL TO authenticated
  USING (get_user_role(auth.uid()) IN ('admin','manager'));

-- profiles: read own + same outlet; write own
CREATE POLICY "profiles_read_own" ON profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR get_user_role(auth.uid()) IN ('admin','manager')
         OR outlet_id = (SELECT outlet_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE TO authenticated
  USING (id = auth.uid());
CREATE POLICY "profiles_admin" ON profiles FOR ALL TO authenticated
  USING (get_user_role(auth.uid()) IN ('admin','manager'));

-- user_outlet_assignments
CREATE POLICY "uoa_read" ON user_outlet_assignments FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR get_user_role(auth.uid()) IN ('admin','manager'));
CREATE POLICY "uoa_admin" ON user_outlet_assignments FOR ALL TO authenticated
  USING (get_user_role(auth.uid()) IN ('admin','manager'));

-- tasks: outlet-scoped + role-based
CREATE POLICY "tasks_select" ON tasks FOR SELECT TO authenticated
  USING (
    get_user_role(auth.uid()) IN ('admin','manager')
    OR outlet_id = ANY(get_user_outlet_ids(auth.uid()))
    OR assigned_to = auth.uid()
  );
CREATE POLICY "tasks_insert" ON tasks FOR INSERT TO authenticated
  WITH CHECK (
    get_user_role(auth.uid()) IN ('admin','manager','spv','staff_media')
    AND outlet_id = ANY(get_user_outlet_ids(auth.uid()))
  );
CREATE POLICY "tasks_update" ON tasks FOR UPDATE TO authenticated
  USING (
    get_user_role(auth.uid()) IN ('admin','manager')
    OR (outlet_id = ANY(get_user_outlet_ids(auth.uid()))
        AND get_user_role(auth.uid()) IN ('spv','staff_media'))
  );
CREATE POLICY "tasks_delete" ON tasks FOR DELETE TO authenticated
  USING (get_user_role(auth.uid()) IN ('admin','manager'));

-- task_step_logs
CREATE POLICY "steps_select" ON task_step_logs FOR SELECT TO authenticated
  USING (task_id IN (SELECT id FROM tasks));
CREATE POLICY "steps_insert" ON task_step_logs FOR INSERT TO authenticated
  WITH CHECK (task_id IN (SELECT id FROM tasks));
CREATE POLICY "steps_update" ON task_step_logs FOR UPDATE TO authenticated
  USING (task_id IN (SELECT id FROM tasks));

-- task_comments
CREATE POLICY "comments_select" ON task_comments FOR SELECT TO authenticated
  USING (task_id IN (SELECT id FROM tasks));
CREATE POLICY "comments_insert" ON task_comments FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND task_id IN (SELECT id FROM tasks));

-- content_cards
CREATE POLICY "content_select" ON content_cards FOR SELECT TO authenticated
  USING (get_user_role(auth.uid()) IN ('admin','manager')
         OR outlet_id = ANY(get_user_outlet_ids(auth.uid())));
CREATE POLICY "content_write" ON content_cards FOR ALL TO authenticated
  USING (get_user_role(auth.uid()) IN ('admin','manager','spv','staff_media')
         AND outlet_id = ANY(get_user_outlet_ids(auth.uid())));

-- content_ideas
CREATE POLICY "ideas_select" ON content_ideas FOR SELECT TO authenticated
  USING (get_user_role(auth.uid()) IN ('admin','manager')
         OR outlet_id = ANY(get_user_outlet_ids(auth.uid())));
CREATE POLICY "ideas_write" ON content_ideas FOR ALL TO authenticated
  USING (outlet_id = ANY(get_user_outlet_ids(auth.uid())));

-- idea_votes
CREATE POLICY "votes_all" ON idea_votes FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- notifications: own only
CREATE POLICY "notif_own" ON notifications FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- user_xp: own; managers can see all
CREATE POLICY "xp_select" ON user_xp FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR get_user_role(auth.uid()) IN ('admin','manager'));
CREATE POLICY "xp_write" ON user_xp FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- achievements
CREATE POLICY "achievements_select" ON achievements FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR get_user_role(auth.uid()) IN ('admin','manager'));
CREATE POLICY "achievements_insert" ON achievements FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- achievement_definitions: everyone reads
CREATE POLICY "achdef_read" ON achievement_definitions FOR SELECT TO authenticated USING (true);
CREATE POLICY "achdef_admin" ON achievement_definitions FOR ALL TO authenticated
  USING (get_user_role(auth.uid()) IN ('admin','manager'));

-- assets
CREATE POLICY "assets_select" ON assets FOR SELECT TO authenticated
  USING (get_user_role(auth.uid()) IN ('admin','manager')
         OR outlet_id = ANY(get_user_outlet_ids(auth.uid())));
CREATE POLICY "assets_write" ON assets FOR ALL TO authenticated
  USING (outlet_id = ANY(get_user_outlet_ids(auth.uid())));

-- ai_generations
CREATE POLICY "ai_select" ON ai_generations FOR SELECT TO authenticated
  USING (get_user_role(auth.uid()) IN ('admin','manager')
         OR outlet_id = ANY(get_user_outlet_ids(auth.uid())));
CREATE POLICY "ai_insert" ON ai_generations FOR INSERT TO authenticated
  WITH CHECK (outlet_id = ANY(get_user_outlet_ids(auth.uid())));

-- brand_guidelines
CREATE POLICY "brand_select" ON brand_guidelines FOR SELECT TO authenticated
  USING (get_user_role(auth.uid()) IN ('admin','manager')
         OR outlet_id = ANY(get_user_outlet_ids(auth.uid())));
CREATE POLICY "brand_write" ON brand_guidelines FOR ALL TO authenticated
  USING (get_user_role(auth.uid()) IN ('admin','manager'));

-- audit_logs: managers only read; no delete/update (enforced by rules above)
CREATE POLICY "audit_select" ON audit_logs FOR SELECT TO authenticated
  USING (get_user_role(auth.uid()) IN ('admin','manager'));
CREATE POLICY "audit_insert" ON audit_logs FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
