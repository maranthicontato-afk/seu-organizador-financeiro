/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Home, 
  List, 
  Calendar, 
  MessageSquare, 
  ChevronLeft,
  Target,
  Wallet,
  TrendingDown,
  ChevronRight,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { Screen, Transaction, TransactionType, DayPlan, UserPlan, PLANS_DATA, CATEGORIES, FEEDBACK_CATEGORIES } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('HOME');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activePlan, setActivePlan] = useState<UserPlan | null>(null);
  const [goal, setGoal] = useState<number>(2000); // Exemplo de meta

  // Inicialização e Carregamento do LocalStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));

    const savedPlan = localStorage.getItem('activePlan');
    if (savedPlan) setActivePlan(JSON.parse(savedPlan));
  }, []);

  // Persistência
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('activePlan', JSON.stringify(activePlan));
  }, [activePlan]);

  const totalSpent = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, curr) => acc + curr.amount, 0);
  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = goal + totalIncome - totalSpent;

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      date: new Date().toISOString()
    };
    setTransactions([newTransaction, ...transactions]);
    setCurrentScreen('HOME');
  };

  const selectPlan = (planId: string) => {
    const planInfo = PLANS_DATA.find(p => p.id === planId);
    if (!planInfo) return;

    const newPlan: UserPlan = {
      id: planId,
      name: planInfo.name,
      days: planInfo.tasks.map((task, i) => ({
        day: i + 1,
        task,
        completed: false
      }))
    };
    setActivePlan(newPlan);
    setCurrentScreen('PLAN');
  };

  const toggleDay = (day: number) => {
    if (!activePlan) return;
    const updatedPlan = {
      ...activePlan,
      days: activePlan.days.map(d => d.day === day ? { ...d, completed: !d.completed } : d)
    };
    setActivePlan(updatedPlan);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'HOME':
        return <HomeScreen 
          totalSpent={totalSpent} 
          totalIncome={totalIncome}
          goal={goal} 
          balance={balance} 
          onNavigate={setCurrentScreen} 
        />;
      case 'ADD_EXPENSE':
        return <AddTransactionScreen 
          onAdd={addTransaction} 
          onBack={() => setCurrentScreen('HOME')} 
        />;
      case 'LIST':
        return <ListScreen 
          transactions={transactions} 
          onBack={() => setCurrentScreen('HOME')} 
        />;
      case 'PLAN':
        if (!activePlan) {
          return <PlanSelectionScreen onSelect={selectPlan} onBack={() => setCurrentScreen('HOME')} />;
        }
        return <PlanDetailScreen 
          plan={activePlan} 
          onToggle={toggleDay} 
          onReset={() => setActivePlan(null)}
          onBack={() => setCurrentScreen('HOME')} 
        />;
      case 'PLAN_SELECTION':
        return <PlanSelectionScreen onSelect={selectPlan} onBack={() => setCurrentScreen('HOME')} />;
      case 'FEEDBACK':
        const messages = getDynamicFeedback(transactions, goal, balance);
        return <FeedbackScreen 
          messages={messages}
          onBack={() => setCurrentScreen('HOME')} 
        />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Phone-like Container */}
      <div className="w-full max-w-[380px] bg-white/40 backdrop-blur-2xl rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/60 min-h-[720px] flex flex-col relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex-1 flex flex-col"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>

        {/* Bottom Navigation */}
        <nav className="bg-white/40 backdrop-blur-md border-t border-white/20 px-8 py-4 flex justify-between items-center z-50">
          <NavButton active={currentScreen === 'HOME'} icon={<Home size={22} />} onClick={() => setCurrentScreen('HOME')} />
          <NavButton active={currentScreen === 'LIST'} icon={<List size={22} />} onClick={() => setCurrentScreen('LIST')} />
          <NavButton active={currentScreen === 'PLAN' || currentScreen === 'PLAN_SELECTION'} icon={<Calendar size={22} />} onClick={() => setCurrentScreen('PLAN')} />
          <NavButton active={currentScreen === 'FEEDBACK'} icon={<MessageSquare size={22} />} onClick={() => setCurrentScreen('FEEDBACK')} />
        </nav>
      </div>
    </div>
  );
}

