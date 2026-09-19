import { VideoLesson } from '../types';

export const DEFAULT_VIMEO_CHANNEL = "https://vimeo.com/powergestor";

export const DEFAULT_VIDEO_LESSONS: VideoLesson[] = [
  {
    id: "aula-01",
    number: 1,
    title: "Apresentação e Primeiros Passos no Power Gestor",
    module: "Introdução",
    url: "https://vimeo.com/powergestor",
    description: "Visão geral da interface, navegação e configurações iniciais do sistema.",
    duration: "10 min"
  },
  {
    id: "aula-02",
    number: 2,
    title: "Cadastro de Clientes, Fornecedores e Vendedores",
    module: "Cadastros",
    url: "https://vimeo.com/powergestor",
    description: "Como cadastrar e gerenciar dados cadastrais completos, limites de crédito e contatos.",
    duration: "12 min"
  },
  {
    id: "aula-03",
    number: 3,
    title: "Cadastro de Produtos, Preços e Código de Barras",
    module: "Cadastros",
    url: "https://vimeo.com/powergestor",
    description: "Cadastro de itens, tabelas de preços, unidades de medida e tributação básica.",
    duration: "15 min"
  },
  {
    id: "aula-04",
    number: 4,
    title: "Controle de Estoque e Entrada por XML de NF-e",
    module: "Estoque",
    url: "https://vimeo.com/powergestor",
    description: "Importação automática de notas de compra via XML, manifesto de notas e ajuste de estoque.",
    duration: "18 min"
  },
  {
    id: "aula-05",
    number: 5,
    title: "Frente de Caixa (PDV) e Venda Rápida",
    module: "Faturamento",
    url: "https://vimeo.com/powergestor",
    description: "Abertura e fechamento de caixa, leitura de código de barras, sangria e suprimento.",
    duration: "14 min"
  },
  {
    id: "aula-06",
    number: 6,
    title: "Emissão de NFC-e (Cupom Fiscal Eletrônico)",
    module: "Faturamento",
    url: "https://vimeo.com/powergestor",
    description: "Emissão, cancelamento e contingência de NFC-e no ponto de venda.",
    duration: "11 min"
  },
  {
    id: "aula-07",
    number: 7,
    title: "Emissão de NF-e (Nota Fiscal Grande) e Tributação",
    module: "Fiscal",
    url: "https://vimeo.com/powergestor",
    description: "Regras de ICMS, PIS, COFINS, CFOP, emissão de Danfe e envio automático de XML.",
    duration: "20 min"
  },
  {
    id: "aula-08",
    number: 8,
    title: "Emissão de NFS-e (Nota Fiscal de Serviços)",
    module: "Fiscal",
    url: "https://vimeo.com/powergestor",
    description: "Emissão de notas de prestação de serviços integradas ao município.",
    duration: "13 min"
  },
  {
    id: "aula-09",
    number: 9,
    title: "Vendas, Orçamentos e Pedidos",
    module: "Comercial",
    url: "https://vimeo.com/powergestor",
    description: "Geração de orçamentos, conversão em vendas, faturamento e impressão de comprovantes.",
    duration: "16 min"
  },
  {
    id: "aula-10",
    number: 10,
    title: "Ordem de Serviço (OS) e Assistência Técnica",
    module: "Serviços",
    url: "https://vimeo.com/powergestor",
    description: "Abertura de chamados, laudo técnico, peças aplicadas e fechamento de OS.",
    duration: "17 min"
  },
  {
    id: "aula-11",
    number: 11,
    title: "Financeiro: Contas a Pagar e Contas a Receber",
    module: "Financeiro",
    url: "https://vimeo.com/powergestor",
    description: "Lançamentos, baixas parciais e totais, juros, descontos e controle de inadimplência.",
    duration: "19 min"
  },
  {
    id: "aula-12",
    number: 12,
    title: "Fluxo de Caixa, DRE e Relatórios Gerenciais",
    module: "Financeiro",
    url: "https://vimeo.com/powergestor",
    description: "Análise de lucratividade, despesas por categoria e demonstrativos para tomada de decisão.",
    duration: "15 min"
  },
  {
    id: "aula-13",
    number: 13,
    title: "Usuários, Vendedores e Controle de Permissões",
    module: "Configurações",
    url: "https://vimeo.com/powergestor",
    description: "Criação de operadores, bloqueio de telas sensíveis e comissões por vendedor.",
    duration: "10 min"
  },
  {
    id: "aula-14",
    number: 14,
    title: "Backup, Restauração e Segurança de Dados",
    module: "Suporte",
    url: "https://vimeo.com/powergestor",
    description: "Rotinas de cópia de segurança em nuvem e restauração do banco de dados.",
    duration: "08 min"
  },
  {
    id: "aula-canal",
    number: 15,
    title: "Canal Oficial Completo no Vimeo",
    module: "Canal Geral",
    url: "https://vimeo.com/powergestor",
    description: "Acesso à página com todas as gravações, atualizações e transmissões do Power Gestor.",
    duration: "Canal"
  }
];
