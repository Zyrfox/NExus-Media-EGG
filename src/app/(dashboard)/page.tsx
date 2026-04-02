import { createClient } from '@/lib/supabase/server'
import { Topbar } from '@/components/shared/Topbar'
import { KpiCards } from '@/components/dashboard/KpiCards'
import { WeeklyBarChart } from '@/components/dashboard/WeeklyBarChart'
import { TaskDistribution } from '@/components/dashboard/TaskDistribution'
import { Leaderboard } from '@/components/dashboard/Leaderboard'
import { RecentTasks } from '@/components/dashboard/RecentTasks'
import { ContentCalendar, type CalDay } from '@/components/dashboard/ContentCalendar'
import { TrendLine } from '@/components/dashboard/TrendLine'
import { CheckSquare2, CheckCheck, AlertCircle, BarChart3 } from 'lucide-react'

// ── Type helpers ──────────────────────────────────────────────────────────────

type TaskRow = {
  id: string
  title: string
  category: string
  status: string
  due_date: string | null
  completed_at: string | null
  created_at: string
  assignee: { id: string; full_name: string } | null
  outlet: { id: string; name: string; slug: string; brand_color: string } | null
}

type XpRow = {
  total_xp: number
  current_level: number
  profiles: { id: string; full_name: string; role: string } | null
}

type ContentRow = {
  id: string
  scheduled_date: string | null
  status: string
}

// ── Constants ─────────────────────────────────────────────────────────────────

const RANK_COLORS = ['#c9a84c', '#a8a8a8', '#4c7ac9', '#4caf7a', '#c9504c']

const CAT_LABELS: Record<string, string> = {
  video: 'Video',
  design: 'Design',
  copy: 'Copywriting',
  event: 'Event',
  sales: 'Sales',
  partner: 'Partner',
}

const CAT_COLORS: Record<string, string> = {
  video: '#c9a84c',
  design: '#4caf7a',
  copy: '#4c7ac9',
  event: '#c9504c',
  sales: '#c9904c',
  partner: '#a09a8e',
}

const BADGE_MAP: Record<string, 'DONE' | 'PROG' | 'LATE' | 'REVIEW' | 'DRAFT'> = {
  completed:   'DONE',
  in_progress: 'PROG',
  overdue:     'LATE',
  review:      'REVIEW',
  draft:       'DRAFT',
}

const CONTENT_STATUS_PRIORITY: Record<string, number> = {
  published:    0,
  ready:        1,
  in_production:2,
  planned:      3,
  draft:        4,
}

const CONTENT_CAL_STATUS: Record<string, CalDay['status']> = {
  published:    'published',
  ready:        'has',
  in_production:'has',
  planned:      'has',
}

const CONTENT_DOT_COLOR: Record<string, string> = {
  published:    '#4caf7a',
  ready:        '#c9a84c',
  in_production:'#4c7ac9',
  planned:      '#c9a84c',
}

// ── Data fetching ─────────────────────────────────────────────────────────────

async function fetchDashboardData() {
  const supabase = await createClient()

  const [tasksRes, xpRes, contentRes] = await Promise.all([
    supabase
      .from('tasks')
      .select(
        'id, title, category, status, due_date, completed_at, created_at,' +
        'assignee:profiles!tasks_assigned_to_fkey(id, full_name),' +
        'outlet:outlets(id, name, slug, brand_color)'
      )
      .order('created_at', { ascending: false }),

    supabase
      .from('user_xp')
      .select('total_xp, current_level, profiles(id, full_name, role)')
      .order('total_xp', { ascending: false })
      .limit(5),

    supabase
      .from('content_cards')
      .select('id, scheduled_date, status')
      .gte('scheduled_date', '2026-04-01T00:00:00Z')
      .lt('scheduled_date', '2026-05-01T00:00:00Z'),
  ])

  return {
    tasks:        (tasksRes.data   ?? []) as unknown as TaskRow[],
    xpRows:       (xpRes.data      ?? []) as unknown as XpRow[],
    contentCards: (contentRes.data ?? []) as unknown as ContentRow[],
  }
}

