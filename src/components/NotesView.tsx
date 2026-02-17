'use client'

import React, { useState } from 'react'
import { useStore } from '@/store'
import { Note } from '@/types'
import { 
  Plus, Search, MoreVertical, Pin, 
  Archive, Trash2, Tag, Filter 
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function NotesView() {
  const { notes, addNote, updateNote, deleteNote } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showNewNote, setShowNewNote] = useState(false)
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    category: 'note' as Note['category']
  })
  const [tagInput, setTagInput] = useState('')

  const categories = [
    { id: 'all', label: 'Todas' },
    { id: 'note', label: 'Notas' },
    { id: 'idea', label: 'Ideias' },
    { id: 'task', label: 'Tarefas' },
    { id: 'reference', label: 'Referências' },
  ]

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory
    return matchesSearch && matchesCategory && !note.isArchived
  })

  const handleAddNote = () => {
    if (!newNote.title.trim()) {
      toast.error('Digite um título para a nota')
      return
    }

    addNote({
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      tags: newNote.tags,
      category: newNote.category,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPinned: false,
      isArchived: false,
    })

    setNewNote({
      title: '',
      content: '',
      tags: [],
      category: 'note'
    })
    setShowNewNote(false)
    toast.success('Nota criada com sucesso!')
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !newNote.tags.includes(tagInput.trim())) {
      setNewNote({ ...newNote, tags: [...newNote.tags, tagInput.trim()] })
      setTagInput('')
    }
  }

  const handleDeleteNote = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta nota?')) {
      deleteNote(id)
      toast.success('Nota excluída')
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Notas</h1>
          <p className="text-secondary-500 mt-1">{notes.length} notas no total</p>
        </div>
        <button
          onClick={() => setShowNewNote(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Nova Nota
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={20} />
          <input
            type="text"
            placeholder="Buscar notas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="text-secondary-400" size={20} />
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all
                  ${selectedCategory === cat.id 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                  }
                `}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* New Note Modal */}
      {showNewNote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-secondary-200">
              <h2 className="text-xl font-bold">Nova Nota</h2>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="input"
                  placeholder="Título da nota..."
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Conteúdo
                </label>
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  className="input min-h-[200px]"
                  placeholder="Escreva sua nota..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Categoria
                </label>
                <select
                  value={newNote.category}
                  onChange={(e) => setNewNote({ ...newNote, category: e.target.value as Note['category'] })}
                  className="input"
                >
                  <option value="note">Nota</option>
                  <option value="idea">Ideia</option>
                  <option value="task">Tarefa</option>
                  <option value="reference">Referência</option>
                </select>
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
                  <button
                    onClick={handleAddTag}
                    className="btn btn-secondary"
                  >
                    <Tag size={18} />
                  </button>
                </div>
                {newNote.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newNote.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm flex items-center gap-2"
                      >
                        {tag}
                        <button
                          onClick={() => setNewNote({ 
                            ...newNote, 
                            tags: newNote.tags.filter((_, index) => index !== i) 
                          })}
                          className="hover:text-primary-800"
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
              <button
                onClick={() => setShowNewNote(false)}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddNote}
                className="btn btn-primary"
              >
                Criar Nota
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <div 
              key={note.id} 
              className="card hover:shadow-md transition-shadow group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-secondary-900">{note.title}</h3>
                  <span className={`
                    inline-block px-2 py-1 text-xs rounded mt-2
                    ${note.category === 'idea' ? 'bg-purple-100 text-purple-600' :
                      note.category === 'task' ? 'bg-blue-100 text-blue-600' :
                      note.category === 'reference' ? 'bg-green-100 text-green-600' :
                      'bg-secondary-100 text-secondary-600'
                    }
                  `}>
                    {note.category === 'idea' ? 'Ideia' :
                     note.category === 'task' ? 'Tarefa' :
                     note.category === 'reference' ? 'Referência' : 'Nota'}
                  </span>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-secondary-100 rounded">
                  <MoreVertical size={16} className="text-secondary-400" />
                </button>
              </div>
              
              <p className="text-sm text-secondary-600 line-clamp-3 mb-3">
                {note.content || 'Sem conteúdo'}
              </p>

              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {note.tags.slice(0, 3).map((tag, i) => (
                    <span 
                      key={i}
                      className="px-2 py-1 text-xs bg-secondary-100 text-secondary-600 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-secondary-200">
                <span className="text-xs text-secondary-400">
                  {new Date(note.createdAt).toLocaleDateString('pt-BR')}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateNote(note.id, { isPinned: !note.isPinned })}
                    className={`p-2 rounded hover:bg-secondary-100 ${
                      note.isPinned ? 'text-primary-500' : 'text-secondary-400'
                    }`}
                  >
                    <Pin size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-2 rounded hover:bg-red-100 text-secondary-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <div className="text-secondary-400">
            <Search className="mx-auto mb-4" size={48} />
            <p className="text-lg font-medium">Nenhuma nota encontrada</p>
            <p className="text-sm mt-2">
              {searchQuery ? 'Tente uma busca diferente' : 'Crie sua primeira nota!'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}