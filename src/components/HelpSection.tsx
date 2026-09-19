import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Download, ShieldCheck, LifeBuoy, FileQuestion } from 'lucide-react';

export const HelpSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "Preciso ter uma conta no Dropbox para baixar os arquivos?",
      answer: "Não! A pasta compartilhada é completamente pública. Caso o Dropbox exiba uma tela solicitando login ou cadastro, você pode simplesmente fechar o pop-up ou clicar em 'Ou continuar para o download'."
    },
    {
      question: "Como baixo um arquivo específico em vez da pasta toda?",
      answer: "Ao abrir a pasta no Dropbox (pelo botão 'Abrir no Dropbox' ou no visualizador), passe o mouse sobre o arquivo desejado e clique nos três pontinhos (...) ou no ícone de 'Download' ao lado dele."
    },
    {
      question: "Como faço para baixar todo o conteúdo de uma só vez?",
      answer: "Utilize o botão verde 'Baixar ZIP' no topo da página ou a opção 'Download' no canto superior direito dentro da página do próprio Dropbox. Todos os arquivos serão compactados em um único arquivo .zip."
    },
    {
      question: "Os arquivos são atualizados com frequência?",
      answer: "Sim! Como este repositório está conectado ao Dropbox em tempo real, quaisquer novos arquivos, atualizações de programas ou correções adicionados pela equipe de suporte estarão disponíveis imediatamente para você."
    }
  ];

  return (
    <div id="help-faq-section" className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
      
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
          <LifeBuoy className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Ajuda &amp; Instruções de Uso</h2>
          <p className="text-xs text-slate-500">Dúvidas frequentes sobre o acesso aos arquivos no Dropbox.</p>
        </div>
      </div>

      {/* FAQ accordion */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openFaq === idx;
          return (
            <div
              key={idx}
              className="border border-slate-200/80 rounded-xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaq(isOpen ? null : idx)}
                className="w-full px-4 py-3 bg-slate-50/70 hover:bg-slate-100/80 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <span className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <FileQuestion className="w-4 h-4 text-blue-600 shrink-0" />
                  {faq.question}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 py-3 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Security & Access Notice */}
      <div className="bg-slate-900 text-slate-300 rounded-xl p-4 text-xs flex items-center gap-3 border border-slate-800">
        <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
        <div>
          <span className="font-semibold text-white block">Acesso Seguro &amp; Verificado</span>
          <span>
            Todos os arquivos contidos na pasta do Dropbox são verificados contra vírus e malware antes da disponibilização para download.
          </span>
        </div>
      </div>

    </div>
  );
};
