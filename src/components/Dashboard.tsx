'use client'

import React from 'react'
import { useStore } from '@/store'
import { 
  FileText, CheckSquare, FolderOpen, Target, 
  TrendingUp, Calendar, Zap, AlertCircle 
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import OpenClawIntegration from './OpenClawIntegration'
import CalendarWidget from './CalendarWidget'

export default function Dashboard() {
  const { notes, tasks, projects, goals, habits } = useStore()
  
  const today = new Date()
  const taskCompleted = tasks.filter(t => t.completed).length
  const taskPending = tasks.filter(t => !t.completed).length
  const activeProjects = projects.filter(p => p.status === 'active').length
  const goalsInProgress = goals.filter(g => g.status === 'in-progress').length
  
  const habitsCompletedToday = habits.filter(h => 
    h.completedDates.some(d => 
      new Date(d).toDateString() === today.toDateString()
    )
  ).length

  const stats = [
    { 
      label: 'Notas', 
      value: notes.length, 
      icon: FileText, 
      color: 'bg-blue-500',
      change: '+3 esta semana'
    },
    { 
      label: 'Tarefas Pendentes', 
      value: taskPending, 
      icon: CheckSquare, 
      color: 'bg-orange-500',
      change: `${taskCompleted} completas`
    },
    { 
      label: 'Projetos Ativos', 
      value: activeProjects, 
      icon: FolderOpen, 
      color: 'bg-purple-500',
      change: `${projects.length} total`
    },
    { 
      label: 'Metas em Andamento', 
      value: goalsInProgress, 
      icon: Target, 
      color: 'bg-green-500',
      change: `${goals.length} total`
    },
  ]

  const priorityTasks = tasks
    .filter(t => !t.completed && (t.priority === 'urgente' || t.priority === 'alta'))
    .slice(0, 5)

  const recentNotes = notes.slice(0, 3)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Dashboard</h1>
        <p className="text-secondary-500 mt-1">
          {format(today, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>

      {/* Main Grid with Jarvis AI */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content (3/4) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-secondary-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-secondary-900 mt-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-secondary-400 mt-2">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="text-primary-500" size={20} />
          <h2 className="text-lg font-semibold">Ações Rápidas</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="btn btn-primary flex items-center justify-center gap-2">
            <FileText size={18} />
            Nova Nota
          </button>
          <button className="btn btn-secondary flex items-center justify-center gap-2">
            <CheckSquare size={18} />
            Nova Tarefa
          </button>
          <button className="btn btn-secondary flex items-center justify-center gap-2">
            <FolderOpen size={18} />
            Novo Projeto
          </button>
          <button className="btn btn-secondary flex items-center justify-center gap-2">
            <Target size={18} />
            Nova Meta
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Tasks */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-red-500" size={20} />
              <h2 className="text-lg font-semibold">Tarefas Prioritárias</h2>
            </div>
            <span className="text-sm text-secondary-400">
              {priorityTasks.length} tarefas
            </span>
          </div>
          
          {priorityTasks.length > 0 ? (
            <div className="space-y-3">
              {priorityTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="flex items-start gap-3 p-3 rounded-lg bg-secondary-50 hover:bg-secondary-100 transition-colors"
                >
                  <div className={`
                    mt-1 w-3 h-3 rounded-full
                    ${task.priority === 'urgente' ? 'bg-red-500' : 'bg-orange-500'}
                  `} />
                  <div className="flex-1">
                    <p className="font-medium text-secondary-900">{task.title}</p>
                    {task.dueDate && (
                      <p className="text-xs text-secondary-400 mt-1">
                        Vence em {format(new Date(task.dueDate), 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-secondary-400">
              <CheckSquare className="mx-auto mb-2" size={32} />
              <p>Nenhuma tarefa prioritária</p>
            </div>
          )}
        </div>

        {/* Recent Notes */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="text-blue-500" size={20} />
              <h2 className="text-lg font-semibold">Notas Recentes</h2>
            </div>
          </div>
          
          {recentNotes.length > 0 ? (
            <div className="space-y-3">
              {recentNotes.map((note) => (
                <div 
                  key={note.id} 
                  className="p-3 rounded-lg bg-secondary-50 hover:bg-secondary-100 transition-colors cursor-pointer"
                >
                  <p className="font-medium text-secondary-900">{note.title}</p>
                  <p className="text-sm text-secondary-500 mt-1 line-clamp-2">
                    {note.content}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {note.tags.slice(0, 3).map((tag, i) => (
                      <span 
                        key={i}
                        className="px-2 py-1 text-xs bg-primary-100 text-primary-600 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-secondary-400">
              <FileText className="mx-auto mb-2" size={32} />
              <p>Nenhuma nota ainda</p>
            </div>
          )}
        </div>
      </div>

          {/* Habits Today */}
          {habits.length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-green-500" size={20} />
                  <h2 className="text-lg font-semibold">Hábitos de Hoje</h2>
                </div>
                <span className="text-sm text-secondary-400">
                  {habitsCompletedToday}/{habits.length} completos
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {habits.map((habit) => {
                  const isCompletedToday = habit.completedDates.some(d => 
                    new Date(d).toDateString() === today.toDateString()
                  )
                  
                  return (
                    <div 
                      key={habit.id}
                      className={`
                        p-4 rounded-lg border-2 text-center cursor-pointer transition-all
                        ${isCompletedToday 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-secondary-200 hover:border-secondary-300'
                        }
                      `}
                    >
                      <div className="text-2xl mb-1">{habit.icon}</div>
                      <p className="text-xs font-medium text-secondary-700">{habit.name}</p>
                      {habit.streak > 0 && (
                        <p className="text-xs text-orange-500 mt-1">
                          🔥 {habit.streak} dias
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Jarvis AI + Calendar (1/4) */}
        <div className="space-y-6 lg:col-span-1">
          <OpenClawIntegration />
          <CalendarWidget compact={true} />
        </div>
      </div>
    </div>
  )
}