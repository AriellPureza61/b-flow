import React, { useState, useMemo } from 'react';
import { UserCheck, Phone, Key, Plus, Search, CheckCircle2, XCircle, Edit3, Trash2, X } from 'lucide-react';

export default function TeamAccessView({ teamAccess, onUpdateTeam, onDeleteTeam, stores, selectedStoreFilter }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [accessFilter, setAccessFilter] = useState('ALL');
  const [editingMember, setEditingMember] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [newMember, setNewMember] = useState({
    nome: '',
    cpf: '',
    rg: '',
    celular: '',
    logins: '',
    cargo: 'Vendedor',
    loja: stores[0]?.code || 'PDV',
    solar: 'SIM',
    netsales: 'SIM',
    oracle: 'SIM',
    extranet: 'SIM'
  });

  const filteredTeam = useMemo(() => {
    return teamAccess.filter((m) => {
      const matchStore = selectedStoreFilter === 'ALL' || m.loja === selectedStoreFilter;
      const matchStatus =
        accessFilter === 'ALL' ||
        (accessFilter === 'SOLAR_PENDENTE' && m.solar === 'NÃO') ||
        (accessFilter === 'SOLAR_OK' && m.solar === 'SIM');
      const matchSearch =
        searchTerm === '' ||
        m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.cpf.includes(searchTerm) ||
        (m.logins && m.logins.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (m.loja && m.loja.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchStore && matchStatus && matchSearch;
    });
  }, [teamAccess, selectedStoreFilter, accessFilter, searchTerm]);

  const toggleSolar = (member) => {
    const updated = { ...member, solar: member.solar === 'SIM' ? 'NÃO' : 'SIM' };
    onUpdateTeam(updated);
  };

  const handleAddNew = (e) => {
    e.preventDefault();
    const created = {
      ...newMember,
      id: Date.now()
    };
    onUpdateTeam(created);
    setIsAddingNew(false);
    setNewMember({
      nome: '',
      cpf: '',
      rg: '',
      celular: '',
      logins: '',
      cargo: 'Vendedor',
      loja: stores[0]?.code || 'PDV',
      solar: 'SIM',
      netsales: 'SIM',
      oracle: 'SIM',
      extranet: 'SIM'
    });
  };

  const solarPendentesCount = teamAccess.filter((m) => m.solar === 'NÃO').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Matriz de Acessos & Logins Claro da Equipe</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-200">
              {teamAccess.length} Colaboradores
            </span>
            {solarPendentesCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-50 text-amber-800 border border-amber-200">
                {solarPendentesCount} Solar Pendente
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerencie colaboradores, matrículas Claro (94... / Z...) e status de acesso ao Solar, Netsales e Oracle.
          </p>
        </div>

        <button
          onClick={() => setIsAddingNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0F214A] hover:bg-[#B81D12] text-white text-xs font-bold rounded-xl shadow-md shadow-slate-900/10 active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Colaborador</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setAccessFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              accessFilter === 'ALL'
                ? 'bg-[#0F214A] text-white border-[#0F214A] shadow-sm shadow-slate-900/10'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Todos ({teamAccess.length})
          </button>
          <button
            onClick={() => setAccessFilter('SOLAR_OK')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              accessFilter === 'SOLAR_OK'
                ? 'bg-[#0F214A] text-white border-[#0F214A] shadow-sm shadow-slate-900/10'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Solar Ativo ({teamAccess.length - solarPendentesCount})
          </button>
          <button
            onClick={() => setAccessFilter('SOLAR_PENDENTE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              accessFilter === 'SOLAR_PENDENTE'
                ? 'bg-[#0F214A] text-white border-[#0F214A] shadow-sm shadow-slate-900/10'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Solar Pendente ({solarPendentesCount})
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou login Claro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-[#0F214A] focus:outline-none shadow-xs"
          />
        </div>
      </div>

      {/* Team Access Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Colaborador</th>
                <th className="py-3 px-3">Loja / PDV</th>
                <th className="py-3 px-3">Documento / CPF</th>
                <th className="py-3 px-3">Contato WhatsApp</th>
                <th className="py-3 px-4">Logins Claro (94... / Z...)</th>
                <th className="py-3 px-2 text-center">Solar</th>
                <th className="py-3 px-2 text-center">Netsales</th>
                <th className="py-3 px-2 text-center">Oracle</th>
                <th className="py-3 px-2 text-center">Extranet</th>
                <th className="py-3 px-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTeam.map((m) => {
                const rawPhone = (m.celular || '').replace(/\D/g, '');
                const waLink = rawPhone ? `https://wa.me/55${rawPhone}` : '#';

                return (
                  <tr key={m.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-slate-900 leading-tight">
                        {m.nome}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {m.cargo || 'Consultor de Vendas'}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold">
                        {m.loja}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                      {m.cpf}
                    </td>
                    <td className="py-3 px-3">
                      {rawPhone ? (
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:text-emerald-700 text-[11px]"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{m.celular}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-sky-50 text-[#0F214A] font-mono font-bold text-[11px] rounded-lg border border-sky-100">
                        <Key className="w-3 h-3 text-[#0F214A]" />
                        {m.logins}
                      </span>
                    </td>
                    {/* Solar Toggle */}
                    <td className="py-3 px-2 text-center">
                      <button
                        onClick={() => toggleSolar(m)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] transition-all cursor-pointer ${
                          m.solar === 'SIM'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                        title="Clique para alternar o status do Solar"
                      >
                        {m.solar === 'SIM' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{m.solar}</span>
                      </button>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        {m.netsales || 'SIM'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        {m.oracle || 'SIM'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        {m.extranet || 'SIM'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100">
                        <button
                          onClick={() => setEditingMember(m)}
                          className="text-slate-500 hover:text-[#0F214A] p-1.5 rounded-lg hover:bg-sky-50 transition-colors"
                          title="Editar logins"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {onDeleteTeam && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Deseja remover ${m.nome} da equipe?`)) {
                                onDeleteTeam(m.id);
                              }
                            }}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Excluir colaborador"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Member Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-extrabold text-slate-900">
                Cadastrar Novo Colaborador & Logins
              </h3>
              <button onClick={() => setIsAddingNew(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNew} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  placeholder="Nome do consultor ou gerente"
                  value={newMember.nome}
                  onChange={(e) => setNewMember({ ...newMember, nome: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F214A]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">CPF *</label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={newMember.cpf}
                    onChange={(e) => setNewMember({ ...newMember, cpf: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F214A]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Celular / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="(61) 90000-0000"
                    value={newMember.celular}
                    onChange={(e) => setNewMember({ ...newMember, celular: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F214A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Loja de Lotação</label>
                  <select
                    value={newMember.loja}
                    onChange={(e) => setNewMember({ ...newMember, loja: e.target.value })}
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
                  <label className="block font-bold text-slate-700 mb-1">Cargo</label>
                  <select
                    value={newMember.cargo}
                    onChange={(e) => setNewMember({ ...newMember, cargo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="Vendedor">Vendedor</option>
                    <option value="Gerente">Gerente</option>
                    <option value="Supervisor">Supervisor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Logins Claro (Separados por vírgula)</label>
                <input
                  type="text"
                  placeholder="Ex: 94291826, Z597445"
                  value={newMember.logins}
                  onChange={(e) => setNewMember({ ...newMember, logins: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F214A]"
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
                  Confirmar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-extrabold text-slate-900">
                Editar Colaborador — {editingMember.nome}
              </h3>
              <button onClick={() => setEditingMember(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateTeam(editingMember);
                setEditingMember(null);
              }}
              className="p-6 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={editingMember.nome}
                  onChange={(e) => setEditingMember({ ...editingMember, nome: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">CPF</label>
                  <input
                    type="text"
                    value={editingMember.cpf}
                    onChange={(e) => setEditingMember({ ...editingMember, cpf: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Celular</label>
                  <input
                    type="text"
                    value={editingMember.celular}
                    onChange={(e) => setEditingMember({ ...editingMember, celular: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Loja de Lotação</label>
                  <select
                    value={editingMember.loja}
                    onChange={(e) => setEditingMember({ ...editingMember, loja: e.target.value })}
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
                  <label className="block font-bold text-slate-700 mb-1">Status no Solar</label>
                  <select
                    value={editingMember.solar}
                    onChange={(e) => setEditingMember({ ...editingMember, solar: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="SIM">SIM (Ativo)</option>
                    <option value="NÃO">NÃO (Pendente)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Logins nos Sistemas Claro</label>
                <input
                  type="text"
                  value={editingMember.logins}
                  onChange={(e) => setEditingMember({ ...editingMember, logins: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  required
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
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
