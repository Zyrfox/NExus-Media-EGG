export type TaskStatus = 'draft' | 'in_progress' | 'review' | 'overdue' | 'done'
export type TaskPriority = 'high' | 'medium' | 'low'
export type TaskCategory = 'video' | 'design' | 'copy' | 'event' | 'sales' | 'partner' | 'sosmed' | 'asset' | 'admin'

export interface TaskItem {
  id: string
  title: string
  category: string
  subcategory: string
  assigneeInitials: string
  assigneeName: string
  assigneeColor: string
  outlet: string
  outletColor: string
  deadline: string
  isLate: boolean
  status: TaskStatus
  priority: TaskPriority
  priorityColor: string
  tags?: string[]
  doneDate?: string
}

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  high:   '#c9504c',
  medium: '#c9904c',
  low:    '#4caf7a',
}

export const STATUS_BADGE: Record<TaskStatus, { label: string; bg: string; color: string }> = {
  draft:       { label: 'DRAFT',    bg: 'rgba(90,86,80,0.15)',   color: '#5a5650' },
  in_progress: { label: 'ON PROG',  bg: 'rgba(201,168,76,0.08)', color: '#c9a84c' },
  review:      { label: 'REVIEW',   bg: 'rgba(76,122,201,0.1)',  color: '#4c7ac9' },
  overdue:     { label: 'OVERDUE',  bg: 'rgba(201,80,76,0.1)',   color: '#c9504c' },
  done:        { label: 'DONE',     bg: 'rgba(76,175,122,0.1)',  color: '#4caf7a' },
}

export const OUTLET_COLORS: Record<string, { bg: string; color: string }> = {
  TSF: { bg: 'rgba(76,175,122,0.08)', color: '#4caf7a' },
  BTM: { bg: 'rgba(76,122,201,0.08)', color: '#4c7ac9' },
  EGC: { bg: 'rgba(201,168,76,0.08)', color: '#c9a84c' },
  All: { bg: 'rgba(201,168,76,0.08)', color: '#c9a84c' },
}

// ── Placeholder data ──────────────────────────────────────────────────────────

