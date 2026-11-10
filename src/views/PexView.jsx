import React, { useState } from 'react';
import { Award, SunMedium, Plus, Edit2, Trash2, X } from 'lucide-react';

export default function PexView({ pex, onUpdatePex, stores, solarAdhesion }) {
  const [editingItem, setEditingItem] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [newItem, setNewItem] = useState({
    loja: stores[0]?.code || 'PDV',
    cidade: stores[0]?.city || 'Brasília',
    gn: 'CARLOS',
    tipo: 'RUA',
    visitas: 1,
    atitude: 1.0,
    gestao: 0.85,
    visual: 0.95,
    geral: 0.95
  });

  const pexGeralAvg = pex.length > 0
    ? (pex.reduce((acc, curr) => acc + (curr.geral || 0), 0) / pex.length * 100).toFixed(1)
    : 0;
  const pexVisualAvg = pex.length > 0
    ? (pex.reduce((acc, curr) => acc + (curr.visual || 1), 0) / pex.length * 100).toFixed(1)
    : 0;

  const handleAddNewSubmit = (e) => {
    e.preventDefault();
    const st = stores.find((s) => s.code === newItem.loja);
    const added = {
      ...newItem,
      cidade: st ? st.city : newItem.cidade
    };
    onUpdatePex([...pex, added]);
    setIsAddingNew(false);
  };

  const handleDeletePex = (lojaCode) => {
    onUpdatePex(pex.filter((p) => p.loja !== lojaCode));
  };

  const handleUpdateItem = (updated) => {
    onUpdatePex(pex.map((p) => (p.loja === updated.loja ? updated : p)));
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Programa de Excelência Claro (PEX) & Aderência Solar</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
              Média Geral: {pexGeralAvg}%
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadastre e edite notas de auditoria de qualidade nas lojas (Atitude, Gestão, Identidade Visual) e Solar.
          </p>
        </div>

        <button
          onClick={() => setIsAddingNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0F214A] hover:bg-[#B81D12] text-white text-xs font-bold rounded-xl shadow-md shadow-slate-900/10 active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Nota PEX</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-sky-50 text-[#0F214A] rounded-xl border border-sky-100">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Nota Geral das Lojas</div>
            <div className="text-2xl font-black text-slate-900">{pexGeralAvg}%</div>
            <div className="text-[11px] text-emerald-600 font-semibold">{pex.length} unidades auditadas</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Identidade Visual</div>
            <div className="text-2xl font-black text-slate-900">{pexVisualAvg}%</div>
            <div className="text-[11px] text-slate-500">Padrão visual de loja Claro</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
            <SunMedium className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Aderência Solar Atual</div>
            <div className="text-2xl font-black text-slate-900">36.8%</div>
            <div className="text-[11px] text-emerald-600 font-semibold">Crescimento contínuo</div>
          </div>
        </div>
      </div>

      {/* PEX Audit Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-sm font-extrabold text-slate-900">
            Quadro de Auditoria PEX por Loja
          </h3>
          <p className="text-xs text-slate-500">
            Critérios de Atitude, Gestão e Conformidade
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Loja</th>
                <th className="py-3 px-3">GN</th>
                <th className="py-3 px-2 text-center">Tipo</th>
                <th className="py-3 px-2 text-center">Visitas</th>
                <th className="py-3 px-2 text-center">Atitude</th>
                <th className="py-3 px-2 text-center">Gestão</th>
                <th className="py-3 px-2 text-center">Visual</th>
                <th className="py-3 px-4 text-right">Nota Geral</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pex.map((item) => (
                <tr key={item.loja} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="py-3 px-4">
                    <div className="font-extrabold text-slate-900">
                      {item.loja}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {item.cidade}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-700">
                    {item.gn}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {item.tipo}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center font-bold text-slate-700">
                    {item.visitas || 1}
                  </td>
                  <td className="py-3 px-2 text-center font-bold text-emerald-600">
                    {((item.atitude || 1) * 100).toFixed(0)}%
                  </td>
                  <td className="py-3 px-2 text-center font-semibold text-slate-700">
                    {item.gestao ? `${(item.gestao * 100).toFixed(1)}%` : '-'}
                  </td>
                  <td className="py-3 px-2 text-center font-semibold text-slate-700">
                    {item.visual ? `${(item.visual * 100).toFixed(1)}%` : '-'}
                  </td>
                  <td className="py-3 px-4 text-right font-black text-sm text-[#0F214A]">
                    {(item.geral * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#0F214A] hover:bg-sky-50"
                        title="Editar Nota PEX"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Excluir avaliação PEX da loja ${item.loja}?`)) {
                            handleDeletePex(item.loja);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Excluir Registro"
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

      {/* Cadastrar Nota PEX Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-extrabold text-slate-900">
                Cadastrar Auditoria PEX para Loja
              </h3>
              <button onClick={() => setIsAddingNew(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Loja / PDV</label>
                  <select
                    value={newItem.loja}
                    onChange={(e) => {
                      const code = e.target.value;
                      const st = stores.find((s) => s.code === code);
                      setNewItem({
                        ...newItem,
                        loja: code,
                        cidade: st ? st.city : newItem.cidade,
                        tipo: st ? st.type : 'RUA'
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
                  <label className="block font-bold text-slate-700 mb-1">GN Responsável</label>
                  <input
                    type="text"
                    value={newItem.gn}
                    onChange={(e) => setNewItem({ ...newItem, gn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nota Atitude (0 a 1)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.atitude}
                    onChange={(e) => setNewItem({ ...newItem, atitude: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nota Gestão (0 a 1)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.gestao}
                    onChange={(e) => setNewItem({ ...newItem, gestao: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Identidade Visual</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.visual}
                    onChange={(e) => setNewItem({ ...newItem, visual: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nota Geral Final (0 a 1)</label>
                <input
                  type="number"
                  step="0.001"
                  value={newItem.geral}
                  onChange={(e) => setNewItem({ ...newItem, geral: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold"
                  required
                />
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
                  Salvar Nota PEX
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Editar Nota PEX Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-extrabold text-slate-900">
                Editar Auditoria PEX — {editingItem.loja}
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateItem(editingItem);
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Atitude</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingItem.atitude}
                    onChange={(e) => setEditingItem({ ...editingItem, atitude: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gestão</label>
                  <input
                    type="number"
                    step="0.001"
                    value={editingItem.gestao || 0}
                    onChange={(e) => setEditingItem({ ...editingItem, gestao: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Visual</label>
                  <input
                    type="number"
                    step="0.001"
                    value={editingItem.visual || 0}
                    onChange={(e) => setEditingItem({ ...editingItem, visual: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nota Geral Final (0 a 1)</label>
                <input
                  type="number"
                  step="0.001"
                  value={editingItem.geral}
                  onChange={(e) => setEditingItem({ ...editingItem, geral: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold"
                  required
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
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
