/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  observation: string;
  date: string;
  type: TransactionType;
}

export interface DayPlan {
  day: number;
  task: string;
  completed: boolean;
}

export interface UserPlan {
  id: string;
  name: string;
  days: DayPlan[];
}

export type Screen = 'HOME' | 'ADD_EXPENSE' | 'LIST' | 'PLAN' | 'FEEDBACK' | 'PLAN_SELECTION' | 'PROFILE';

export const PLANS_DATA = [
  {
    id: 'sufoco',
    name: 'SAIR DO SUFOCO',
    focus: 'Quem fica sem dinheiro antes do fim do mês',
    tasks: [
      "Anotar TODOS os gastos", "Não julgar, só registrar", "Ver onde mais gasta", "Identificar desperdícios", "Cortar 1 gasto inútil", "Repetir controle", "Revisão da semana",
      "Definir limite diário", "Evitar compras por impulso", "Regra dos 10 minutos antes de comprar", "Reduzir gastos pequenos", "Trocar hábitos caros por baratos", "Manter foco no limite", "Revisão da semana 2",
      "Separar necessidades vs desejos", "Criar limite por categoria", "Ajustar padrão de consumo", "Planejar gastos da semana", "Revisar limites", "Disciplina financeira", "Revisão da semana 3",
      "Manter consistência", "Criar sobra de dinheiro", "Revisão geral", "Planejar próximo mês", "Ajuste final de rota", "Foco no lucro", "Consistência total", "Independência de hábitos", "Vitória: Sair do sufoco!"
    ]
  },
  {
    id: 'sobrar',
    name: 'SOBRAR DINHEIRO',
    focus: 'Sensação de progresso rápido e economia',
    tasks: [
      "Descobrir pra onde vai seu dinheiro", "Economizar R$5", "Evitar 1 gasto desnecessário", "Revisar gastos do dia", "Guardar qualquer valor", "Trocar marca cara por barata", "Dia sem gastar moedas",
      "Analisar assinaturas esquecidas", "Levar marmita pro trabalho", "Comparar preços antes", "Economizar R$10", "Evitar lanche por impulso", "Revisar progresso", "Guardar a economia da semana",
      "Identificar gasto invisível", "Vender algo sem uso", "Dia sem delivery", "Pesquisar descontos", "Fazer lista de mercado", "Ignorar promoções 'imperdíveis'", "Avaliar sobras da semana",
      "Meta: Dobrar a economia", "Dia de lazer gratuito", "Evitar shopping", "Revisão de faturas", "Guardar lucro do mês", "Planejar sonhos reais", "Foco no objetivo", "Consolidar ganhos", "Vitória: Sobrou dinheiro!"
    ]
  },
  {
    id: 'reset',
    name: 'RESET FINANCEIRO 30D',
    focus: 'Mudança radical de comportamento',
    tasks: [
      "Reset mental (sem gasto por impulso)", "Detox de gastos", "Consumo consciente", "Eliminar 1 hábito caro", "Reprogramar decisões", "Análise de gatilhos mentais", "Revisão do detox",
      "Desafio zero consumo supérfluo", "Ajustar mentalidade de abundância", "Mapear desejos reais", "Blindagem contra marketing", "Organizar ambiente financeiro", "Repensar valor do tempo", "Revisão da quinzena",
      "Consumo minimalista", "Avaliar impacto ambiental do gasto", "Troca consciente de serviços", "Simplificar contas fixas", "Rever conceitos de luxo", "Praticar o desapego", "Nova ordem financeira",
      "Consistência comportamental", "Blindagem de patrimônio", "Visão de longo prazo", "Meta: Gasto inteligente", "Paz emocional com dinheiro", "Legado financeiro", "Autonomia total", "Maestria nas escolhas", "Vitória: Reset Completo!"
    ]
  }
];

export const CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Lazer',
  'Saúde',
  'Educação',
  'Casa',
  'Outros'
];

export const FEEDBACK_CATEGORIES = {
  CONSCIENCE: [
    "Você realmente precisa gastar hoje?",
    "Esse gasto te aproxima ou te afasta do seu objetivo?",
    "Pare 10 segundos antes de gastar."
  ],
  RISK: [
    "Você já gastou mais do que o ideal hoje 😬",
    "Se continuar assim, vai faltar dinheiro antes do fim do mês",
    "Cuidado: seus gastos estão aumentando"
  ],
  MOTIVATIONAL: [
    "Você está fazendo melhor que ontem 👏",
    "Pequenos controles geram grandes resultados",
    "Continue assim — você está no caminho certo"
  ],
  GOAL: [
    "Seu objetivo é fazer o dinheiro sobrar — não esqueça disso",
    "Cada escolha hoje impacta seu fim de mês",
    "Você quer controle ou arrependimento?"
  ],
  PROGRESS: [
    "Você está no controle",
    "Hoje é um bom dia para economizar",
    "Cada economia conta!"
  ],
  ANTI_PROCRASTINATION: [
    "Você ainda não registrou seus gastos hoje",
    "1 minuto agora pode te salvar no fim do mês",
    "Não deixe pra depois — registre agora"
  ],
  TIME_BASED: {
    MORNING: [
      "Hoje é um novo dia pra controlar seu dinheiro",
      "Defina um limite de gasto hoje"
    ],
    AFTERNOON: [
      "Cuidado com gastos impulsivos agora",
      "Você já registrou seus gastos de hoje?"
    ],
    EVENING: [
      "Revise seus gastos antes de dormir",
      "Você controlou bem seu dinheiro hoje?"
    ]
  }
};
