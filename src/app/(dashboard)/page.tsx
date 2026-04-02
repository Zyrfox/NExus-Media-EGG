import { Topbar } from '@/components/shared/Topbar'
import { KpiCards } from '@/components/dashboard/KpiCards'
import { WeeklyBarChart } from '@/components/dashboard/WeeklyBarChart'
import { TaskDistribution } from '@/components/dashboard/TaskDistribution'
import { Leaderboard } from '@/components/dashboard/Leaderboard'
import { RecentTasks } from '@/components/dashboard/RecentTasks'
import { ContentCalendar, type CalDay } from '@/components/dashboard/ContentCalendar'
import { TrendLine } from '@/components/dashboard/TrendLine'
import {
  CheckSquare2,
  CheckCheck,
  AlertCircle,
  BarChart3,
} from 'lucide-react'

// ─── Placeholder data (akan diganti dengan Supabase query) ───────────────────

const KPI_DATA = [
  {
    label: 'Total Task',
    value: 142,
    delta: '↑ 12%',
    deltaUp: true,
    color: '#c9a84c',
    barWidth: 78,
    iconBg: 'rgba(201,168,76,0.08)',
    icon: <CheckSquare2 size={13} color="#c9a84c" />,
  },
  {
    label: 'Task Selesai',
    value: 97,
    delta: '↑ 8%',
    deltaUp: true,
    color: '#4caf7a',
    barWidth: 68,
    iconBg: 'rgba(76,175,122,0.1)',
    icon: <CheckCheck size={13} color="#4caf7a" />,
  },
  {
    label: 'Task Telat',
    value: 11,
    delta: '↑ 3',
    deltaUp: false,
    color: '#c9504c',
    barWidth: 22,
    iconBg: 'rgba(201,80,76,0.1)',
    icon: <AlertCircle size={13} color="#c9504c" />,
  },
  {
    label: 'Completion Rate',
    value: 68,
    suffix: '%',
    delta: '↑ 5%',
    deltaUp: true,
    color: '#4c7ac9',
    barWidth: 68,
    iconBg: 'rgba(76,122,201,0.1)',
    icon: <BarChart3 size={13} color="#4c7ac9" />,
  },
]

const WEEKLY_DATA = [
  { day: 'Sn', selesai: 12, telat: 3 },
  { day: 'Sl', selesai: 18, telat: 2 },
  { day: 'Rb', selesai: 8,  telat: 5 },
  { day: 'Km', selesai: 22, telat: 1 },
  { day: 'Jm', selesai: 15, telat: 4 },
  { day: 'Sb', selesai: 19, telat: 2 },
  { day: 'Mg', selesai: 7,  telat: 2 },
]

const DISTRIBUTION_CATS = [
  { label: 'Konten',  pct: 40, color: '#c9a84c' },
  { label: 'Vendor',  pct: 25, color: '#4caf7a' },
  { label: 'Event',   pct: 15, color: '#4c7ac9' },
  { label: 'Admin',   pct:  6, color: '#c9504c' },
  { label: 'Lainnya', pct: 14, color: '#3a3a32' },
]

const OUTLET_STATS = [
  { label: 'EG Coffee', count: 38, color: '#c9a84c' },
  { label: 'BTM',       count: 52, color: '#4c7ac9' },
  { label: 'TSF',       count: 52, color: '#4caf7a', span: true },
]

const LEADERBOARD = [
  { rank: 1, initials: 'IR', name: 'Irfan',  role: 'Kepala Media',  score: 34, maxScore: 34, color: '#c9a84c' },
  { rank: 2, initials: 'AK', name: 'Akbar',  role: 'Staff Media',   score: 28, maxScore: 34, color: '#a8a8a8' },
  { rank: 3, initials: 'AN', name: 'Ana',    role: 'SPV Komersial', score: 22, maxScore: 34, color: '#4c7ac9' },
  { rank: 4, initials: 'AL', name: 'Aldy',   role: 'SPV Komersial', score: 17, maxScore: 34, color: '#4caf7a' },
  { rank: 5, initials: 'FA', name: 'Farid',  role: 'SPV GA',        score: 11, maxScore: 34, color: '#c9504c' },
]

