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

export interface Tip {
  title: string;
  message: string;
  detail: string;
  type: 'motivational' | 'warning' | 'info';
}

export const FEEDBACK_CATEGORIES = {
  CONSCIENCE: [
    { title: "Momento de Reflexão", message: "Você realmente precisa gastar hoje?", detail: "A impulsividade é a maior inimiga da economia. Antes de passar o cartão, se pergunte: 'Eu preciso disso agora ou posso esperar 24 horas?'", type: 'info' },
    { title: "Foco no Alvo", message: "Esse gasto te aproxima ou te afasta do seu objetivo?", detail: "Cada real gasto em algo supérfluo é um real a menos na sua liberdade financeira futura.", type: 'info' },
    { title: "Regra dos 10 Segundos", message: "Pare 10 segundos antes de gastar.", detail: "Respire fundo. Esse pequeno intervalo rompe o ciclo do impulso e ativa sua mente racional.", type: 'info' }
  ] as Tip[],
  RISK: [
    { title: "Alerta de Limite", message: "Você já gastou mais do que o ideal hoje 😬", detail: "Seus gastos diários ultrapassaram a média planejada. Tente compensar gastando zero amanhã.", type: 'warning' },
    { title: "Atenção ao Mês", message: "Se continuar assim, vai faltar dinheiro no fim do mês", detail: "O ritmo atual de gastos está insustentável para sua meta atual. Hora de puxar o freio.", type: 'warning' }
  ] as Tip[],
  MOTIVATIONAL: [
    { title: "Evolução Constante", message: "Você está fazendo melhor que ontem 👏", detail: "A consistência é mais importante que o valor. Continue registrando tudo com disciplina.", type: 'motivational' },
    { title: "Pequeno Grande Passo", message: "Pequenos controles geram grandes resultados", detail: "Não despreze as moedas. A riqueza é construída com a soma de pequenas economias diárias.", type: 'motivational' }
  ] as Tip[],
  DAILY_TIPS: [
    { title: "Dica do Dia: Café", message: "Que tal economizar no cafezinho hoje?", detail: "O gasto 'formiga' como café na rua pode somar mais de R$ 150 no fim do mês. Tente levar de casa!", type: 'info' },
    { title: "Dica do Dia: Marmita", message: "Levar almoço economiza tempo e dinheiro", detail: "Comer fora é um dos maiores ralos de dinheiro. Cozinhar em casa é saúde física e financeira.", type: 'motivational' },
    { title: "Dica do Dia: Assinaturas", message: "Revise seus streamings e assinaturas", detail: "Muitas vezes pagamos por serviços que não usamos. Cancele o que não é essencial hoje.", type: 'warning' },
    { title: "Dica do Dia: Listas", message: "Nunca vá ao mercado sem lista", detail: "Sem lista, você compra o que vê, não o que precisa. Planeje suas compras e economize até 30%.", type: 'info' }
  ] as Tip[]
};
