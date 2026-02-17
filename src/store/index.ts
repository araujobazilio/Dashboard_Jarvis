import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Note, Task, Project, Habit, Goal, Resource, QuickCapture } from '@/types'

interface AppState {
  // Notes
  notes: Note[]
  addNote: (note: Note) => void
  updateNote: (id: string, note: Partial<Note>) => void
  deleteNote: (id: string) => void
  
  // Tasks
  tasks: Task[]
  addTask: (task: Task) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  
  // Projects
  projects: Project[]
  addProject: (project: Project) => void
  updateProject: (id: string, project: Partial<Project>) => void
  deleteProject: (id: string) => void
  
  // Habits
  habits: Habit[]
  addHabit: (habit: Habit) => void
  updateHabit: (id: string, habit: Partial<Habit>) => void
  deleteHabit: (id: string) => void
  
  // Goals
  goals: Goal[]
  addGoal: (goal: Goal) => void
  updateGoal: (id: string, goal: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  
  // Resources
  resources: Resource[]
  addResource: (resource: Resource) => void
  updateResource: (id: string, resource: Partial<Resource>) => void
  deleteResource: (id: string) => void
  
  // Quick Capture
  quickCaptures: QuickCapture[]
  addQuickCapture: (capture: QuickCapture) => void
  processQuickCapture: (id: string) => void
  deleteQuickCapture: (id: string) => void
  
  // UI State
  sidebarOpen: boolean
  toggleSidebar: () => void
  activeView: string
  setActiveView: (view: string) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Notes
      notes: [],
      addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
      updateNote: (id, note) => set((state) => ({
        notes: state.notes.map((n) => (n.id === id ? { ...n, ...note } : n))
      })),
      deleteNote: (id) => set((state) => ({
        notes: state.notes.filter((n) => n.id !== id)
      })),
      
      // Tasks
      tasks: [],
      addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
      updateTask: (id, task) => set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...task } : t))
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id)
      })),
      
      // Projects
      projects: [],
      addProject: (project) => set((state) => ({ projects: [project, ...state.projects] })),
      updateProject: (id, project) => set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? { ...p, ...project } : p))
      })),
      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter((p) => p.id !== id)
      })),
      
      // Habits
      habits: [],
      addHabit: (habit) => set((state) => ({ habits: [habit, ...state.habits] })),
      updateHabit: (id, habit) => set((state) => ({
        habits: state.habits.map((h) => (h.id === id ? { ...h, ...habit } : h))
      })),
      deleteHabit: (id) => set((state) => ({
        habits: state.habits.filter((h) => h.id !== id)
      })),
      
      // Goals
      goals: [],
      addGoal: (goal) => set((state) => ({ goals: [goal, ...state.goals] })),
      updateGoal: (id, goal) => set((state) => ({
        goals: state.goals.map((g) => (g.id === id ? { ...g, ...goal } : g))
      })),
      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter((g) => g.id !== id)
      })),
      
      // Resources
      resources: [],
      addResource: (resource) => set((state) => ({ resources: [resource, ...state.resources] })),
      updateResource: (id, resource) => set((state) => ({
        resources: state.resources.map((r) => (r.id === id ? { ...r, ...resource } : r))
      })),
      deleteResource: (id) => set((state) => ({
        resources: state.resources.filter((r) => r.id !== id)
      })),
      
      // Quick Capture
      quickCaptures: [],
      addQuickCapture: (capture) => set((state) => ({ 
        quickCaptures: [capture, ...state.quickCaptures] 
      })),
      processQuickCapture: (id) => set((state) => ({
        quickCaptures: state.quickCaptures.map((c) => 
          c.id === id ? { ...c, processed: true } : c
        )
      })),
      deleteQuickCapture: (id) => set((state) => ({
        quickCaptures: state.quickCaptures.filter((c) => c.id !== id)
      })),
      
      // UI State
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      activeView: 'dashboard',
      setActiveView: (view) => set({ activeView: view }),
    }),
    {
      name: 'segundo-cerebro-storage',
    }
  )
)