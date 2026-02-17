'use client'

import React, { useState } from 'react'
import { useStore } from '@/store'
import type { QuickCapture as QuickCaptureType } from '@/types'
import { Zap, Trash2, FileText, CheckSquare, Lightbulb, BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function QuickCapture() {
  const { quickCaptures, addQuickCapture, processQuickCapture, deleteQuickCapture } = useStore()
  const [newCapture, setNewCapture] = useState('')
  const [captureType, setCaptureType] = useState<QuickCaptureType['type']>('note')

  const types = [
    { id: 'note', label: 'Nota', icon: FileText, color: 'text-blue-500' },
    { id: 'task', label: 'Tarefa', icon: CheckSquare, color: 'text-green-500' },
    { id: 'idea', label: 'Ideia', icon: Lightbulb, color: 'text-yellow-500' },
    { id: 'reference', label: 'Referência', icon: BookOpen, color: 'text-purple-500' },
  ]

  const handleAddCapture = () => {
    if (!newCapture.trim()) {
      toast.error('Digite algo para capturar')
      return
    }

    addQuickCapture({
      id: Date.now().toString(),
      content: newCapture,
      type: captureType,
      processed: false,
      createdAt: new Date()
    })

    setNewCapture('')
    toast.success('Capturado com sucesso!')
  }

  const handleProcess = (id: string) => {
    processQuickCapture(id)
    toast.success('Item processado!')
  }

  const handleDelete = (id: string) => {
    deleteQuickCapture(id)
    toast.success('Item excluído')
  }

  const unprocessed = quickCaptures.filter(c => !c.processed)
  const processed = quickCaptures.filter(c => c.processed)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 flex items-center gap-3">
          <Zap className="text-yellow-500" />
          Captura Rápida
        </h1>
        <p className="text-secondary-500 mt-1">
          Capture ideias rapidamente para processar depois
        </p>
      </div>

      {/* Quick Input */}
      <div className="card bg-gradient-to-br from-primary-50 to-purple-50 border-2 border-primary-200">
        <div className="space-y-4">
          {/* Type Selector */}
          <div className="flex gap-2">
            {types.map((type) => {
              const Icon = type.icon
              return (
                <button
                  key={type.id}
                  onClick={() => setCaptureType(type.id as QuickCaptureType['type'])}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                    ${captureType === type.id 
                      ? 'bg-white shadow-md text-primary-600' 
                      : 'bg-white/50 text-secondary-600 hover:bg-white'
                    }
                  `}
                >
                  <Icon size={18} className={type.color} />
                  {type.label}
                </button>
              )
            })}
          </div>

          {/* Input */}
          <div className="flex gap-3">
            <textarea
              value={newCapture}
              onChange={(e) => setNewCapture(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleAddCapture()
                }
              }}
              placeholder="Digite aqui e pressione Enter para capturar..."
              className="flex-1 px-4 py-3 bg-white rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:outline-none min-h-[80px]"
              autoFocus
            />
            <button
              onClick={handleAddCapture}
              className="btn btn-primary px-8"
            >
              Capturar
            </button>
          </div>
        </div>
      </div>

      {/* Unprocessed Items */}
      {unprocessed.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">
            📥 A Processar ({unprocessed.length})
          </h2>
          <div className="space-y-3">
            {unprocessed.map((capture) => {
              const typeInfo = types.find(t => t.id === capture.type)!
              const Icon = typeInfo.icon
              
              return (
                <div 
                  key={capture.id} 
                  className="card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg bg-secondary-100 ${typeInfo.color}`}>
                      <Icon size={20} />
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-secondary-900">{capture.content}</p>
                      <p className="text-xs text-secondary-400 mt-2">
                        {format(new Date(capture.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleProcess(capture.id)}
                        className="btn btn-primary text-sm"
                      >
                        Processar
                      </button>
                      <button
                        onClick={() => handleDelete(capture.id)}
                        className="p-2 rounded hover:bg-red-100 text-secondary-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Processed Items */}
      {processed.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">
            ✅ Processados ({processed.length})
          </h2>
          <div className="space-y-3 opacity-60">
            {processed.slice(0, 10).map((capture) => {
              const typeInfo = types.find(t => t.id === capture.type)!
              const Icon = typeInfo.icon
              
              return (
                <div 
                  key={capture.id} 
                  className="card bg-secondary-50"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg bg-white ${typeInfo.color}`}>
                      <Icon size={20} />
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-secondary-600 line-through">{capture.content}</p>
                      <p className="text-xs text-secondary-400 mt-2">
                        Processado em {format(new Date(capture.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDelete(capture.id)}
                      className="p-2 rounded hover:bg-red-100 text-secondary-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {quickCaptures.length === 0 && (
        <div className="card text-center py-12">
          <div className="text-secondary-400">
            <Zap className="mx-auto mb-4" size={48} />
            <p className="text-lg font-medium">Nenhuma captura ainda</p>
            <p className="text-sm mt-2">
              Comece digitando algo no campo acima!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}