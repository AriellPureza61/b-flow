import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit2,
  X,
  Lock,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

export default function VendedoresBriefingView({
  vendedores,
  onAddVendedor,
  onUpdateVendedor,
  onDeleteVendedor,
  stores
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAccess, setFilterAccess] = useState('ALL');
  const [filterPdv, setFilterPdv] = useState('ALL');
  // Quando null = mostra a lista/grade de vendedores; quando preenchido = direciona direto para a ficha completa do vendedor!
  const [openedVendedorId, setOpenedVendedorId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendedor, setEditingVendedor] = useState(null);

  const accessList = [
    { key: 'extranet', label: 'EXTRANET' },
    { key: 'solar', label: 'SOLAR' },
    { key: 'netsales', label: 'NETSALES' },
    { key: 'telefoneUra', label: 'TELEFONE URA' },
    { key: 'rcv', label: 'RCV' },
    { key: 'pool', label: 'POOL' },
    { key: 'estrela177', label: '*177' },
    { key: 'claroTroca', label: 'CLARO TROCA' },
    { key: 'uraBox', label: 'URA BOX' },
    { key: 'duo', label: 'DUO' }
  ];

  const emptyVendedor = {
    cnpjEmpresa: stores[0]?.cnpj || '',
    nome: '',
    rg: '',
    cpf: '',
    dataNascimento: '',
    celular: '',
    cincoDigitos: '',
    cargo: 'Vendedor',
    loginZ: '',
    login94: '',
    dataCadastro: new Date().toISOString().slice(0, 10),
    lojaPdv: stores[0]?.pdv || '',
    lojaNome: stores[0]?.nomeLoja || '',
    coordenador: stores[0]?.coordenador || 'MARCELO',
    extranet: true,
    solar: true,
    netsales: true,
    telefoneUra: true,
    rcv: true,
    pool: true,
    estrela177: true,
    claroTroca: true,
    uraBox: true,
    duo: true
  };

  const [formVendedor, setFormVendedor] = useState(emptyVendedor);

  const filteredVendedores = useMemo(() => {
    return vendedores.filter((v) => {
      const term = searchTerm.toLowerCase();
      const matchSearch =
        v.nome.toLowerCase().includes(term) ||
        (v.cpf && v.cpf.includes(term)) ||
        (v.loginZ && v.loginZ.toLowerCase().includes(term)) ||
        (v.cincoDigitos && v.cincoDigitos.toLowerCase().includes(term)) ||
        (v.lojaPdv && v.lojaPdv.toLowerCase().includes(term));

      const hasPending = accessList.some((acc) => !v[acc.key]);
      if (filterAccess === 'PENDENTES' && !hasPending) return false;
      if (filterAccess === 'COMPLETO' && hasPending) return false;
      if (filterPdv !== 'ALL' && v.lojaPdv !== filterPdv) return false;

      return matchSearch;
    });
  }, [vendedores, searchTerm, filterAccess, filterPdv]);

  const activeVendedor = useMemo(() => {
    if (!openedVendedorId) return null;
    return vendedores.find((v) => v.id === openedVendedorId) || null;
  }, [vendedores, openedVendedorId]);

  const activePendingCount = useMemo(() => {
    if (!activeVendedor) return 0;
    return accessList.filter((acc) => !activeVendedor[acc.key]).length;
  }, [activeVendedor]);

  // Ao clicar no vendedor: direciona imediatamente para a tela exclusiva do vendedor (PC e Celular)
  const handleSelectVendedor = (id) => {
    setOpenedVendedorId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleAccess = (accessKey) => {
    if (!activeVendedor) return;
    const updated = {
      ...activeVendedor,
      [accessKey]: !activeVendedor[accessKey]
    };
    onUpdateVendedor(updated);
  };

  const handleOpenNew = () => {
    setEditingVendedor(null);
    setFormVendedor(emptyVendedor);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v) => {
    setEditingVendedor(v);
    setFormVendedor(v);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingVendedor) {
      onUpdateVendedor(formVendedor);
    } else {
      const created = {
        ...formVendedor,
        id: Date.now()
      };
      onAddVendedor(created);
      setOpenedVendedorId(created.id);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Claro */}
      <div className="bg-white rounded-2xl p-5 border-2 border-[#0F214A]/15 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-7 rounded-full bg-[#0F214A] inline-block" />
            <h2 className="text-lg sm:text-xl font-black text-[#1F2937]">
              2° Vendedores & Matriz de Acessos
            </h2>
            <span className="px-3 py-0.5 rounded-full text-xs font-black bg-[#0F214A] text-white">
              {vendedores.length} Vendedores
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Clique no nome de qualquer vendedor para direcionar imediatamente à ficha completa e aos 10 acessos Claro.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#22C55E] hover:bg-[#16a34a] text-white text-xs font-black rounded-xl shadow-md shadow-green-500/25 active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Novo Vendedor</span>
        </button>
      </div>

      {/* SE UM VENDEDOR FOI CLICADO: DIRECIONA DIRETO PARA A TELA COMPLETA DO VENDEDOR (PC E CELULAR) */}
      {activeVendedor ? (
        <div className="bg-white rounded-2xl border-2 border-[#0F214A] shadow-lg overflow-hidden animate-in fade-in duration-150">
          {/* Barra Superior de Navegação Direta */}
          <div className="p-4 bg-[#0F214A] text-white flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setOpenedVendedorId(null)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-[#0F214A] hover:bg-sky-50 rounded-xl text-xs font-black shadow-sm active:scale-95 transition-all"
            >
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
              <span>Voltar para Todos os Vendedores</span>
            </button>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs font-bold text-white hidden sm:inline">
                Ir direto para outro Vendedor:
              </span>
              <select
                value={activeVendedor.id}
                onChange={(e) => handleSelectVendedor(Number(e.target.value))}
                className="px-3 py-2 rounded-xl bg-white text-[#1F2937] text-xs font-black max-w-[260px] truncate border-0 focus:outline-none"
              >
                {filteredVendedores.map((vend) => (
                  <option key={vend.id} value={vend.id}>
                    {vend.lojaPdv} - {vend.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cabeçalho do Vendedor Selecionado */}
          <div className="p-6 bg-sky-50/50 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 bg-[#0F214A] text-white font-mono font-black text-xs rounded-lg">
                    PDV: {activeVendedor.lojaPdv}
                  </span>
                  <span className="px-3 py-1 bg-white border border-gray-300 text-[#1F2937] font-black text-xs rounded-lg">
                    {activeVendedor.cargo || 'Vendedor'}
                  </span>
                  <span className="text-xs font-bold text-gray-600">
                    {activeVendedor.lojaNome}
                  </span>
                </div>
                <h3 className="text-xl font-black text-[#1F2937] mt-2">
                  {activeVendedor.nome}
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  Data do Cadastro: <strong>{activeVendedor.dataCadastro || '-'}</strong> • CNPJ da Empresa: <strong>{activeVendedor.cnpjEmpresa}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(activeVendedor)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-[#0F214A] text-xs font-black text-[#0F214A] hover:bg-[#0F214A] hover:text-white bg-white transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Editar Vendedor</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Deseja remover ${activeVendedor.nome} do sistema?`)) {
                      onDeleteVendedor(activeVendedor.id);
                      setOpenedVendedorId(null);
                    }
                  }}
                  className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-[#0F214A] hover:border-[#0F214A] transition-colors"
                  title="Excluir Vendedor"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Ficha Completa do Vendedor + Matriz de Acessos */}
          <div className="p-6 space-y-6 text-xs">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-[#0F214A] mb-3">
                1. Dados Cadastrais do Vendedor
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div>
                  <span className="text-gray-500 block text-[10px] font-bold">CPF:</span>
                  <span className="font-mono font-black text-sm text-[#1F2937]">{activeVendedor.cpf}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] font-bold">RG:</span>
                  <span className="font-mono font-bold text-[#1F2937]">{activeVendedor.rg || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] font-bold">DATA DE NASCIMENTO:</span>
                  <span className="font-bold text-[#1F2937]">{activeVendedor.dataNascimento || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] font-bold">CELULAR:</span>
                  <span className="font-black text-green-700">{activeVendedor.celular || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] font-bold">5 DÍGITOS (CÓD. VENDEDOR):</span>
                  <span className="font-mono font-black text-sm text-[#0F214A]">{activeVendedor.cincoDigitos || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] font-bold">LOGIN Z:</span>
                  <span className="font-mono font-black text-sm text-[#1F2937]">{activeVendedor.loginZ || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] font-bold">LOGIN 94:</span>
                  <span className="font-mono font-bold text-[#1F2937]">{activeVendedor.login94 || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] font-bold">COORDENADOR:</span>
                  <span className="font-black text-[#1F2937]">{activeVendedor.coordenador || '-'}</span>
                </div>
              </div>
            </div>

            {/* Matriz dos 10 Acessos */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#0F214A] flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>2. Acessos Obrigatórios aos Sistemas Claro (Clique para alternar)</span>
                </h4>
                <span
                  className={`text-xs font-black px-3 py-1 rounded-full ${
                    activePendingCount === 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {activePendingCount === 0
                    ? '100% Acessos Liberados'
                    : `${activePendingCount} Acesso(s) Pendente(s)`}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {accessList.map((acc) => {
                  const isOk = !!activeVendedor[acc.key];
                  return (
                    <button
                      key={acc.key}
                      type="button"
                      onClick={() => handleToggleAccess(acc.key)}
                      className={`p-3.5 rounded-xl border-2 text-left flex flex-col justify-between transition-all ${
                        isOk
                          ? 'bg-green-50 border-green-500 hover:bg-green-100'
                          : 'bg-rose-50 border-rose-500 hover:bg-rose-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#1F2937]">
                          {acc.label}
                        </span>
                        {isOk ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600" />
                        )}
                      </div>
                      <span
                        className={`text-[11px] font-black mt-2 ${
                          isOk ? 'text-green-800' : 'text-rose-600'
                        }`}
                      >
                        {isOk ? 'LIBERADO' : 'PENDENTE'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* LISTA / GRADE DE VENDEDORES PARA CLICAR E DIRECIONAR IMEDIATAMENTE */
        <>
          {/* Barra de Filtros e Busca */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setFilterAccess('ALL')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                  filterAccess === 'ALL'
                    ? 'bg-[#0F214A] text-white shadow-sm'
                    : 'bg-gray-100 text-[#1F2937] hover:bg-sky-50 hover:text-[#0F214A]'
                }`}
              >
                Todos ({vendedores.length})
              </button>
              <button
                onClick={() => setFilterAccess('PENDENTES')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                  filterAccess === 'PENDENTES'
                    ? 'bg-[#0F214A] text-white shadow-sm'
                    : 'bg-gray-100 text-[#1F2937] hover:bg-sky-50 hover:text-[#0F214A]'
                }`}
              >
                Com Acessos Pendentes
              </button>
              <button
                onClick={() => setFilterAccess('COMPLETO')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                  filterAccess === 'COMPLETO'
                    ? 'bg-[#0F214A] text-white shadow-sm'
                    : 'bg-gray-100 text-[#1F2937] hover:bg-sky-50 hover:text-[#0F214A]'
                }`}
              >
                100% Liberados
              </button>

              <select
                value={filterPdv}
                onChange={(e) => setFilterPdv(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-gray-300 bg-gray-50 text-xs font-black text-[#1F2937] focus:outline-none focus:border-[#0F214A]"
              >
                <option value="ALL">Todas as Lojas (PDVs)</option>
                {stores.map((st) => (
                  <option key={st.pdv} value={st.pdv}>
                    PDV {st.pdv} - {st.nomeLoja}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#0F214A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar nome, CPF, 5 dígitos, login Z..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#0F214A]"
              />
            </div>
          </div>

          {/* Grade de Cartões dos Vendedores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVendedores.map((v) => {
              const pendingCount = accessList.filter((acc) => !v[acc.key]).length;
              return (
                <div
                  key={v.id}
                  onClick={() => handleSelectVendedor(v.id)}
                  className="bg-white rounded-2xl p-4 border-2 border-gray-200 hover:border-[#0F214A] shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-[#0F214A] text-white font-mono text-xs font-black">
                        PDV: {v.lojaPdv}
                      </span>
                      {pendingCount > 0 ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-700">
                          {pendingCount} Pendente(s)
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-green-100 text-green-800">
                          Acessos OK
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-black text-[#1F2937] mt-3 group-hover:text-[#0F214A] transition-colors">
                      {v.nome}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-mono text-gray-600">
                      <span className="bg-gray-100 px-2 py-0.5 rounded">
                        5 Díg: <strong className="text-[#0F214A]">{v.cincoDigitos || '-'}</strong>
                      </span>
                      <span className="bg-gray-100 px-2 py-0.5 rounded">
                        Login Z: <strong className="text-[#1F2937]">{v.loginZ || '-'}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-bold">{v.cargo || 'Vendedor'}</span>
                    <span className="inline-flex items-center gap-1 font-black text-[#0F214A] group-hover:translate-x-1 transition-transform">
                      <span>Abrir Ficha</span>
                      <ChevronRight className="w-4 h-4 stroke-[3]" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Modal: Novo Vendedor / Editar Vendedor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-[#0F214A]">
            <div className="p-4 bg-[#0F214A] text-white flex items-center justify-between sticky top-0 z-10">
              <h3 className="font-black text-sm uppercase">
                {editingVendedor ? `Editar Vendedor: ${editingVendedor.nome}` : 'Cadastrar Novo Vendedor Claro'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white text-white hover:text-[#0F214A] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">NOME DO VENDEDOR *</label>
                  <input
                    type="text"
                    placeholder="Nome completo"
                    value={formVendedor.nome}
                    onChange={(e) => setFormVendedor({ ...formVendedor, nome: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold focus:outline-none focus:border-[#0F214A]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">LOJA / PDV</label>
                  <select
                    value={formVendedor.lojaPdv}
                    onChange={(e) => {
                      const pdv = e.target.value;
                      const st = stores.find((s) => s.pdv === pdv);
                      setFormVendedor({
                        ...formVendedor,
                        lojaPdv: pdv,
                        lojaNome: st ? st.nomeLoja : pdv,
                        cnpjEmpresa: st ? st.cnpj : formVendedor.cnpjEmpresa,
                        coordenador: st ? st.coordenador : formVendedor.coordenador
                      });
                    }}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none"
                  >
                    {stores.map((s) => (
                      <option key={s.pdv} value={s.pdv}>
                        {s.pdv} - {s.nomeLoja}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">CPF *</label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={formVendedor.cpf}
                    onChange={(e) => setFormVendedor({ ...formVendedor, cpf: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-mono focus:outline-none focus:border-[#0F214A]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">RG</label>
                  <input
                    type="text"
                    value={formVendedor.rg}
                    onChange={(e) => setFormVendedor({ ...formVendedor, rg: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">DATA DE NASCIMENTO</label>
                  <input
                    type="date"
                    value={formVendedor.dataNascimento}
                    onChange={(e) => setFormVendedor({ ...formVendedor, dataNascimento: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                <div>
                  <label className="block font-bold text-gray-700 mb-1 font-sans">CELULAR / WHATSAPP</label>
                  <input
                    type="text"
                    placeholder="(61) 90000-0000"
                    value={formVendedor.celular}
                    onChange={(e) => setFormVendedor({ ...formVendedor, celular: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1 font-sans">5 DÍGITOS (CÓD. IW)</label>
                  <input
                    type="text"
                    placeholder="Ex: OQ6IS"
                    value={formVendedor.cincoDigitos}
                    onChange={(e) => setFormVendedor({ ...formVendedor, cincoDigitos: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl uppercase font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1 font-sans">LOGIN Z</label>
                  <input
                    type="text"
                    placeholder="Ex: Z381754"
                    value={formVendedor.loginZ}
                    onChange={(e) => setFormVendedor({ ...formVendedor, loginZ: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl uppercase font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-2 font-sans">
                  Status Inicial dos Acessos:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {accessList.map((acc) => (
                    <label key={acc.key} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!formVendedor[acc.key]}
                        onChange={(e) => setFormVendedor({ ...formVendedor, [acc.key]: e.target.checked })}
                        className="accent-[#0F214A]"
                      />
                      <span className="text-[10px] font-bold text-[#1F2937]">{acc.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F214A] hover:bg-[#0a1735] text-white font-black rounded-xl shadow-sm"
                >
                  Salvar Vendedor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
