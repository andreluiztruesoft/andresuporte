import React, { useState } from 'react';
import { 
  Video, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Search, 
  Archive, 
  Edit2, 
  Plus, 
  Trash2, 
  Sparkles,
  Play
} from 'lucide-react';
import { VideoLesson } from '../types';
import { downloadShortcut, downloadAllShortcutsAsZip } from '../utils/shortcut';

interface VideoLessonsSectionProps {
  lessons: VideoLesson[];
  onUpdateLessons: (lessons: VideoLesson[]) => void;
}

export const VideoLessonsSection: React.FC<VideoLessonsSectionProps> = ({
  lessons,
  onUpdateLessons,
}) => {
  const [search, setSearch] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('todos');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [editingLesson, setEditingLesson] = useState<VideoLesson | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New lesson form state
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('https://vimeo.com/powergestor');
  const [newModule, setNewModule] = useState('Geral');

  const modules = Array.from(new Set(lessons.map((l) => l.module || 'Geral')));

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch = 
      lesson.title.toLowerCase().includes(search.toLowerCase()) ||
      (lesson.description && lesson.description.toLowerCase().includes(search.toLowerCase())) ||
      (lesson.module && lesson.module.toLowerCase().includes(search.toLowerCase()));
    
    const matchesModule = selectedModule === 'todos' || lesson.module === selectedModule;
    return matchesSearch && matchesModule;
  });

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadSingle = (lesson: VideoLesson) => {
    downloadShortcut(lesson.title, lesson.url, lesson.number);
  };

  const handleDownloadAll = async () => {
    try {
      setDownloadingZip(true);
      await downloadAllShortcutsAsZip(lessons, 'Atalhos - Video Aulas Power Gestor');
    } catch (err) {
      console.error('Erro ao gerar arquivo zip de atalhos:', err);
    } finally {
      setDownloadingZip(false);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;
    const updated = lessons.map((l) => (l.id === editingLesson.id ? editingLesson : l));
    onUpdateLessons(updated);
    setEditingLesson(null);
  };

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;
    const newLesson: VideoLesson = {
      id: `aula-${Date.now()}`,
      number: lessons.length + 1,
      title: newTitle.trim(),
      module: newModule.trim() || 'Geral',
      url: newUrl.trim(),
      duration: 'Aula',
    };
    onUpdateLessons([...lessons, newLesson]);
    setNewTitle('');
    setNewUrl('https://vimeo.com/powergestor');
    setShowAddModal(false);
  };

  const handleDeleteLesson = (id: string) => {
    if (confirm('Deseja remover esta aula da lista?')) {
      onUpdateLessons(lessons.filter((l) => l.id !== id));
    }
  };

  return (
    <div id="video-lessons-container" className="space-y-6">
      
      {/* Action Header Card */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-4">
        
        {/* Title & Top Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Vídeo Aulas Power Gestor
              </h2>
              <span className="text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
                Vimeo
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Gere atalhos de área de trabalho para seus clientes acessarem as aulas diretamente.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700 transition-colors inline-flex items-center gap-1.5"
              title="Adicionar nova videoaula"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nova Aula</span>
            </button>
            
            <a
              href="https://vimeo.com/powergestor"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700 transition-colors inline-flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Canal Vimeo</span>
            </a>
          </div>
        </div>

        {/* Master Action: Download All Shortcuts in ZIP */}
        <div className="p-4 bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Archive className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-slate-200">
                Pacote Completo de Atalhos para Área de Trabalho
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Baixa um arquivo <strong>.ZIP</strong> contendo os atalhos de <strong>todas as {lessons.length} aulas</strong>. 
              Basta extrair na Área de Trabalho do cliente.
            </p>
          </div>

          <button
            id="download-all-shortcuts-btn"
            onClick={handleDownloadAll}
            disabled={downloadingZip}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.99] flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            {downloadingZip ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Gerando Pacote ZIP...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Baixar Todos os Atalhos (.ZIP)</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              id="lesson-search-input"
              type="text"
              placeholder="Buscar aula por título, tema ou módulo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Module filter chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
            <button
              onClick={() => setSelectedModule('todos')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors shrink-0 ${
                selectedModule === 'todos'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-800/60'
              }`}
            >
              Todos ({lessons.length})
            </button>
            {modules.map((mod) => (
              <button
                key={mod}
                onClick={() => setSelectedModule(mod)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors shrink-0 ${
                  selectedModule === mod
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-800/60'
                }`}
              >
                {mod}
              </button>
            ))}
          </div>

        </div>

        {/* Video Lessons List */}
        <div className="divide-y divide-slate-800/60 pt-1">
          {filteredLessons.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              Nenhuma aula encontrada para a busca atual.
            </div>
          ) : (
            filteredLessons.map((lesson) => {
              const isCopied = copiedId === lesson.id;
              return (
                <div
                  key={lesson.id}
                  className="py-3 px-2 hover:bg-slate-800/40 rounded-xl transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  {/* Left info: number + title + module */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="w-7 h-7 rounded-lg bg-blue-600/15 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {lesson.number}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">
                          {lesson.title}
                        </span>
                        {lesson.module && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                            {lesson.module}
                          </span>
                        )}
                      </div>
                      
                      {lesson.description && (
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {lesson.description}
                        </p>
                      )}

                      <p className="text-[10px] font-mono text-slate-500 truncate max-w-sm">
                        {lesson.url}
                      </p>
                    </div>
                  </div>

                  {/* Right actions: 1) Copy Link, 2) Download Shortcut (.url), 3) Watch/Open */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    
                    {/* Botão 1: Copiar Link */}
                    <button
                      onClick={() => handleCopy(lesson.id, lesson.url)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
                      title="Copiar link desta aula"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 text-[11px]">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[11px]">Copiar Link</span>
                        </>
                      )}
                    </button>

                    {/* Botão 2: Download do Atalho (.url) para Área de Trabalho */}
                    <button
                      onClick={() => handleDownloadSingle(lesson)}
                      className="px-2.5 py-1.5 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 hover:text-emerald-300 text-xs font-medium rounded-lg border border-emerald-500/30 transition-colors flex items-center gap-1.5"
                      title="Baixar arquivo de atalho (.url) para colocar na área de trabalho do cliente"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Baixar Atalho</span>
                    </button>

                    {/* Botão 3: Abrir Aula no Navegador */}
                    <a
                      href={lesson.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Abrir no navegador"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {/* Config / Edit Button */}
                    <button
                      onClick={() => setEditingLesson(lesson)}
                      className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors opacity-60 hover:opacity-100"
                      title="Editar link ou título"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Edit Lesson Modal */}
      {editingLesson && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-md w-full space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">
                Editar Aula {editingLesson.number}
              </h3>
              <button
                type="button"
                onClick={() => setEditingLesson(null)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Título da Aula</label>
                <input
                  type="text"
                  value={editingLesson.title}
                  onChange={(e) =>
                    setEditingLesson({ ...editingLesson, title: e.target.value })
                  }
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Módulo</label>
                <input
                  type="text"
                  value={editingLesson.module}
                  onChange={(e) =>
                    setEditingLesson({ ...editingLesson, module: e.target.value })
                  }
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Link do Vídeo (Vimeo)</label>
                <input
                  type="url"
                  value={editingLesson.url}
                  onChange={(e) =>
                    setEditingLesson({ ...editingLesson, url: e.target.value })
                  }
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleDeleteLesson(editingLesson.id)}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingLesson(null)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Add New Lesson Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddLesson}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-md w-full space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-400" />
                Adicionar Nova Videoaula
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Título da Aula</label>
                <input
                  type="text"
                  placeholder="Ex: Emissão de Boletos e Remessa Bancária"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Módulo</label>
                <input
                  type="text"
                  placeholder="Ex: Financeiro"
                  value={newModule}
                  onChange={(e) => setNewModule(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Link do Vídeo no Vimeo</label>
                <input
                  type="url"
                  placeholder="https://vimeo.com/..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
              >
                Adicionar Aula
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
