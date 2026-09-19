/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  FolderGit2, 
  ExternalLink, 
  Copy, 
  Check, 
  Folder, 
  FileText, 
  FileCode,
  Settings2, 
  Video,
  FileDown,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { DropboxItem, VideoLesson } from './types';
import { DEFAULT_VIDEO_LESSONS } from './data/videoLessons';
import { VideoLessonsSection } from './components/VideoLessonsSection';
import { SupportManualSection } from './components/SupportManualSection';
import { downloadSupportManualTxt } from './utils/supportManual';

const DEFAULT_DROPBOX_URL = "https://www.dropbox.com/scl/fo/8a4q1l47w88ytfyxpn8em/ANtT3RuihAOgeAyWS_DU-j8?rlkey=kt7dugthnbm5i0yxq0nc00qoj&st=eozgl2gu&e=1&dl=0";

export default function App() {
  // Navigation Menu Tabs: 'dropbox' (default initial page) | 'videos' | 'manual'
  const [activeTab, setActiveTab] = useState<'dropbox' | 'videos' | 'manual'>('dropbox');

  // Dropbox State
  const [dropboxUrl, setDropboxUrl] = useState<string>(() => {
    return localStorage.getItem('custom_dropbox_url') || DEFAULT_DROPBOX_URL;
  });
  const [folderTitle, setFolderTitle] = useState<string>('TRUESOFT');
  const [detectedItems, setDetectedItems] = useState<DropboxItem[]>([
    { name: 'Pinpad', isFolder: true, type: 'folder' },
    { name: 'TEF Getcard', isFolder: true, type: 'folder' },
    { name: 'Impressoras', isFolder: true, type: 'folder' },
    { name: 'TrueManager', isFolder: true, type: 'folder' },
    { name: 'Video Aulas', isFolder: true, type: 'folder' },
    { name: 'PDV1.2.5.exe', isFolder: false, type: 'exe' },
  ]);
  const [isLoadingDropbox, setIsLoadingDropbox] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [inputUrl, setInputUrl] = useState<string>(dropboxUrl);
  const [copiedItemIdx, setCopiedItemIdx] = useState<number | null>(null);
  const [downloadedManual, setDownloadedManual] = useState<boolean>(false);

  // Video Lessons State (Power Gestor)
  const [videoLessons, setVideoLessons] = useState<VideoLesson[]>(() => {
    const saved = localStorage.getItem('powergestor_video_lessons_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 50) {
          return parsed;
        }
      } catch {}
    }
    return DEFAULT_VIDEO_LESSONS;
  });
  const [isSyncingVimeo, setIsSyncingVimeo] = useState<boolean>(false);
  const [vimeoSyncMessage, setVimeoSyncMessage] = useState<string | null>(null);

  const handleUpdateLessons = (updated: VideoLesson[]) => {
    setVideoLessons(updated);
    localStorage.setItem('powergestor_video_lessons_v2', JSON.stringify(updated));
  };

  const syncVimeoLessons = async (force: boolean = false) => {
    setIsSyncingVimeo(true);
    setVimeoSyncMessage(null);
    try {
      const res = await fetch(`/api/vimeo/videos${force ? '?force=true' : ''}`);
      const data = await res.json();
      if (data && data.success && Array.isArray(data.videos) && data.videos.length > 0) {
        handleUpdateLessons(data.videos);
        setVimeoSyncMessage(`${data.videos.length} aulas sincronizadas diretamente com o Vimeo`);
        setTimeout(() => setVimeoSyncMessage(null), 4000);
      }
    } catch (err) {
      console.error("Erro ao sincronizar vídeos do Vimeo:", err);
    } finally {
      setIsSyncingVimeo(false);
    }
  };

  useEffect(() => {
    // Check for Vimeo updates on mount
    syncVimeoLessons(false);
  }, []);

  const handleQuickDownloadManual = () => {
    downloadSupportManualTxt('Manual_Suporte_Truesoft.txt');
    setDownloadedManual(true);
    setTimeout(() => setDownloadedManual(false), 2000);
  };

  // Inspect Dropbox structure on link open
  const fetchDropboxStructure = async (url: string) => {
    setIsLoadingDropbox(true);
    try {
      const res = await fetch(`/api/dropbox/info?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data) {
        if (data.folderTitle) setFolderTitle(data.folderTitle);
        if (data.detectedItems && data.detectedItems.length > 0) {
          setDetectedItems(data.detectedItems);
          return;
        }
      }
    } catch (err) {
      console.error("Erro ao verificar estrutura no Dropbox:", err);
    } finally {
      setIsLoadingDropbox(false);
    }
  };

  useEffect(() => {
    fetchDropboxStructure(dropboxUrl);
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

  return (
    <div className="min-h-screen bg-[#0c0e14] text-slate-200 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Bar with Navigation Menu Tabs */}
      <header className="border-b border-slate-800/70 bg-slate-900/60 backdrop-blur-md px-4 py-2.5 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          
          {/* Menu de Navegação Minimalista e Objetivo */}
          <nav id="main-nav-menu" className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            
            {/* Aba 1: Pastas Dropbox (Página Inicial) */}
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
              <span>Dropbox</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === 'dropbox' ? 'bg-blue-500/40 text-blue-100' : 'bg-slate-800 text-slate-400'
              }`}>
                {detectedItems.length}
              </span>
            </button>

            {/* Aba 2: Vídeo Aulas (Power Gestor) */}
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

            {/* Aba 3: Manual do Suporte Truesoft */}
            <button
              id="tab-support-manual"
              onClick={() => setActiveTab('manual')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'manual'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Manual Suporte</span>
            </button>
          </nav>

          {/* Direct Quick Download Manual .TXT Action */}
          <div className="flex items-center gap-2">
            <button
              id="quick-download-manual-header"
              onClick={handleQuickDownloadManual}
              className="px-2.5 py-1.5 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 hover:text-emerald-300 text-xs font-medium rounded-lg border border-emerald-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Baixar Manual de Suporte (.TXT) para o computador do cliente"
            >
              {downloadedManual ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Baixado!</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Manual .TXT</span>
                </>
              )}
            </button>

            {activeTab === 'dropbox' && (
              <button
                id="toggle-config-btn"
                onClick={() => setShowConfig(!showConfig)}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-md transition-colors text-xs"
                title="Configurar Link do Dropbox"
              >
                <Settings2 className="w-4 h-4" />
              </button>
            )}

            {activeTab === 'videos' && (
              <a
                href="https://vimeo.com/powergestor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-slate-400 hover:text-blue-400 hidden sm:flex items-center gap-1 font-mono transition-colors"
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
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium cursor-pointer"
            >
              Salvar
            </button>
          </form>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 flex flex-col justify-start">
        
        {/* TAB 1: Repositório Dropbox (Página Inicial) */}
        {activeTab === 'dropbox' && (
          <div className="space-y-5">
            
            {/* Core Header Card with Direct Dropbox Action */}
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      <span>{folderTitle}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
                        Dropbox
                      </span>
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400">
                    Estrutura de arquivos e pastas sincronizada diretamente com o repositório.
                  </p>
                </div>

                {/* Primary Button Directing to Dropbox on the side */}
                <a
                  id="open-dropbox-primary"
                  href={dropboxUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.99] flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                  title="Abrir pasta completa no Dropbox"
                >
                  <span>Abrir no Dropbox</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Copy Link Strip */}
              <div className="flex items-center justify-between gap-3 bg-slate-950/70 border border-slate-800/80 rounded-xl px-3.5 py-2">
                <span className="text-[11px] font-mono text-slate-400 truncate flex-1 select-all">
                  {dropboxUrl}
                </span>
                <button
                  id="copy-link-btn"
                  onClick={handleCopyLink}
                  className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                  title="Copiar link do Dropbox"
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

            {/* Real Dropbox Files & Folders Structure with Redirection Button on each row */}
            <div className="bg-slate-900/60 border border-slate-800/70 rounded-2xl p-4 sm:p-5 space-y-3">
              
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold text-slate-200 tracking-wide uppercase">
                    Estrutura do Repositório ({detectedItems.length} itens)
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {isLoadingDropbox && (
                    <span className="text-[11px] text-blue-400 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Sincronizando...</span>
                    </span>
                  )}
                  <button
                    onClick={() => fetchDropboxStructure(dropboxUrl)}
                    className="text-slate-400 hover:text-slate-200 p-1 hover:bg-slate-800 rounded transition-colors"
                    title="Recarregar estrutura do Dropbox"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDropbox ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Exact items list from Dropbox */}
              <div className="divide-y divide-slate-800/60">
                {detectedItems.map((item, idx) => (
                  <div
                    key={idx}
                    id={`dropbox-item-${idx}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between py-3 px-3 hover:bg-slate-800/40 rounded-xl transition-all gap-2.5 group"
                  >
                    {/* Item Identity */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg shrink-0 ${
                        item.isFolder 
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {item.isFolder ? (
                          <Folder className="w-4 h-4" />
                        ) : (
                          <FileCode className="w-4 h-4" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-200 group-hover:text-white font-mono tracking-tight truncate">
                            {item.name}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                            item.isFolder 
                              ? 'bg-slate-800 text-slate-400' 
                              : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {item.isFolder ? 'Pasta' : 'Arquivo Executável'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Redirection Button to Dropbox on the side */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={(e) => handleCopyItem(item.name, idx, e)}
                        className="text-[11px] text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 px-2 py-1 rounded-lg border border-slate-700/60 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Copiar nome do arquivo/pasta"
                      >
                        {copiedItemIdx === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-medium">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-400" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>

                      <a
                        href={dropboxUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-medium rounded-lg border border-slate-700/70 hover:border-blue-500 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                        title={`Abrir ${item.name} no Dropbox`}
                      >
                        <span>Abrir no Dropbox</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: Video Aulas Power Gestor (Vimeo) */}
        {activeTab === 'videos' && (
          <VideoLessonsSection
            lessons={videoLessons}
            onUpdateLessons={handleUpdateLessons}
            onSyncVimeo={syncVimeoLessons}
            isSyncing={isSyncingVimeo}
            syncMessage={vimeoSyncMessage}
          />
        )}

        {/* TAB 3: Manual de Funcionamento do Suporte (Truesoft) */}
        {activeTab === 'manual' && (
          <SupportManualSection />
        )}

      </main>

      {/* Minimal Footer */}
      <footer className="py-3 text-center text-[11px] text-slate-600 border-t border-slate-900 mt-auto flex flex-col sm:flex-row items-center justify-between max-w-2xl w-full mx-auto px-4">
        <span>Truesoft Sistemas &bull; Suporte Técnico</span>
        <a 
          href="https://app.powergestor.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-slate-400 transition-colors font-mono"
        >
          app.powergestor.com
        </a>
      </footer>

    </div>
  );
}
