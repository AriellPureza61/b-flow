import React, { useState, useMemo } from 'react';
import { Trophy, Plus, Search, Edit2, Trash2, X } from 'lucide-react';

export default function SellersView({ sellers, onAddSeller, onUpdateSeller, onDeleteSeller, stores, selectedStoreFilter, selectedCoordinatorFilter }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSeller, setEditingSeller] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [newSeller, setNewSeller] = useState({
    nome: '',
    loja: stores[0]?.code || 'PDV',
    coordenador: 'Marcelo',
    total: 0,
    tv: 0,
    virtua: 0,
    controle: 0,
    pos: 0,
    upgrade: 0,
    trocaAparelho: 0
  });

  const filteredSellers = useMemo(() => {
    return sellers.filter((s) => {
      const matchStore = selectedStoreFilter === 'ALL' || s.loja === selectedStoreFilter;
      const matchCoord = selectedCoordinatorFilter === 'ALL' || s.coordenador === selectedCoordinatorFilter;
      const matchSearch = searchTerm === '' ||
        s.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.lojaNome && s.lojaNome.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchStore && matchCoord && matchSearch;
    });
  }, [sellers, selectedStoreFilter, selectedCoordinatorFilter, searchTerm]);

  const topThree = sellers.slice(0, 3);
  const totalVendasEquipe = sellers.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const mediaVendas = sellers.length > 0 ? (totalVendasEquipe / sellers.length).toFixed(1) : 0;

  const handleAddNewSubmit = (e) => {
    e.preventDefault();
    const st = stores.find((s) => s.code === newSeller.loja);
    const added = {
      ...newSeller,
      id: Date.now(),
      lojaNome: st ? st.name : newSeller.loja
    };
    onAddSeller(added);
    setIsAddingNew(false);
    setNewSeller({
      nome: '',
      loja: stores[0]?.code || 'PDV',
      coordenador: 'Marcelo',
      total: 0,
      tv: 0,
      virtua: 0,
      controle: 0,
      pos: 0,
      upgrade: 0,
      trocaAparelho: 0
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Ranking Geral de Vendedores & Consultores</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-50 text-amber-700 border border-amber-200">
              {sellers.length} Consultores
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadastre consultores, ajuste metas e acompanhe a produção individual por produto e loja.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 text-xs font-bold bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
            <div>
              <span className="text-slate-400 block text-[10px]">Total Equipe:</span>
              <span className="text-slate-900 text-sm font-black">{totalVendasEquipe}</span>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div>
              <span className="text-slate-400 block text-[10px]">Média / Vendedor:</span>
              <span className="text-[#0F214A] text-sm font-black">{mediaVendas}</span>
            </div>
          </div>

          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0F214A] hover:bg-[#B81D12] text-white text-xs font-bold rounded-xl shadow-md shadow-slate-900/10 active:scale-95 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Consultor</span>
          </button>
        </div>
      </div>

      {/* Podium Top 3 */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topThree.map((seller, idx) => {
            const medals = [
              { title: '1º Lugar - Campeão Geral', bg: 'from-amber-400 to-yellow-500', text: 'text-amber-950', ring: 'ring-amber-300' },
              { title: '2º Lugar - Vice-Campeão', bg: 'from-slate-300 to-slate-400', text: 'text-slate-950', ring: 'ring-slate-300' },
              { title: '3º Lugar - Pódio Bronze', bg: 'from-amber-600 to-amber-700', text: 'text-white', ring: 'ring-amber-500' }
            ][idx];

            return (
              <div
                key={seller.id}
                className="relative bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {medals.title}
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-900 truncate max-w-[190px]">
                      {seller.nome}
                    </h3>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <span>{seller.lojaNome}</span>
                      <span>•</span>
                      <span>Coord: {seller.coordenador}</span>
                    </p>
                  </div>

                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${medals.bg} ${medals.text} flex items-center justify-center font-black text-base shadow-sm ring-4 ${medals.ring}/30`}>
                    {idx + 1}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Produção:</span>
                    <div className="text-2xl font-black text-[#0F214A]">
                      {seller.total} <span className="text-xs font-semibold text-slate-500">vendas</span>
                    </div>
                  </div>

                  <div className="text-right text-[11px] text-slate-600 font-medium">
                    <div>TV: <strong>{seller.tv}</strong> | Controle: <strong>{seller.controle}</strong></div>
                    <div>Upgrades: <strong>{seller.upgrade}</strong></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Complete Sellers Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Classificação Completa da Equipe
            </h3>
            <p className="text-xs text-slate-500">
              Listando {filteredSellers.length} consultores ativos
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar vendedor..."
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
                <th className="py-3 px-4">Posição</th>
                <th className="py-3 px-4">Nome do Consultor</th>
                <th className="py-3 px-3">Loja / PDV</th>
                <th className="py-3 px-3">Coordenador</th>
                <th className="py-3 px-2 text-center">TV</th>
                <th className="py-3 px-2 text-center">Vírtua</th>
                <th className="py-3 px-2 text-center">Controle</th>
                <th className="py-3 px-2 text-center">Pós</th>
                <th className="py-3 px-2 text-center">Upgrade</th>
                <th className="py-3 px-2 text-center">Aparelho</th>
                <th className="py-3 px-3 text-right">Total</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSellers.map((s, idx) => (
                <tr key={s.id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="py-3 px-4 font-black text-slate-500">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs ${
                      idx < 3 ? 'bg-sky-50 text-[#0F214A] font-black' : 'text-slate-600'
                    }`}>
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-extrabold text-slate-900">
                    {s.nome}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    <span className="font-bold text-slate-800">{s.loja}</span> - {s.lojaNome}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-700">
                    {s.coordenador}
                  </td>
                  <td className="py-3 px-2 text-center font-semibold text-slate-700 bg-purple-50/30">
                    {s.tv || '-'}
                  </td>
                  <td className="py-3 px-2 text-center font-semibold text-slate-700">
                    {s.virtua || '-'}
                  </td>
                  <td className="py-3 px-2 text-center font-semibold text-slate-700 bg-sky-50/30">
                    {s.controle || '-'}
                  </td>
                  <td className="py-3 px-2 text-center font-semibold text-slate-700">
                    {s.pos || '-'}
                  </td>
                  <td className="py-3 px-2 text-center font-semibold text-slate-700 bg-emerald-50/30">
                    {s.upgrade || '-'}
                  </td>
                  <td className="py-3 px-2 text-center font-semibold text-slate-700">
                    {s.trocaAparelho || '-'}
                  </td>
                  <td className="py-3 px-3 text-right font-black text-sm text-[#0F214A]">
                    {s.total}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={() => setEditingSeller(s)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#0F214A] hover:bg-sky-50"
                        title="Editar Vendedor"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Excluir ${s.nome} do ranking?`)) {
                            onDeleteSeller(s.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Excluir Vendedor"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cadastrar Vendedor Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-extrabold text-slate-900">
                Cadastrar Novo Consultor de Vendas
              </h3>
              <button onClick={() => setIsAddingNew(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  placeholder="Nome do consultor"
                  value={newSeller.nome}
                  onChange={(e) => setNewSeller({ ...newSeller, nome: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Loja / PDV</label>
                  <select
                    value={newSeller.loja}
                    onChange={(e) => setNewSeller({ ...newSeller, loja: e.target.value })}
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
                  <label className="block font-bold text-slate-700 mb-1">Coordenador</label>
                  <input
                    type="text"
                    value={newSeller.coordenador}
                    onChange={(e) => setNewSeller({ ...newSeller, coordenador: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total de Vendas</label>
                  <input
                    type="number"
                    value={newSeller.total}
                    onChange={(e) => setNewSeller({ ...newSeller, total: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">TV Box</label>
                  <input
                    type="number"
                    value={newSeller.tv}
                    onChange={(e) => setNewSeller({ ...newSeller, tv: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fibra Vírtua</label>
                  <input
                    type="number"
                    value={newSeller.virtua}
                    onChange={(e) => setNewSeller({ ...newSeller, virtua: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0F214A] hover:bg-[#B81D12] text-white font-bold rounded-xl shadow-md shadow-slate-900/10"
                >
                  Cadastrar Consultor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Editar Vendedor Modal */}
      {editingSeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-extrabold text-slate-900">
                Editar Consultor — {editingSeller.nome}
              </h3>
              <button onClick={() => setEditingSeller(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateSeller(editingSeller);
                setEditingSeller(null);
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome do Vendedor</label>
                <input
                  type="text"
                  value={editingSeller.nome}
                  onChange={(e) => setEditingSeller({ ...editingSeller, nome: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Loja de Atuação</label>
                  <select
                    value={editingSeller.loja}
                    onChange={(e) => {
                      const code = e.target.value;
                      const st = stores.find((s) => s.code === code);
                      setEditingSeller({
                        ...editingSeller,
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
                  <label className="block font-bold text-slate-700 mb-1">Coordenador</label>
                  <input
                    type="text"
                    value={editingSeller.coordenador}
                    onChange={(e) => setEditingSeller({ ...editingSeller, coordenador: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Produção</label>
                  <input
                    type="number"
                    value={editingSeller.total}
                    onChange={(e) => setEditingSeller({ ...editingSeller, total: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">TV Box</label>
                  <input
                    type="number"
                    value={editingSeller.tv || 0}
                    onChange={(e) => setEditingSeller({ ...editingSeller, tv: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSeller(null)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0F214A] hover:bg-[#B81D12] text-white font-bold rounded-xl shadow-md shadow-slate-900/10"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
