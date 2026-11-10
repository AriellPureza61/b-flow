import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Edit2,
  X,
  Check,
  Building2,
  Download,
  AlertCircle
} from 'lucide-react';

export default function PendenciasView({
  pendencias,
  onAddPendencia,
  onUpdatePendencia,
  onDeletePendencia,
  stores
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPrioridade, setFilterPrioridade] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPendencia, setEditingPendencia] = useState(null);

  const emptyPendencia = {
    nome: '',
    dataInclusao: new Date().toISOString().slice(0, 10),
    prazo: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    status: 'Pendente',
    prioridade: 'Alta',
    lojaPdv: stores[0]?.pdv || 'GERAL',
    responsavel: 'GN Claro'
  };

  const [formPendencia, setFormPendencia] = useState(emptyPendencia);

  // Helper to check deadline urgency
  const getDeadlineInfo = (prazoStr, status) => {
    if (status === 'Resolvido') {
      return { label: 'Concluído', color: 'text-[#12813d] bg-[#e9f8ef] border-[#bfe8ce]', urgent: false };
    }
    if (!prazoStr) return { label: 'Sem prazo', color: 'text-gray-500 bg-gray-100', urgent: false };

    const todayStr = new Date().toISOString().slice(0, 10);
    const prazo = new Date(prazoStr + 'T00:00:00');
    const today = new Date(todayStr + 'T00:00:00');
    const diffTime = prazo - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        label: `Atrasada (${Math.abs(diffDays)}d)`,
        color: 'text-[#8d0d20] bg-[#fdeaed] border-[#f4c2ca] font-black',
        urgent: true
      };
    } else if (diffDays === 0) {
      return {
        label: 'Vence HOJE!',
        color: 'text-[#8a5a00] bg-[#fff6e5] border-[#f6dfae] font-black',
        urgent: true
      };
    } else if (diffDays <= 2) {
      return {
        label: `Vence em ${diffDays}d`,
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        urgent: false
      };
    } else {
      return {
        label: `No prazo (${diffDays}d)`,
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        urgent: false
      };
    }
  };

  // KPIs
  const stats = useMemo(() => {
    let pendentes = 0;
    let emAndamento = 0;
    let resolvidas = 0;
    let atrasadas = 0;
    let vencemHoje = 0;

    const todayStr = new Date().toISOString().slice(0, 10);

    pendencias.forEach((p) => {
      if (p.status === 'Resolvido') {
        resolvidas++;
      } else {
        if (p.status === 'Em Andamento') emAndamento++;
        else pendentes++;

        if (p.prazo) {
          if (p.prazo < todayStr) atrasadas++;
          else if (p.prazo === todayStr) vencemHoje++;
        }
      }
    });

    return {
      total: pendencias.length,
      pendentes,
      emAndamento,
      resolvidas,
      atrasadas,
      vencemHoje
    };
  }, [pendencias]);

  // Filtered List
  const filteredList = useMemo(() => {
    return pendencias.filter((p) => {
      const term = searchTerm.toLowerCase();
      const matchSearch =
        p.nome.toLowerCase().includes(term) ||
        (p.lojaPdv && p.lojaPdv.toLowerCase().includes(term)) ||
        (p.responsavel && p.responsavel.toLowerCase().includes(term));

      const matchStatus = filterStatus === 'ALL' || p.status === filterStatus;
      const matchPrioridade = filterPrioridade === 'ALL' || p.prioridade === filterPrioridade;

      return matchSearch && matchStatus && matchPrioridade;
    });
  }, [pendencias, searchTerm, filterStatus, filterPrioridade]);

  const handleOpenAddModal = () => {
    setEditingPendencia(null);
    setFormPendencia(emptyPendencia);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingPendencia(item);
    setFormPendencia({
      nome: item.nome || '',
      dataInclusao: item.dataInclusao || new Date().toISOString().slice(0, 10),
      prazo: item.prazo || '',
      status: item.status || 'Pendente',
      prioridade: item.prioridade || 'Alta',
      lojaPdv: item.lojaPdv || 'GERAL',
      responsavel: item.responsavel || 'GN Claro'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formPendencia.nome || !formPendencia.prazo) {
      alert('Informe o nome da pendência e o prazo para resolução.');
      return;
    }

    if (editingPendencia) {
      onUpdatePendencia({ ...formPendencia, id: editingPendencia.id });
    } else {
      const newId = 'PND-' + Date.now().toString().slice(-6);
      onAddPendencia({ ...formPendencia, id: newId });
    }

    setIsModalOpen(false);
  };

  const handleToggleStatus = (item) => {
    const nextStatus =
      item.status === 'Pendente'
        ? 'Em Andamento'
        : item.status === 'Em Andamento'
        ? 'Resolvido'
        : 'Pendente';
    onUpdatePendencia({ ...item, status: nextStatus });
  };

  const handleExportCsv = () => {
    const headers = ['ID', 'NOME_DA_PENDENCIA', 'DATA_INCLUSAO', 'PRAZO_RESOLVER', 'STATUS', 'PRIORIDADE', 'LOJA_PDV', 'RESPONSAVEL'];
    const rows = filteredList.map((p) => [
      p.id,
      `"${(p.nome || '').replace(/"/g, '""')}"`,
      p.dataInclusao,
      p.prazo,
      p.status,
      p.prioridade,
      p.lojaPdv,
      `"${(p.responsavel || '').replace(/"/g, '""')}"`
    ]);

    const csvText = '\uFEFF' + [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `pendencias_gn_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 500);
  };

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      {/* Briefing Header Card */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-[#0F214A] text-white tracking-wider">
              6° ABA DO BRIEFING
            </span>
            <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
              Controle Geral de Rotina
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#1F2937] tracking-tight mt-1">
            Gestão de Pendências do GN
          </h1>
          <p className="text-sm text-gray-700 font-medium mt-0.5">
            Cadastre pendências com data de inclusão e prazo para resolver. Mantenha o controle da sua rotina e evite atrasos operacionais.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold shadow-sm transition-all"
            title="Exportar pendências em CSV"
          >
            <Download className="w-4 h-4 text-gray-500" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F214A] hover:bg-[#d00000] text-white text-xs font-black shadow-md shadow-slate-900/10 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Nova Pendência</span>
          </button>
        </div>
      </div>

      {/* KPI Cards  */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Abertas */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-4 shadow-sm relative overflow-hidden pl-5">
          <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-[#1F2937]" />
          <div className="text-[11px] font-black tracking-wider text-gray-700 uppercase">
            Total em Aberto
          </div>
          <div className="text-2xl font-black text-[#1F2937] mt-1">
            {stats.pendentes + stats.emAndamento}
          </div>
          <div className="text-xs text-gray-700 font-bold mt-1">
            {stats.pendentes} pendentes + {stats.emAndamento} em andamento
          </div>
        </div>

        {/* Atrasadas */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-4 shadow-sm relative overflow-hidden pl-5">
          <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-[#b3001b]" />
          <div className="text-[11px] font-black tracking-wider text-[#b3001b] uppercase">
            Pendências Atrasadas
          </div>
          <div className="text-2xl font-black text-[#b3001b] mt-1">
            {stats.atrasadas}
          </div>
          <div className="text-xs text-[#8d0d20] font-bold mt-1">
            Requer atenção imediata do GN
          </div>
        </div>

        {/* Vencem Hoje */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-4 shadow-sm relative overflow-hidden pl-5">
          <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-[#f59e0b]" />
          <div className="text-[11px] font-black tracking-wider text-[#8a5a00] uppercase">
            Vencendo Hoje
          </div>
          <div className="text-2xl font-black text-[#8a5a00] mt-1">
            {stats.vencemHoje}
          </div>
          <div className="text-xs text-gray-700 font-bold mt-1">
            Prazo limite encerra hoje
          </div>
        </div>

        {/* Resolvidas */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-4 shadow-sm relative overflow-hidden pl-5">
          <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-[#12813d]" />
          <div className="text-[11px] font-black tracking-wider text-[#12813d] uppercase">
            Concluídas / Resolvidas
          </div>
          <div className="text-2xl font-black text-[#12813d] mt-1">
            {stats.resolvidas}
          </div>
          <div className="text-xs text-gray-700 font-bold mt-1">
            {stats.total > 0 ? ((stats.resolvidas / stats.total) * 100).toFixed(0) : 0}% de resolução
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
            placeholder="Buscar por pendência, loja ou responsável..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-800 placeholder-gray-600 focus:outline-none focus:border-[#0F214A] transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#0F214A] bg-white cursor-pointer"
          >
            <option value="ALL">Todos os Status</option>
            <option value="Pendente">Pendente</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Resolvido">Resolvido</option>
          </select>

          {/* Prioridade Filter */}
          <select
            value={filterPrioridade}
            onChange={(e) => setFilterPrioridade(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#0F214A] bg-white cursor-pointer"
          >
            <option value="ALL">Todas as Prioridades</option>
            <option value="Alta">Alta Prioridade</option>
            <option value="Média">Média Prioridade</option>
            <option value="Baixa">Baixa Prioridade</option>
          </select>

          {(searchTerm || filterStatus !== 'ALL' || filterPrioridade !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('ALL');
                setFilterPrioridade('ALL');
              }}
              className="text-xs font-bold text-[#0F214A] hover:underline px-2 py-1"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Table of Pendencias */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#e2e8f0] flex items-center justify-between">
          <div className="text-xs font-black text-[#1F2937] uppercase tracking-wider">
            Painel de Pendências ({filteredList.length})
          </div>
          <span className="text-[11px] font-bold text-gray-700">
            Dica: Clique no checkbox ou status para alternar entre Pendente, Em Andamento e Resolvido
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-10 text-center">Status</th>
                <th className="py-3 px-4">Nome da Pendência</th>
                <th className="py-3 px-4">Loja / PDV</th>
                <th className="py-3 px-4">Data Inclusão</th>
                <th className="py-3 px-4">Prazo para Resolver</th>
                <th className="py-3 px-4 text-center">Situação do Prazo</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-600">
                    Nenhuma pendência encontrada com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => {
                  const deadline = getDeadlineInfo(item.prazo, item.status);
                  const isDone = item.status === 'Resolvido';

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-sky-50/20 transition-colors ${
                        isDone ? 'bg-gray-50/40 opacity-75' : ''
                      }`}
                    >
                      {/* Quick Toggle Checkbox */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(item)}
                          className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                            isDone
                              ? 'bg-[#12813d] border-[#12813d] text-white'
                              : item.status === 'Em Andamento'
                              ? 'bg-amber-100 border-amber-300 text-amber-700'
                              : 'border-gray-300 hover:border-[#0F214A] text-transparent'
                          }`}
                          title="Clique para alternar status"
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                        </button>
                      </td>

                      {/* Nome da Pendência */}
                      <td className="py-3 px-4">
                        <div
                          className={`font-black text-sm text-[#1F2937] ${
                            isDone ? 'line-through text-gray-500' : ''
                          }`}
                        >
                          {item.nome}
                        </div>
                        {item.responsavel && (
                          <div className="text-[11px] text-gray-600 font-semibold mt-0.5">
                            Responsável: {item.responsavel}
                          </div>
                        )}
                      </td>

                      {/* Loja / PDV */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-gray-100 text-gray-700">
                          {item.lojaPdv || 'GERAL'}
                        </span>
                      </td>

                      {/* Data Inclusão */}
                      <td className="py-3 px-4 text-gray-700 font-semibold">
                        {item.dataInclusao
                          ? new Date(item.dataInclusao + 'T00:00:00').toLocaleDateString('pt-BR')
                          : '-'}
                      </td>

                      {/* Prazo para Resolver */}
                      <td className="py-3 px-4 font-black text-gray-800">
                        {item.prazo
                          ? new Date(item.prazo + 'T00:00:00').toLocaleDateString('pt-BR')
                          : '-'}
                      </td>

                      {/* Situação do Prazo */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border ${deadline.color}`}
                        >
                          {deadline.label}
                        </span>
                      </td>

                      {/* Ações */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Editar pendência"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Excluir a pendência "${item.nome}"?`)) {
                                onDeletePendencia(item.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                            title="Excluir pendência"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nova / Editar Pendência */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
            <div className="bg-[#0F214A] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5" />
                <h3 className="font-black text-base">
                  {editingPendencia ? 'Editar Pendência' : 'Cadastrar Nova Pendência'}
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
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Nome da Pendência *
                </label>
                <textarea
                  rows={2}
                  value={formPendencia.nome}
                  onChange={(e) => setFormPendencia({ ...formPendencia, nome: e.target.value })}
                  placeholder="Ex: Liberar acesso Solar para vendedores ou Trocar ponto de rede"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#0F214A]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Data da Inclusão *
                  </label>
                  <input
                    type="date"
                    value={formPendencia.dataInclusao}
                    onChange={(e) =>
                      setFormPendencia({ ...formPendencia, dataInclusao: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium text-gray-800 focus:outline-none focus:border-[#0F214A]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Prazo para Resolver *
                  </label>
                  <input
                    type="date"
                    value={formPendencia.prazo}
                    onChange={(e) => setFormPendencia({ ...formPendencia, prazo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#0F214A]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Status da Pendência
                  </label>
                  <select
                    value={formPendencia.status}
                    onChange={(e) => setFormPendencia({ ...formPendencia, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#0F214A]"
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Em Andamento">Em Andamento</option>
                    <option value="Resolvido">Resolvido</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Prioridade
                  </label>
                  <select
                    value={formPendencia.prioridade}
                    onChange={(e) =>
                      setFormPendencia({ ...formPendencia, prioridade: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#0F214A]"
                  >
                    <option value="Alta">Alta</option>
                    <option value="Média">Média</option>
                    <option value="Baixa">Baixa</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Loja / PDV
                  </label>
                  <select
                    value={formPendencia.lojaPdv}
                    onChange={(e) =>
                      setFormPendencia({ ...formPendencia, lojaPdv: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#0F214A]"
                  >
                    <option value="GERAL">GERAL (Todas as Lojas)</option>
                    {stores.map((s) => (
                      <option key={s.pdv} value={s.pdv}>
                        {s.pdv} - {s.nomeLoja}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Responsável
                  </label>
                  <input
                    type="text"
                    value={formPendencia.responsavel}
                    onChange={(e) =>
                      setFormPendencia({ ...formPendencia, responsavel: e.target.value })
                    }
                    placeholder="GN / Suporte / Gerente"
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
                  {editingPendencia ? 'Salvar Alterações' : 'Cadastrar Pendência'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
