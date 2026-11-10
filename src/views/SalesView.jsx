import React, { useState, useMemo } from 'react';
import { Search, Plus, Trash2, Edit2, FileText, Check, X, Upload } from 'lucide-react';

export default function SalesView({
  productSummary,
  sellers,
  stores,
  recentSales,
  onOpenNewSale,
  onUpdateSale,
  onDeleteSale,
  onBatchImportSales,
  selectedStoreFilter,
  selectedCoordinatorFilter
}) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSale, setEditingSale] = useState(null);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [pasteText, setPasteText] = useState('');

  // Filter sellers
  const filteredSellers = useMemo(() => {
    return sellers.filter((s) => {
      const matchStore = selectedStoreFilter === 'ALL' || s.loja === selectedStoreFilter;
      const matchCoord = selectedCoordinatorFilter === 'ALL' || s.coordenador === selectedCoordinatorFilter;
      const matchSearch = searchTerm === '' ||
        s.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.lojaNome.toLowerCase().includes(searchTerm.toLowerCase());
      return matchStore && matchCoord && matchSearch;
    });
  }, [sellers, selectedStoreFilter, selectedCoordinatorFilter, searchTerm]);

  // Filter sales
  const filteredSales = useMemo(() => {
    return recentSales.filter((r) => {
      const matchStore = selectedStoreFilter === 'ALL' || r.loja === selectedStoreFilter;
      const matchCategory = selectedCategory === 'ALL' || r.tipo.includes(selectedCategory);
      const matchSearch = searchTerm === '' ||
        r.vendedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.plano.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.lojaNome.toLowerCase().includes(searchTerm.toLowerCase());
      return matchStore && matchCategory && matchSearch;
    });
  }, [recentSales, selectedStoreFilter, selectedCategory, searchTerm]);

  const categories = [
    { id: 'ALL', label: 'Todas as Categorias' },
    { id: 'Ativação Controle', label: 'Controle' },
    { id: 'Ativação Pós', label: 'Pós-Pago' },
    { id: 'Instalação TV', label: 'Claro TV+' },
    { id: 'Instalação Vírtua', label: 'Vírtua Fibra' },
    { id: 'Troca de Aparelho', label: 'Aparelho' },
    { id: 'Upgrade de Plano', label: 'Upgrades' },
    { id: 'Migração', label: 'Migrações' },
    { id: 'Comissões Adicionais', label: 'Plugins & Portab.' },
    { id: 'Serviços Gerais', label: 'SimCard & Proteção' }
  ];

  const handlePasteImport = (e) => {
    e.preventDefault();
    if (!pasteText.trim()) return;

    // Parses lines like: Vendedor, Loja, Tipo, Plano, Qtd
    const lines = pasteText.split('\n').filter((l) => l.trim().length > 0);
    const imported = [];

    lines.forEach((line, idx) => {
      const parts = line.split(/[,\t;]/).map((p) => p.trim());
      if (parts.length >= 2) {
        imported.push({
          id: `IMP-${Date.now()}-${idx}`,
          data: new Date().toISOString().slice(0, 10),
          vendedor: parts[0] || 'Consultor',
          loja: parts[1] || 'PDV',
          lojaNome: parts[1] || 'PDV',
          tipo: parts[2] || 'Ativação Controle',
          plano: parts[3] || 'Plano Padrão',
          qtd: Number(parts[4]) || 1
        });
      }
    });

    if (imported.length > 0) {
      onBatchImportSales(imported);
      setIsPasteModalOpen(false);
      setPasteText('');
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header with CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Central de Produção & Vendas</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-sky-50 text-[#0F214A] border border-sky-200">
              Lançamentos & Histórico
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Lançamento, edição, exclusão e importação em lote para total autonomia da sua operação.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsPasteModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl shadow-xs transition-all"
            title="Importar linhas copiadas do Excel"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Colar da Planilha</span>
          </button>

          <button
            onClick={onOpenNewSale}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0F214A] hover:bg-[#B81D12] text-white text-xs font-bold rounded-xl shadow-md shadow-slate-900/10 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Venda</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-[#0F214A] text-white border-[#0F214A] shadow-sm shadow-slate-900/10'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Editable Transactions List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Registros de Vendas e Produção
            </h3>
            <p className="text-xs text-slate-500">
              Mostrando {filteredSales.length} transações registradas
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por vendedor, plano ou loja..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-[#0F214A] focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4">Vendedor</th>
                <th className="py-3 px-3">Loja / PDV</th>
                <th className="py-3 px-3">Tipo de Operação</th>
                <th className="py-3 px-4">Serviço / Plano</th>
                <th className="py-3 px-3 text-center">Qtd</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-xs text-slate-400">
                    Nenhum lançamento encontrado. Clique em "+ Nova Venda" para adicionar.
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {sale.data}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-slate-900">
                      {sale.vendedor}
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      <span className="font-bold text-slate-900">{sale.loja}</span> ({sale.lojaNome})
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-700 text-[11px]">
                        {sale.tipo}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {sale.plano}
                    </td>
                    <td className="py-3 px-3 text-center font-black text-sm text-[#0F214A]">
                      {sale.qtd}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100">
                        <button
                          onClick={() => setEditingSale(sale)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#0F214A] hover:bg-sky-50 transition-colors"
                          title="Editar lançamento"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Deseja excluir este registro de venda?')) {
                              onDeleteSale(sale.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Excluir lançamento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Sale Modal */}
      {editingSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-extrabold text-slate-900">
                Editar Lançamento de Venda
              </h3>
              <button onClick={() => setEditingSale(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateSale(editingSale);
                setEditingSale(null);
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome do Vendedor</label>
                <input
                  type="text"
                  value={editingSale.vendedor}
                  onChange={(e) => setEditingSale({ ...editingSale, vendedor: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Loja / PDV</label>
                  <select
                    value={editingSale.loja}
                    onChange={(e) => {
                      const code = e.target.value;
                      const st = stores.find((s) => s.code === code);
                      setEditingSale({
                        ...editingSale,
                        loja: code,
                        lojaNome: st ? st.name : code
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    {stores.map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.code} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Data</label>
                  <input
                    type="date"
                    value={editingSale.data}
                    onChange={(e) => setEditingSale({ ...editingSale, data: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tipo de Operação</label>
                <input
                  type="text"
                  value={editingSale.tipo}
                  onChange={(e) => setEditingSale({ ...editingSale, tipo: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Serviço / Plano</label>
                  <input
                    type="text"
                    value={editingSale.plano}
                    onChange={(e) => setEditingSale({ ...editingSale, plano: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quantidade</label>
                  <input
                    type="number"
                    min="1"
                    value={editingSale.qtd}
                    onChange={(e) => setEditingSale({ ...editingSale, qtd: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSale(null)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0F214A] hover:bg-[#B81D12] text-white font-bold rounded-xl shadow-md shadow-slate-900/10"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Paste from Excel Modal */}
      {isPasteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-extrabold text-slate-900">
                Colar Linhas Copiadas do Excel / CSV
              </h3>
              <button onClick={() => setIsPasteModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePasteImport} className="p-6 space-y-4 text-xs">
              <p className="text-slate-500">
                Copie as colunas do Excel e cole abaixo. Formato esperado por linha:<br />
                <code className="text-[#0F214A] font-bold">Vendedor, Código Loja, Tipo, Plano, Quantidade</code>
              </p>

              <textarea
                rows="6"
                placeholder="Exemplo:
JOAO SILVA, 3QCV, Ativação Controle, CLARO CONTROLE 25GB, 1
MARIA SOUZA, 9GWC, Instalação Vírtua, VIRTUA 600MB, 2"
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F214A]"
                required
              />

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPasteModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0F214A] hover:bg-[#B81D12] text-white font-bold rounded-xl shadow-md shadow-slate-900/10"
                >
                  Importar Linhas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
