import React, { useState } from 'react';
import { ExternalLink, RefreshCw, Maximize2, Minimize2, Info, FolderCheck, Download, AlertCircle } from 'lucide-react';

interface DropboxIframeViewerProps {
  dropboxUrl: string;
  zipDownloadUrl: string;
}

export const DropboxIframeViewer: React.FC<DropboxIframeViewerProps> = ({
  dropboxUrl,
  zipDownloadUrl,
}) => {
  const [iframeKey, setIframeKey] = useState(0);
  const [isFullHeight, setIsFullHeight] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Dropbox folder view link formatted for standard web viewing
  const embedUrl = dropboxUrl;

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div id="dropbox-iframe-viewer-section" className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
      {/* Control Toolbar */}
      <div className="bg-slate-900 text-slate-100 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <FolderCheck className="w-5 h-5 text-blue-400" />
          <span className="font-semibold text-sm">Visualizador de Pastas do Dropbox</span>
          <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 hidden sm:inline-block">
            Modo Incorporado
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="iframe-refresh-btn"
            onClick={handleRefresh}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-xs flex items-center gap-1"
            title="Recarregar tela"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">Recarregar</span>
          </button>

          <button
            id="iframe-toggle-height-btn"
            onClick={() => setIsFullHeight(!isFullHeight)}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-xs flex items-center gap-1"
            title={isFullHeight ? "Tamanho Padrão" : "Expandir Visualizador"}
          >
            {isFullHeight ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isFullHeight ? "Reduzir" : "Expandir"}</span>
          </button>

          <a
            id="iframe-open-tab-btn"
            href={dropboxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <span>Abrir no Dropbox</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Info Notice Banner */}
      <div className="bg-blue-50 border-b border-blue-100 px-4 py-2.5 text-xs text-blue-900 flex items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            Navegue pelas pastas e arquivos diretamente na janela abaixo. Se preferir, você também pode baixar a pasta inteira em formato ZIP.
          </span>
        </div>
        <a
          href={zipDownloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 hover:text-blue-900 font-semibold underline shrink-0 flex items-center gap-1"
        >
          <Download className="w-3.5 h-3.5" />
          Baixar ZIP
        </a>
      </div>

      {/* Embedded iFrame Box */}
      <div className={`relative w-full bg-slate-100 transition-all duration-300 ${isFullHeight ? 'h-[850px]' : 'h-[620px]'}`}>
        {isLoading && (
          <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center z-10 p-6 text-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm font-medium text-slate-700">Carregando pasta do Dropbox...</p>
            <p className="text-xs text-slate-500 max-w-sm mt-1">Conectando ao repositório público de arquivos.</p>
          </div>
        )}

        <iframe
          key={iframeKey}
          id="dropbox-embedded-iframe"
          src={embedUrl}
          title="Arquivos de Suporte Dropbox"
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
        />
      </div>

      {/* Footer Fallback Bar */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-slate-400" />
          <span>Se o seu navegador bloquear o iframe por segurança ou cookies de terceiros, use o botão de acesso direto:</span>
        </div>
        <a
          id="fallback-direct-link"
          href={dropboxUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
        >
          Acessar Diretamente no Dropbox
          <ExternalLink className="w-3 h-3 ml-1.5" />
        </a>
      </div>
    </div>
  );
};
