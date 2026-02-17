'use client'

import React, { useState } from 'react'
import { useStore } from '@/store'
import { Task } from '@/types'
import { 
  Plus, Search, CheckCircle2, Circle, 
  AlertCircle, Clock, Filter, MoreVertical,
  Trash2, Edit
} from 'lucide-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function TasksView() {
  const { tasks, addTask, updateTask, deleteTask } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showNewTask, setShowNewTask] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    dueDate: '',
    project: '',
    tags: [] as string[]
  })
  const [tagInput, setTagInput] = useState('')

  const priorities = [
    { id: 'all', label: 'Todas', color: 'bg-secondary-100' },
    { id: 'urgent', label: 'Urgente', color: 'bg-red-100 text-red-600' },
    { id: 'high', label: 'Alta', color: 'bg-orange-100 text-orange-600' },
    { id: 'medium', label: 'Média', color: 'bg-yellow-100 text-yellow-600' },
    { id: 'low', label: 'Baixa', color: 'bg-green-100 text-green-600' },
  ]

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'completed' && task.completed) ||
                         (filterStatus === 'pending' && !task.completed)
    return matchesSearch && matchesPriority && matchesStatus
  })

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      toast.error('Digite um título para a tarefa')
      return
    }

    addTask({
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      completed: false,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      tags: newTask.tags,
      createdAt: new Date().toISOString()
    })

    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      project: '',
      tags: []
    })
    setShowNewTask(false)
    toast.success('Tarefa criada com sucesso!')
  }

  const handleToggleTask = (id: string, completed: boolean) => {
    updateTask(id, { 
      completed: !completed,
      completedAt: !completed ? new Date() : undefined
    })
    toast.success(completed ? 'Tarefa reaberta' : 'Tarefa concluída!')
  }

  const handleDeleteTask = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      deleteTask(id)
      toast.success('Tarefa excluída')
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !newTask.tags.includes(tagInput.trim())) {
      setNewTask({ ...newTask, tags: [...newTask.tags, tagInput.trim()] })
      setTagInput('')
    }
  }

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    urgent: tasks.filter(t => !t.completed && t.priority === 'urgent').length,
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Tarefas</h1>
          <p className="text-secondary-500 mt-1">
            {taskStats.completed} de {taskStats.total} concluídas
          </p>
        </div>
        <button
          onClick={() => setShowNewTask(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Nova Tarefa
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-secondary-500">Total</p>
          <p className="text-2xl font-bold text-secondary-900">{taskStats.total}</p>
        </div>
        <div className="card">
          <p className="text-sm text-secondary-500">Concluídas</p>
          <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
        </div>
        <div className="card">
          <p className="text-sm text-secondary-500">Pendentes</p>
          <p className="text-2xl font-bold text-orange-600">{taskStats.pending}</p>
        </div>
        <div className="card">
          <p className="text-sm text-secondary-500">Urgentes</p>
          <p className="text-2xl font-bold text-red-600">{taskStats.urgent}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={20} />
          <input
            type="text"
            placeholder="Buscar tarefas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <Filter className="text-secondary-400" size={20} />
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="input"
          >
            <option value="all">Todas as prioridades</option>
            <option value="urgent">Urgente</option>
            <option value="high">Alta</option>
            <option value="medium">Média</option>
            <option value="low">Baixa</option>
          </select>
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input"
        >
          <option value="all">Todos os status</option>
          <option value="pending">Pendentes</option>
          <option value="completed">Concluídas</option>
        </select>
      </div>

      {/* New Task Modal */}
      {showNewTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-secondary-200">
              <h2 className="text-xl font-bold">Nova Tarefa</h2>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="input"
                  placeholder="O que precisa ser feito?"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="input min-h-[100px]"
                  placeholder="Detalhes da tarefa..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Prioridade
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                    className="input"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Data de Vencimento
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Tags
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    className="input"
                    placeholder="Adicionar tag..."
                  />
                  <button onClick={handleAddTag} className="btn btn-secondary">
                    Adicionar
                  </button>
                </div>
                {newTask.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newTask.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          onClick={() => setNewTask({ 
                            ...newTask, 
                            tags: newTask.tags.filter((_, index) => index !== i) 
                          })}
                          className="ml-2 hover:text-primary-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-secondary-200 flex justify-end gap-3">
              <button onClick={() => setShowNewTask(false)} className="btn btn-secondary">
                Cancelar
              </button>
              <button onClick={handleAddTask} className="btn btn-primary">
                Criar Tarefa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tasks List */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div 
              key={task.id} 
              className={`
                card hover:shadow-md transition-all
                ${task.completed ? 'opacity-60' : ''}
              `}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => handleToggleTask(task.id, task.completed)}
                  className={`
                    mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                    ${task.completed 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'border-secondary-300 hover:border-primary-500'
                    }
                  `}
                >
                  {task.completed && <CheckCircle2 size={14} />}
                </button>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`font-medium ${task.completed ? 'line-through text-secondary-400' : 'text-secondary-900'}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-secondary-500 mt-1">{task.description}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {/* Priority Badge */}
                      <span className={`
                        px-2 py-1 text-xs rounded-full font-medium
                        ${task.priority === 'urgent' ? 'bg-red-100 text-red-600' :
                          task.priority === 'high' ? 'bg-orange-100 text-orange-600' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-green-100 text-green-600'
                        }
                      `}>
                        {task.priority === 'urgent' ? 'Urgente' :
                         task.priority === 'high' ? 'Alta' :
                         task.priority === 'medium' ? 'Média' : 'Baixa'}
                      </span>

                      {/* Actions */}
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 rounded hover:bg-red-100 text-secondary-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-secondary-400">
                    {task.dueDate && (
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>
                          {format(new Date(task.dueDate), "dd 'de' MMM", { locale: ptBR })}
                        </span>
                      </div>
                    )}
                    {task.project && (
                      <div className="flex items-center gap-1">
                        <span>📁 {task.project}</span>
                      </div>
                    )}
                    {task.tags.length > 0 && (
                      <div className="flex gap-1">
                        {task.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="px-2 py-1 bg-secondary-100 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <div className="text-secondary-400">
            <CheckCircle2 className="mx-auto mb-4" size={48} />
            <p className="text-lg font-medium">Nenhuma tarefa encontrada</p>
            <p className="text-sm mt-2">
              {searchQuery || filterPriority !== 'all' || filterStatus !== 'all'
                ? 'Tente filtros diferentes' 
                : 'Adicione sua primeira tarefa!'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}