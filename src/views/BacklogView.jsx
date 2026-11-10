import React, { useState } from 'react';
import { ClipboardList, AlertTriangle, CheckCircle, Clock, MapPin, Plus, Edit2, Trash2, X } from 'lucide-react';

export default function BacklogView({ backlog, onUpdateBacklog }) {
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [editingContract, setEditingContract] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Contracts list stored in state
  const [contracts, setContracts] = useState(backlog.contracts || [
    { id: '56741889', masc: '5****889', status: 'AG FUTURA', plano: '600 M', video: 'BOX TV', cidade: 'Brasília', periodo: '08:00 - 12:00', dataAbertura: '2026-08-06', dataAgenda: '2026-08-10', quebra: null },
    { id: '1010813', masc: '1****813', status: 'AG FUTURA', plano: '600 M', video: 'BOX TV', cidade: 'Águas Lindas de Goiás', periodo: '12:01 - 18:00', dataAbertura: '2026-08-06', dataAgenda: '2026-08-12', quebra: null },
    { id: '1451330', masc: '1****330', status: 'AG FUTURA', plano: '600 M', video: 'BOX TV', cidade: 'Valparaíso de Goiás', periodo: '08:00 - 12:00', dataAbertura: '2026-08-06', dataAgenda: '2026-08-10', quebra: null },
    { id: '56739531', masc: '5****531', status: 'AG HOJE', plano: '500 M', video: 'BOX TV', cidade: 'Brasília', periodo: '12:00 - 15:00', dataAbertura: '2026-08-06', dataAgenda: '2026-08-07', quebra: null },
    { id: '56739256', masc: '5****256', status: 'AG HOJE', plano: '500 M', video: 'BOX TV', cidade: 'Brasília', periodo: '12:00 - 15:00', dataAbertura: '2026-08-06', dataAgenda: '2026-08-07', quebra: null },
    { id: '1009637', masc: '1****637', status: 'AG DIA SEGUINTE', plano: '600 M', video: 'BOX TV', cidade: 'Águas Lindas de Goiás', periodo: '08:01 - 12:00', dataAbertura: '2026-08-02', dataAgenda: '2026-08-08', quebra: '1,00 - NÃO INFORMADO' },
    { id: '56720415', masc: '5****415', status: 'SEM AGENDA', plano: '1 G', video: 'BOX TV', cidade: 'Brasília', periodo: '-', dataAbertura: '2026-07-30', dataAgenda: '-', quebra: '1,00 - 206 PRÉDIO SEM BACKBONE' },
    { id: '56736583', masc: '5****583', status: 'SEM AGENDA', plano: '600 M', video: 'NI', cidade: 'Brasília', periodo: '-', dataAbertura: '2026-08-05', dataAgenda: '-', quebra: '1,00 - 106 CLIENTE AUSENTE' },
    { id: '1450333', masc: '1****333', status: 'SEM AGENDA', plano: '600 M', video: 'NI', cidade: 'Valparaíso de Goiás', periodo: '-', dataAbertura: '2026-08-03', dataAgenda: '-', quebra: '1,00 - 316 RUA NÃO CABEADA GPON' },
    { id: '56727851', masc: '5****851', status: 'SEM AGENDA', plano: '1 G', video: 'NI', cidade: 'Brasília', periodo: '-', dataAbertura: '2026-08-03', dataAgenda: '-', quebra: '1,00 - 100 AGENDAMENTO NÃO CUMPRIDO' },
    { id: '1450643', masc: '1****643', status: 'SEM AGENDA', plano: '600 M', video: 'NI', cidade: 'Valparaíso de Goiás', periodo: '-', dataAbertura: '2026-08-04', dataAgenda: '-', quebra: '1,00 - 302 DESISTÊNCIA DO CLIENTE' }
  ]);

  const [newContract, setNewContract] = useState({
    id: '',
    masc: '',
    status: 'AG HOJE',
    plano: '600 M',
    video: 'BOX TV',
    cidade: 'Brasília',
    periodo: '08:00 - 12:00',
    dataAbertura: new Date().toISOString().slice(0, 10),
    dataAgenda: new Date().toISOString().slice(0, 10),
    quebra: ''
  });

  const filteredContracts = contracts.filter((c) => {
    const matchStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
    const matchCity = selectedCity === 'ALL' || c.cidade === selectedCity;
    return matchStatus && matchCity;
  });

  const handleAddNewSubmit = (e) => {
    e.preventDefault();
    const id = newContract.id || `${Math.floor(10000000 + Math.random() * 90000000)}`;
    const masc = id.length > 4 ? `${id[0]}****${id.slice(-3)}` : id;
    const added = { ...newContract, id, masc };
    const updated = [added, ...contracts];
    setContracts(updated);
    if (onUpdateBacklog) onUpdateBacklog(updated);
    setIsAddingNew(false);
    setNewContract({
      id: '',
      masc: '',
      status: 'AG HOJE',
      plano: '600 M',
      video: 'BOX TV',
      cidade: 'Brasília',
      periodo: '08:00 - 12:00',
      dataAbertura: new Date().toISOString().slice(0, 10),
      dataAgenda: new Date().toISOString().slice(0, 10),
      quebra: ''
    });
  };

  const handleDeleteContract = (id) => {
    const updated = contracts.filter((c) => c.id !== id);
    setContracts(updated);
    if (onUpdateBacklog) onUpdateBacklog(updated);
  };

  const handleUpdateContract = (updatedRecord) => {
    const updated = contracts.map((c) => (c.id === updatedRecord.id ? updatedRecord : c));
    setContracts(updated);
    if (onUpdateBacklog) onUpdateBacklog(updated);
    setEditingContract(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Gestão Operacional de Backlog Residencial</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-50 text-amber-800 border border-amber-200">
              {contracts.length} Ordens
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Adicione, altere status de agendamento ou exclua contratos técnicos de fibra e TV.
          </p>
        </div>

        <button
          onClick={() => setIsAddingNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0F214A] hover:bg-[#B81D12] text-white text-xs font-bold rounded-xl shadow-md shadow-slate-900/10 active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Ordem de Instalação</span>
        </button>
      </div>

      {/* Status Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setSelectedStatus('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            selectedStatus === 'ALL'
              ? 'bg-[#0F214A] text-white border-[#0F214A] shadow-sm shadow-slate-900/10'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Todos ({contracts.length})
        </button>
        <button
          onClick={() => setSelectedStatus('AG HOJE')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            selectedStatus === 'AG HOJE'
              ? 'bg-[#0F214A] text-white border-[#0F214A] shadow-sm shadow-slate-900/10'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          AG HOJE ({contracts.filter((c) => c.status === 'AG HOJE').length})
        </button>
        <button
          onClick={() => setSelectedStatus('AG DIA SEGUINTE')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            selectedStatus === 'AG DIA SEGUINTE'
              ? 'bg-[#0F214A] text-white border-[#0F214A] shadow-sm shadow-slate-900/10'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          AG DIA SEGUINTE ({contracts.filter((c) => c.status === 'AG DIA SEGUINTE').length})
        </button>
        <button
          onClick={() => setSelectedStatus('AG FUTURA')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            selectedStatus === 'AG FUTURA'
              ? 'bg-[#0F214A] text-white border-[#0F214A] shadow-sm shadow-slate-900/10'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          AG FUTURA ({contracts.filter((c) => c.status === 'AG FUTURA').length})
        </button>
        <button
          onClick={() => setSelectedStatus('SEM AGENDA')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            selectedStatus === 'SEM AGENDA'
              ? 'bg-[#0F214A] text-white border-[#0F214A] shadow-sm shadow-slate-900/10'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          SEM AGENDA ({contracts.filter((c) => c.status === 'SEM AGENDA').length})
        </button>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Contrato</th>
                <th className="py-3 px-3">Status Agenda</th>
                <th className="py-3 px-3">Plano Fibra</th>
                <th className="py-3 px-3">Vídeo / TV</th>
                <th className="py-3 px-3">Cidade</th>
                <th className="py-3 px-3">Janela Agendada</th>
                <th className="py-3 px-4">Motivo de Quebra</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContracts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {c.masc || c.id}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      c.status === 'AG HOJE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : c.status === 'SEM AGENDA'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {c.plano}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {c.video}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">
                    {c.cidade}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                    {c.periodo} {c.dataAgenda && c.dataAgenda !== '-' ? `(${c.dataAgenda})` : ''}
                  </td>
                  <td className="py-3 px-4 font-medium text-rose-600">
                    {c.quebra || <span className="text-slate-400">Regular</span>}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={() => setEditingContract(c)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#0F214A] hover:bg-sky-50"
                        title="Editar Contrato"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Excluir esta ordem do backlog?')) {
                            handleDeleteContract(c.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Excluir Contrato"
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

      {/* Cadastrar Ordem Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-extrabold text-slate-900">
                Adicionar Nova Ordem ao Backlog
              </h3>
              <button onClick={() => setIsAddingNew(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nº do Contrato</label>
                  <input
                    type="text"
                    placeholder="Ex: 56741889"
                    value={newContract.id}
                    onChange={(e) => setNewContract({ ...newContract, id: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status da Agenda</label>
                  <select
                    value={newContract.status}
                    onChange={(e) => setNewContract({ ...newContract, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="AG HOJE">AG HOJE</option>
                    <option value="AG DIA SEGUINTE">AG DIA SEGUINTE</option>
                    <option value="AG FUTURA">AG FUTURA</option>
                    <option value="SEM AGENDA">SEM AGENDA</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Plano Vírtua (Fibra)</label>
                  <input
                    type="text"
                    placeholder="Ex: 600 M, 1 G..."
                    value={newContract.plano}
                    onChange={(e) => setNewContract({ ...newContract, plano: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vídeo / TV</label>
                  <input
                    type="text"
                    placeholder="Ex: BOX TV, NI..."
                    value={newContract.video}
                    onChange={(e) => setNewContract({ ...newContract, video: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cidade</label>
                  <input
                    type="text"
                    value={newContract.cidade}
                    onChange={(e) => setNewContract({ ...newContract, cidade: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Janela / Período</label>
                  <input
                    type="text"
                    placeholder="Ex: 08:00 - 12:00"
                    value={newContract.periodo}
                    onChange={(e) => setNewContract({ ...newContract, periodo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Motivo de Quebra (se houver)</label>
                <input
                  type="text"
                  placeholder="Ex: 106 CLIENTE AUSENTE, 206 PRÉDIO SEM BACKBONE..."
                  value={newContract.quebra}
                  onChange={(e) => setNewContract({ ...newContract, quebra: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
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
                  Salvar Ordem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Editar Contrato Modal */}
      {editingContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-extrabold text-slate-900">
                Editar Ordem — {editingContract.masc || editingContract.id}
              </h3>
              <button onClick={() => setEditingContract(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateContract(editingContract);
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status da Agenda</label>
                  <select
                    value={editingContract.status}
                    onChange={(e) => setEditingContract({ ...editingContract, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="AG HOJE">AG HOJE</option>
                    <option value="AG DIA SEGUINTE">AG DIA SEGUINTE</option>
                    <option value="AG FUTURA">AG FUTURA</option>
                    <option value="SEM AGENDA">SEM AGENDA</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cidade</label>
                  <input
                    type="text"
                    value={editingContract.cidade}
                    onChange={(e) => setEditingContract({ ...editingContract, cidade: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Motivo de Quebra / Reagendamento</label>
                <input
                  type="text"
                  placeholder="Deixe em branco se resolvido"
                  value={editingContract.quebra || ''}
                  onChange={(e) => setEditingContract({ ...editingContract, quebra: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingContract(null)}
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
    </div>
  );
}