function NavButton({ active, icon, onClick }: { active: boolean, icon: React.ReactNode, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-2xl transition-all duration-300 ${
        active 
          ? 'text-neutral-800 bg-white/60 shadow-sm border border-white/40' 
          : 'text-neutral-400 hover:text-neutral-600'
      }`}
    >
      {icon}
    </button>
  );
}

// --- SUB-SCREENS ---

function HomeScreen({ totalSpent, totalIncome, goal, balance, onNavigate }: { 
  totalSpent: number; 
  totalIncome: number;
  goal: number; 
  balance: number; 
  onNavigate: (s: Screen) => void 
}) {
  return (
    <div className="flex-1 flex flex-col">
      <header className="p-6 text-center font-bold text-lg text-neutral-600 tracking-tight shrink-0">
        Início
      </header>
      
      <div className="px-6 pb-6 flex flex-col flex-1 overflow-y-auto">
        <div className="space-y-3 mb-8">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#99F6E4]/50 backdrop-blur-md p-5 rounded-2xl border border-white/40">
              <div className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold mb-2">Total Entrada</div>
              <p className="text-xl font-bold text-[#0D9488]">R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-[#BAE6FD]/50 backdrop-blur-md p-5 rounded-2xl border border-white/40">
              <div className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold mb-2">Total Saída</div>
              <p className="text-xl font-bold text-[#0369A1]">R$ {totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>

          <div className="bg-white/30 backdrop-blur-md p-6 rounded-2xl border border-white/40">
            <div className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold mb-2">Meta</div>
            <p className="text-2xl font-bold text-neutral-700">R$ {goal.toLocaleString('pt-BR')}</p>
          </div>

          <div className="bg-white/30 backdrop-blur-md p-6 rounded-2xl border border-white/40">
            <div className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold mb-2">Saldo</div>
            <p className={`text-2xl font-bold ${balance < 0 ? 'text-[#0369A1]' : 'text-[#0D9488]'}`}>
              R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="mt-auto space-y-3">
          <button 
            onClick={() => onNavigate('ADD_EXPENSE')}
            className="w-full bg-gradient-to-r from-[#BAE6FD] to-[#99F6E4] text-[#0369A1] py-4 px-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest shadow-lg shadow-blue-200/50 active:scale-95 transition-all border border-white/40"
          >
            + Adicionar registro
          </button>

          <button 
            onClick={() => onNavigate('PLAN')}
            className="w-full bg-white/40 backdrop-blur-md text-[#0D9488] border border-white/60 py-4 px-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest active:scale-95 transition-all shadow-sm"
          >
            Plano 30 dias
          </button>
        </div>
      </div>
    </div>
  );
}

function AddTransactionScreen({ onAdd, onBack }: { onAdd: (e: any) => void; onBack: () => void }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [observation, setObservation] = useState('');
  const [type, setType] = useState<TransactionType>('EXPENSE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    onAdd({
      amount: parseFloat(amount.replace(',', '.')),
      category,
      observation,
      type
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      <header className="p-6 text-center font-bold text-lg text-neutral-600 tracking-tight relative shrink-0">
        <button onClick={onBack} className="absolute left-6 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-neutral-600 transition-colors bg-white/40 rounded-xl border border-white/60 shadow-sm transition-all active:scale-95">
          <ChevronLeft size={20} />
        </button>
        Novo Registro
      </header>

      <div className="p-6 flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="space-y-6">
            <div className="flex bg-white/30 backdrop-blur-md p-1.5 rounded-2xl border border-white/40">
              <button
                type="button"
                onClick={() => setType('EXPENSE')}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
                  type === 'EXPENSE' ? 'bg-[#BAE6FD] text-[#0369A1] shadow-sm border border-white/60' : 'text-neutral-400 hover:text-neutral-600'
                }`}
              >
                Saída
              </button>
              <button
                type="button"
                onClick={() => setType('INCOME')}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
                  type === 'INCOME' ? 'bg-[#99F6E4] text-[#0D9488] shadow-sm border border-white/60' : 'text-neutral-400 hover:text-neutral-600'
                }`}
              >
                Entrada
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">Valor</label>
              <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl p-4 shadow-sm">
                 <input 
                  type="text" 
                  inputMode="decimal"
                  placeholder="R$ 0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-transparent border-none focus:outline-none text-lg font-bold text-neutral-700 placeholder:text-neutral-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">Categoria</label>
              <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl p-4 shadow-sm relative">
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-transparent border-none focus:outline-none text-sm font-bold text-neutral-600 appearance-none bg-none"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronRight size={16} className="text-neutral-300 rotate-90" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">Observação</label>
              <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl p-4 shadow-sm">
                <textarea 
                  placeholder="No que você pensou?"
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  className="w-full bg-transparent border-none focus:outline-none text-sm font-medium text-neutral-600 h-24 resize-none placeholder:text-neutral-300"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="mt-auto w-full bg-gradient-to-r from-[#BAE6FD] to-[#99F6E4] text-[#0369A1] py-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest shadow-lg shadow-blue-200/50 active:scale-95 transition-all border border-white/40"
          >
            Salvar Registro
          </button>
        </form>
      </div>
    </div>
  );
}

function ListScreen({ transactions, onBack }: { transactions: Transaction[]; onBack: () => void }) {
  return (
    <div className="flex-1 flex flex-col">
      <header className="p-6 text-center font-bold text-lg text-neutral-600 tracking-tight relative shrink-0">
        <button onClick={onBack} className="absolute left-6 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-neutral-600 transition-colors bg-white/40 rounded-xl border border-white/60">
          <ChevronLeft size={20} />
        </button>
        Extrato
      </header>

      <div className="p-6 flex-1 overflow-y-auto">
        {transactions.length === 0 ? (
          <div className="text-center py-20 bg-white/20 rounded-3xl border border-white/40 backdrop-blur-sm">
            <p className="text-neutral-400 text-xs font-semibold">Tudo vazio por aqui.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((exp) => (
              <div key={exp.id} className="p-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 flex justify-between items-center shadow-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${exp.type === 'INCOME' ? 'bg-[#0D9488] shadow-[0_0_8px_rgba(13,148,136,0.3)]' : 'bg-[#0369A1] shadow-[0_0_8px_rgba(3,105,161,0.3)]'}`} />
                    <p className="text-xs font-bold text-neutral-700">{exp.category}</p>
                  </div>
                  <p className="text-[10px] font-medium text-neutral-400">
                    {new Date(exp.date).toLocaleDateString('pt-BR')} • {new Date(exp.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <p className={`text-sm font-bold ${exp.type === 'INCOME' ? 'text-[#0D9488]' : 'text-neutral-700'}`}>
                  {exp.type === 'INCOME' ? '+' : '-'}R$ {exp.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PlanSelectionScreen({ onSelect, onBack }: { onSelect: (id: string) => void; onBack: () => void }) {
  return (
    <div className="flex-1 flex flex-col">
      <header className="p-6 text-center font-bold text-lg text-neutral-600 tracking-tight relative shrink-0">
        <button onClick={onBack} className="absolute left-6 top-1/2 -translate-y-1/2 p-2 text-neutral-400 border border-white/60 bg-white/40 rounded-xl">
          <ChevronLeft size={20} />
        </button>
        Seu Plano
      </header>

      <div className="p-6 flex-1 flex flex-col justify-center space-y-4">
        {PLANS_DATA.map((plan) => (
          <button
            key={plan.id}
            onClick={() => onSelect(plan.id)}
            className="w-full bg-white/40 backdrop-blur-md border border-white/60 p-6 rounded-[24px] text-left hover:border-purple-300 transition-all group shadow-sm"
          >
            <h3 className="font-extrabold text-sm mb-1.5 tracking-tight text-neutral-700 uppercase">{plan.name}</h3>
            <p className="text-[11px] text-neutral-500 font-medium leading-relaxed mb-5">{plan.focus}</p>
            <div className="flex items-center text-[10px] font-bold text-[#0D9488] uppercase tracking-widest">
              Iniciar jornada <ChevronRight size={14} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function PlanDetailScreen({ plan, onToggle, onReset, onBack }: { plan: UserPlan; onToggle: (d: number) => void; onReset: () => void; onBack: () => void }) {
  const completedCount = plan.days.filter(d => d.completed).length;
  const isFinished = completedCount === 30;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className="p-6 text-center font-bold text-lg text-neutral-600 tracking-tight relative shrink-0">
        <button onClick={onBack} className="absolute left-6 top-1/2 -translate-y-1/2 p-2 text-neutral-400 border border-white/60 bg-white/40 rounded-xl">
          <ChevronLeft size={20} />
        </button>
        Jornada 30D
      </header>
      
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="mb-6 bg-white/40 backdrop-blur-md p-6 rounded-[24px] border border-white/60 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Progresso</span>
            <span className="text-[10px] font-bold text-neutral-700">{completedCount}/30 Dias</span>
          </div>
          <div className="relative h-2 w-full bg-white/40 rounded-full overflow-hidden border border-white/20">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / 30) * 100}%` }}
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#BAE6FD] to-[#99F6E4]"
            />
          </div>
        </div>

        <div className="space-y-3 pb-32">
          {plan.days.map((day) => (
            <button
              key={day.day}
              onClick={() => onToggle(day.day)}
              className={`w-full flex items-start p-5 rounded-2xl text-xs transition-all border shadow-sm ${
                day.completed 
                  ? 'bg-[#99F6E4]/40 border-[#5EEAD4] text-[#0D9488]' 
                  : 'bg-white/40 border-white/60 text-neutral-700 hover:border-blue-300'
              }`}
            >
              <div className={`w-6 h-6 rounded-lg border shrink-0 mr-4 flex items-center justify-center transition-colors ${
                day.completed ? 'bg-[#0D9488] border-[#0D9488]' : 'bg-white/40 border-neutral-200'
              }`}>
                {day.completed && <CheckCircle2 size={14} className="text-white" />}
              </div>
              <div className="text-left">
                <span className="block text-[9px] font-bold uppercase opacity-50 mb-1 tracking-widest">Dia {day.day}</span>
                <span className="font-bold leading-relaxed">{day.task}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {isFinished && (
        <div className="absolute inset-x-0 bottom-0 p-6 bg-white/20 backdrop-blur-xl border-t border-white/40 z-20">
          <div className="bg-[#99F6E4]/60 p-5 rounded-2xl mb-4 border border-white/40 text-center shadow-sm">
             <p className="text-xs font-bold text-[#0D9488] leading-relaxed">
               {plan.id === 'sufoco' ? '“Agora você não vive mais no sufoco”' : 
                plan.id === 'sobrar' ? '“A sensação de progresso é real!”' : 
                '“Seu comportamento mudou para sempre!”'}
             </p>
          </div>
          <button 
            onClick={onReset}
            className="w-full bg-black text-white py-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest shadow-lg"
          >
            Escolher novo plano
          </button>
        </div>
      )}
    </div>
  );
}

function getDynamicFeedback(transactions: Transaction[], goal: number, balance: number): string[] {
  const result: string[] = [];
  const now = new Date();
  const hour = now.getHours();
  const todayStr = now.toISOString().split('T')[0];
  
  const transactionsToday = transactions.filter(t => t.date.startsWith(todayStr));
  const spentToday = transactionsToday.filter(t => t.type === 'EXPENSE').reduce((acc, curr) => acc + curr.amount, 0);
  
  // 1. Time Based
  if (hour >= 5 && hour < 12) {
    result.push(FEEDBACK_CATEGORIES.TIME_BASED.MORNING[Math.floor(Math.random() * FEEDBACK_CATEGORIES.TIME_BASED.MORNING.length)]);
  } else if (hour >= 12 && hour < 18) {
    result.push(FEEDBACK_CATEGORIES.TIME_BASED.AFTERNOON[Math.floor(Math.random() * FEEDBACK_CATEGORIES.TIME_BASED.AFTERNOON.length)]);
  } else {
    result.push(FEEDBACK_CATEGORIES.TIME_BASED.EVENING[Math.floor(Math.random() * FEEDBACK_CATEGORIES.TIME_BASED.EVENING.length)]);
  }

  // 2. Behavioral
  if (transactionsToday.length === 0) {
    result.push(FEEDBACK_CATEGORIES.ANTI_PROCRASTINATION[Math.floor(Math.random() * FEEDBACK_CATEGORIES.ANTI_PROCRASTINATION.length)]);
  } else if (spentToday > goal / 30) { // Limit for a day assuming monthly goal
    result.push(FEEDBACK_CATEGORIES.RISK[Math.floor(Math.random() * FEEDBACK_CATEGORIES.RISK.length)]);
  } else if (balance > 0) {
    result.push(FEEDBACK_CATEGORIES.MOTIVATIONAL[Math.floor(Math.random() * FEEDBACK_CATEGORIES.MOTIVATIONAL.length)]);
  }

  // 3. Goal/Conscience
  if (Math.random() > 0.5) {
    result.push(FEEDBACK_CATEGORIES.GOAL[Math.floor(Math.random() * FEEDBACK_CATEGORIES.GOAL.length)]);
  } else {
    result.push(FEEDBACK_CATEGORIES.CONSCIENCE[Math.floor(Math.random() * FEEDBACK_CATEGORIES.CONSCIENCE.length)]);
  }

  // Specific Savings Feedback
  if (spentToday > 0) {
    result.push(`Você está no controle hoje. Já registrou R$ ${spentToday.toLocaleString('pt-BR')} em gastos.`);
  }

  return [...new Set(result)].slice(0, 3); // Return up to 3 unique messages
}

function FeedbackScreen({ messages, onBack }: { messages: string[]; onBack: () => void }) {
  return (
    <div className="flex-1 flex flex-col">
      <header className="p-6 text-center font-bold text-lg text-neutral-600 tracking-tight relative shrink-0">
        <button onClick={onBack} className="absolute left-6 top-1/2 -translate-y-1/2 p-2 text-neutral-400 border border-white/60 bg-white/40 rounded-xl">
          <ChevronLeft size={20} />
        </button>
        Dicas e Insights
      </header>

      <div className="p-6 flex-1 flex flex-col justify-center space-y-5">
        {messages.map((msg, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`${
              i === 0 ? 'bg-white/40 border border-white/60 text-neutral-700' : 
              i === 1 ? 'bg-[#BAE6FD]/50 border border-[#7DD3FC] text-[#0369A1]' : 
              'bg-[#99F6E4]/50 border border-[#5EEAD4] text-[#0D9488]'
            } p-6 rounded-[24px] text-[13px] leading-relaxed font-bold text-center shadow-sm backdrop-blur-sm`}
          >
            {msg}
          </motion.div>
        ))}
        
        {messages.length === 0 && (
          <p className="text-center text-xs font-bold text-neutral-400 uppercase tracking-widest">Aguardando novos dados...</p>
        )}
      </div>
    </div>
  );
}

