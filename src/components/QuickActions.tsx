import React, { useState } from 'react';
import { ExternalLink, Download, Copy, Share2, Check, Edit3, Link2, QrCode } from 'lucide-react';

interface QuickActionsProps {
  dropboxUrl: string;
  zipDownloadUrl: string;
  onUpdateUrl: (newUrl: string) => void;
  onCopyLink: () => void;
  copied: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  dropboxUrl,
  zipDownloadUrl,
  onUpdateUrl,
  onCopyLink,
  copied,
}) => {
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [inputUrl, setInputUrl] = useState(dropboxUrl);
  const [showQrModal, setShowQrModal] = useState(false);

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      onUpdateUrl(inputUrl.trim());
      setIsEditingUrl(false);
    }
  };

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Acesse a pasta de suporte no Dropbox: ${dropboxUrl}`
  )}`;

  return (
    <div id="quick-actions-section" className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Action 1: Direct Link */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
              <ExternalLink className="w-5 h-5 text-blue-100" />
            </div>
            <span className="text-[11px] font-semibold bg-white/15 px-2.5 py-0.5 rounded-full text-blue-100">
              Direto
            </span>
          </div>
          <h3 className="font-bold text-lg text-white">Navegar no Dropbox</h3>
          <p className="text-xs text-blue-100/80 mt-1 leading-relaxed">
            Abra a pasta pública diretamente no site ou aplicativo oficial do Dropbox.
          </p>
        </div>

        <div className="mt-5 pt-3 border-t border-white/15 flex items-center justify-between gap-2">
          <button
            onClick={onCopyLink}
            className="text-xs text-white/90 hover:text-white flex items-center gap-1 font-medium bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copiado!' : 'Copiar URL'}
          </button>

          <a
            href={dropboxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 bg-white text-blue-700 font-bold rounded-lg text-xs hover:bg-blue-50 transition-colors shadow-sm inline-flex items-center gap-1"
          >
            Acessar
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Action 2: Direct ZIP Download */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <Download className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              Download
            </span>
          </div>
          <h3 className="font-bold text-lg text-white">Baixar Arquivo ZIP</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Inicie o download compactado contendo todos os arquivos e subpastas de suporte.
          </p>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">Formato .ZIP</span>
          <a
            href={zipDownloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs transition-colors shadow-sm inline-flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Baixar ZIP Agora
          </a>
        </div>
      </div>

      {/* Action 3: Share & Manage Link */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-50 border border-purple-100 rounded-xl">
              <Share2 className="w-5 h-5 text-purple-600" />
            </div>
            <button
              onClick={() => setIsEditingUrl(!isEditingUrl)}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md"
              title="Alterar Link do Dropbox"
            >
              <Edit3 className="w-3 h-3" />
              Editar Link
            </button>
          </div>
          <h3 className="font-bold text-lg text-slate-900">Compartilhar Acesso</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Envie este repositório de suporte facilmente para clientes ou membros da equipe.
          </p>
        </div>

        {isEditingUrl ? (
          <form onSubmit={handleSaveUrl} className="mt-4 pt-3 border-t border-slate-100 space-y-2">
            <div className="relative">
              <Link2 className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Cole um novo link do Dropbox..."
                className="w-full pl-8 pr-2 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div className="flex justify-end gap-1">
              <button
                type="button"
                onClick={() => setIsEditingUrl(false)}
                className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700"
              >
                Salvar Link
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              onClick={() => setShowQrModal(true)}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <QrCode className="w-3.5 h-3.5 text-slate-500" />
              QR Code
            </button>

            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold rounded-lg text-xs transition-colors border border-emerald-200 inline-flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              WhatsApp
            </a>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <QrCode className="w-5 h-5 text-purple-600" />
                QR Code de Acesso
              </h3>
              <button
                onClick={() => setShowQrModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Escaneie este QR code para abrir a pasta de suporte no seu celular ou tablet.
            </p>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex justify-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  dropboxUrl
                )}`}
                alt="QR Code Dropbox"
                className="w-48 h-48 rounded-lg shadow-xs"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowQrModal(false)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
