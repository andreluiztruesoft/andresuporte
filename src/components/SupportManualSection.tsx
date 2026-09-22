import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Phone, 
  MessageSquare, 
  Clock, 
  AlertTriangle, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { downloadSupportManualTxt, TRUESOFT_MANUAL_TEXT } from '../utils/supportManual';

export const SupportManualSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    downloadSupportManualTxt('Manual_Suporte_Truesoft.txt');
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(TRUESOFT_MANUAL_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="support-manual-container" className="space-y-5">
      
      {/* Action Header Card with Download Button */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Manual de Suporte Técnico &bull; Truesoft
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Orientações sobre horários, telefones, prazos e prioridades de atendimento.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="copy-manual-text-btn"
              onClick={handleCopy}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700 transition-colors inline-flex items-center gap-1.5"
              title="Copiar texto completo"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Texto Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copiar Texto</span>
                </>
              )}
            </button>

            <button
              id="download-manual-txt-btn"
              onClick={handleDownload}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-all shadow-md shadow-emerald-600/20 active:scale-[0.99] inline-flex items-center gap-1.5 cursor-pointer"
              title="Baixar arquivo .txt para salvar na máquina do cliente"
            >
              {downloaded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Arquivo Baixado!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar Manual (.TXT)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Horários de Funcionamento */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Horário de Funcionamento
            </span>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Segunda a Sexta:</span>
                <span className="text-slate-200 font-medium">08:00 às 18:00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Sábado:</span>
                <span className="text-slate-200 font-medium">08:00 às 17:00</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-800/80">
                <span className="text-rose-400 font-semibold">Plantão (18h às 22h):</span>
                <span className="font-mono text-rose-300 font-semibold">(83) 98889-7051</span>
              </div>
            </div>
          </div>

          {/* Contatos do Suporte */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              Contatos do Suporte
            </span>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Whatsapp:</span>
                <span className="font-mono text-emerald-400 font-semibold">(83) 98801-5825</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Central Telefônica:</span>
                <span className="font-mono text-slate-200 font-semibold">(83) 3512-5825 / 3142-0007</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-800/80">
                <span className="text-slate-400">Plantão:</span>
                <span className="font-mono text-slate-200 font-semibold">(83) 98889-7051</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Prioridades de Atendimento */}
      <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-4 space-y-3">
        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-blue-400" />
          Classificação de Prioridades e Prazos
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Vermelho */}
          <div className="bg-rose-950/25 border border-rose-500/30 rounded-xl p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Muito Urgente
              </span>
              <span className="text-[10px] font-mono bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-bold">
                15 a 20 min
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Caixa/PDV parado, TEF, NFC-e/NF-e de vendas, MDF-e, sistema fora do ar.
            </p>
          </div>

          {/* Amarelo */}
          <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Pouco Urgente
              </span>
              <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                Até 1 Hora
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Dúvidas de uso, entrada de XML, etiquetas, estoque, instalação em nova máquina.
            </p>
          </div>

          {/* Verde */}
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Não Urgente
              </span>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                Agendado
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Novos relatórios, novas funções, treinamentos e agendamento de visitas.
            </p>
          </div>
        </div>
      </div>

      {/* Preview / Raw Text File Layout Card */}
      <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            Estrutura do Arquivo Manual_Suporte_Truesoft.txt
          </span>

          <button
            onClick={handleDownload}
            className="text-xs text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 font-medium"
          >
            <Download className="w-3 h-3" />
            <span>Baixar .TXT</span>
          </button>
        </div>

        <pre className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-56 leading-relaxed whitespace-pre-wrap selection:bg-blue-600">
          {TRUESOFT_MANUAL_TEXT}
        </pre>
      </div>

      {/* Links Power Gestor Footer Cards (Produção e Homologação) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Produção */}
        <div className="bg-slate-900/60 border border-slate-800/70 rounded-xl p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-xs font-semibold text-slate-200 block">
                Power Gestor &bull; Produção:
              </span>
              <code className="text-[11px] font-mono text-emerald-400 truncate block">
                app.powergestor.com
              </code>
            </div>
          </div>

          <a
            href="https://app.powergestor.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium inline-flex items-center gap-1 transition-colors shrink-0 cursor-pointer shadow-xs"
            title="Acessar Sistema Power Gestor (Produção)"
          >
            <span>Acessar</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Ambiente de Homologação */}
        <div className="bg-slate-900/60 border border-slate-800/70 rounded-xl p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-xs font-semibold text-slate-200 block">
                Power Gestor &bull; Homologação:
              </span>
              <code className="text-[11px] font-mono text-amber-400 truncate block">
                d2towid6322pn6.cloudfront.net
              </code>
            </div>
          </div>

          <a
            href="https://d2towid6322pn6.cloudfront.net/#/login"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 hover:text-amber-200 border border-amber-500/30 rounded-lg font-medium inline-flex items-center gap-1 transition-colors shrink-0 cursor-pointer shadow-xs"
            title="Acessar Power Gestor - Ambiente de Homologação"
          >
            <span>Acessar</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

    </div>
  );
};
