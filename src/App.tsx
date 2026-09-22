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
  FileText, 
  Video,
  FileDown
} from 'lucide-react';
import { VideoLesson } from './types';
import { DEFAULT_VIDEO_LESSONS } from './data/videoLessons';
import { VideoLessonsSection } from './components/VideoLessonsSection';
import { SupportManualSection } from './components/SupportManualSection';
import { downloadSupportManualTxt } from './utils/supportManual';

const DEFAULT_DROPBOX_URL = "https://www.dropbox.com/scl/fo/8a4q1l47w88ytfyxpn8em/ANtT3RuihAOgeAyWS_DU-j8?rlkey=kt7dugthnbm5i0yxq0nc00qoj&st=eozgl2gu&e=1&dl=0";

export default function App() {
  // Navigation Menu Tabs: 'dropbox' (default initial page) | 'videos' | 'manual'
  const [activeTab, setActiveTab] = useState<'dropbox' | 'videos' | 'manual'>('dropbox');

  // Dropbox State
  const [dropboxUrl] = useState<string>(() => {
    return localStorage.getItem('custom_dropbox_url') || DEFAULT_DROPBOX_URL;
  });
  const [folderTitle, setFolderTitle] = useState<string>('TRUESOFT');
  const [copied, setCopied] = useState<boolean>(false);
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

  // Get Dropbox folder title on link open
  const fetchDropboxStructure = async (url: string) => {
    try {
      const res = await fetch(`/api/dropbox/info?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data && data.folderTitle) {
        setFolderTitle(data.folderTitle);
      }
    } catch (err) {
      console.error("Erro ao verificar pasta no Dropbox:", err);
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

  return (
    <div className="min-h-screen bg-[#0c0e14] text-slate-200 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Bar with Navigation Menu Tabs */}
      <header className="border-b border-slate-800/70 bg-slate-900/60 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-2.5 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
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
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col justify-start">
        
        {/* TAB 1: Repositório Dropbox (Página Inicial) */}
        {activeTab === 'dropbox' && (
          <div className="space-y-5">
            
            {/* Core Header Card with Direct Dropbox Action */}
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-xl">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                      <span>{folderTitle}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
                        Dropbox
                      </span>
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Acesso direto ao repositório de arquivos e instaladores do sistema.
                  </p>
                </div>

                {/* Primary Button Directing to Dropbox on the side */}
                <a
                  id="open-dropbox-primary"
                  href={dropboxUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.99] flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                  title="Abrir pasta completa no Dropbox"
                >
                  <span>Abrir no Dropbox</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Copy Link Strip */}
              <div className="flex items-center justify-between gap-3 bg-slate-950/70 border border-slate-800/80 rounded-xl px-4 py-2.5">
                <span className="text-xs font-mono text-slate-400 truncate flex-1 select-all">
                  {dropboxUrl}
                </span>
                <button
                  id="copy-link-btn"
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
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
      <footer className="py-3 text-center text-[11px] text-slate-600 border-t border-slate-900 mt-auto flex flex-col sm:flex-row items-center justify-between max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8">
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
