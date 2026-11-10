import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Plus,
  Receipt,
  Car,
  Utensils,
  Plane,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Trash2,
  Edit2,
  X,
  Check,
  Download,
  CreditCard
} from 'lucide-react';

export default function ReembolsosView({
  reembolsos,
  onAddReembolso,
  onUpdateReembolso,
  onDeleteReembolso
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReembolso, setEditingReembolso] = useState(null);

  const defaultCentroCusto = '10DFCO1S41';

  const emptyReembolso = {
    tipo: 'ESTACIONAMENTO',
    centroCusto: defaultCentroCusto,
    ticket: '',
    valor: '',
    data: new Date().toISOString().slice(0, 10),
    status: 'PENDENTE',
    obs: ''
  };

  const [formReembolso, setFormReembolso] = useState(emptyReembolso);

  // KPIs
  const stats = useMemo(() => {
    let totalPago = 0;
    let totalPendente = 0;
    let totalEmAnalise = 0;
    let totalGeral = 0;

    reembolsos.forEach((r) => {
      const val = parseFloat(r.valor) || 0;
      totalGeral += val;
      if (r.status === 'PAGO') totalPago += val;
      else if (r.status === 'PENDENTE') totalPendente += val;
      else if (r.status === 'EM ANÁLISE') totalEmAnalise += val;
    });

    return {
      totalGeral,
      totalPago,
      totalPendente,
      totalEmAnalise,
      count: reembolsos.length
    };
  }, [reembolsos]);

  // Filtered List
  const filteredList = useMemo(() => {
    return reembolsos.filter((r) => {
      const term = searchTerm.toLowerCase();
      const matchSearch =
        r.ticket.toLowerCase().includes(term) ||
        (r.centroCusto && r.centroCusto.toLowerCase().includes(term)) ||
        (r.obs && r.obs.toLowerCase().includes(term)) ||
        (r.tipo && r.tipo.toLowerCase().includes(term));

      const matchTipo = filterTipo === 'ALL' || r.tipo === filterTipo;
      const matchStatus = filterStatus === 'ALL' || r.status === filterStatus;

      return matchSearch && matchTipo && matchStatus;
    });
  }, [reembolsos, searchTerm, filterTipo, filterStatus]);

  const handleOpenAddModal = () => {
    setEditingReembolso(null);
    setFormReembolso(emptyReembolso);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingReembolso(item);
    setFormReembolso({
      tipo: item.tipo || 'ESTACIONAMENTO',
      centroCusto: item.centroCusto || defaultCentroCusto,
      ticket: item.ticket || '',
      valor: item.valor || '',
      data: item.data || new Date().toISOString().slice(0, 10),
      status: item.status || 'PENDENTE',
      obs: item.obs || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formReembolso.ticket || !formReembolso.valor) {
      alert('Por favor, informe a descrição/ticket e o valor.');
      return;
    }

    const payload = {
      ...formReembolso,
      valor: parseFloat(formReembolso.valor) || 0
    };

    if (editingReembolso) {
      onUpdateReembolso({ ...payload, id: editingReembolso.id });
    } else {
      onAddReembolso({ ...payload, id: 'RMB-' + Date.now().toString().slice(-6) });
    }

    setIsModalOpen(false);
  };

  const handleToggleStatus = (item) => {
    const nextStatus =
      item.status === 'PENDENTE'
        ? 'EM ANÁLISE'
        : item.status === 'EM ANÁLISE'
        ? 'PAGO'
        : 'PENDENTE';
    onUpdateReembolso({ ...item, status: nextStatus });
  };

  const handleExportCsv = () => {
    const headers = ['ID', 'TIPO', 'CENTRO_DE_CUSTO', 'TICKET_DESCRICAO', 'VALOR_R$', 'DATA', 'STATUS', 'OBS'];
    const rows = filteredList.map((r) => [
      r.id,
      r.tipo,
      r.centroCusto,
      `"${(r.ticket || '').replace(/"/g, '""')}"`,
      (r.valor || 0).toFixed(2),
      r.data,
      r.status,
      `"${(r.obs || '').replace(/"/g, '""')}"`
    ]);

    const csvText = '\uFEFF' + [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reembolsos_gn_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 500);
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'ESTACIONAMENTO':
        return <Car className="w-4 h-4 text-blue-600" />;
      case 'ALIMENTAÇÃO':
        return <Utensils className="w-4 h-4 text-amber-600" />;
      case 'VIAGEM':
        return <Plane className="w-4 h-4 text-purple-600" />;
      default:
        return <Receipt className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAGO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#e9f8ef] text-[#12813d] border border-[#bfe8ce]">
            <CheckCircle2 className="w-3 h-3" /> PAGO
          </span>
        );
      case 'EM ANÁLISE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#fff6e5] text-[#8a5a00] border border-[#f6dfae]">
            <Clock className="w-3 h-3" /> EM ANÁLISE
          </span>
        );
      case 'PENDENTE':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#fdeaed] text-[#8d0d20] border border-[#f4c2ca]">
            <AlertCircle className="w-3 h-3" /> PENDENTE
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      {/* Briefing Header Card */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-[#0F214A] text-white tracking-wider">
              4° ABA DO BRIEFING
            </span>
            <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
              Centro de Custo: {defaultCentroCusto}
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#1F2937] tracking-tight mt-1">
            Controle de Reembolsos do GN
          </h1>
          <p className="text-sm text-gray-700 font-medium mt-0.5">
            Acompanhe despesas com Estacionamento, Alimentação e Viagem. Tenha controle claro do valor pago e pendente no mês.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold shadow-sm transition-all"
            title="Exportar planilha de reembolsos em CSV"
          >
            <Download className="w-4 h-4 text-gray-500" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F214A] hover:bg-[#d00000] text-white text-xs font-black shadow-md shadow-slate-900/10 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Novo Reembolso</span>
          </button>
        </div>
      </div>

      {/* KPI Cards  */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Reembolsos */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-4 shadow-sm relative overflow-hidden pl-5">
          <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-[#1F2937]" />
          <div className="text-[11px] font-black tracking-wider text-gray-700 uppercase">
            Total Lançado
          </div>
          <div className="text-2xl font-black text-[#1F2937] mt-1">
            R$ {stats.totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-gray-700 font-bold mt-1">
            {stats.count} {stats.count === 1 ? 'ticket cadastrado' : 'tickets cadastrados'}
          </div>
        </div>

        {/* Total Pago */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-4 shadow-sm relative overflow-hidden pl-5">
          <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-[#12813d]" />
          <div className="text-[11px] font-black tracking-wider text-[#12813d] uppercase">
            Total Pago (Ressarcido)
          </div>
          <div className="text-2xl font-black text-[#12813d] mt-1">
            R$ {stats.totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-gray-700 font-bold mt-1">
            {stats.totalGeral > 0 ? ((stats.totalPago / stats.totalGeral) * 100).toFixed(0) : 0}% do total ressarcido
          </div>
        </div>

        {/* Total Pendente */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-4 shadow-sm relative overflow-hidden pl-5">
          <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-[#b3001b]" />
          <div className="text-[11px] font-black tracking-wider text-[#b3001b] uppercase">
            Total Pendente de Pagamento
          </div>
          <div className="text-2xl font-black text-[#b3001b] mt-1">
            R$ {stats.totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-gray-700 font-bold mt-1">
            Aguardando depósito / processamento
          </div>
        </div>

        {/* Em Análise */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-4 shadow-sm relative overflow-hidden pl-5">
          <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-[#f59e0b]" />
          <div className="text-[11px] font-black tracking-wider text-[#8a5a00] uppercase">
            Em Análise / Validação
          </div>
          <div className="text-2xl font-black text-[#8a5a00] mt-1">
            R$ {stats.totalEmAnalise.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-gray-700 font-bold mt-1">
            Notas fiscais em conferência
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-700" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por ticket, nota fiscal, observação..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-800 placeholder-gray-600 focus:outline-none focus:border-[#0F214A] transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Tipo Filter */}
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#0F214A] bg-white cursor-pointer"
          >
            <option value="ALL">Todos os Tipos</option>
            <option value="ESTACIONAMENTO">Estacionamento</option>
            <option value="ALIMENTAÇÃO">Alimentação</option>
            <option value="VIAGEM">Viagem / Deslocamento</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#0F214A] bg-white cursor-pointer"
          >
            <option value="ALL">Todos os Status</option>
            <option value="PENDENTE">Pendente</option>
            <option value="EM ANÁLISE">Em Análise</option>
            <option value="PAGO">Pago</option>
          </select>

          {(searchTerm || filterTipo !== 'ALL' || filterStatus !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterTipo('ALL');
                setFilterStatus('ALL');
              }}
              className="text-xs font-bold text-[#0F214A] hover:underline px-2 py-1"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Table of Reembolsos */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#e2e8f0] flex items-center justify-between">
          <div className="text-xs font-black text-[#1F2937] uppercase tracking-wider">
            Listagem de Lançamentos ({filteredList.length})
          </div>
          <span className="text-[11px] font-bold text-gray-700">
            Dica: Clique no status para alternar rapidamente entre Pendente, Em Análise e Pago
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Ticket / Motivo</th>
                <th className="py-3 px-4">C. Custo</th>
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4 text-right">Valor (R$)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-600">
                    Nenhum reembolso encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-sky-50/20 transition-colors">
                    {/* Tipo */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-gray-100 shrink-0">
                          {getTipoIcon(item.tipo)}
                        </div>
                        <span className="font-bold text-gray-800">{item.tipo}</span>
                      </div>
                    </td>

                    {/* Ticket / Motivo */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#1F2937]">{item.ticket}</div>
                      {item.obs && (
                        <div className="text-[11px] text-gray-600 font-medium truncate max-w-xs">
                          Obs: {item.obs}
                        </div>
                      )}
                    </td>

                    {/* C. Custo */}
                    <td className="py-3 px-4 font-mono font-bold text-gray-700">
                      {item.centroCusto || defaultCentroCusto}
                    </td>

                    {/* Data */}
                    <td className="py-3 px-4 text-gray-700">
                      {item.data
                        ? new Date(item.data + 'T00:00:00').toLocaleDateString('pt-BR')
                        : '-'}
                    </td>

                    {/* Valor */}
                    <td className="py-3 px-4 text-right font-black text-sm text-[#1F2937]">
                      R${' '}
                      {(parseFloat(item.valor) || 0).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        title="Clique para alternar status"
                        className="transition-transform active:scale-95 cursor-pointer"
                      >
                        {getStatusBadge(item.status)}
                      </button>
                    </td>

                    {/* Ações */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Editar reembolso"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Deseja realmente excluir o reembolso "${item.ticket}"?`)) {
                              onDeleteReembolso(item.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                          title="Excluir reembolso"
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

      {/* Modal Novo / Editar Reembolso */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
            <div className="bg-[#0F214A] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                <h3 className="font-black text-base">
                  {editingReembolso ? 'Editar Reembolso' : 'Novo Reembolso'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white text-white hover:text-[#0F214A] flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Tipo de Reembolso *
                  </label>
                  <select
                    value={formReembolso.tipo}
                    onChange={(e) => setFormReembolso({ ...formReembolso, tipo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#0F214A]"
                  >
                    <option value="ESTACIONAMENTO">ESTACIONAMENTO</option>
                    <option value="ALIMENTAÇÃO">ALIMENTAÇÃO</option>
                    <option value="VIAGEM">VIAGEM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    C. Custo *
                  </label>
                  <input
                    type="text"
                    value={formReembolso.centroCusto}
                    onChange={(e) =>
                      setFormReembolso({ ...formReembolso, centroCusto: e.target.value })
                    }
                    placeholder="10DFCO1S41"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono font-bold text-gray-800 focus:outline-none focus:border-[#0F214A]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Ticket / Descrição / Motivo *
                </label>
                <input
                  type="text"
                  value={formReembolso.ticket}
                  onChange={(e) => setFormReembolso({ ...formReembolso, ticket: e.target.value })}
                  placeholder="Ex: Estacionamento Shopping Sul Valparaíso (Visita Auditoria)"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium text-gray-800 focus:outline-none focus:border-[#0F214A]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Valor do Reembolso (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formReembolso.valor}
                    onChange={(e) => setFormReembolso({ ...formReembolso, valor: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-black text-gray-800 focus:outline-none focus:border-[#0F214A]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Data da Despesa *
                  </label>
                  <input
                    type="date"
                    value={formReembolso.data}
                    onChange={(e) => setFormReembolso({ ...formReembolso, data: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium text-gray-800 focus:outline-none focus:border-[#0F214A]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Status do Reembolso
                  </label>
                  <select
                    value={formReembolso.status}
                    onChange={(e) => setFormReembolso({ ...formReembolso, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#0F214A]"
                  >
                    <option value="PENDENTE">PENDENTE</option>
                    <option value="EM ANÁLISE">EM ANÁLISE</option>
                    <option value="PAGO">PAGO</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Comprovante / Obs
                  </label>
                  <input
                    type="text"
                    value={formReembolso.obs}
                    onChange={(e) => setFormReembolso({ ...formReembolso, obs: e.target.value })}
                    placeholder="Ex: NFC-e 49102"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium text-gray-800 focus:outline-none focus:border-[#0F214A]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0F214A] hover:bg-[#d00000] text-white text-xs font-black shadow-md shadow-slate-900/10 active:scale-95 transition-all"
                >
                  {editingReembolso ? 'Salvar Alterações' : 'Cadastrar Reembolso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
