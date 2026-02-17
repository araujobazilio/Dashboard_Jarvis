'use client'

import React from 'react'
import { useStore } from '@/store'
import Sidebar from '@/components/Sidebar'
import Dashboard from '@/components/Dashboard'
import NotesView from '@/components/NotesView'
import TasksView from '@/components/TasksView'
import QuickCapture from '@/components/QuickCapture'

export default function Home() {
  const { activeView } = useStore()

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />
      case 'notes':
        return <NotesView />
      case 'tasks':
        return <TasksView />
      case 'capture':
        return <QuickCapture />
      case 'projects':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-secondary-900">Projetos</h1>
            <p className="text-secondary-500 mt-2">Em desenvolvimento...</p>
          </div>
        )
      case 'goals':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-secondary-900">Metas</h1>
            <p className="text-secondary-500 mt-2">Em desenvolvimento...</p>
          </div>
        )
      case 'resources':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-secondary-900">Recursos</h1>
            <p className="text-secondary-500 mt-2">Em desenvolvimento...</p>
          </div>
        )
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-secondary-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:ml-0">
        {renderContent()}
      </main>
    </div>
  )
}