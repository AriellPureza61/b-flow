import React from 'react';
import {
  Building2,
  Users,
  Key,
  Receipt,
  MapPin,
  CheckSquare,
  Settings,
  X
} from 'lucide-react';
import Logo from './Logo';

export const NAV_ITEMS = [
  { id: 'lojas', label: 'Lojas & PDVs', icon: Building2, countKey: 'stores' },
  { id: 'vendedores', label: 'Vendedores', icon: Users, countKey: 'vendedores' },
  { id: 'rcv', label: 'Base RCV', icon: Key, countKey: 'senhasRcv' },
  { id: 'reembolsos', label: 'Reembolsos', icon: Receipt, countKey: 'reembolsos' },
  { id: 'rotas', label: 'Rotas & Auditorias', icon: MapPin, countKey: 'rotas' },
  { id: 'pendencias', label: 'Pendências', icon: CheckSquare, countKey: 'pendencias' }
];

export default function Sidebar({ currentView, onViewChange, counts = {}, onClose }) {
  const renderItem = (item) => {
    const Icon = item.icon;
    const isActive = currentView === item.id;
    const count = item.countKey ? counts[item.countKey] : undefined;
    return (
      <button
        key={item.id}
        onClick={() => onViewChange(item.id)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm transition-all ${
          isActive
            ? 'bg-[#0F214A] text-white font-semibold shadow-md shadow-slate-900/15'
            : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F214A] font-medium'
        }`}
      >
        <span className="flex items-center gap-3 min-w-0">
          <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-[#22C55E]' : 'text-[#94a3b8]'}`} />
          <span className="truncate">{item.label}</span>
        </span>
        {count !== undefined && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isActive ? 'bg-white/15 text-white' : 'bg-[#F1F5F9] text-[#64748b]'
            }`}
          >
            {count}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="w-[250px] h-full bg-white border-r border-[#e2e8f0] flex flex-col bflow-sidebar">
      <div className="px-5 pt-6 pb-5 flex items-start justify-between">
        <Logo size="md" />
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-[#64748b] hover:bg-[#F1F5F9]">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
          Rotina do Gestor
        </div>
        {NAV_ITEMS.map(renderItem)}

        <div className="px-3 pt-5 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
          Sistema
        </div>
        {renderItem({ id: 'backup', label: 'Configurações', icon: Settings })}
      </nav>

      <div className="m-3 p-4 rounded-2xl bg-gradient-to-br from-[#0F214A] to-[#123a6b] text-white overflow-hidden relative">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-[#22C55E]/25 blur-xl" />
        <div className="text-xs font-semibold leading-snug relative">
          Simplificar a gestão.
          <br />
          Impulsionar <span className="text-[#22C55E]">resultados.</span>
        </div>
        <div className="mt-2 text-[10px] text-white/60 relative">{counts.stores || 0} lojas sob gestão</div>
      </div>
    </aside>
  );
}
