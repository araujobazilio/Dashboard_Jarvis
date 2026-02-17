'use client'

import React from 'react'
import { useStore } from '@/store'
import { 
  Home, FileText, CheckSquare, FolderOpen, Target, 
  BookOpen, Sparkles, Settings, Menu, X 
} from 'lucide-react'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'notes', label: 'Notas', icon: FileText },
  { id: 'tasks', label: 'Tarefas', icon: CheckSquare },
  { id: 'projects', label: 'Projetos', icon: FolderOpen },
  { id: 'goals', label: 'Metas', icon: Target },
  { id: 'resources', label: 'Recursos', icon: BookOpen },
  { id: 'capture', label: 'Captura Rápida', icon: Sparkles },
]

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, activeView, setActiveView } = useStore()

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-white rounded-lg shadow-md"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-white border-r border-secondary-200 z-40
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        w-64 lg:translate-x-0 lg:static
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-secondary-200">
            <h1 className="text-2xl font-bold text-primary-600">
              🧠 Segundo Cérebro
            </h1>
            <p className="text-sm text-secondary-500 mt-1">JarvisNF</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveView(item.id)
                        if (window.innerWidth < 1024) toggleSidebar()
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-lg
                        transition-all duration-200
                        ${activeView === item.id 
                          ? 'bg-primary-50 text-primary-600 font-medium' 
                          : 'text-secondary-600 hover:bg-secondary-50'
                        }
                      `}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-secondary-200">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-secondary-600 hover:bg-secondary-50 transition-all duration-200">
              <Settings size={20} />
              <span>Configurações</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}