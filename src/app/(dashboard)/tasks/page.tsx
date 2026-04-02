import { createClient } from '@/lib/supabase/server'
import { TasksClient } from '@/components/tasks/TasksClient'
import { PRIORITY_COLORS } from '@/components/tasks/task-data'
import type { TaskItem, TaskStatus, TaskPriority } from '@/components/tasks/task-data'

// ── Assignee color palette (deterministic by name char code) ──────────────────
const ASSIGNEE_COLORS = ['#c9a84c', '#4c7ac9', '#4caf7a', '#c9504c', '#c9904c']

const CATEGORY_DISPLAY: Record<string, string> = {
  video: 'Video', design: 'Design', copy: 'Copy',
  event: 'Event', sales: 'Sales', partner: 'Partner',
}

function mapTask(task: {
  id: string
  title: string
  category: string
  status: string
  priority: string
  due_date: string | null
  completed_at: string | null
  assignee?: { id: string; full_name: string } | null
  outlet?: { id: string; name: string; slug: string; brand_color: string } | null
}): TaskItem {
  const name = task.assignee?.full_name ?? ''
  const colorIdx = name ? name.charCodeAt(0) % ASSIGNEE_COLORS.length : 0
  const assigneeColor = ASSIGNEE_COLORS[colorIdx]

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?'

  const outletSlug = (task.outlet?.slug ?? 'all').toUpperCase()

  // DB uses 'completed', UI uses 'done'
  const status = task.status === 'completed' ? 'done' : task.status

  const now = new Date()
  const isLate =
    !!task.due_date &&
    new Date(task.due_date) < now &&
    status !== 'done'

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })

  return {
    id: task.id,
    title: task.title,
    category: CATEGORY_DISPLAY[task.category] ?? task.category,
    subcategory: task.category,
    assigneeInitials: initials,
    assigneeName: name || 'Unassigned',
    assigneeColor,
    outlet: outletSlug,
    outletColor: task.outlet?.brand_color ?? '#c9a84c',
    deadline: task.due_date ? formatDate(task.due_date) : '-',
    isLate,
    status: status as TaskStatus,
    priority: task.priority as TaskPriority,
    priorityColor: PRIORITY_COLORS[task.priority as TaskPriority] ?? '#5a5650',
    tags: [CATEGORY_DISPLAY[task.category] ?? task.category],
    doneDate: task.completed_at ? formatDate(task.completed_at) : undefined,
  }
}

export default async function TasksPage() {
  const supabase = await createClient()

  const [tasksResult, profilesResult, outletsResult] = await Promise.all([
    supabase
      .from('tasks')
      .select('id, title, category, status, priority, due_date, completed_at, assignee:profiles!tasks_assigned_to_fkey(id, full_name), outlet:outlets(id, name, slug, brand_color)')
      .order('created_at', { ascending: false }),
    supabase
      .from('profiles')
      .select('id, full_name')
      .eq('is_active', true)
      .order('full_name'),
    supabase
      .from('outlets')
      .select('id, name, slug')
      .eq('is_active', true),
  ])

  const tasks = (tasksResult.data ?? []).map(mapTask)
  const profiles = profilesResult.data ?? []
  const outlets = outletsResult.data ?? []

  return <TasksClient tasks={tasks} profiles={profiles} outlets={outlets} />
}
