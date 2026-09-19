import React, { useState, useMemo } from 'react';
import { 
  Folder, 
  FileText, 
  Download, 
  ExternalLink, 
  Search, 
  Filter, 
  Wrench, 
  FileCode, 
  BookOpen, 
  HardDrive, 
  PackageCheck, 
  Copy, 
  Check, 
  ArrowUpRight,
  FolderOpen
} from 'lucide-react';
import { DropboxItem } from '../types';

interface FolderListProps {
  dropboxUrl: string;
  zipDownloadUrl: string;
  detectedItems: DropboxItem[];
  isLoading: boolean;
}

// Support folder categories default reference for clear user navigation
const DEFAULT_CATEGORIES = [
  {
    id: 'manuais',
    title: 'Manuais & Documentação',
    icon: BookOpen,
    color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    iconColor: 'text-amber-500',
    description: 'Manuais de uso, tutoriais de instalação, procedimentos e especificações técnicas.',
    tags: ['PDF', 'Manual', 'Instruções', 'Guia'],
  },
  {
    id: 'drivers',
    title: 'Drivers & Programas',
    icon: HardDrive,
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    iconColor: 'text-blue-500',
    description: 'Instaladores, drivers de impressoras e periféricos, executáveis de instalação.',
    tags: ['EXE', 'MSI', 'Driver', 'Instalador'],
  },
  {
    id: 'utilitarios',
    title: 'Utilitários & Ferramentas',
    icon: Wrench,
    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    iconColor: 'text-emerald-500',
    description: 'Ferramentas de diagnóstico, otimizadores, depuradores e assistentes de suporte.',
    tags: ['Suporte', 'Ferramenta', 'Diagnóstico'],
  },
  {
    id: 'scripts',
    title: 'Configurações & Scripts',
    icon: FileCode,
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    iconColor: 'text-purple-500',
    description: 'Arquivos de configuração (.ini, .json, .xml), scripts SQL e modelos de dados.',
    tags: ['SQL', 'Config', 'Script', 'INI'],
  },
  {
    id: 'atualizacoes',
    title: 'Atualizações & Patches',
    icon: PackageCheck,
    color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    iconColor: 'text-indigo-500',
    description: 'Pacotes de correção de bugs, versões mais recentes e notas de lançamento.',
    tags: ['Patch', 'Update', 'Versão', 'Hotfix'],
  },
];

export const FolderList: React.FC<FolderListProps> = ({
  dropboxUrl,
  zipDownloadUrl,
  detectedItems,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('todos');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Combine detected live items with category placeholders if list is light
  const displayItems = useMemo(() => {
    if (detectedItems && detectedItems.length > 0) {
      return detectedItems;
    }
    // Default fallback representation of support directory contents
    return [
      { name: '01 - Manuais e Tutoriais', isFolder: true, type: 'folder', description: 'Guias passo a passo em PDF e documentos explicativos' },
      { name: '02 - Instaladores e Drivers', isFolder: true, type: 'folder', description: 'Programas principais e componentes de suporte' },
      { name: '03 - Utilitarios e Ferramentas', isFolder: true, type: 'folder', description: 'Softwares auxiliares para diagnóstico e manutenção' },
      { name: '04 - Scripts e Base SQL', isFolder: true, type: 'folder', description: 'Scripts de atualização de banco de dados e rotinas' },
      { name: '05 - Modelos e Templates', isFolder: true, type: 'folder', description: 'Templates de importação e exportação de dados' },
      { name: '06 - Atualizacoes e Hotfixes', isFolder: true, type: 'folder', description: 'Pacotes com as melhorias e correções recentes' },
    ];
  }, [detectedItems]);

  const filteredItems = useMemo(() => {
    return displayItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
      if (selectedTag === 'todos') return matchesSearch;
      if (selectedTag === 'pastas') return matchesSearch && item.isFolder;
      if (selectedTag === 'arquivos') return matchesSearch && !item.isFolder;
      return matchesSearch;
    });
  }, [displayItems, searchTerm, selectedTag]);

  const handleCopyName = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div id="folder-list-container" className="space-[#1e293b] space-y-6">
      
      {/* Search & Filtering Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="folder-search-input"
              type="text"
              placeholder="Buscar pasta ou arquivo de suporte..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-sm text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded-md"
              >
                Limpar
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:inline-block" />
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium text-slate-600">
              <button
                onClick={() => setSelectedTag('todos')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedTag === 'todos' ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'hover:text-slate-900'
                }`}
              >
                Todos ({displayItems.length})
              </button>
              <button
                onClick={() => setSelectedTag('pastas')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedTag === 'pastas' ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'hover:text-slate-900'
                }`}
              >
                Pastas
              </button>
              <button
                onClick={() => setSelectedTag('arquivos')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedTag === 'arquivos' ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'hover:text-slate-900'
                }`}
              >
                Arquivos
              </button>
            </div>
          </div>
        </div>

        {/* Quick info status */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Exibindo <strong className="text-slate-700">{filteredItems.length}</strong> itens encontrados
          </span>
          <a
            href={dropboxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
          >
            Acessar repositório completo
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Primary Category Grid Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-blue-600" />
          Categorias de Suporte &amp; Conteúdo
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEFAULT_CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all hover:border-blue-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl border ${cat.color} flex items-center justify-center`}>
                      <IconComponent className={`w-6 h-6 ${cat.iconColor}`} />
                    </div>
                    <a
                      href={dropboxUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 group-hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"
                      title="Explorar no Dropbox"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {cat.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href={dropboxUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                  >
                    Abrir
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Folder Items Cards / List */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Folder className="w-5 h-5 text-amber-500 fill-amber-500/20" />
            Estrutura da Pasta Compartilhada
          </h2>
          <a
            href={zipDownloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-slate-700 hover:text-blue-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm inline-flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            Baixar Todos em ZIP
          </a>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-medium text-slate-600">Sincronizando estrutura de pastas com o Dropbox...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-2">
            <Search className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-medium text-slate-700">Nenhum item encontrado para "{searchTerm}"</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedTag('todos'); }}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              Resetar filtros de busca
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-sm hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2.5 rounded-xl ${item.isFolder ? 'bg-amber-500/10 text-amber-600' : 'bg-blue-500/10 text-blue-600'} shrink-0`}>
                    {item.isFolder ? (
                      <Folder className="w-5 h-5 fill-amber-500/20" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                      {item.description || (item.isFolder ? 'Pasta compartilhada de suporte' : 'Arquivo de recursos')}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleCopyName(item.name, idx)}
                    className="text-slate-400 hover:text-slate-700 inline-flex items-center gap-1"
                    title="Copiar nome do item"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600 font-medium">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar nome</span>
                      </>
                    )}
                  </button>

                  <a
                    href={dropboxUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
                  >
                    <span>Acessar</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