const RECENT_TASKS = [
  { id: '1', title: 'Brief konten Ramadan week 2',  outlet: 'TSF', assignee: 'Akbar', badge: 'DONE'   as const },
  { id: '2', title: 'Negosiasi vendor foto BTM Q2', outlet: 'BTM', assignee: 'Aldy',  badge: 'PROG'   as const },
  { id: '3', title: 'Upload asset Eid campaign',    outlet: 'All', assignee: 'Akbar', badge: 'LATE'   as const },
  { id: '4', title: 'Review caption batch 28–31',   outlet: 'EGC', assignee: 'Irfan', badge: 'REVIEW' as const },
  { id: '5', title: 'Monitoring engagement IG',     outlet: 'All', assignee: 'Ana',   badge: 'DONE'   as const },
]

// April 2026: starts on Wednesday (offset = 2 from Monday)
const CAL_DAYS: CalDay[] = [
  // Row 1 (offset 2 for Wed start)
  { date: null, status: 'empty' }, { date: null, status: 'empty' }, { date: 1, status: 'normal' },
  { date: 2, status: 'has' as const, dotColor: '#c9a84c' },
  { date: 3, status: 'normal' as const },
  { date: 4, status: 'has' as const, dotColor: '#c9a84c' },
  { date: 5, status: 'normal' as const },
  // Row 2
  { date: 6, status: 'has' as const, dotColor: '#c9a84c' },
  { date: 7, status: 'published' as const, dotColor: '#4caf7a' },
  { date: 8, status: 'normal' as const },
  { date: 9, status: 'has' as const, dotColor: '#c9a84c' },
  { date: 10, status: 'normal' as const },
  { date: 11, status: 'late' as const, dotColor: '#c9504c' },
  { date: 12, status: 'normal' as const },
  // Row 3
  { date: 13, status: 'has' as const, dotColor: '#c9a84c' },
  { date: 14, status: 'normal' as const },
  { date: 15, status: 'has' as const, dotColor: '#4c7ac9' },
  { date: 16, status: 'published' as const, dotColor: '#4caf7a' },
  { date: 17, status: 'normal' as const },
  { date: 18, status: 'has' as const, dotColor: '#c9a84c' },
  { date: 19, status: 'normal' as const },
  // Row 4
  { date: 20, status: 'has' as const, dotColor: '#c9a84c' },
  { date: 21, status: 'normal' as const },
  { date: 22, status: 'today' as const, dotColor: '#c9a84c' },
  { date: 23, status: 'normal' as const },
  { date: 24, status: 'has' as const, dotColor: '#c9a84c' },
  { date: 25, status: 'normal' as const },
  { date: 26, status: 'normal' as const },
  // Row 5
  { date: 27, status: 'has' as const, dotColor: '#c9a84c' },
  { date: 28, status: 'normal' as const },
  { date: 29, status: 'has' as const, dotColor: '#c9a84c' },
  { date: 30, status: 'normal' as const },
]

export default function DashboardPage() {
  return (
    <>
      <Topbar title="Dashboard" crumb="APRIL 2026 — OVERVIEW" />

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        {/* Row 1 — KPI */}
        <KpiCards cards={KPI_DATA} />

        {/* Row 2 — Bar chart + Donut */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px', marginBottom: '14px' }}>
          <WeeklyBarChart data={WEEKLY_DATA} />
          <TaskDistribution
            completionRate={68}
            categories={DISTRIBUTION_CATS}
            outletStats={OUTLET_STATS}
          />
        </div>

        {/* Row 3 — Leaderboard + Recent Tasks + Calendar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
          <Leaderboard entries={LEADERBOARD} />
          <RecentTasks tasks={RECENT_TASKS} />
          <ContentCalendar month="April 2026" days={CAL_DAYS} />
        </div>

        {/* Row 4 — Trend Line */}
        <TrendLine
          currentRate={68}
          startLabel="1 Apr"
          midLabel="15 Apr"
        />
      </div>
    </>
  )
}