// ── Derived data helpers ──────────────────────────────────────────────────────

function buildKpiData(tasks: TaskRow[]) {
  const total    = tasks.length
  const completed = tasks.filter(t => t.status === 'completed').length
  const overdue   = tasks.filter(t => t.status === 'overdue').length
  const rate      = total > 0 ? Math.round((completed / total) * 100) : 0

  return {
    total,
    completed,
    overdue,
    rate,
    cards: [
      {
        label:   'Total Task',
        value:   total,
        color:   '#c9a84c',
        barWidth: 100,
        iconBg:  'rgba(201,168,76,0.08)',
        icon:    <CheckSquare2 size={13} color="#c9a84c" />,
      },
      {
        label:   'Task Selesai',
        value:   completed,
        color:   '#4caf7a',
        barWidth: total > 0 ? Math.round((completed / total) * 100) : 0,
        iconBg:  'rgba(76,175,122,0.1)',
        icon:    <CheckCheck size={13} color="#4caf7a" />,
      },
      {
        label:    'Task Telat',
        value:    overdue,
        deltaUp:  false,
        color:    '#c9504c',
        barWidth: total > 0 ? Math.round((overdue / total) * 100) : 0,
        iconBg:   'rgba(201,80,76,0.1)',
        icon:     <AlertCircle size={13} color="#c9504c" />,
      },
      {
        label:   'Completion Rate',
        value:   rate,
        suffix:  '%',
        color:   '#4c7ac9',
        barWidth: rate,
        iconBg:  'rgba(76,122,201,0.1)',
        icon:    <BarChart3 size={13} color="#4c7ac9" />,
      },
    ],
  }
}

function buildWeeklyData(tasks: TaskRow[]) {
  const DAY_MS   = 86_400_000
  const DAY_KEYS = ['Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb', 'Mg']

  const now      = new Date()
  const weekStart = new Date(now)
  weekStart.setHours(0, 0, 0, 0)
  const dow = weekStart.getDay()
  weekStart.setDate(weekStart.getDate() - (dow === 0 ? 6 : dow - 1))

  return DAY_KEYS.map((day, i) => {
    const dayStart = new Date(weekStart.getTime() + i * DAY_MS)
    const dayEnd   = new Date(dayStart.getTime() + DAY_MS)

    const selesai = tasks.filter(t => {
      if (!t.completed_at) return false
      const d = new Date(t.completed_at)
      return d >= dayStart && d < dayEnd
    }).length

    const telat = tasks.filter(t => {
      if (!t.due_date) return false
      const d = new Date(t.due_date)
      return d >= dayStart && d < dayEnd && t.status === 'overdue'
    }).length

    return { day, selesai, telat }
  })
}

function buildDistribution(tasks: TaskRow[]) {
  const total = tasks.length

  const catCounts = tasks.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] ?? 0) + 1
    return acc
  }, {})

  const categories = Object.entries(catCounts)
    .map(([cat, count]) => ({
      label: CAT_LABELS[cat] ?? cat,
      pct:   total > 0 ? Math.round((count / total) * 100) : 0,
      color: CAT_COLORS[cat]  ?? '#3a3a32',
    }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5)

  const outletMap = tasks.reduce<Record<string, { label: string; color: string; count: number }>>((acc, t) => {
    if (!t.outlet) return acc
    const { id, slug, brand_color } = t.outlet
    if (!acc[id]) acc[id] = { label: slug.toUpperCase(), color: brand_color, count: 0 }
    acc[id].count++
    return acc
  }, {})

  const outletStats = Object.values(outletMap).sort((a, b) => b.count - a.count)

  return { categories, outletStats }
}

