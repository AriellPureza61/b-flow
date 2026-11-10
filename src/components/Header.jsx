import React from 'react';
import { Menu, Sun, Moon, Clock } from 'lucide-react';
import Logo from './Logo';

const TITLES = {
  lojas: 'Lojas & PDVs',
  vendedores: 'Vendedores & Acessos',
  rcv: 'Base de Senhas RCV',
  reembolsos: 'Reembolsos',
  rotas: 'Rotas & Auditorias',
  pendencias: 'Pendências',
  backup: 'Configurações & Backup'
};

export default function Header({ currentView, lastUpdated, darkMode, onToggleDarkMode, onOpenMenu }) {
  const formattedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : 'Hoje';

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-[#e2e8f0] bflow-topbar">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMenu}
            className="lg:hidden p-2 rounded-xl border border-[#e2e8f0] text-[#0F214A] hover:bg-[#F1F5F9]"
            title="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="lg:hidden">
            <Logo size="sm" showTagline={false} />
          </div>
          <h1 className="hidden lg:block text-xl font-bold text-[#0F214A] truncate">
            {TITLES[currentView] || 'Painel'}
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-[#64748b] font-medium bg-[#F1F5F9] px-3 py-1.5 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            <span>Atualizado em {formattedDate}</span>
          </div>
          <button
            onClick={onToggleDarkMode}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#e2e8f0] text-[#0F214A] hover:bg-[#F1F5F9] text-xs font-semibold transition-all active:scale-95"
            title="Mudar cor do sistema (Claro / Escuro)"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            <span className="hidden sm:inline">{darkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
          </button>
        </div>
      </div>
      {/* Título da tela no celular */}
      <div className="lg:hidden px-4 pb-3 -mt-1 text-base font-bold text-[#0F214A]">
        {TITLES[currentView] || 'Painel'}
      </div>
    </header>
  );
}
