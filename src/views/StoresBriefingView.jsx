import React, { useState, useMemo } from 'react';
import {
  Building2,
  Search,
  Plus,
  MapPin,
  User,
  ChevronRight,
  ArrowLeft,
  Edit2,
  Trash2,
  X,
  Cpu
} from 'lucide-react';

export default function StoresBriefingView({ stores, onAddStore, onUpdateStore, onDeleteStore }) {
  const [subTab, setSubTab] = useState('TODAS');
  const [searchTerm, setSearchTerm] = useState('');
  // Quando null = mostra a lista/grade de lojas; quando preenchido = direciona direto para a ficha completa da loja!
  const [openedCnpj, setOpenedCnpj] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);

  const emptyStore = {
    cnpj: '',
    gerente: '',
    telefone: '',
    pdv: '',
    nomeLoja: '',
    coordenador: 'MARCELO',
    gn: 'CARLOS',
    tipoLayout: 'LAYOUT CONCEITO',
    logradouro: '',
    numero: 'SN',
    complemento: '',
    bairro: '',
    cep: '',
    nomeCidade: 'BRASILIA',
    codIbge: '5300108',
    metragem: '45',
    horarioSemana: '09:00 às 18:00',
    horarioSabado: '09:00 às 13:00',
    horarioDomingo: 'FECHADO',
    hcPa: '6',
    hcIw: '5',
    ipFixo: '',
    adquirente: 'CIELO',
    sapCliente: '',
    macTv: '',
    macTablet: '',
    sapFornecedor: '',
    atlas: '',
    equipeVenda: '',
    telefoneGmb: '',
    emailGerente: '',
    pdvGmbOk: 'OK',
    cortesia: 'SIM'
  };

  const [formStore, setFormStore] = useState(emptyStore);

  const filteredStores = useMemo(() => {
    return stores.filter((s) => {
      const term = searchTerm.toLowerCase();
      if (!term) return true;
      if (subTab === 'BUSCA_CNPJ') return s.cnpj.toLowerCase().includes(term);
      if (subTab === 'BUSCA_PDV') return s.pdv.toLowerCase().includes(term);
      if (subTab === 'BUSCA_COORD') return s.coordenador.toLowerCase().includes(term);
      if (subTab === 'BUSCA_GN') return s.gn.toLowerCase().includes(term);
      return (
        s.cnpj.toLowerCase().includes(term) ||
        s.pdv.toLowerCase().includes(term) ||
        s.nomeLoja.toLowerCase().includes(term) ||
        s.gerente.toLowerCase().includes(term) ||
        s.coordenador.toLowerCase().includes(term) ||
        s.gn.toLowerCase().includes(term) ||
        s.nomeCidade.toLowerCase().includes(term)
      );
    });
  }, [stores, subTab, searchTerm]);

  const activeStore = useMemo(() => {
    if (!openedCnpj) return null;
    return stores.find((s) => s.cnpj === openedCnpj) || null;
  }, [stores, openedCnpj]);

  // Ao clicar na loja: direciona imediatamente para a tela exclusiva da loja (PC e Celular)
  const handleSelectStore = (cnpj) => {
    setOpenedCnpj(cnpj);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenNew = () => {
    setEditingStore(null);
    setFormStore(emptyStore);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (store) => {
    setEditingStore(store);
    setFormStore(store);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingStore) {
      onUpdateStore(formStore);
    } else {
      onAddStore(formStore);
      setOpenedCnpj(formStore.cnpj);
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
              1° Lojas & PDVs Claro
            </h2>
            <span className="px-3 py-0.5 rounded-full text-xs font-black bg-[#0F214A] text-white">
              {stores.length} Lojas
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Clique em qualquer CNPJ ou Loja abaixo para ser direcionado imediatamente à ficha completa da unidade.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#22C55E] hover:bg-[#16a34a] text-white text-xs font-black rounded-xl shadow-md shadow-green-500/25 active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Novo CNPJ / Loja</span>
        </button>
      </div>

      {/* SE UMA LOJA FOI CLICADA: DIRECIONA DIRETO PARA A TELA COMPLETA DA LOJA (PC E CELULAR) */}
      {activeStore ? (
        <div className="bg-white rounded-2xl border-2 border-[#0F214A] shadow-lg overflow-hidden animate-in fade-in duration-150">
          {/* Barra Superior de Navegação Direta */}
          <div className="p-4 bg-[#0F214A] text-white flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setOpenedCnpj(null)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-[#0F214A] hover:bg-sky-50 rounded-xl text-xs font-black shadow-sm active:scale-95 transition-all"
            >
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
              <span>Voltar para Todas as Lojas</span>
            </button>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs font-bold text-white hidden sm:inline">
                Ir direto para outra Loja:
              </span>
              <select
                value={activeStore.cnpj}
                onChange={(e) => handleSelectStore(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white text-[#1F2937] text-xs font-black border-0 focus:outline-none"
              >
                {stores.map((st) => (
                  <option key={st.cnpj} value={st.cnpj}>
                    {st.pdv} - {st.nomeLoja}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cabeçalho da Loja Selecionada */}
          <div className="p-6 bg-sky-50/50 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 bg-[#0F214A] text-white font-mono font-black text-sm rounded-lg">
                    PDV: {activeStore.pdv}
                  </span>
                  <span className="px-3 py-1 bg-white border border-gray-300 text-xs font-mono font-black text-[#1F2937] rounded-lg">
                    CNPJ: {activeStore.cnpj}
                  </span>
                  <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-black rounded-lg">
                    {activeStore.tipoLayout}
                  </span>
                </div>
                <h3 className="text-xl font-black text-[#1F2937] pt-1">
                  {activeStore.nomeLoja}
                </h3>
                <p className="text-xs text-gray-600 font-medium">
                  {activeStore.nomeCidade} • CEP: {activeStore.cep} • Código IBGE: {activeStore.codIbge}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(activeStore)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-[#0F214A] text-xs font-black text-[#0F214A] hover:bg-[#0F214A] hover:text-white bg-white transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Editar Dados</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Deseja excluir a loja ${activeStore.nomeLoja} (${activeStore.cnpj})?`)) {
                      onDeleteStore(activeStore.cnpj);
                      setOpenedCnpj(null);
                    }
                  }}
                  className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-[#0F214A] hover:border-[#0F214A] transition-colors"
                  title="Excluir Loja"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Ficha Completa com todos os campos do Briefing */}
          <div className="p-6 space-y-6 text-xs">
            {/* Seção 1 */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-[#0F214A] mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>1. Gestão, Contato & Equipe</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div>
                  <span className="text-gray-500 block text-[10px] font-bold">GERENTE:</span>
                  <span className="font-black text-sm text-[#1F2937]">{activeStore.gerente || 'Não informado'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] font-bold">TELEFONE / GMB:</span>
                  <span className="font-black text-sm text-green-700">{activeStore.telefone || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] font-bold">EMAIL GERENTE:</span>
                  <span className="font-bold text-[#0F214A] truncate block">{activeStore.emailGerente || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] font-bold">COORDENADOR DA LOJA:</span>
                  <span className="font-black text-[#0F214A]">{activeStore.coordenador || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] font-bold">GN RESPONSÁVEL:</span>
                  <span className="font-black text-[#1F2937]">{activeStore.gn || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] font-bold">EQUIPE DE VENDA:</span>
                  <span className="font-mono font-bold text-[#1F2937]">{activeStore.equipeVenda || '-'}</span>
                </div>
              </div>
            </div>

            {/* Seção 2 */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-[#0F214A] mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>2. Endereço, Metragem & Horários de Funcionamento</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="sm:col-span-2">
                  <span className="text-gray-500 block text-[10px] font-bold">LOGRADOURO / NÚMERO / COMPLEMENTO:</span>
                  <span className="font-bold text-[#1F2937]">
                    {activeStore.logradouro}, {activeStore.numero} {activeStore.complemento && `(${activeStore.complemento})`}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] font-bold">BAIRRO / CIDADE / CEP:</span>
                  <span className="font-bold text-[#1F2937]">{activeStore.bairro} - {activeStore.nomeCidade} ({activeStore.cep})</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] font-bold">METRAGEM DAS LOJAS:</span>
                  <span className="font-black text-[#1F2937]">{activeStore.metragem} m²</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] font-bold">QUANTIDADE HC PA COMPLETA / HC IW:</span>
                  <span className="font-black text-[#1F2937]">HC PA: {activeStore.hcPa} | HC IW: {activeStore.hcIw}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] font-bold">HORÁRIO DE FUNCIONAMENTO:</span>
                  <span className="text-gray-700 font-medium block text-[11px]">
                    Seg-Sex: {activeStore.horarioSemana} | Sáb: {activeStore.horarioSabado} | Dom: {activeStore.horarioDomingo}
                  </span>
                </div>
              </div>
            </div>

            {/* Seção 3 */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-[#0F214A] mb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                <span>3. Dados Técnicos, SAP, MAC & Cortesia</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 font-mono text-[11px]">
                <div>
                  <span className="text-gray-500 block text-[10px] font-sans font-bold">IP FIXO:</span>
                  <span className="font-black text-[#1F2937]">{activeStore.ipFixo || 'DHCP'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] font-sans font-bold">ADQUIRENTE:</span>
                  <span className="font-black text-[#1F2937]">{activeStore.adquirente || 'CIELO'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] font-sans font-bold">SAP CLIENTE:</span>
                  <span className="font-black text-[#1F2937]">{activeStore.sapCliente || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] font-sans font-bold">SAP FORNECEDOR:</span>
                  <span className="font-black text-[#1F2937]">{activeStore.sapFornecedor || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] font-sans font-bold">MAC TV:</span>
                  <span className="font-bold text-gray-800">{activeStore.macTv || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] font-sans font-bold">MAC TABLET:</span>
                  <span className="font-bold text-gray-800">{activeStore.macTablet || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] font-sans font-bold">ATLAS:</span>
                  <span className="font-black text-[#1F2937]">{activeStore.atlas || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] font-sans font-bold">CORTESIA / DEGUSTAÇÃO:</span>
                  <span className="px-2.5 py-0.5 rounded font-black bg-green-100 text-green-800">
                    {activeStore.cortesia || 'SIM'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* LISTA / GRADE DE LOJAS PARA CLICAR E DIRECIONAR IMEDIATAMENTE */
        <>
          {/* Filtros Rápidos: Todas, CNPJ, PDV, Coordenador, GN */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { id: 'TODAS', label: 'Todas as Lojas' },
                { id: 'BUSCA_CNPJ', label: 'Por CNPJ' },
                { id: 'BUSCA_PDV', label: 'Aba PDV' },
                { id: 'BUSCA_COORD', label: 'Aba COORDENADOR' },
                { id: 'BUSCA_GN', label: 'Aba GN' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSubTab(tab.id);
                    setSearchTerm('');
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                    subTab === tab.id
                      ? 'bg-[#0F214A] text-white shadow-sm'
                      : 'bg-gray-100 text-[#1F2937] hover:bg-sky-50 hover:text-[#0F214A]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#0F214A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Digite CNPJ, PDV, Gerente ou Cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#0F214A]"
              />
            </div>
          </div>

          {/* Grade de Cartões das Lojas Claro */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStores.map((s) => (
              <div
                key={s.cnpj}
                onClick={() => handleSelectStore(s.cnpj)}
                className="bg-white rounded-2xl p-5 border-2 border-gray-200 hover:border-[#0F214A] shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-lg bg-[#0F214A] text-white font-mono text-xs font-black">
                      PDV: {s.pdv}
                    </span>
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-sky-50 text-[#0F214A]">
                      {s.tipoLayout}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-[#1F2937] mt-3 group-hover:text-[#0F214A] transition-colors">
                    {s.nomeLoja}
                  </h3>

                  <div className="mt-2 py-1.5 px-2.5 rounded-lg bg-gray-50 border border-gray-200 font-mono text-xs font-bold text-[#1F2937]">
                    CNPJ: {s.cnpj}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-600">
                    Gerente: <strong className="text-[#1F2937]">{s.gerente.split(' ')[0]}</strong>
                  </span>
                  <span className="inline-flex items-center gap-1 font-black text-[#0F214A] group-hover:translate-x-1 transition-transform">
                    <span>Abrir Loja</span>
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal: Novo CNPJ / Editar Loja */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-[#0F214A]">
            <div className="p-4 bg-[#0F214A] text-white flex items-center justify-between sticky top-0 z-10">
              <h3 className="font-black text-sm uppercase">
                {editingStore ? `Editar Loja: ${editingStore.nomeLoja}` : 'Cadastrar Novo CNPJ / Loja Claro'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white text-white hover:text-[#0F214A] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">NUMERO CNPJ *</label>
                  <input
                    type="text"
                    placeholder="00.000.000/0000-00"
                    value={formStore.cnpj}
                    onChange={(e) => setFormStore({ ...formStore, cnpj: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-mono focus:outline-none focus:border-[#0F214A]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">CÓDIGO PDV *</label>
                  <input
                    type="text"
                    placeholder="Ex: 3QCV, 9GWC..."
                    value={formStore.pdv}
                    onChange={(e) => setFormStore({ ...formStore, pdv: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-mono uppercase font-bold focus:outline-none focus:border-[#0F214A]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">TIPO LAYOUT</label>
                  <select
                    value={formStore.tipoLayout}
                    onChange={(e) => setFormStore({ ...formStore, tipoLayout: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none"
                  >
                    <option value="LAYOUT CONCEITO">LAYOUT CONCEITO</option>
                    <option value="LAYOUT BÁSICO">LAYOUT BÁSICO</option>
                    <option value="LAYOUT ANTIGO">LAYOUT ANTIGO</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">NOME DA LOJA *</label>
                <input
                  type="text"
                  placeholder="Ex: UNIDADE 01 - SHOPPING MORUMBI"
                  value={formStore.nomeLoja}
                  onChange={(e) => setFormStore({ ...formStore, nomeLoja: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold focus:outline-none focus:border-[#0F214A]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">GERENTE</label>
                  <input
                    type="text"
                    value={formStore.gerente}
                    onChange={(e) => setFormStore({ ...formStore, gerente: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">TELEFONE</label>
                  <input
                    type="text"
                    value={formStore.telefone}
                    onChange={(e) => setFormStore({ ...formStore, telefone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">EMAIL GERENTE</label>
                  <input
                    type="email"
                    value={formStore.emailGerente}
                    onChange={(e) => setFormStore({ ...formStore, emailGerente: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">COORDENADOR DA LOJA</label>
                  <input
                    type="text"
                    value={formStore.coordenador}
                    onChange={(e) => setFormStore({ ...formStore, coordenador: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl uppercase font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">GN (GESTOR DE NEGÓCIOS)</label>
                  <input
                    type="text"
                    value={formStore.gn}
                    onChange={(e) => setFormStore({ ...formStore, gn: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl uppercase font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">LOGRADOURO</label>
                  <input
                    type="text"
                    value={formStore.logradouro}
                    onChange={(e) => setFormStore({ ...formStore, logradouro: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">NÚMERO</label>
                  <input
                    type="text"
                    value={formStore.numero}
                    onChange={(e) => setFormStore({ ...formStore, numero: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">COMPLEMENTO</label>
                  <input
                    type="text"
                    value={formStore.complemento}
                    onChange={(e) => setFormStore({ ...formStore, complemento: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div>
                  <label className="block font-bold text-gray-700 mb-1 font-sans">IP FIXO</label>
                  <input
                    type="text"
                    value={formStore.ipFixo}
                    onChange={(e) => setFormStore({ ...formStore, ipFixo: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1 font-sans">SAP CLIENTE</label>
                  <input
                    type="text"
                    value={formStore.sapCliente}
                    onChange={(e) => setFormStore({ ...formStore, sapCliente: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1 font-sans">SAP FORNECEDOR</label>
                  <input
                    type="text"
                    value={formStore.sapFornecedor}
                    onChange={(e) => setFormStore({ ...formStore, sapFornecedor: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1 font-sans">ATLAS</label>
                  <input
                    type="text"
                    value={formStore.atlas}
                    onChange={(e) => setFormStore({ ...formStore, atlas: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none"
                  />
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
                  Salvar Loja
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
