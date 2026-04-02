// ═══════════════════════════════════════════
// NEXUS MEDIA — Core TypeScript Types
// ═══════════════════════════════════════════

export type UserRole = 'admin' | 'manager' | 'spv' | 'staff_media' | 'guest'

export type TaskCategory = 'video' | 'design' | 'copy' | 'event' | 'sales' | 'partner'

export type TaskStatus = 'draft' | 'in_progress' | 'review' | 'completed' | 'overdue'

export type ContentStatus =
  | 'ideas'
  | 'brief'
  | 'in_production'
  | 'review'
  | 'scheduled'
  | 'published'

export type NotificationType =
  | 'task_assigned'
  | 'overdue'
  | 'deadline'
  | 'approve_needed'
  | 'achievement'

export type AssetType = 'ai' | 'psd' | 'svg' | 'png' | 'jpg' | 'eps' | 'pdf'

// ── Domain Models ──────────────────────────

export interface Outlet {
  id: string
  name: string
  slug: string
  description?: string
  brand_color: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  outlet_id: string
  full_name: string
  avatar_url?: string
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
  outlet?: Outlet
}

export interface Task {
  id: string
  outlet_id: string
  category: TaskCategory
  title: string
  description?: string
  status: TaskStatus
  priority: 'low' | 'medium' | 'high'
  assigned_to?: string
  created_by: string
  due_date?: string
  completed_at?: string
  created_at: string
  updated_at: string
  // Relations
  assignee?: Profile
  creator?: Profile
  step_logs?: TaskStepLog[]
}

export interface TaskStepLog {
  id: string
  task_id: string
  step_code: string
  step_name: string
  step_order: number
  progress_weight: number
  is_final: boolean
  status: 'pending' | 'completed'
  completed_by?: string
  completed_at?: string
  created_at: string
}

export interface ContentCard {
  id: string
  outlet_id: string
  title: string
  description?: string
  status: ContentStatus
  type: 'post' | 'story' | 'reel' | 'carousel' | 'blog'
  target_platform: 'instagram' | 'tiktok' | 'facebook' | 'all'
  scheduled_date?: string
  published_date?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface ContentIdea {
  id: string
  outlet_id: string
  title: string
  description?: string
  status: 'brainstorm' | 'approved' | 'rejected' | 'in_backlog'
  votes: number
  suggested_by: string
  created_at: string
  updated_at: string
  // Relations
  suggester?: Profile
  user_voted?: boolean
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: NotificationType
  related_task_id?: string
  is_read: boolean
  copied_to_wa: boolean
  created_at: string
}

export interface UserXP {
  id: string
  user_id: string
  total_xp: number
  current_level: number
  xp_in_current_level: number
  updated_at: string
}

export interface Achievement {
  id: string
  user_id: string
  achievement_id: string
  unlocked_at: string
}

export interface AchievementDefinition {
  id: string
  name: string
  description: string
  icon: string
  requirement: string
  xp_reward: number
  badge_color: string
}

// ── Task Step Definitions (per category) ──

export const TASK_STEPS: Record<TaskCategory, { code: string; name: string; weight: number; isFinal: boolean }[]> = {
  video: [
    { code: 'RAW_CUT',  name: 'Raw Cut',        weight: 20, isFinal: false },
    { code: 'FINE_CUT', name: 'Fine Cut',        weight: 25, isFinal: false },
    { code: 'EDIT',     name: 'Editing Final',   weight: 20, isFinal: false },
    { code: 'REVIEW',   name: 'Review',          weight: 15, isFinal: false },
    { code: 'RENDER',   name: 'Rendering',       weight: 10, isFinal: false },
    { code: 'UPLOAD',   name: 'Upload / Publish', weight: 10, isFinal: true  },
  ],
  design: [
    { code: 'BRIEF',    name: 'Brief',   weight: 15, isFinal: false },
    { code: 'CONCEPT',  name: 'Konsep',  weight: 20, isFinal: false },
    { code: 'DESIGN',   name: 'Design',  weight: 30, isFinal: false },
    { code: 'REVISION', name: 'Revisi',  weight: 20, isFinal: false },
    { code: 'FINAL',    name: 'Final',   weight: 10, isFinal: false },
    { code: 'PRINT',    name: 'Deploy',  weight: 5,  isFinal: true  },
  ],
  copy: [
    { code: 'DRAFT',    name: 'Draft',    weight: 40, isFinal: false },
    { code: 'REVIEW',   name: 'Review',   weight: 30, isFinal: false },
    { code: 'APPROVAL', name: 'Approval', weight: 30, isFinal: true  },
  ],
  event: [
    { code: 'CONCEPT', name: 'Konsep',      weight: 20, isFinal: false },
    { code: 'VENDOR',  name: 'Vendor',      weight: 25, isFinal: false },
    { code: 'PROMO',   name: 'Promosi',     weight: 20, isFinal: false },
    { code: 'EXECUTE', name: 'Pelaksanaan', weight: 25, isFinal: false },
    { code: 'REPORT',  name: 'Laporan',     weight: 10, isFinal: true  },
  ],
  sales: [
    { code: 'BRIEF',    name: 'Brief',        weight: 30, isFinal: false },
    { code: 'PROPOSAL', name: 'Proposal',     weight: 30, isFinal: false },
    { code: 'DEAL',     name: 'Deal/Closing', weight: 40, isFinal: true  },
  ],
  partner: [
    { code: 'APPROACH',  name: 'Approach',      weight: 20, isFinal: false },
    { code: 'NEGOTIATE', name: 'Negosiasi',     weight: 30, isFinal: false },
    { code: 'DEAL',      name: 'Deal',          weight: 30, isFinal: false },
    { code: 'LIVE',      name: 'Aktivasi/Live', weight: 20, isFinal: true  },
  ],
}

// ── UI Helper Types ──

export interface NavItem {
  id: string
  label: string
  icon: string
  href: string
  badge?: number
  roles?: UserRole[]
}
