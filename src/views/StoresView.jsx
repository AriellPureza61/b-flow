import React, { useState, useMemo } from 'react';
import {
  Store,
  Phone,
  Mail,
  MapPin,
  Clock,
  Edit2,
  Trash2,
  Plus,
  Search,
  Building2,
  Check,
  X
} from 'lucide-react';

export default function StoresView({ stores, onAddStore, onUpdateStore, onDeleteStore, selectedCoordinatorFilter }) {
  const [filterType, setFilterType] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStore, setEditingStore] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const emptyStore = {
    code: '',
    name: '',
    franquia: 'Rede Horizonte',
    city: 'Brasília',
    state: 'DF',
    type: 'RUA',
    layout: 'LAYOUT CONCEITO',
    coordinator: 'Marcelo',
    manager: '',
    phone: '',
    email: '',
    cnpj: '',
    address: '',
    cep: '',
    hoursWeek: '09:00 às 18:00',
    hoursSat: '09:00 às 13:00',
    hoursSun: 'FECHADO',
    headcountPA: 5,
    headcountIW: 5,
    ip: '',
    adquirente: 'CIELO',
    sapClient: '',
    macTV: '',
    macTablet: '',
    atlas: '',
    salesTeam: '',
    pexScore: 0.95,
    meta: 50,
    real: 0,
    gap: -50,
    metaDia: -3.57
  };

  const [newStore, setNewStore] = useState(emptyStore);

  const filteredStores = useMemo(() => {
    return stores.filter((s) => {
      const matchCoord = selectedCoordinatorFilter === 'ALL' || s.coordinator === selectedCoordinatorFilter;
      const matchType = filterType === 'ALL' || s.type === filterType;
      const matchSearch = searchTerm === '' ||
        s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.franquia && s.franquia.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchCoord && matchType && matchSearch;
    });
  }, [stores, selectedCoordinatorFilter, filterType, searchTerm]);

  const handleAddNewSubmit = (e) => {
    e.preventDefault();
    if (!newStore.code || !newStore.name) return;

    const gap = newStore.real - newStore.meta;
    const metaDia = newStore.meta > 0 ? (gap / 14).toFixed(2) : 0;

    onAddStore({
      ...newStore,
      gap,
      metaDia: Number(metaDia)
    });

    setIsAddingNew(false);
    setNewStore(emptyStore);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Rede de Lojas & PDVs Administrados</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-sky-50 text-[#0F214A] border border-sky-200">
              {stores.length} Unidades
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadastre, edite ou exclua qualquer loja da sua carteira de atendimento (Rede Horizonte ou qualquer outra franquia).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0F214A] hover:bg-[#B81D12] text-white text-xs font-bold rounded-xl shadow-md shadow-slate-900/10 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Nova Loja</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              filterType === 'ALL'
                ? 'bg-[#0F214A] text-white border-[#0F214A] shadow-sm shadow-slate-900/10'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Todas ({stores.length})
          </button>
          <button
            onClick={() => setFilterType('SHOPPING')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              filterType === 'SHOPPING'
                ? 'bg-[#0F214A] text-white border-[#0F214A] shadow-sm shadow-slate-900/10'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Shopping
          </button>
          <button
            onClick={() => setFilterType('RUA')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              filterType === 'RUA'
                ? 'bg-[#0F214A] text-white border-[#0F214A] shadow-sm shadow-slate-900/10'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Rua
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por código, nome, gerente, cidade ou franquia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-[#0F214A] focus:outline-none shadow-xs"
          />
        </div>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStores.map((s) => {
          const rawPhone = (s.phone || '').replace(/\D/g, '');
          const waLink = rawPhone ? `https://wa.me/55${rawPhone}` : '#';
          const atingimento = s.meta > 0 ? ((s.real / s.meta) * 100).toFixed(0) : 0;

          return (
            <div
              key={s.code}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-slate-100 bg-gradient-to-br from-slate-50/50 to-white">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center font-black text-sm text-[#0F214A] shadow-xs">
                      {s.code}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                        {s.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] font-medium text-slate-500">
                          {s.city} - {s.state}
                        </span>
                        <span>•</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                          {s.type}
                        </span>
                        {s.franquia && (
                          <span className="text-[10px] font-semibold text-slate-400">
                            ({s.franquia})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    PEX {(s.pexScore * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Card Body Info */}
              <div className="p-5 space-y-3.5 flex-1 text-xs">
                {/* Manager & Contact */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">Gerente:</span>
                    <span className="font-extrabold text-slate-900 truncate max-w-[180px]">
                      {s.manager || 'Não informado'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">Coord. Claro:</span>
                    <span className="font-bold text-[#0F214A]">
                      {s.coordinator || 'Padrão'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                    {rawPhone ? (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{s.phone}</span>
                      </a>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Sem telefone</span>
                    )}

                    {s.email && (
                      <a href={`mailto:${s.email}`} className="text-slate-400 hover:text-slate-700" title={s.email}>
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Address & Hours */}
                <div className="space-y-1 text-slate-600 text-[11px]">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{s.address || 'Endereço não cadastrado'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Seg-Sex: {s.hoursWeek}</span>
                  </div>
                </div>

                {/* Technical / Operations Specs */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Headcount:</span>
                    <strong>{s.headcountPA || 0} PA</strong> / <strong>{s.headcountIW || 0} IW</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">SAP Cliente:</span>
                    <strong>{s.sapClient || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Adquirente:</span>
                    <strong>{s.adquirente || 'CIELO'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Atlas PDV:</span>
                    <strong>{s.atlas || '-'}</strong>
                  </div>
                </div>

                {/* Campanha Desafio Progress */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                    <span>Meta: {s.real} de {s.meta}</span>
                    <span className={atingimento >= 40 ? 'text-emerald-600' : 'text-[#0F214A]'}>
                      {atingimento}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${atingimento >= 40 ? 'bg-emerald-500' : 'bg-[#0F214A]'}`}
                      style={{ width: `${Math.min(Number(atingimento), 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    if (window.confirm(`Tem certeza que deseja excluir a loja ${s.code} - ${s.name}?`)) {
                      onDeleteStore(s.code);
                    }
                  }}
                  className="flex items-center gap-1 font-semibold text-rose-500 hover:text-rose-700 px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Excluir Loja"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Excluir</span>
                </button>

                <button
                  onClick={() => setEditingStore(s)}
                  className="flex items-center gap-1 font-bold text-slate-700 hover:text-[#0F214A] px-2 py-1 rounded-lg hover:bg-white transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Editar Loja</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cadastrar Nova Loja Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#0F214A] text-white rounded-xl">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Cadastrar Nova Loja / PDV
                  </h3>
                  <p className="text-xs text-slate-500">Adicione uma nova loja à sua rede de atendimento</p>
                </div>
              </div>
              <button onClick={() => setIsAddingNew(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Código PDV *</label>
                  <input
                    type="text"
                    placeholder="Ex: 3QCV, 9GWC..."
                    value={newStore.code}
                    onChange={(e) => setNewStore({ ...newStore, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold uppercase focus:ring-2 focus:ring-sky-500/20 focus:border-[#0F214A] focus:outline-none"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Nome da Loja *</label>
                  <input
                    type="text"
                    placeholder="Ex: Loja Taguatinga Shopping"
                    value={newStore.name}
                    onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-[#0F214A] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Franquia / Rede</label>
                  <input
                    type="text"
                    placeholder="Ex: Rede Horizonte, Cellcom..."
                    value={newStore.franquia}
                    onChange={(e) => setNewStore({ ...newStore, franquia: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-[#0F214A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cidade</label>
                  <input
                    type="text"
                    placeholder="Ex: Brasília"
                    value={newStore.city}
                    onChange={(e) => setNewStore({ ...newStore, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-[#0F214A] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de PDV</label>
                  <select
                    value={newStore.type}
                    onChange={(e) => setNewStore({ ...newStore, type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-[#0F214A] focus:outline-none"
                  >
                    <option value="RUA">RUA</option>
                    <option value="SHOPPING">SHOPPING</option>
                    <option value="QUIOSQUE">QUIOSQUE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome do Gerente</label>
                  <input
                    type="text"
                    placeholder="Nome completo do gerente"
                    value={newStore.manager}
                    onChange={(e) => setNewStore({ ...newStore, manager: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-[#0F214A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp / Telefone</label>
                  <input
                    type="text"
                    placeholder="(61) 99999-9999"
                    value={newStore.phone}
                    onChange={(e) => setNewStore({ ...newStore, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-[#0F214A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Meta Desafio</label>
                  <input
                    type="number"
                    value={newStore.meta}
                    onChange={(e) => setNewStore({ ...newStore, meta: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-[#0F214A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vendas Realizadas</label>
                  <input
                    type="number"
                    value={newStore.real}
                    onChange={(e) => setNewStore({ ...newStore, real: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-[#0F214A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nota PEX (0 a 1)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newStore.pexScore}
                    onChange={(e) => setNewStore({ ...newStore, pexScore: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-[#0F214A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Endereço Completo</label>
                <input
                  type="text"
                  placeholder="Rua, Quadra, Lote, Bairro..."
                  value={newStore.address}
                  onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-[#0F214A] focus:outline-none"
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
                  Salvar Nova Loja
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Editar Loja Modal */}
      {editingStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
              <h3 className="text-sm font-extrabold text-slate-900">
                Editar Loja — {editingStore.code} ({editingStore.name})
              </h3>
              <button onClick={() => setEditingStore(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const gap = editingStore.real - editingStore.meta;
                const metaDia = editingStore.meta > 0 ? (gap / 14).toFixed(2) : 0;
                onUpdateStore({
                  ...editingStore,
                  gap,
                  metaDia: Number(metaDia)
                });
                setEditingStore(null);
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Código PDV</label>
                  <input
                    type="text"
                    value={editingStore.code}
                    onChange={(e) => setEditingStore({ ...editingStore, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold uppercase focus:outline-none"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Nome da Loja</label>
                  <input
                    type="text"
                    value={editingStore.name}
                    onChange={(e) => setEditingStore({ ...editingStore, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Franquia</label>
                  <input
                    type="text"
                    value={editingStore.franquia || ''}
                    onChange={(e) => setEditingStore({ ...editingStore, franquia: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cidade</label>
                  <input
                    type="text"
                    value={editingStore.city}
                    onChange={(e) => setEditingStore({ ...editingStore, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de PDV</label>
                  <select
                    value={editingStore.type}
                    onChange={(e) => setEditingStore({ ...editingStore, type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="RUA">RUA</option>
                    <option value="SHOPPING">SHOPPING</option>
                    <option value="QUIOSQUE">QUIOSQUE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome do Gerente</label>
                  <input
                    type="text"
                    value={editingStore.manager}
                    onChange={(e) => setEditingStore({ ...editingStore, manager: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telefone WhatsApp</label>
                  <input
                    type="text"
                    value={editingStore.phone}
                    onChange={(e) => setEditingStore({ ...editingStore, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Meta Desafio</label>
                  <input
                    type="number"
                    value={editingStore.meta}
                    onChange={(e) => setEditingStore({ ...editingStore, meta: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Realizado</label>
                  <input
                    type="number"
                    value={editingStore.real}
                    onChange={(e) => setEditingStore({ ...editingStore, real: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nota PEX (0 a 1)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={editingStore.pexScore}
                    onChange={(e) => setEditingStore({ ...editingStore, pexScore: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Endereço Completo</label>
                <input
                  type="text"
                  value={editingStore.address}
                  onChange={(e) => setEditingStore({ ...editingStore, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStore(null)}
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
