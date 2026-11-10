import React from 'react';
import { Search, Eraser, Building2, User, Filter } from 'lucide-react';

export default function FilterBar({
  stores,
  selectedStore,
  onSelectStore,
  selectedCoordinator,
  onSelectCoordinator,
  searchTerm,
  onSearchChange,
  onClearFilters,
  totalItemsCount,
  filteredItemsCount
}) {
  const isFiltered = selectedStore !== 'ALL' || selectedCoordinator !== 'ALL' || searchTerm !== '';

  return (
    <div className="bg-white border-b border-[#e2e8f0] px-4 sm:px-6 py-2.5 sticky top-[57px] z-20 shadow-xs select-none">
      <div className="max-w-[1600px] mx-auto flex flex-wrap items-center gap-2.5 sm:gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar loja, PDV, vendedor, cidade..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f8fafc] border border-[#e2e8f0] rounded-xl focus:bg-white focus:outline-none focus:border-[#0F214A] text-[#1F2937] transition-all"
          />
        </div>

        {/* Loja Filter Chip */}
        <div className="flex items-center gap-1.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-3 py-1.5 text-xs text-[#475569]">
          <Building2 className="w-3.5 h-3.5 text-[#64748b]" />
          <select
            value={selectedStore}
            onChange={(e) => onSelectStore(e.target.value)}
            className="bg-transparent font-bold text-xs focus:outline-none cursor-pointer pr-1 text-[#1F2937]"
          >
            <option value="ALL">Todas as Lojas ({stores.length})</option>
            {stores.map((s) => (
              <option key={s.code} value={s.code}>
                {s.code} - {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Coordenador Filter Chip */}
        <div className="flex items-center gap-1.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-3 py-1.5 text-xs text-[#475569]">
          <User className="w-3.5 h-3.5 text-[#64748b]" />
          <select
            value={selectedCoordinator}
            onChange={(e) => onSelectCoordinator(e.target.value)}
            className="bg-transparent font-bold text-xs focus:outline-none cursor-pointer pr-1 text-[#1F2937]"
          >
            <option value="ALL">Todos Coordenadores</option>
            <option value="Marcelo">Coord. Marcelo</option>
            <option value="Renata">Coord. Renata</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {isFiltered && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e2e8f0] hover:border-[#0F214A] text-[#0F214A] hover:bg-[#e6f7fb] rounded-xl text-xs font-black transition-all"
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>Limpar</span>
          </button>
        )}

        {/* Filter Info Status on the right */}
        <div className="ml-auto text-[11px] text-[#64748b] font-medium hidden sm:block">
          Mostrando <strong>{filteredItemsCount ?? stores.length}</strong> de <strong>{totalItemsCount ?? stores.length}</strong> registros
        </div>
      </div>
    </div>
  );
}
