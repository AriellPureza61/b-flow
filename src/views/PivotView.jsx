import React, { useState, useMemo } from 'react';
import { TableProperties, Download, X, Search, Layers } from 'lucide-react';

export default function PivotView({ sellers, stores, recentSales, onExportCsv }) {
  const [rowDimension, setRowDimension] = useState('VENDEDOR'); // 'VENDEDOR' or 'LOJA'
  const [drillModalData, setDrillModalData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Column definitions based on the spreadsheet categories
  const columns = [
    { key: 'controle', label: 'Controle' },
    { key: 'pos', label: 'Pós' },
    { key: 'tv', label: 'Claro TV+' },
    { key: 'virtua', label: 'Vírtua Fibra' },
    { key: 'trocaAparelho', label: 'Aparelho' },
    { key: 'upgrade', label: 'Upgrade' },
    { key: 'migracaoControle', label: 'Migr. Controle' },
    { key: 'migracaoPos', label: 'Migr. Pós' },
    { key: 'comissoes', label: 'Plugins' },
    { key: 'servicos', label: 'Serviços' }
  ];

  // Aggregate rows by Vendedor
  const vendedorRows = useMemo(() => {
    return sellers.map((s) => ({
      id: s.id,
      name: s.nome,
      sublabel: `${s.loja} - ${s.lojaNome}`,
      controle: s.controle || 0,
      pos: s.pos || 0,
      tv: s.tv || 0,
      virtua: s.virtua || 0,
      trocaAparelho: s.trocaAparelho || 0,
      upgrade: s.upgrade || 0,
      migracaoControle: s.migracaoControle || 0,
      migracaoPos: s.migracaoPos || 0,
      comissoes: s.comissoes || 0,
      servicos: s.servicos || 0,
      total: s.total || 0
    }));
  }, [sellers]);

  // Aggregate rows by Loja
  const lojaRows = useMemo(() => {
    return stores.map((st) => {
      const storeSellers = sellers.filter((s) => s.loja === st.code);
      const acc = {
        id: st.code,
        name: `${st.code} - ${st.name}`,
        sublabel: `${st.city} • Coord: ${st.coordinator || 'Padrão'}`,
        controle: storeSellers.reduce((sum, s) => sum + (s.controle || 0), 0),
        pos: storeSellers.reduce((sum, s) => sum + (s.pos || 0), 0),
        tv: storeSellers.reduce((sum, s) => sum + (s.tv || 0), 0),
        virtua: storeSellers.reduce((sum, s) => sum + (s.virtua || 0), 0),
        trocaAparelho: storeSellers.reduce((sum, s) => sum + (s.trocaAparelho || 0), 0),
        upgrade: storeSellers.reduce((sum, s) => sum + (s.upgrade || 0), 0),
        migracaoControle: storeSellers.reduce((sum, s) => sum + (s.migracaoControle || 0), 0),
        migracaoPos: storeSellers.reduce((sum, s) => sum + (s.migracaoPos || 0), 0),
        comissoes: storeSellers.reduce((sum, s) => sum + (s.comissoes || 0), 0),
        servicos: storeSellers.reduce((sum, s) => sum + (s.servicos || 0), 0),
        total: storeSellers.reduce((sum, s) => sum + (s.total || 0), 0)
      };
      return acc;
    });
  }, [stores, sellers]);

  const activeRows = (rowDimension === 'VENDEDOR' ? vendedorRows : lojaRows).filter((r) =>
    searchTerm === '' ||
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.sublabel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Column totals
  const colTotals = useMemo(() => {
    const res = {};
    columns.forEach((col) => {
      res[col.key] = activeRows.reduce((sum, r) => sum + (r[col.key] || 0), 0);
    });
    res.total = activeRows.reduce((sum, r) => sum + (r.total || 0), 0);
    return res;
  }, [activeRows, columns]);

  // Handle cell click (Drill-down modal )
  const handleCellClick = (rowName, colKey, colLabel, value) => {
    if (value === 0) return;

    setDrillModalData({
      title: `${rowName} — ${colLabel}`,
      subtitle: `${value} registro(s) associado(s)`,
      rowName,
      colKey,
      colLabel,
      value
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm">
        <div>
          <h2 className="text-lg font-black text-[#1F2937] tracking-tight flex items-center gap-2">
            <span>Tabela Dinâmica (Visão Cruzada)</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#e6f7fb] text-[#0a1735] border border-[#bde8f4]">
              Modelo B.Flow
            </span>
          </h2>
          <p className="text-xs text-[#64748b] mt-0.5">
            Cruzamento dinâmico de produção. <strong>Clique em qualquer número</strong> para abrir o detalhamento.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-3 py-1.5 text-xs text-[#475569]">
            <span className="font-bold text-[#64748b]">Agrupar Linhas:</span>
            <select
              value={rowDimension}
              onChange={(e) => setRowDimension(e.target.value)}
              className="bg-transparent font-black text-[#1F2937] focus:outline-none cursor-pointer"
            >
              <option value="VENDEDOR">Por Vendedor ({sellers.length})</option>
              <option value="LOJA">Por Loja / PDV ({stores.length})</option>
            </select>
          </div>

          <div className="relative w-48">
            <Search className="w-3.5 h-3.5 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrar linha..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#f8fafc] border border-[#e2e8f0] rounded-xl focus:outline-none focus:border-[#0F214A]"
            />
          </div>
        </div>
      </div>

      {/* Dinâmica Table Card */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#fbfcfe] border-b border-[#dfe5ee] text-[#6d7a8e] font-extrabold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 min-w-[200px]">
                  {rowDimension === 'VENDEDOR' ? 'Consultor de Vendas' : 'Loja / Unidade'}
                </th>
                {columns.map((col) => (
                  <th key={col.key} className="py-3 px-2.5 text-center whitespace-nowrap">
                    {col.label}
                  </th>
                ))}
                <th className="py-3 px-4 text-right font-black text-[#1F2937] bg-[#f1f5f9]">
                  Total Geral
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {activeRows.map((r, idx) => (
                <tr key={r.id} className="hover:bg-[#f9fbfe] transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-extrabold text-[#1F2937] leading-tight">
                      {r.name}
                    </div>
                    <div className="text-[10px] text-[#64748b] mt-0.5">
                      {r.sublabel}
                    </div>
                  </td>

                  {columns.map((col) => {
                    const val = r[col.key];
                    return (
                      <td key={col.key} className="py-3 px-2.5 text-center font-bold">
                        {val > 0 ? (
                          <button
                            onClick={() => handleCellClick(r.name, col.key, col.label, val)}
                            className="text-[#00A6D4] hover:bg-[#ecf2ff] px-2 py-0.5 rounded-lg font-black transition-colors underline decoration-dotted underline-offset-4 cursor-pointer"
                            title={`Clique para detalhar ${col.label} de ${r.name}`}
                          >
                            {val}
                          </button>
                        ) : (
                          <span className="text-[#94a3b8] font-normal">-</span>
                        )}
                      </td>
                    );
                  })}

                  <td className="py-3 px-4 text-right font-black text-sm text-[#0F214A] bg-[#f9fbfe]">
                    {r.total}
                  </td>
                </tr>
              ))}
            </tbody>

            {/* Total Footer  */}
            <tfoot>
              <tr className="bg-[#1F2937] text-white font-black text-xs">
                <td className="py-3 px-4">TOTAL GERAL ({activeRows.length} registros)</td>
                {columns.map((col) => (
                  <td key={col.key} className="py-3 px-2.5 text-center">
                    {colTotals[col.key]}
                  </td>
                ))}
                <td className="py-3 px-4 text-right text-sm text-yellow-300">
                  {colTotals.total}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Drill-Down Modal ( #mDrill) */}
      {drillModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141c2a]/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl border border-[#e2e8f0] overflow-hidden">
            {/* Modal Head */}
            <div className="bg-[#0F214A] text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black tracking-tight">{drillModalData.title}</h3>
                <small className="text-xs opacity-90">{drillModalData.subtitle}</small>
              </div>
              <button
                onClick={() => setDrillModalData(null)}
                className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white text-white hover:text-[#0F214A] flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto flex-1 text-xs space-y-3">
              <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
                <span className="font-bold text-[#64748b] uppercase text-[10px] block">Detalhamento da Produção:</span>
                <p className="text-xs text-[#1F2937] font-semibold mt-0.5">
                  Esta categoria contabiliza <strong>{drillModalData.value}</strong> transações no período para <strong>{drillModalData.rowName}</strong>.
                </p>
              </div>

              <div className="border border-[#e2e8f0] rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[10px] uppercase font-bold text-[#64748b]">
                    <tr>
                      <th className="py-2.5 px-3">Origem</th>
                      <th className="py-2.5 px-3">Operação</th>
                      <th className="py-2.5 px-3 text-right">Qtd</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0]">
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-[#1F2937]">{drillModalData.rowName}</td>
                      <td className="py-2.5 px-3 text-[#475569]">{drillModalData.colLabel}</td>
                      <td className="py-2.5 px-3 text-right font-black text-[#0F214A]">{drillModalData.value}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Foot */}
            <div className="p-4 bg-[#fafbfd] border-t border-[#e2e8f0] flex items-center justify-between">
              <span className="text-xs text-[#64748b]">Total filtrado: <strong>{drillModalData.value}</strong></span>
              <button
                onClick={() => setDrillModalData(null)}
                className="px-4 py-2 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#1F2937] font-bold rounded-xl text-xs transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
