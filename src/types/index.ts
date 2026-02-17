// Types for Second Brain System

export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  category?: string
  pinned?: boolean
}

export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'baixa' | 'media' | 'alta' | 'urgente'
  dueDate?: string
  category?: string
  tags?: string[]
  createdAt: string
  completedAt?: Date
}

export interface Project {
  id: string
  name: string
  description: string
  color: string
  progress: number
  status: 'active' | 'completed' | 'paused' | 'planned'
  tasks: string[]
  createdAt: Date
  updatedAt: Date
  deadline?: Date
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: Date
  end: Date
  type: 'meeting' | 'task' | 'reminder' | 'event'
  location?: string
  color: string
}

export interface Habit {
  id: string
  name: string
  description: string
  frequency: 'daily' | 'weekly' | 'monthly'
  completedDates: Date[]
  streak: number
  icon: string
  color: string
  createdAt: Date
}

export interface Goal {
  id: string
  title: string
  description: string
  target: number
  current: number
  unit: string
  deadline: Date
  status: 'in-progress' | 'completed' | 'failed'
  category: string
  createdAt: Date
}

export interface Resource {
  id: string
  title: string
  url?: string
  content?: string
  type: 'article' | 'video' | 'book' | 'tool' | 'course' | 'other'
  tags: string[]
  isRead: boolean
  rating?: number
  notes?: string
  createdAt: Date
}

export interface QuickCapture {
  id: string
  content: string
  type: 'note' | 'task' | 'idea' | 'reference'
  processed: boolean
  createdAt: Date
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  weekStartsOn: 0 | 1 // Sunday or Monday
  defaultView: 'dashboard' | 'notes' | 'tasks' | 'calendar'
}