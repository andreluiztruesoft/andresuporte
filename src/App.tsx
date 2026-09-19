/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  FolderGit2, 
  ExternalLink, 
  Download, 
  Copy, 
  Check, 
  Search, 
  Folder, 
  FileText, 
  Settings2, 
  ArrowUpRight,
  Video,
  PlaySquare
} from 'lucide-react';
import { DropboxItem, VideoLesson } from './types';
import { DEFAULT_VIDEO_LESSONS } from './data/videoLessons';
import { VideoLessonsSection } from './components/VideoLessonsSection';

const DEFAULT_DROPBOX_URL = "https://www.dropbox.com/scl/fo/8a4q1l47w88ytfyxpn8em/ANtT3RuihAOgeAyWS_DU-j8?rlkey=kt7dugthnbm5i0yxq0nc00qoj&st=eozgl2gu&e=1&dl=0";

export default function App() {
  // Navigation Menu Tab: 'videos' (Vimeo Video Aulas) or 'dropbox' (Pastas de Suporte)
  const [activeTab, setActiveTab] = useState<'videos' | 'dropbox'>('videos');

  // Dropbox State
  const [dropboxUrl, setDropboxUrl] = useState<string>(() => {
    return localStorage.getItem('custom_dropbox_url') || DEFAULT_DROPBOX_URL;
  });
  const [folderTitle, setFolderTitle] = useState<string>('Arquivos de Suporte');
  const [detectedItems, setDetectedItems] = useState<DropboxItem[]>([]);
  const [search, setSearch] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [inputUrl, setInputUrl] = useState<string>(dropboxUrl);
  const [copiedItemIdx, setCopiedItemIdx] = useState<number | null>(null);

  // Video Lessons State (Power Gestor)
  const [videoLessons, setVideoLessons] = useState<VideoLesson[]>(() => {
    const saved = localStorage.getItem('powergestor_video_lessons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_VIDEO_LESSONS;
  });

  const handleUpdateLessons = (updated: VideoLesson[]) => {
    setVideoLessons(updated);
    localStorage.setItem('powergestor_video_lessons', JSON.stringify(updated));
  };

  const zipDownloadUrl = useMemo(() => {
    return dropboxUrl.includes("dl=0")
      ? dropboxUrl.replace("dl=0", "dl=1")
      : dropboxUrl + (dropboxUrl.includes("?") ? "&dl=1" : "?dl=1");
  }, [dropboxUrl]);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const res = await fetch(`/api/dropbox/info?url=${encodeURIComponent(dropboxUrl)}`);
        const data = await res.json();
        if (isMounted && data) {
          if (data.folderTitle) setFolderTitle(data.folderTitle);
          if (data.detectedItems && data.detectedItems.length > 0) {
            setDetectedItems(data.detectedItems);
            return;
          }
        }
      } catch {
        // Fallback default structure
      }

      if (isMounted) {
        setDetectedItems([
          { name: '01 - Manuais & Tutoriais', isFolder: true },
          { name: '02 - Drivers & Instaladores', isFolder: true },
          { name: '03 - Utilitários & Ferramentas', isFolder: true },
          { name: '04 - Scripts & Banco de Dados', isFolder: true },
          { name: '05 - Modelos & Templates', isFolder: true },
          { name: '06 - Atualizações de Sistema', isFolder: true },
        ]);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [dropboxUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(dropboxUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyItem = (name: string, idx: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(name);
    setCopiedItemIdx(idx);
    setTimeout(() => setCopiedItemIdx(null), 1500);
  };

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      setDropboxUrl(inputUrl.trim());
      localStorage.setItem('custom_dropbox_url', inputUrl.trim());
      setShowConfig(false);
    }
  };

  const filteredItems = useMemo(() => {
    if (!search.trim()) return detectedItems;
    const term = search.toLowerCase();
    return detectedItems.filter(item => item.name.toLowerCase().includes(term));
  }, [detectedItems, search]);

  return (
    <div className="min-h-screen bg-[#0c0e14] text-slate-200 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Bar with Navigation Menu Tabs */}
      <header className="border-b border-slate-800/70 bg-slate-900/60 backdrop-blur-md px-4 py-2.5 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          
          {/* Menu de Navegação Minimalista e Objetivo */}
          <nav id="main-nav-menu" className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            
            {/* Aba 1: Vídeo Aulas (Power Gestor) */}
            <button
              id="tab-video-lessons"
              onClick={() => setActiveTab('videos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'videos'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Vídeo Aulas</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === 'videos' ? 'bg-blue-500/40 text-blue-100' : 'bg-slate-800 text-slate-400'
              }`}>
                {videoLessons.length}
              </span>
            </button>

            {/* Aba 2: Pastas Dropbox */}
            <button
              id="tab-dropbox-files"
              onClick={() => setActiveTab('dropbox')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'dropbox'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Pastas Dropbox</span>
            </button>
          </nav>

          {/* Quick link status / settings */}
          <div className="flex items-center gap-2">
            {activeTab === 'dropbox' && (
              <button
                id="toggle-config-btn"
                onClick={() => setShowConfig(!showConfig)}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-md transition-colors text-xs"
                title="Alterar Link do Dropbox"
              >
                <Settings2 className="w-4 h-4" />
              </button>
            )}

            {activeTab === 'videos' && (
              <a
                href="https://vimeo.com/powergestor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-slate-400 hover:text-blue-400 flex items-center gap-1 font-mono transition-colors"
                title="Acessar canal oficial no Vimeo"
              >
                <span>vimeo.com/powergestor</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

        </div>

        {/* Dropbox URL editor (only if open on Dropbox tab) */}
        {showConfig && activeTab === 'dropbox' && (
          <form onSubmit={handleSaveUrl} className="max-w-2xl mx-auto mt-2 pt-2 border-t border-slate-800/80 flex gap-2">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Cole o link do Dropbox..."
              className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700/70 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium"
            >
              Salvar
            </button>
          </form>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 flex flex-col justify-start">
        
        {/* TAB 1: Video Aulas Power Gestor (Vimeo) */}
        {activeTab === 'videos' && (
          <VideoLessonsSection
            lessons={videoLessons}
            onUpdateLessons={handleUpdateLessons}
          />
        )}

        {/* TAB 2: Pastas do Dropbox */}
        {activeTab === 'dropbox' && (
          <div className="space-y-6">
            
            {/* Core Quick-Action Panel */}
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
              
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <h2 className="text-sm font-bold text-slate-100">
                    {folderTitle}
                  </h2>
                </div>
                <span className="text-[11px] text-slate-400">Repositório de Suporte</span>
              </div>

              {/* Main 2 Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  id="open-dropbox-primary"
                  href={dropboxUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.99]"
                >
                  <span>Abrir no Dropbox</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <a
                  id="download-zip-primary"
                  href={zipDownloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3.5 bg-slate-800 hover:bg-slate-700/90 text-slate-100 border border-slate-700/70 font-semibold text-sm rounded-xl transition-all active:scale-[0.99]"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Baixar ZIP Completo</span>
                </a>
              </div>

              {/* Copy Link Strip */}
              <div className="flex items-center justify-between gap-3 bg-slate-950/60 border border-slate-800/70 rounded-xl px-3.5 py-2">
                <span className="text-[11px] font-mono text-slate-400 truncate flex-1">
                  {dropboxUrl}
                </span>
                <button
                  id="copy-link-btn"
                  onClick={handleCopyLink}
                  className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1.5 shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copiar Link</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Directory & Quick Search */}
            <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-4 space-y-3">
              
              {/* Search Header */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5 text-amber-400" />
                  Pastas do Repositório ({filteredItems.length})
                </span>

                <div className="relative w-44 sm:w-56">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="search-input"
                    type="text"
                    placeholder="Filtrar..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-8 pr-2 py-1 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Folder items list */}
              <div className="divide-y divide-slate-800/50 max-h-80 overflow-y-auto pr-1">
                {filteredItems.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-500">
                    Nenhum item encontrado.
                  </p>
                ) : (
                  filteredItems.map((item, idx) => (
                    <a
                      key={idx}
                      href={dropboxUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between py-2.5 px-2 hover:bg-slate-800/40 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {item.isFolder ? (
                          <Folder className="w-4 h-4 text-amber-400 shrink-0" />
                        ) : (
                          <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                        )}
                        <span className="text-xs text-slate-300 group-hover:text-white font-medium truncate">
                          {item.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={(e) => handleCopyItem(item.name, idx, e)}
                          className="opacity-0 group-hover:opacity-100 text-[10px] text-slate-400 hover:text-slate-200 bg-slate-800 px-2 py-0.5 rounded transition-all"
                          title="Copiar nome"
                        >
                          {copiedItemIdx === idx ? 'Copiado!' : 'Copiar'}
                        </button>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                      </div>
                    </a>
                  ))
                )}
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Minimal Footer */}
      <footer className="py-3 text-center text-[11px] text-slate-600 border-t border-slate-900 mt-auto">
        <span>Central de Suporte &bull; Power Gestor</span>
      </footer>

    </div>
  );
}
