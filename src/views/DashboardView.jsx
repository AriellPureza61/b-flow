import React, { useState } from 'react';
import StatCard from '../components/StatCard';
import {
  TrendingUp,
  Target,
  Award,
  SunMedium,
  Calendar,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Edit2,
  X,
  Check
} from 'lucide-react';

export default function DashboardView({
  campaign,
  onUpdateCampaign,
  stores,
  productSummary,
  topSellers,
  backlog,
  solarAdhesion,
  pex,
  onNavigate,
  gnProfile
}) {
  const [isEditingCampaign, setIsEditingCampaign] = useState(false);
  const [campaignForm, setCampaignForm] = useState({
    nome: campaign.nome,
    diasUteis: campaign.diasUteis,
    diasRealizados: campaign.diasRealizados,
    diasFaltantes: campaign.diasFaltantes,
    metaGeral: campaign.metaGeral,
    realGeral: campaign.realGeral
  });

  const percentMeta = campaign.metaGeral > 0
    ? ((campaign.realGeral / campaign.metaGeral) * 100).toFixed(1)
    : 0;

  const handleSaveCampaign = (e) => {
    e.preventDefault();
    const gap = campaignForm.realGeral - campaignForm.metaGeral;
    const ritmo = campaignForm.diasFaltantes > 0
      ? Math.abs(gap / campaignForm.diasFaltantes).toFixed(2)
      : 0;

    onUpdateCampaign({
      ...campaignForm,
      gapGeral: gap,
      ritmoNecessarioDia: Number(ritmo)
    });
    setIsEditingCampaign(false);
  };

  return (
    <div className="space-y-6">
      {/* Executive Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 lg:p-8 shadow-xl border border-slate-700/50">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-sky-300">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              {campaign.nome || 'Campanha Desafio - Ciclo Comercial'}
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              Acompanhamento de Metas & Produção
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              Painel de gestão para o Gestor de Negócios Claro. Acompanhe {stores.length} PDVs, vendedores, campanhas de incentivo, qualidade PEX e backlog em tempo real.
            </p>
          </div>

          {/* Cycle Timeline Card with Edit Action */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/15 p-4 rounded-2xl flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#0F214A] text-white rounded-xl shadow-md">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-300 font-semibold">
                  Status do Período
                </div>
                <div className="text-lg font-black text-white">
                  {campaign.diasRealizados} de {campaign.diasUteis} dias úteis
                </div>
                <div className="text-xs text-amber-300 font-medium">
                  Faltam {campaign.diasFaltantes} dias para fechar a meta
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setCampaignForm({
                  nome: campaign.nome,
                  diasUteis: campaign.diasUteis,
                  diasRealizados: campaign.diasRealizados,
                  diasFaltantes: campaign.diasFaltantes,
                  metaGeral: campaign.metaGeral,
                  realGeral: campaign.realGeral
                });
                setIsEditingCampaign(true);
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Ajustar Dias e Metas da Campanha"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-96 h-96 bg-[#0F214A]/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Meta Global Desafio"
          value={`${campaign.realGeral} / ${campaign.metaGeral}`}
          subtitle={`Atingimento: ${percentMeta}% da meta`}
          icon={Target}
          badge={`GAP: ${campaign.gapGeral}`}
          color="red"
        />
        <StatCard
          title="Ritmo Diário Necessário"
          value={`${campaign.ritmoNecessarioDia} / dia`}
          subtitle={`Para zerar o GAP em ${campaign.diasFaltantes} dias`}
          icon={TrendingUp}
          color="amber"
        />
        <StatCard
          title="Qualidade PEX Média"
          value="95.1%"
          subtitle={`${stores.length} lojas auditadas no ciclo`}
          icon={Award}
          color="emerald"
        />
        <StatCard
          title="Aderência Solar"
          value="36.8%"
          subtitle="Crescimento contínuo no ciclo"
          icon={SunMedium}
          trend={+47}
          trendLabel="vs início do período"
          color="blue"
        />
      </div>

      {/* Campanha Desafio: Detalhe por Loja */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-100 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0F214A]" />
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                Campanha Desafio — Ritmo por PDV
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Acompanhamento de vendas realizadas vs meta estipulada e necessidade diária
            </p>
          </div>

          <button
            onClick={() => onNavigate('stores')}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#0F214A] hover:text-[#B81D12] transition-colors"
          >
            <span>Gerenciar Lojas & Metas</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Store Goal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {stores.map((s) => {
            const atingido = s.meta > 0 ? ((s.real / s.meta) * 100).toFixed(0) : 0;
            const isAhead = Number(atingido) >= 40;

            return (
              <div
                key={s.code}
                className="bg-slate-50/70 hover:bg-white rounded-xl p-4 border border-slate-200/70 hover:border-sky-200 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800">
                        {s.code}
                      </span>
                      <span className="text-xs font-bold text-slate-900 truncate max-w-[170px]" title={s.name}>
                        {s.name}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                      <span>Coord: <strong>{s.coordinator || 'Padrão'}</strong></span>
                      <span>•</span>
                      <span>{s.city}</span>
                    </div>
                  </div>

                  <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                    isAhead ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-red-800'
                  }`}>
                    {atingido}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-3.5 space-y-1.5">
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isAhead ? 'bg-emerald-500' : 'bg-[#0F214A]'
                      }`}
                      style={{ width: `${Math.min(Number(atingido), 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                    <span>Real: <strong>{s.real}</strong></span>
                    <span>Meta: <strong>{s.meta}</strong></span>
                    <span className="text-rose-600 font-semibold">GAP: {s.gap}</span>
                    <span>Meta/Dia: <strong>{s.metaDia}</strong></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Mix de Produtos & Top Vendedores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mix de Produtos (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                Mix de Produção & Vendas por Categoria
              </h3>
              <p className="text-xs text-slate-500">
                Volume de contratações de produtos e serviços
              </p>
            </div>
            <button
              onClick={() => onNavigate('sales')}
              className="text-xs font-bold text-[#0F214A] hover:underline"
            >
              Explorar tabela
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {productSummary.slice(0, 10).map((prod) => (
              <div
                key={prod.categoria}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${prod.bg} ${prod.color}`}>
                    {prod.total}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 leading-tight">
                      {prod.categoria}
                    </div>
                  </div>
                </div>
                <div className="text-xs font-black text-slate-900">
                  {prod.total}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Vendedores Ranking (1 Col) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                Top Vendedores
              </h3>
              <p className="text-xs text-slate-500">Líderes de conversão</p>
            </div>
            <button
              onClick={() => onNavigate('sellers')}
              className="text-xs font-bold text-[#0F214A] hover:underline"
            >
              Ver todos
            </button>
          </div>

          <div className="flex-1 mt-4 space-y-3">
            {topSellers.slice(0, 5).map((seller, idx) => (
              <div
                key={seller.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-sky-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                    idx === 0
                      ? 'bg-amber-400 text-amber-950 shadow-sm'
                      : idx === 1
                      ? 'bg-slate-300 text-slate-800'
                      : idx === 2
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[130px]">
                      {seller.nome}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {seller.lojaNome}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-[#0F214A]">
                    {seller.total}
                  </div>
                  <div className="text-[9px] text-slate-400 font-medium">
                    vendas
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigate('sellers')}
              className="w-full py-2.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#0F214A] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Ver Ranking Completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Backlog Alert Section */}
      <div className="bg-gradient-to-r from-sky-500/10 via-amber-500/10 to-transparent p-5 rounded-2xl border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-[#0F214A] text-white rounded-xl shadow-sm shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Acompanhamento do Backlog Residencial ({backlog.total} ordens)
            </h4>
            <p className="text-xs text-slate-600">
              Controle ordens agendadas para hoje e resolva quebras de clientes ou cabeamento.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('backlog')}
          className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 text-xs font-bold rounded-xl shadow-xs transition-all shrink-0"
        >
          Abrir Backlog
        </button>
      </div>

      {/* Modal: Editar Parâmetros da Campanha */}
      {isEditingCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-extrabold text-slate-900">
                Ajustar Parâmetros da Campanha
              </h3>
              <button onClick={() => setIsEditingCampaign(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCampaign} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome da Campanha</label>
                <input
                  type="text"
                  value={campaignForm.nome}
                  onChange={(e) => setCampaignForm({ ...campaignForm, nome: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F214A]"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dias Úteis</label>
                  <input
                    type="number"
                    value={campaignForm.diasUteis}
                    onChange={(e) => {
                      const uteis = Number(e.target.value);
                      const faltam = Math.max(0, uteis - campaignForm.diasRealizados);
                      setCampaignForm({ ...campaignForm, diasUteis: uteis, diasFaltantes: faltam });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Realizados</label>
                  <input
                    type="number"
                    value={campaignForm.diasRealizados}
                    onChange={(e) => {
                      const real = Number(e.target.value);
                      const faltam = Math.max(0, campaignForm.diasUteis - real);
                      setCampaignForm({ ...campaignForm, diasRealizados: real, diasFaltantes: faltam });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Faltantes</label>
                  <input
                    type="number"
                    value={campaignForm.diasFaltantes}
                    onChange={(e) => setCampaignForm({ ...campaignForm, diasFaltantes: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Meta Global</label>
                  <input
                    type="number"
                    value={campaignForm.metaGeral}
                    onChange={(e) => setCampaignForm({ ...campaignForm, metaGeral: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Realizado Global</label>
                  <input
                    type="number"
                    value={campaignForm.realGeral}
                    onChange={(e) => setCampaignForm({ ...campaignForm, realGeral: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingCampaign(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0F214A] hover:bg-[#B81D12] text-white font-bold rounded-xl shadow-md shadow-slate-900/10"
                >
                  Salvar Campanha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