function buildLeaderboard(xpRows: XpRow[]) {
  const maxScore = xpRows[0]?.total_xp ?? 1

  return xpRows.map((row, i) => {
    const p       = row.profiles
    const name    = p?.full_name ?? 'Unknown'
    const initials = name
      .split(' ')
      .map((w: string) => w[0] ?? '')
      .join('')
      .slice(0, 2)
      .toUpperCase()

    return {
      rank:     i + 1,
      initials,
      name,
      role:     p?.role ?? '',
      score:    row.total_xp,
      maxScore: Math.max(maxScore, 1),
      color:    RANK_COLORS[i] ?? '#3a3a32',
    }
  })
}

function buildRecentTasks(tasks: TaskRow[]) {
  return tasks.slice(0, 5).map(t => ({
    id:       t.id,
    title:    t.title,
    outlet:   t.outlet?.slug?.toUpperCase()         ?? '—',
    assignee: t.assignee?.full_name?.split(' ')[0]  ?? '—',
    badge:    BADGE_MAP[t.status]                   ?? 'DRAFT',
  }))
}

function buildCalDays(contentCards: ContentRow[]): CalDay[] {
  // April 2026: 30 days, starts on Wednesday (Mon=0 offset → offset 2)
  const TODAY = 2

  const calLookup: Record<number, { status: CalDay['status']; dotColor?: string }> = {}
  for (const card of contentCards) {
    if (!card.scheduled_date) continue
    const dateNum  = new Date(card.scheduled_date).getDate()
    const priority = CONTENT_STATUS_PRIORITY[card.status] ?? 99
    const current  = calLookup[dateNum]
    const currentPriority = current
      ? (CONTENT_STATUS_PRIORITY[
          Object.keys(CONTENT_CAL_STATUS).find(k => CONTENT_CAL_STATUS[k] === current.status) ?? ''
        ] ?? 99)
      : 99

    if (!current || priority < currentPriority) {
      calLookup[dateNum] = {
        status:   CONTENT_CAL_STATUS[card.status] ?? 'normal',
        dotColor: CONTENT_DOT_COLOR[card.status],
      }
    }
  }

  const calDays: CalDay[] = [
    { date: null, status: 'empty' },
    { date: null, status: 'empty' },
    ...Array.from({ length: 30 }, (_, i) => {
      const dateNum = i + 1
      if (dateNum === TODAY) {
        return { date: dateNum, status: 'today' as const, dotColor: '#c9a84c' }
      }
      const entry = calLookup[dateNum]
      return {
        date:     dateNum,
        status:   entry?.status  ?? ('normal' as const),
        dotColor: entry?.dotColor,
      }
    }),
  ]

  return calDays
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const { tasks, xpRows, contentCards } = await fetchDashboardData()

  const kpi        = buildKpiData(tasks)
  const weeklyData = buildWeeklyData(tasks)
  const { categories, outletStats } = buildDistribution(tasks)
  const leaderboard  = buildLeaderboard(xpRows)
  const recentTasks  = buildRecentTasks(tasks)
  const calDays      = buildCalDays(contentCards)

  return (
    <>
      <Topbar title="Dashboard" crumb="APRIL 2026 — OVERVIEW" />

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        {/* Row 1 — KPI */}
        <KpiCards cards={kpi.cards} />

        {/* Row 2 — Bar chart + Donut */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px', marginBottom: '14px' }}>
          <WeeklyBarChart data={weeklyData} />
          <TaskDistribution
            completionRate={kpi.rate}
            categories={categories.length > 0 ? categories : [{ label: 'Belum ada data', pct: 100, color: '#3a3a32' }]}
            outletStats={outletStats.length > 0 ? outletStats : [{ label: '—', count: 0, color: '#3a3a32' }]}
          />
        </div>

        {/* Row 3 — Leaderboard + Recent Tasks + Calendar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
          <Leaderboard entries={leaderboard} />
          <RecentTasks tasks={recentTasks} />
          <ContentCalendar month="April 2026" days={calDays} />
        </div>

        {/* Row 4 — Trend Line */}
        <TrendLine
          currentRate={kpi.rate}
          startLabel="1 Apr"
          midLabel="15 Apr"
        />
      </div>
    </>
  )
}
