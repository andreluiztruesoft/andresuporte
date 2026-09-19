import React from 'react';
import { FolderGit2, ExternalLink, Download, Copy, Check, LayoutGrid, Monitor, Layers } from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  dropboxUrl: string;
  zipDownloadUrl: string;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  folderTitle: string;
  onCopyLink: () => void;
  copied: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  dropboxUrl,
  zipDownloadUrl,
  viewMode,
  setViewMode,
  folderTitle,
  onCopyLink,
  copied,
}) => {
  return (
    <header id="main-header" className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div id="logo-icon-container" className="p-2.5 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400 flex items-center justify-center shadow-inner">
              <FolderGit2 className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                  Pasta Pública Dropbox
                </span>
              </div>
              <h1 id="header-title" className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
                {folderTitle || "Central de Suporte - Arquivos"}
              </h1>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="copy-link-btn"
              onClick={onCopyLink}
              className="inline-flex items-center px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shadow-sm cursor-pointer"
              title="Copiar link do Dropbox"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                  Copiar Link
                </>
              )}
            </button>

            <a
              id="download-zip-btn"
              href={zipDownloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shadow-sm"
              title="Baixar pasta completa em arquivo ZIP"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
              Baixar ZIP
            </a>

            <a
              id="open-dropbox-btn"
              href={dropboxUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              Abrir no Dropbox
            </a>
          </div>
        </div>

        {/* Navigation / View Selector Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800">
            <button
              id="view-embedded-tab"
              onClick={() => setViewMode('embedded')}
              className={`inline-flex items-center px-3 py-1.5 rounded-md font-medium transition-all ${
                viewMode === 'embedded'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Monitor className="w-3.5 h-3.5 mr-1.5" />
              Visualizador Incorporado
            </button>

            <button
              id="view-categories-tab"
              onClick={() => setViewMode('categories')}
              className={`inline-flex items-center px-3 py-1.5 rounded-md font-medium transition-all ${
                viewMode === 'categories'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5 mr-1.5" />
              Organizador por Categorias
            </button>

            <button
              id="view-grid-tab"
              onClick={() => setViewMode('grid')}
              className={`inline-flex items-center px-3 py-1.5 rounded-md font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 mr-1.5" />
              Grade de Pastas
            </button>
          </div>

          <div className="text-slate-400 text-[11px] hidden sm:flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
            Acesso Direto &amp; Download Livre
          </div>
        </div>

      </div>
    </header>
  );
};
