/**
 * Truesoft Support Manual Text Content & Downloader
 * Formatted as requested from the official support manual.
 */

export const TRUESOFT_MANUAL_TEXT = `======================================================================
TRUESOFT SISTEMAS - MANUAL DE FUNCIONAMENTO DO SUPORTE TÉCNICO
======================================================================

NOME DA EMPRESA:
Truesoft Sistemas

----------------------------------------------------------------------
FUNCIONAMENTO DO SUPORTE:
----------------------------------------------------------------------
Nosso atendimento técnico é estruturado para garantir agilidade e
eficiência, priorizando chamados críticos que afetam diretamente as
vendas e a operação da sua empresa. Os atendimentos são classificados
por nível de urgência (Vermelho, Amarelo e Verde).

----------------------------------------------------------------------
HORÁRIO DE FUNCIONAMENTO DO SUPORTE:
----------------------------------------------------------------------
• Segunda a Sexta: das 08:00 às 18:00
• Sábado: das 08:00 às 17:00

----------------------------------------------------------------------
CONTATOS DO SUPORTE:
----------------------------------------------------------------------
• Whatsapp do Suporte:
  (83) 98801-5825

• Central Telefônica do Suporte:
  (83) 3512-5825 ou (83) 3142-0007

----------------------------------------------------------------------
PLANTÃO TÉCNICO:
----------------------------------------------------------------------
• Plantão das 18:00 às 22:00 no telefone: (83) 98889-7051
  (Atendimento emergencial para chamados urgentes e sistema parado)

----------------------------------------------------------------------
PRAZOS DE ATENDIMENTO E PRIORIDADES:
----------------------------------------------------------------------
[VERMELHO - MUITO URGENTE]
• Prazo de atendimento: de 15 a 20 minutos (prioridade máxima imediata).
• Escopo:
  - Problemas no Caixa PDV (TEF, emissão de NFC-e, NF-e de vendas, devoluções);
  - MDF-e e Romaneio de entrega;
  - Sistema completamente indisponível ou travado.

[AMARELO - POUCO URGENTE]
• Prazo de atendimento: em até 1 (uma) Hora.
• Escopo:
  - Dúvidas gerais de operação (Financeiro, Comercial, Estoque e módulos);
  - Entrada de notas fiscais, ajustes de estoque e inventário;
  - Configuração ou ajustes de etiquetas de preço;
  - Instalação do sistema em novos computadores;
  - Instabilidades em módulos que não impeçam a venda imediata.
  * Obs: Correções técnicas dependem de prazo específico após análise.

[VERDE - NÃO URGENTE]
• Prazo de atendimento: Agendado de acordo com a necessidade da empresa.
• Escopo:
  - Solicitação de novos relatórios e ajustes em relatórios existentes;
  - Sugestão de novas funcionalidades (mediante viabilidade técnica);
  - Treinamento com novos colaboradores ou módulos ainda não utilizados;
  - Solicitação de visitas técnicas.

* Obs Geral: Todos os prazos podem ser encurtados de acordo com a
  disponibilidade imediata da equipe de analistas da Truesoft.

----------------------------------------------------------------------
ACESSO AO SISTEMA POWER GESTOR:
----------------------------------------------------------------------
Link de acesso direto:
https://app.powergestor.com

======================================================================
Truesoft Sistemas - Suporte Técnico Especializado
======================================================================
`;

/**
 * Downloads the support manual as a clean .txt file on the user's computer.
 */
export function downloadSupportManualTxt(filename = 'Manual_Suporte_Truesoft.txt') {
  // Use CRLF for Windows compatibility
  const normalizedText = TRUESOFT_MANUAL_TEXT.replace(/\r?\n/g, '\r\n');
  const blob = new Blob([normalizedText], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