export const SAMPLE_TASKS: TaskItem[] = [
  {
    id: '1', title: 'Upload asset Eid campaign ke Drive', category: 'Asset', subcategory: 'Admin',
    assigneeInitials: 'AK', assigneeName: 'Akbar', assigneeColor: '#4c7ac9',
    outlet: 'TSF', outletColor: '#4caf7a', deadline: '24 Mar', isLate: true,
    status: 'overdue', priority: 'high', priorityColor: '#c9504c',
    tags: ['Asset'],
  },
  {
    id: '2', title: 'Negosiasi vendor foto produk BTM Q2', category: 'Vendor', subcategory: 'Komersial',
    assigneeInitials: 'AL', assigneeName: 'Aldy', assigneeColor: '#4caf7a',
    outlet: 'BTM', outletColor: '#4c7ac9', deadline: '30 Apr', isLate: false,
    status: 'in_progress', priority: 'medium', priorityColor: '#c9904c',
    tags: ['Vendor'],
  },
  {
    id: '3', title: 'Review caption batch posting 28–31 Mar', category: 'Konten', subcategory: 'Review',
    assigneeInitials: 'IR', assigneeName: 'Irfan', assigneeColor: '#c9a84c',
    outlet: 'EGC', outletColor: '#c9a84c', deadline: '29 Apr', isLate: false,
    status: 'review', priority: 'medium', priorityColor: '#4c7ac9',
    tags: ['Konten'],
  },
  {
    id: '4', title: 'Brief konten Ramadan week 2 — IG Reels', category: 'Konten', subcategory: 'Produksi',
    assigneeInitials: 'AK', assigneeName: 'Akbar', assigneeColor: '#4c7ac9',
    outlet: 'TSF', outletColor: '#4caf7a', deadline: '27 Mar', isLate: false,
    status: 'done', priority: 'low', priorityColor: '#4caf7a',
    tags: ['Konten'], doneDate: '27 Mar',
  },
  {
    id: '5', title: 'Monitoring engagement IG minggu ini', category: 'Sosmed', subcategory: 'Monitoring',
    assigneeInitials: 'AN', assigneeName: 'Ana', assigneeColor: '#4c7ac9',
    outlet: 'All', outletColor: '#c9a84c', deadline: '29 Apr', isLate: false,
    status: 'done', priority: 'low', priorityColor: '#5a5650',
    tags: ['Sosmed'], doneDate: '28 Mar',
  },
  {
    id: '6', title: 'Rekap KPI media bulan April 2026', category: 'Laporan', subcategory: 'Admin',
    assigneeInitials: 'IR', assigneeName: 'Irfan', assigneeColor: '#c9a84c',
    outlet: 'All', outletColor: '#c9a84c', deadline: '30 Apr', isLate: false,
    status: 'in_progress', priority: 'medium', priorityColor: '#c9904c',
    tags: ['Admin'],
  },
  {
    id: '7', title: 'Desain feed Lebaran BTM', category: 'Konten', subcategory: 'Design',
    assigneeInitials: 'AL', assigneeName: 'Aldy', assigneeColor: '#4caf7a',
    outlet: 'BTM', outletColor: '#4c7ac9', deadline: '5 Apr', isLate: false,
    status: 'draft', priority: 'medium', priorityColor: '#c9904c',
    tags: ['Konten'],
  },
  {
    id: '8', title: 'SOP penggunaan template IG Stories', category: 'Admin', subcategory: 'Dokumen',
    assigneeInitials: 'IR', assigneeName: 'Irfan', assigneeColor: '#c9a84c',
    outlet: 'All', outletColor: '#c9a84c', deadline: '10 Apr', isLate: false,
    status: 'draft', priority: 'low', priorityColor: '#5a5650',
    tags: ['Admin'],
  },
  {
    id: '9', title: 'Produksi konten video TSF mini zoo tour', category: 'Konten', subcategory: 'Video',
    assigneeInitials: 'AK', assigneeName: 'Akbar', assigneeColor: '#4c7ac9',
    outlet: 'TSF', outletColor: '#4caf7a', deadline: '2 Apr', isLate: false,
    status: 'in_progress', priority: 'high', priorityColor: '#c9504c',
    tags: ['Konten', 'Video'],
  },
  {
    id: '10', title: 'Update bio semua akun sosmed', category: 'Sosmed', subcategory: 'Admin',
    assigneeInitials: 'AN', assigneeName: 'Ana', assigneeColor: '#4c7ac9',
    outlet: 'All', outletColor: '#c9a84c', deadline: '20 Mar', isLate: true,
    status: 'overdue', priority: 'high', priorityColor: '#c9504c',
    tags: ['Sosmed'],
  },
]

export const STATUS_TABS = [
  { key: 'all',         label: 'Semua',      count: 142 },
  { key: 'in_progress', label: 'In Progress', count: 34 },
  { key: 'review',      label: 'Review',      count: 8 },
  { key: 'overdue',     label: 'Overdue',     count: 11 },
  { key: 'done',        label: 'Done',        count: 97 },
  { key: 'draft',       label: 'Draft',       count: 15 },
]

export const KANBAN_COLUMNS: { key: TaskStatus; label: string; color?: string; countBg?: string }[] = [
  { key: 'draft',       label: 'Draft' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'review',      label: 'Review' },
  { key: 'overdue',     label: 'Overdue', color: '#c9504c', countBg: 'rgba(201,80,76,0.1)' },
  { key: 'done',        label: 'Done',    color: '#4caf7a', countBg: 'rgba(76,175,122,0.1)' },
]

export const TIMELINE_DATA = [
  { name: 'Irfan',  color: '#c9a84c', left: 0,   width: 53, label: 'Review caption batch' },
  { name: 'Akbar',  color: '#4c7ac9', left: 27,  width: 46, label: 'Produksi video TSF' },
  { name: 'Aldy',   color: '#4caf7a', left: 13,  width: 60, label: 'Negosiasi vendor foto' },
  { name: 'Ana',    color: '#c9504c', left: 0,   width: 33, label: 'Update bio sosmed !' },
  { name: 'Farid',  color: '#c9904c', left: 40,  width: 40, label: 'Inventaris peralatan Q1' },
]

export const TIMELINE_DAYS = ['20','21','22','23','24','25','26','27','28','29','30','31','1','2','3']
export const TIMELINE_TODAY_COLS = ['28','29']
