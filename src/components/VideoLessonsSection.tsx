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
  RefreshCw,
  Clock,
  Play
} from 'lucide-react';
import { VideoLesson } from '../types';
import { downloadShortcut, downloadAllShortcutsAsZip } from '../utils/shortcut';

interface VideoLessonsSectionProps {
  lessons: VideoLesson[];
  onUpdateLessons: (lessons: VideoLesson[]) => void;
  onSyncVimeo?: (force: boolean) => Promise<void>;
  isSyncing?: boolean;
  syncMessage?: string | null;
}

export const VideoLessonsSection: React.FC<VideoLessonsSectionProps> = ({
  lessons,
  onUpdateLessons,
  onSyncVimeo,
  isSyncing = false,
  syncMessage = null,
}) => {
  const [search, setSearch] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('todos');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [editingLesson, setEditingLesson] = useState<VideoLesson | null>(null);

  const modules = Array.from(new Set(lessons.map((l) => l.module || 'Geral')));

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch = 
      lesson.title.toLowerCase().includes(search.toLowerCase()) ||
      (lesson.description && lesson.description.toLowerCase().includes(search.toLowerCase())) ||
      (lesson.module && lesson.module.toLowerCase().includes(search.toLowerCase())) ||
      lesson.url.toLowerCase().includes(search.toLowerCase());
    
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
              <span className="text-[11px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-mono">
                {lessons.length} vídeos
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Atalhos de Área de Trabalho (.url) com link direto para cada vídeo individual no Vimeo.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onSyncVimeo && (
              <button
                onClick={() => onSyncVimeo(true)}
                disabled={isSyncing}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                title="Buscar novos vídeos no perfil do Vimeo"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-400' : ''}`} />
                <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Canal'}</span>
              </button>
            )}
            
            <a
              href="https://vimeo.com/powergestor"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              title="Visitar canal vimeo.com/powergestor"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Canal Vimeo</span>
            </a>
          </div>
        </div>

        {/* Sync message badge if available */}
        {syncMessage && (
          <div className="p-2.5 bg-blue-950/40 border border-blue-500/30 rounded-xl text-xs text-blue-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncMessage}</span>
          </div>
        )}

        {/* Master Action: Download All Shortcuts in ZIP */}
        <div className="p-4 bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Archive className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-slate-200">
                Pacote Completo de Atalhos ({lessons.length} Arquivos .url)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Baixa um arquivo <strong>.ZIP</strong> contendo todos os <strong>{lessons.length} atalhos diretos</strong> numerados e organizados. 
              Ao clicar duas vezes, cada atalho abre imediatamente o vídeo correspondente no navegador do cliente.
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
              placeholder="Buscar por nome, assunto ou link..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Module filter chips without horizontal scrollbar */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setSelectedModule('todos')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors shrink-0 cursor-pointer ${
                selectedModule === 'todos'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-800/60'
              }`}
            >
              Todos ({lessons.length})
            </button>
            {modules.map((mod) => (
              <button
                key={mod}
                onClick={() => setSelectedModule(mod)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors shrink-0 cursor-pointer ${
                  selectedModule === mod
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
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
              Nenhuma aula encontrada para o filtro atual.
            </div>
          ) : (
            filteredLessons.map((lesson) => {
              const isCopied = copiedId === lesson.id;
              return (
                <div
                  key={lesson.id}
                  id={`video-lesson-${lesson.id}`}
                  className="py-3 px-2 hover:bg-slate-800/40 rounded-xl transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  {/* Left info: thumbnail / number + title + module + duration */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Thumbnail or Number Badge */}
                    <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 shrink-0 flex items-center justify-center group-hover:border-blue-500/40 transition-colors">
                      {lesson.thumbnail ? (
                        <img 
                          src={lesson.thumbnail} 
                          alt={lesson.title} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                      ) : (
                        <Video className="w-5 h-5 text-slate-600" />
                      )}
                      <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-white font-mono text-[9px] px-1 rounded">
                        #{lesson.number}
                      </span>
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition-colors leading-tight">
                          {lesson.title}
                        </span>
                        {lesson.module && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                            {lesson.module}
                          </span>
                        )}
                        {lesson.duration && (
                          <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {lesson.duration}
                          </span>
                        )}
                      </div>
                      
                      {lesson.description && (
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {lesson.description}
                        </p>
                      )}

                      {/* Direct Link Tag */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500 font-mono">Link direto:</span>
                        <a
                          href={lesson.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-mono text-blue-400 hover:text-blue-300 hover:underline truncate max-w-xs"
                          title="Abrir link direto no Vimeo"
                        >
                          {lesson.url}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Right actions: 1) Copy Link, 2) Download Shortcut (.url), 3) Watch/Open */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-center">
                    
                    {/* Botão 1: Copiar Link Direto */}
                    <button
                      onClick={() => handleCopy(lesson.id, lesson.url)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="Copiar link direto para este vídeo"
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

                    {/* Botão 2: Download do Atalho (.url) com Link Direto para Área de Trabalho */}
                    <button
                      onClick={() => handleDownloadSingle(lesson)}
                      className="px-2.5 py-1.5 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 hover:text-emerald-300 text-xs font-medium rounded-lg border border-emerald-500/30 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                      title="Baixar atalho da área de trabalho (.url) para este vídeo específico"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Baixar Atalho</span>
                    </button>

                    {/* Botão 3: Abrir Aula Diretamente no Navegador */}
                    <a
                      href={lesson.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-blue-600/15 hover:bg-blue-600/30 text-blue-300 hover:text-blue-200 border border-blue-500/30 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                      title="Assistir aula agora no Vimeo"
                    >
                      <Play className="w-3 h-3 text-blue-400 fill-blue-400" />
                      <span className="text-[11px]">Assistir</span>
                    </a>

                    {/* Config / Edit Button */}
                    <button
                      onClick={() => setEditingLesson(lesson)}
                      className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors opacity-60 hover:opacity-100 cursor-pointer"
                      title="Editar título ou link"
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
                Editar Aula #{editingLesson.number}
              </h3>
              <button
                type="button"
                onClick={() => setEditingLesson(null)}
                className="text-slate-400 hover:text-slate-200 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400">Título da Aula:</label>
                <input
                  type="text"
                  value={editingLesson.title}
                  onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Link Direto do Vídeo:</label>
                <input
                  type="url"
                  value={editingLesson.url}
                  onChange={(e) => setEditingLesson({ ...editingLesson, url: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono text-[11px] focus:outline-none focus:border-blue-500"
                  placeholder="https://vimeo.com/..."
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Módulo / Categoria:</label>
                <input
                  type="text"
                  value={editingLesson.module}
                  onChange={(e) => setEditingLesson({ ...editingLesson, module: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingLesson(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-xs cursor-pointer"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
