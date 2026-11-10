import React, { useState, useMemo, useRef } from 'react';
import {
  MapPin,
  Plus,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Sparkles,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  Camera,
  Image as ImageIcon,
  Store,
  FileText,
  ChevronRight,
  ArrowLeft,
  Upload,
  ZoomIn
} from 'lucide-react';

export default function RotasView({
  rotas,
  onAddRota,
  onUpdateRota,
  onDeleteRota,
  stores
}) {
  const [selectedDia, setSelectedDia] = useState('ALL');
  const [selectedRotaId, setSelectedRotaId] = useState(rotas[0]?.id || null);
  const [mobileShowDetail, setMobileShowDetail] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRota, setEditingRota] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const detailRef = useRef(null);

  const diasSemana = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado'
  ];

  const auditFields = [
    {
      key: 'limpeza',
      num: 1,
      title: 'Limpeza de Loja',
      placeholder: 'Incluir observações sobre piso, vidros, balcões e organização geral...'
    },
    {
      key: 'rga',
      num: 2,
      title: 'RGA (Registro Geral de Atendimento)',
      placeholder: 'Incluir observações sobre o preenchimento e conformidade do RGA...'
    },
    {
      key: 'positivacoes',
      num: 3,
      title: 'Positivações & Comunicação Visual',
      placeholder: 'Incluir observações sobre banners, cartazes de campanha, totens e precificadores...'
    },
    {
      key: 'uniforme',
      num: 4,
      title: 'Organização & Padrão de Uniforme',
      placeholder: 'Incluir observações sobre uso de crachá, camisa padrão Claro e calçado...'
    },
    {
      key: 'abastecimentoEstoque',
      num: 5,
      title: 'Abastecimento e Estoque',
      placeholder: 'Incluir observações sobre disponibilidade de aparelhos, chips Pré/Controle e insumos...'
    }
  ];

  const emptyRota = {
    diaSemana: 'Segunda-feira',
    data: new Date().toISOString().slice(0, 10),
    lojaPdv: stores[0]?.pdv || '',
    lojaNome: stores[0]?.nomeLoja || '',
    statusVisita: 'Agendada',
    limpeza: { ok: true, obs: '', fotos: [] },
    rga: { ok: true, obs: '', fotos: [] },
    positivacoes: { ok: true, obs: '', imagem: '', fotos: [] },
    uniforme: { ok: true, obs: '', fotos: [] },
    abastecimentoEstoque: { ok: true, obs: '', fotos: [] },
    prazoAjuste: ''
  };

  const [formRota, setFormRota] = useState(emptyRota);

  const activeRota = useMemo(() => {
    return rotas.find((r) => r.id === selectedRotaId) || rotas[0] || null;
  }, [rotas, selectedRotaId]);

  const filteredRotas = useMemo(() => {
    if (selectedDia === 'ALL') return rotas;
    return rotas.filter((r) => r.diaSemana === selectedDia);
  }, [rotas, selectedDia]);

  const getAuditScore = (rota) => {
    if (!rota) return { okCount: 0, total: 5, pct: 0, isAllOk: false };
    const items = [
      rota.limpeza?.ok,
      rota.rga?.ok,
      rota.positivacoes?.ok,
      rota.uniforme?.ok,
      rota.abastecimentoEstoque?.ok
    ];
    const okCount = items.filter(Boolean).length;
    return {
      okCount,
      total: 5,
      pct: Math.round((okCount / 5) * 100),
      isAllOk: okCount === 5
    };
  };

  const handleSelectRota = (id) => {
    setSelectedRotaId(id);
    setMobileShowDetail(true);
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  const handleOpenAddModal = () => {
    setEditingRota(null);
    setFormRota({
      ...emptyRota,
      lojaPdv: stores[0]?.pdv || '',
      lojaNome: stores[0]?.nomeLoja || ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (rota) => {
    setEditingRota(rota);
    setFormRota({
      diaSemana: rota.diaSemana || 'Segunda-feira',
      data: rota.data || new Date().toISOString().slice(0, 10),
      lojaPdv: rota.lojaPdv || stores[0]?.pdv || '',
      lojaNome: rota.lojaNome || '',
      statusVisita: rota.statusVisita || 'Agendada',
      limpeza: { ...rota.limpeza, fotos: rota.limpeza?.fotos || [] },
      rga: { ...rota.rga, fotos: rota.rga?.fotos || [] },
      positivacoes: { ...rota.positivacoes, fotos: rota.positivacoes?.fotos || [] },
      uniforme: { ...rota.uniforme, fotos: rota.uniforme?.fotos || [] },
      abastecimentoEstoque: { ...rota.abastecimentoEstoque, fotos: rota.abastecimentoEstoque?.fotos || [] },
      prazoAjuste: rota.prazoAjuste || ''
    });
    setIsModalOpen(true);
  };

  const handleStoreSelectChange = (pdvCode) => {
    const st = stores.find((s) => s.pdv === pdvCode);
    setFormRota((prev) => ({
      ...prev,
      lojaPdv: pdvCode,
      lojaNome: st ? st.nomeLoja : ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formRota.lojaPdv) {
      alert('Selecione uma loja para a rota.');
      return;
    }

    if (editingRota) {
      onUpdateRota({ ...formRota, id: editingRota.id });
    } else {
      const newId = 'ROT-' + Date.now().toString().slice(-6);
      onAddRota({ ...formRota, id: newId });
      setSelectedRotaId(newId);
      setMobileShowDetail(true);
    }

    setIsModalOpen(false);
  };

  const handleToggleCheck = (fieldKey) => {
    if (!activeRota) return;
    const currentVal = activeRota[fieldKey]?.ok ?? true;
    const updated = {
      ...activeRota,
      [fieldKey]: {
        ...activeRota[fieldKey],
        ok: !currentVal
      }
    };
    onUpdateRota(updated);
  };

  const handleUpdateObs = (fieldKey, text) => {
    if (!activeRota) return;
    const updated = {
      ...activeRota,
      [fieldKey]: {
        ...activeRota[fieldKey],
        obs: text
      }
    };
    onUpdateRota(updated);
  };

  // Comprime imagem via Canvas para caber com folga no localStorage (PC e Celular)
  const compressImageFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 900;
          let width = img.width;
          let height = img.height;

          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.72);
          resolve({
            id: 'IMG-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
            name: file.name,
            dataUrl,
            createdAt: new Date().toLocaleString('pt-BR')
          });
        };
        img.onerror = reject;
        img.src = event.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleUploadAuditImage = async (fieldKey, e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !activeRota) return;

    try {
      const compressedList = [];
      for (const f of files) {
        const compressed = await compressImageFile(f);
        compressedList.push(compressed);
      }

      const currentFotos = activeRota[fieldKey]?.fotos || [];
      const updated = {
        ...activeRota,
        [fieldKey]: {
          ...activeRota[fieldKey],
          fotos: [...currentFotos, ...compressedList]
        }
      };
      onUpdateRota(updated);
    } catch (err) {
      alert('Não foi possível processar a imagem selecionada.');
    }
    e.target.value = '';
  };

  const handleRemoveAuditImage = (fieldKey, imgId) => {
    if (!activeRota) return;
    const currentFotos = activeRota[fieldKey]?.fotos || [];
    const updated = {
      ...activeRota,
      [fieldKey]: {
        ...activeRota[fieldKey],
        fotos: currentFotos.filter((f) => f.id !== imgId)
      }
    };
    onUpdateRota(updated);
  };

  const handleUpdatePrazo = (newDate) => {
    if (!activeRota) return;
    onUpdateRota({ ...activeRota, prazoAjuste: newDate });
  };

  const handleUpdateStatusVisita = (newStatus) => {
    if (!activeRota) return;
    onUpdateRota({ ...activeRota, statusVisita: newStatus });
  };

  const activeScore = getAuditScore(activeRota);

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      {/* Briefing Header Card */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-[#0F214A] text-white tracking-wider">
              5° ABA DO BRIEFING
            </span>
            <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
              Auditorias com Inclusão de Fotos
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#1F2937] tracking-tight mt-1">
            Rota Semanal & Mapa de Auditorias
          </h1>
          <p className="text-sm text-gray-700 font-medium mt-0.5">
            Organize a rota semanal do GN e audite: Limpeza, RGA, Positivações, Uniforme e Estoque — agora com inclusão de fotos direto do celular ou PC.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F214A] hover:bg-[#d00000] text-white text-xs font-black shadow-md shadow-slate-900/10 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Agendar Nova Rota / Visita</span>
          </button>
        </div>
      </div>

      {/* Week Day Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => { setSelectedDia('ALL'); setMobileShowDetail(false); }}
          className={`px-3.5 py-2 rounded-xl text-xs font-black shrink-0 transition-all ${
            selectedDia === 'ALL'
              ? 'bg-[#1F2937] text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Semana Inteira ({rotas.length})
        </button>

        {diasSemana.map((dia) => {
          const count = rotas.filter((r) => r.diaSemana === dia).length;
          const isSelected = selectedDia === dia;
          return (
            <button
              key={dia}
              onClick={() => { setSelectedDia(dia); setMobileShowDetail(false); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-[#0F214A] text-white shadow-md shadow-slate-900/10 font-black'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span>{dia}</span>
              {count > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                    isSelected ? 'bg-white text-[#0F214A]' : 'bg-sky-50 text-[#0F214A]'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Master-Detail Layout: Left Rota Cards | Right Audit Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List of Visitas na Rota (5 cols) */}
        <div
          className={`lg:col-span-5 space-y-3 ${
            mobileShowDetail ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="text-xs font-black text-gray-700 uppercase tracking-wider px-1 flex items-center justify-between">
            <span>Visitas Cadastradas ({filteredRotas.length})</span>
            <span className="text-[11px] font-bold text-[#0F214A]">Toque para abrir auditoria</span>
          </div>

          {filteredRotas.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 text-center text-gray-600 text-xs">
              Nenhuma visita agendada para este dia. Clique em "+ Agendar Nova Rota" para adicionar.
            </div>
          ) : (
            filteredRotas.map((rota) => {
              const isSelected = activeRota?.id === rota.id;
              const score = getAuditScore(rota);

              return (
                <div
                  key={rota.id}
                  onClick={() => handleSelectRota(rota.id)}
                  className={`bg-white rounded-2xl border p-4 cursor-pointer transition-all relative overflow-hidden ${
                    isSelected
                      ? 'border-[#0F214A] ring-2 ring-sky-500/15 shadow-md pl-5'
                      : 'border-[#e2e8f0] hover:border-[#0F214A] shadow-sm pl-4'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-[#0F214A]" />
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black uppercase text-[#0F214A] bg-sky-50 px-2 py-0.5 rounded">
                          {rota.diaSemana}
                        </span>
                        <span className="text-xs text-gray-700 font-semibold">
                          {rota.data ? new Date(rota.data + 'T00:00:00').toLocaleDateString('pt-BR') : ''}
                        </span>
                      </div>
                      <div className="font-black text-sm text-[#1F2937] truncate mt-1">
                        {rota.lojaNome || 'Loja Claro'}
                      </div>
                      <div className="text-xs font-bold text-gray-700 mt-0.5">
                        PDV: <span className="font-mono text-[#0F214A]">{rota.lojaPdv}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          rota.statusVisita === 'Realizada'
                            ? 'bg-[#e9f8ef] text-[#12813d]'
                            : rota.statusVisita === 'Em Andamento'
                            ? 'bg-[#fff6e5] text-[#8a5a00]'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {rota.statusVisita}
                      </span>

                      <div
                        className={`text-[11px] font-black px-2 py-0.5 rounded ${
                          score.isAllOk
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {score.okCount}/5 OK
                      </div>
                    </div>
                  </div>

                  {/* Quick indicators of 5 items */}
                  <div className="grid grid-cols-5 gap-1 mt-3 pt-3 border-t border-gray-100 text-[10px] font-bold text-center">
                    <div className={`p-1 rounded ${rota.limpeza?.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-sky-700'}`}>
                      Limp.
                    </div>
                    <div className={`p-1 rounded ${rota.rga?.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-sky-700'}`}>
                      RGA
                    </div>
                    <div className={`p-1 rounded ${rota.positivacoes?.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-sky-700'}`}>
                      Posit.
                    </div>
                    <div className={`p-1 rounded ${rota.uniforme?.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-sky-700'}`}>
                      Unif.
                    </div>
                    <div className={`p-1 rounded ${rota.abastecimentoEstoque?.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-sky-700'}`}>
                      Estoque
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Detailed Audit Inspector (7 cols) */}
        <div
          ref={detailRef}
          className={`lg:col-span-7 scroll-mt-20 ${
            mobileShowDetail ? 'block' : 'hidden lg:block'
          }`}
        >
          {activeRota ? (
            <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6 space-y-6">
              {/* Mobile Back Button */}
              <div className="lg:hidden pb-3 border-b border-[#e2e8f0]">
                <button
                  onClick={() => setMobileShowDetail(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F214A] text-white rounded-xl text-xs font-black shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar para Lista de Rotas</span>
                </button>
              </div>

              {/* Header of Active Inspection */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#e2e8f0] gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#0F214A] bg-sky-50 px-2.5 py-0.5 rounded-lg uppercase">
                      {activeRota.diaSemana} - {activeRota.data ? new Date(activeRota.data + 'T00:00:00').toLocaleDateString('pt-BR') : ''}
                    </span>
                    <span className="text-xs font-bold text-gray-700">
                      PDV: <b className="font-mono text-[#0F214A]">{activeRota.lojaPdv}</b>
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-[#1F2937] mt-1">
                    {activeRota.lojaNome}
                  </h2>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={activeRota.statusVisita}
                    onChange={(e) => handleUpdateStatusVisita(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-black text-gray-700 bg-gray-50 focus:outline-none focus:border-[#0F214A] cursor-pointer"
                  >
                    <option value="Agendada">Agendada</option>
                    <option value="Em Andamento">Em Andamento</option>
                    <option value="Realizada">Realizada</option>
                  </select>

                  <button
                    onClick={() => handleOpenEditModal(activeRota)}
                    className="p-2 rounded-xl text-gray-500 hover:text-[#0F214A] hover:bg-sky-50 transition-colors"
                    title="Editar informações da rota"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Excluir esta rota de visita?')) {
                        onDeleteRota(activeRota.id);
                        setMobileShowDetail(false);
                      }
                    }}
                    className="p-2 rounded-xl text-gray-500 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                    title="Excluir visita"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Conformity Banner */}
              <div
                className={`p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border ${
                  activeScore.isAllOk
                    ? 'bg-[#e9f8ef] border-[#bfe8ce] text-[#12813d]'
                    : 'bg-[#fff6e5] border-[#f6dfae] text-[#8a5a00]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {activeScore.isAllOk ? (
                    <CheckCircle2 className="w-6 h-6 text-[#12813d] shrink-0" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-[#8a5a00] shrink-0" />
                  )}
                  <div>
                    <div className="font-black text-sm">
                      {activeScore.isAllOk
                        ? 'Loja 100% Conforme com os Padrões Claro'
                        : `${5 - activeScore.okCount} Não-Conformidade(s) Encontrada(s)`}
                    </div>
                    <div className="text-xs font-medium opacity-90">
                      Score de Auditoria: {activeScore.okCount} de 5 itens conformes ({activeScore.pct}%)
                    </div>
                  </div>
                </div>

                <div className="sm:text-right">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-gray-700">
                    Prazo para Ajuste
                  </label>
                  <input
                    type="date"
                    value={activeRota.prazoAjuste || ''}
                    onChange={(e) => handleUpdatePrazo(e.target.value)}
                    className="mt-1 px-2.5 py-1 rounded-lg border border-gray-300 text-xs font-bold text-gray-800 bg-white focus:outline-none focus:border-[#0F214A]"
                  />
                </div>
              </div>

              {/* 5 Checklist Items com Inclusão de Imagem / Foto em TODOS os itens */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-black text-[#1F2937] uppercase tracking-wider">
                    Checklist Oficial de Auditoria GN (Com Anexos de Foto)
                  </div>
                  <span className="text-[11px] font-bold text-[#0F214A]">
                    Tire foto pelo celular ou anexe do computador
                  </span>
                </div>

                {auditFields.map((item) => {
                  const fieldData = activeRota[item.key] || { ok: true, obs: '', fotos: [] };
                  const fotos = fieldData.fotos || [];

                  return (
                    <div
                      key={item.key}
                      className="p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-colors space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-sky-50 text-[#0F214A] font-black text-xs flex items-center justify-center">
                            {item.num}
                          </span>
                          <span className="text-xs font-black text-[#1F2937]">
                            {item.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Botão para Anexar / Tirar Foto */}
                          <label className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-[#e6f7fb] hover:bg-[#ffe4e4] text-[#0F214A] border border-[#bde8f4] cursor-pointer transition-all">
                            <Camera className="w-3.5 h-3.5" />
                            <span>+ Incluir Imagem / Foto</span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => handleUploadAuditImage(item.key, e)}
                              className="hidden"
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => handleToggleCheck(item.key)}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black transition-all ${
                              fieldData.ok
                                ? 'bg-[#e9f8ef] text-[#12813d] border border-[#bfe8ce]'
                                : 'bg-[#fdeaed] text-[#8d0d20] border border-[#f4c2ca]'
                            }`}
                          >
                            {fieldData.ok ? (
                              <>
                                <Check className="w-3.5 h-3.5 stroke-[3]" /> CONFORME / OK
                              </>
                            ) : (
                              <>
                                <X className="w-3.5 h-3.5 stroke-[3]" /> IRREGULAR
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <input
                        type="text"
                        value={fieldData.obs || ''}
                        onChange={(e) => handleUpdateObs(item.key, e.target.value)}
                        placeholder={item.placeholder}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0F214A]"
                      />

                      {/* Galeria de Fotos Anexadas neste Item */}
                      {fotos.length > 0 && (
                        <div className="pt-2 flex flex-wrap items-center gap-3">
                          {fotos.map((foto) => (
                            <div
                              key={foto.id}
                              className="relative group w-24 h-24 rounded-xl overflow-hidden border border-[#e2e8f0] shadow-xs bg-[#f8fafc]"
                            >
                              <img
                                src={foto.dataUrl}
                                alt={foto.name || 'Foto da Auditoria'}
                                onClick={() => setPreviewImage(foto)}
                                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveAuditImage(item.key, foto.id)}
                                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white hover:bg-[#0F214A] flex items-center justify-center transition-colors"
                                title="Remover foto"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                              <div
                                onClick={() => setPreviewImage(foto)}
                                className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 truncate cursor-pointer flex items-center justify-center gap-1"
                              >
                                <ZoomIn className="w-2.5 h-2.5" />
                                <span>Ampliar</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-12 text-center text-gray-600 text-xs">
              Selecione uma visita à esquerda para ver e editar o checklist de auditoria.
            </div>
          )}
        </div>
      </div>

      {/* Modal de Visualização de Foto em Tela Cheia */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#e2e8f0]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 bg-[#0F214A] text-white flex items-center justify-between">
              <span className="text-xs font-black truncate">
                Foto de Auditoria ({previewImage.createdAt || 'Registrada'})
              </span>
              <button
                onClick={() => setPreviewImage(null)}
                className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white text-white hover:text-[#0F214A] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 bg-black flex items-center justify-center max-h-[80vh]">
              <img
                src={previewImage.dataUrl}
                alt="Auditoria Ampliada"
                className="max-h-[75vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal Nova / Editar Rota */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
            <div className="bg-[#0F214A] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <h3 className="font-black text-base">
                  {editingRota ? 'Editar Rota de Visita' : 'Agendar Rota Semanal'}
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
                    Dia da Semana *
                  </label>
                  <select
                    value={formRota.diaSemana}
                    onChange={(e) => setFormRota({ ...formRota, diaSemana: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#0F214A]"
                  >
                    {diasSemana.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Data Prevista *
                  </label>
                  <input
                    type="date"
                    value={formRota.data}
                    onChange={(e) => setFormRota({ ...formRota, data: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium text-gray-800 focus:outline-none focus:border-[#0F214A]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Selecione a Loja / PDV *
                </label>
                <select
                  value={formRota.lojaPdv}
                  onChange={(e) => handleStoreSelectChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#0F214A]"
                >
                  {stores.map((s) => (
                    <option key={s.pdv} value={s.pdv}>
                      {s.pdv} - {s.nomeLoja} ({s.coordenador})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Status da Visita
                  </label>
                  <select
                    value={formRota.statusVisita}
                    onChange={(e) => setFormRota({ ...formRota, statusVisita: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#0F214A]"
                  >
                    <option value="Agendada">Agendada</option>
                    <option value="Em Andamento">Em Andamento</option>
                    <option value="Realizada">Realizada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Prazo Inicial de Ajuste
                  </label>
                  <input
                    type="date"
                    value={formRota.prazoAjuste || ''}
                    onChange={(e) => setFormRota({ ...formRota, prazoAjuste: e.target.value })}
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
                  {editingRota ? 'Salvar Alterações' : 'Agendar Visita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
