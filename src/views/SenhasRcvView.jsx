import React, { useState, useMemo, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
  Key,
  Plus,
  Upload,
  Download,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  AlertTriangle,
  FileSpreadsheet,
  Filter
} from 'lucide-react';
import { OFFICIAL_PDV_CODES } from '../data/briefingData';

const ALLOWED_PDVS = OFFICIAL_PDV_CODES || [
  'A6F4',
  'B5FJ',
  'S5X6',
  'JDT4',
  'IZN3',
  'B91S',
  '9GWC',
  'Z7JR',
  'DX9N',
  '3QCV',
  '47N3'
];

export default function SenhasRcvView({
  senhasRcv,
  onAddSenha,
  onUpdateSenha,
  onDeleteSenha,
  onBatchImportSenhas,
  stores
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPdv, setFilterPdv] = useState('ALL');
  const [onlyOfficialPdvs, setOnlyOfficialPdvs] = useState(true);
  const [replaceOnImport, setReplaceOnImport] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [importFeedback, setImportFeedback] = useState(null);
  const [editingSenha, setEditingSenha] = useState(null);
  const fileInputRef = useRef(null);

  const emptySenha = {
    nomeVendedor: '',
    codVendedor: '',
    cargo: 'Vendedor',
    codAgenteVenda: stores[0]?.pdv || '3QCV',
    razaoSocial: 'GRUPO HORIZONTE VAREJO LTDA',
    senhaUra: '',
    dataExpiracaoUra: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    status: 'VÁLIDA'
  };

  const [formSenha, setFormSenha] = useState(emptySenha);

  // Calcula dias até expirar
  const getExpirationInfo = (dateStr) => {
    if (!dateStr) return { days: 0, status: 'EXPIRADA', color: 'text-[#b3001b] bg-[#fdeaed]' };
    const exp = new Date(dateStr);
    if (isNaN(exp.getTime())) {
      return { days: 30, status: 'VÁLIDA', color: 'text-[#12813d] bg-[#e9f8ef] border-[#bfe8ce]' };
    }
    const today = new Date();
    const diffTime = exp - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { days: diffDays, status: 'EXPIRADA', color: 'text-[#8d0d20] bg-[#fdeaed] border-[#f4c2ca]' };
    } else if (diffDays <= 15) {
      return { days: diffDays, status: 'A VENCER', color: 'text-[#8a5a00] bg-[#fff6e5] border-[#f6dfae]' };
    } else {
      return { days: diffDays, status: 'VÁLIDA', color: 'text-[#12813d] bg-[#e9f8ef] border-[#bfe8ce]' };
    }
  };

  const filteredSenhas = useMemo(() => {
    return senhasRcv.filter((s) => {
      const pdvUpper = (s.codAgenteVenda || '').toUpperCase().trim();
      if (onlyOfficialPdvs && pdvUpper && !ALLOWED_PDVS.includes(pdvUpper)) {
        return false;
      }
      if (filterPdv !== 'ALL' && pdvUpper !== filterPdv) {
        return false;
      }

      const term = searchTerm.toLowerCase();
      const matchSearch =
        (s.nomeVendedor && s.nomeVendedor.toLowerCase().includes(term)) ||
        (s.codVendedor && s.codVendedor.toLowerCase().includes(term)) ||
        (s.cargo && s.cargo.toLowerCase().includes(term)) ||
        (s.codAgenteVenda && s.codAgenteVenda.toLowerCase().includes(term)) ||
        (s.razaoSocial && s.razaoSocial.toLowerCase().includes(term)) ||
        (s.senhaUra && String(s.senhaUra).toLowerCase().includes(term));

      const expInfo = getExpirationInfo(s.dataExpiracaoUra);
      const matchStatus = filterStatus === 'ALL' || expInfo.status === filterStatus;

      return matchSearch && matchStatus;
    });
  }, [senhasRcv, searchTerm, filterStatus, filterPdv, onlyOfficialPdvs]);

  const handleOpenNew = () => {
    setEditingSenha(null);
    setFormSenha(emptySenha);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s) => {
    setEditingSenha(s);
    setFormSenha({
      ...emptySenha,
      ...s
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const expInfo = getExpirationInfo(formSenha.dataExpiracaoUra);
    const record = {
      ...formSenha,
      codAgenteVenda: (formSenha.codAgenteVenda || '').toUpperCase().trim(),
      codVendedor: (formSenha.codVendedor || '').toUpperCase().trim(),
      status: expInfo.status
    };

    if (editingSenha) {
      onUpdateSenha(record);
    } else {
      onAddSenha({ ...record, id: Date.now() });
    }
    setIsModalOpen(false);
  };

  // Normalizador de datas vindas do Excel (número serial ou DD/MM/AAAA ou AAAA-MM-DD)
  const normalizeExcelDate = (val) => {
    if (!val) return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    if (typeof val === 'number' && val > 20000) {
      const utcDays = Math.floor(val - 25569);
      const d = new Date(utcDays * 86400 * 1000);
      return d.toISOString().slice(0, 10);
    }
    const str = String(val).trim();
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
      const [dd, mm, yyyy] = str.split('/');
      return `${yyyy}-${mm}-${dd}`;
    }
    if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
      return str.slice(0, 10);
    }
    return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  };

  // Processa linhas de objetos ou matriz vindas do Excel (.xlsx / .xls) ou CSV
  const processRowsFromSheet = (rows2D) => {
    if (!rows2D || rows2D.length === 0) return [];

    // Encontrar linha de cabeçalho
    let headerIdx = 0;
    for (let i = 0; i < Math.min(rows2D.length, 15); i++) {
      const rowStr = (rows2D[i] || []).join(' ').toLowerCase();
      if (
        rowStr.includes('vendedor') ||
        rowStr.includes('nome') ||
        rowStr.includes('agente') ||
        rowStr.includes('ura') ||
        rowStr.includes('loja')
      ) {
        headerIdx = i;
        break;
      }
    }

    const headers = (rows2D[headerIdx] || []).map((h) =>
      String(h || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
    );

    const findCol = (keywords, fallbackIdx) => {
      const idx = headers.findIndex((h) => keywords.some((k) => h.includes(k)));
      return idx !== -1 ? idx : fallbackIdx;
    };

    const colNome = findCol(['nome vendedor', 'nome completo', 'nome', 'vendedor', 'consultor'], 0);
    const colCodVend = findCol(['cod. vendedor', 'cod vendedor', 'codigo iw', 'codigo vendedor', 'iw', 'login'], 1);
    const colCargo = findCol(['cargo', 'funcao'], 2);
    const colPdv = findCol(['cod. agente', 'cod agente', 'agente venda', 'codigo loja', 'cod loja', 'pdv'], 3);
    const colRazao = findCol(['razao social', 'empresa', 'agente autorizado', 'grupo'], 4);
    const colSenha = findCol(['senha ura', 'senha', 'ura'], 5);
    const colExp = findCol(['expiracao', 'validade', 'vencimento', 'data'], 6);

    const imported = [];

    for (let r = headerIdx + 1; r < rows2D.length; r++) {
      const row = rows2D[r];
      if (!row || row.length === 0) continue;

      const nome = String(row[colNome] ?? '').trim();
      if (!nome || nome.toLowerCase().includes('total')) continue;

      // Tentar detectar PDV automaticamente na linha caso a coluna padrão não tenha um código de 4 caracteres
      let pdv = String(row[colPdv] ?? '').toUpperCase().trim();
      if (!ALLOWED_PDVS.includes(pdv)) {
        const foundPdvCell = row.find((cell) =>
          ALLOWED_PDVS.includes(String(cell ?? '').toUpperCase().trim())
        );
        if (foundPdvCell) {
          pdv = String(foundPdvCell).toUpperCase().trim();
        }
      }

      // Se a opção de filtrar apenas pelos 11 códigos do GN estiver ativa e a planilha tiver outras lojas, filtra!
      if (onlyOfficialPdvs && pdv && !ALLOWED_PDVS.includes(pdv)) {
        continue;
      }

      const codVend = String(row[colCodVend] ?? '-').toUpperCase().trim();
      const cargo = String(row[colCargo] ?? 'Vendedor').trim() || 'Vendedor';
      const razao = String(row[colRazao] ?? 'GRUPO HORIZONTE VAREJO LTDA').trim() || 'GRUPO HORIZONTE VAREJO LTDA';
      const senha = String(row[colSenha] ?? '000000').trim() || '000000';
      const expDate = normalizeExcelDate(row[colExp]);
      const expInfo = getExpirationInfo(expDate);

      imported.push({
        id: `RCV-${Date.now()}-${r}`,
        nomeVendedor: nome.toUpperCase(),
        codVendedor: codVend,
        cargo,
        codAgenteVenda: pdv || '3QCV',
        razaoSocial: razao,
        senhaUra: senha,
        dataExpiracaoUra: expDate,
        status: expInfo.status
      });
    }

    return imported;
  };

  // Upload de arquivo Excel (.xlsx, .xls) ou .csv
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        let allImported = [];
        // Procura primeiro por abas específicas ou lê a primeira aba com dados válidos
        for (const sheetName of workbook.SheetNames) {
          const sheet = workbook.Sheets[sheetName];
          const rows2D = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
          const parsed = processRowsFromSheet(rows2D);
          if (parsed.length > 0) {
            allImported = parsed;
            break;
          }
        }

        if (allImported.length > 0) {
          onBatchImportSenhas(allImported, replaceOnImport);
          setImportFeedback({
            type: 'success',
            text: `Sucesso! ${allImported.length} vendedores importados da planilha "${file.name}".`
          });
          setTimeout(() => {
            setIsImportModalOpen(false);
            setImportFeedback(null);
          }, 1500);
        } else {
          setImportFeedback({
            type: 'error',
            text: 'Nenhum vendedor compatível com os códigos PDV foi encontrado na planilha.'
          });
        }
      } catch (err) {
        setImportFeedback({
          type: 'error',
          text: 'Erro ao ler planilha Excel: ' + err.message
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Colar texto direto do Excel (separado por TAB, ponto-e-vírgula ou vírgula)
  const handleProcessPastedText = () => {
    const lines = csvText.split('\n').filter((l) => l.trim().length > 0);
    const rows2D = lines.map((line) =>
      line.split(/[\t;]/).length > 1
        ? line.split(/[\t;]/).map((p) => p.trim())
        : line.split(',').map((p) => p.trim())
    );

    // Se a primeira linha não parece cabeçalho, adicionamos cabeçalho padrão de 7 colunas
    const firstRowStr = (rows2D[0] || []).join(' ').toLowerCase();
    if (!firstRowStr.includes('nome') && !firstRowStr.includes('vendedor')) {
      rows2D.unshift([
        'Nome Vendedor',
        'Cód. Vendedor',
        'Cargo',
        'Cód. Agente Venda',
        'Razão Social',
        'Senha URA',
        'Data de Expiração URA'
      ]);
    }

    const imported = processRowsFromSheet(rows2D);
    if (imported.length > 0) {
      onBatchImportSenhas(imported, replaceOnImport);
      setCsvText('');
      setIsImportModalOpen(false);
    } else {
      setImportFeedback({
        type: 'error',
        text: 'Não foi possível identificar os dados colados. Verifique as colunas.'
      });
    }
  };

  // Exportar em Excel (.xlsx) real compatível com PC e Celular
  const handleExportExcel = () => {
    const exportData = filteredSenhas.map((s) => ({
      'Nome Vendedor': s.nomeVendedor || '',
      'Cód. Vendedor': s.codVendedor || '-',
      'Cargo': s.cargo || 'Vendedor',
      'Cód. Agente Venda': s.codAgenteVenda || '',
      'Razão Social': s.razaoSocial || 'GRUPO HORIZONTE VAREJO LTDA',
      'Senha URA': s.senhaUra || '',
      'Data de Expiração URA': s.dataExpiracaoUra || '',
      'Status': s.status || 'VÁLIDA'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Base_RCV_URA');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([wbout], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Base_RCV_URA_Claro_${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-black text-[#1F2937]">
              3° Base de Senhas RCV & URA
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#e6f7fb] text-[#0a1735] border border-[#bde8f4]">
              {filteredSenhas.length} Vendedores Exibidos
            </span>
          </div>
          <p className="text-xs text-[#64748b] mt-0.5">
            Base oficial com suporte a planilhas Excel (<strong>.xlsx / .xls</strong>), 7 colunas padrão e filtro automático pelos 11 códigos PDV.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setImportFeedback(null);
              setIsImportModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#e6f7fb] border border-[#0F214A] text-xs font-black text-[#0F214A] rounded-xl shadow-xs transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#0F214A]" />
            <span>Importar Planilha Excel (.XLSX)</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#f8fafc] border border-[#e2e8f0] text-xs font-bold text-[#1F2937] rounded-xl shadow-xs transition-all"
            title="Baixar planilha em formato Excel (.xlsx)"
          >
            <Download className="w-4 h-4 text-[#16a34a]" />
            <span>Baixar Excel (.XLSX)</span>
          </button>

          <button
            onClick={handleOpenNew}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0F214A] hover:bg-[#0a1735] text-white text-xs font-bold rounded-xl shadow-sm active:scale-95 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Registro RCV</span>
          </button>
        </div>
      </div>

      {/* Filtro Rápido dos 11 Códigos de Agente de Venda (PDVs) */}
      <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0] shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs font-black text-[#1F2937]">
            <Filter className="w-3.5 h-3.5 text-[#0F214A]" />
            <span>Cód. Agente Venda (11 Lojas Atreladas):</span>
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-[#475569] cursor-pointer">
            <input
              type="checkbox"
              checked={onlyOfficialPdvs}
              onChange={(e) => setOnlyOfficialPdvs(e.target.checked)}
              className="accent-[#0F214A] rounded"
            />
            <span>Exibir apenas os 11 códigos oficiais</span>
          </label>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterPdv('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all ${
              filterPdv === 'ALL'
                ? 'bg-[#0F214A] text-white shadow-xs'
                : 'bg-[#f8fafc] text-[#475569] border border-[#e2e8f0] hover:bg-white'
            }`}
          >
            Todos os 11 PDVs ({senhasRcv.length})
          </button>

          {ALLOWED_PDVS.map((code) => {
            const count = senhasRcv.filter(
              (s) => (s.codAgenteVenda || '').toUpperCase() === code
            ).length;
            const isSelected = filterPdv === code;
            return (
              <button
                key={code}
                onClick={() => setFilterPdv(code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-black shrink-0 transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#0F214A] text-white shadow-xs'
                    : 'bg-[#f8fafc] text-[#1F2937] border border-[#e2e8f0] hover:border-[#0F214A]'
                }`}
              >
                <span>{code}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isSelected ? 'bg-white text-[#0F214A]' : 'bg-[#e6f7fb] text-[#0a1735]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Status and Search Bar */}
      <div className="bg-white rounded-2xl p-3 border border-[#e2e8f0] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'ALL'
                ? 'bg-[#0F214A] text-white shadow-xs'
                : 'text-[#475569] hover:bg-[#f1f5f9]'
            }`}
          >
            Todas ({filteredSenhas.length})
          </button>
          <button
            onClick={() => setFilterStatus('VÁLIDA')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'VÁLIDA'
                ? 'bg-[#0F214A] text-white shadow-xs'
                : 'text-[#475569] hover:bg-[#f1f5f9]'
            }`}
          >
            Válidas
          </button>
          <button
            onClick={() => setFilterStatus('A VENCER')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'A VENCER'
                ? 'bg-[#0F214A] text-white shadow-xs'
                : 'text-[#475569] hover:bg-[#f1f5f9]'
            }`}
          >
            A Vencer (&le; 15 dias)
          </button>
          <button
            onClick={() => setFilterStatus('EXPIRADA')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'EXPIRADA'
                ? 'bg-[#0F214A] text-white shadow-xs'
                : 'text-[#475569] hover:bg-[#f1f5f9]'
            }`}
          >
            Expiradas
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar vendedor, cód. vendedor, cargo, PDV..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#f8fafc] border border-[#e2e8f0] rounded-xl focus:bg-white focus:outline-none focus:border-[#0F214A]"
          />
        </div>
      </div>

      {/* Tabela com as 7 Colunas Solicitadas pelo Gestor */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#fbfcfe] border-b border-[#dfe5ee] text-[#6d7a8e] font-extrabold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Nome Vendedor</th>
                <th className="py-3.5 px-3">Cód. Vendedor</th>
                <th className="py-3.5 px-3">Cargo</th>
                <th className="py-3.5 px-3">Cód. Agente Venda</th>
                <th className="py-3.5 px-3">Razão Social</th>
                <th className="py-3.5 px-3">Senha URA</th>
                <th className="py-3.5 px-3">Data de Expiração URA</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {filteredSenhas.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-10 text-center text-xs text-[#64748b]">
                    Nenhum registro encontrado. Clique em "Importar Planilha Excel (.XLSX)" ou "Novo Registro RCV".
                  </td>
                </tr>
              ) : (
                filteredSenhas.map((s) => {
                  const expInfo = getExpirationInfo(s.dataExpiracaoUra);
                  return (
                    <tr key={s.id} className="hover:bg-[#f9fbfe] transition-colors group">
                      <td className="py-3 px-4 font-bold text-[#1F2937]">
                        {s.nomeVendedor}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-[#1F2937]">
                        {s.codVendedor || '-'}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-[#f8fafc] border border-[#e2e8f0] font-semibold text-[#475569] text-[11px]">
                          {s.cargo || 'Vendedor'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-[#e6f7fb] text-[#0F214A] font-mono font-black text-xs">
                          {s.codAgenteVenda}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[11px] font-medium text-[#475569] max-w-[180px] truncate">
                        {s.razaoSocial || 'GRUPO HORIZONTE VAREJO LTDA'}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono font-black text-xs px-2.5 py-1 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-[#1F2937]">
                          {s.senhaUra}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[#475569]">
                        <div>{s.dataExpiracaoUra || '-'}</div>
                        <div className="text-[10px] font-sans font-semibold text-[#64748b]">
                          {expInfo.days < 0
                            ? `Expirou há ${Math.abs(expInfo.days)}d`
                            : `${expInfo.days}d restantes`}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${expInfo.color}`}>
                          {expInfo.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(s)}
                            className="p-1.5 rounded-lg text-[#64748b] hover:text-[#0F214A] hover:bg-[#e6f7fb] transition-colors"
                            title="Editar Registro"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Excluir o registro RCV de ${s.nomeVendedor}?`)) {
                                onDeleteSenha(s.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-[#64748b] hover:text-[#b3001b] hover:bg-[#fdeaed] transition-colors"
                            title="Excluir Registro"
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

      {/* Modal: Novo / Editar Registro RCV Manual */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141c2a]/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-[#e2e8f0] overflow-hidden">
            <div className="p-4 bg-[#0F214A] text-white flex items-center justify-between">
              <h3 className="font-black text-sm">
                {editingSenha ? `Editar RCV: ${editingSenha.nomeVendedor}` : 'Novo Registro Base RCV / URA'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:opacity-80">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#475569] mb-1">Nome Vendedor *</label>
                <input
                  type="text"
                  placeholder="Nome completo do vendedor"
                  value={formSenha.nomeVendedor}
                  onChange={(e) => setFormSenha({ ...formSenha, nomeVendedor: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl font-bold focus:outline-none focus:border-[#0F214A]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#475569] mb-1">Cód. Vendedor (IW)</label>
                  <input
                    type="text"
                    placeholder="Ex: OQ6IS"
                    value={formSenha.codVendedor}
                    onChange={(e) => setFormSenha({ ...formSenha, codVendedor: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl font-mono font-bold uppercase focus:outline-none focus:border-[#0F214A]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#475569] mb-1">Cargo</label>
                  <select
                    value={formSenha.cargo}
                    onChange={(e) => setFormSenha({ ...formSenha, cargo: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl focus:outline-none"
                  >
                    <option value="Vendedor">Vendedor</option>
                    <option value="Gerente">Gerente</option>
                    <option value="Coordenador">Coordenador</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#475569] mb-1">Cód. Agente Venda (PDV) *</label>
                  <select
                    value={formSenha.codAgenteVenda}
                    onChange={(e) => setFormSenha({ ...formSenha, codAgenteVenda: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl font-mono font-bold focus:outline-none"
                  >
                    {ALLOWED_PDVS.map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#475569] mb-1">Razão Social</label>
                  <input
                    type="text"
                    value={formSenha.razaoSocial}
                    onChange={(e) => setFormSenha({ ...formSenha, razaoSocial: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#475569] mb-1">Senha URA *</label>
                  <input
                    type="text"
                    placeholder="Ex: 849201"
                    value={formSenha.senhaUra}
                    onChange={(e) => setFormSenha({ ...formSenha, senhaUra: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl font-mono font-bold focus:outline-none focus:border-[#0F214A]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#475569] mb-1">Data de Expiração URA *</label>
                  <input
                    type="date"
                    value={formSenha.dataExpiracaoUra}
                    onChange={(e) => setFormSenha({ ...formSenha, dataExpiracaoUra: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl font-mono focus:outline-none focus:border-[#0F214A]"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#e2e8f0] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-bold text-[#475569] hover:bg-[#f1f5f9] rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F214A] hover:bg-[#0a1735] text-white font-bold rounded-xl shadow-sm"
                >
                  Salvar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Importar Planilha Excel (.XLSX / .XLS / .CSV) */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141c2a]/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-[#e2e8f0] overflow-hidden">
            <div className="p-4 bg-[#0F214A] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" />
                <h3 className="font-black text-sm">
                  Subir Base RCV via Excel (.XLSX / .XLS) ou CSV
                </h3>
              </div>
              <button onClick={() => setIsImportModalOpen(false)} className="text-white hover:opacity-80">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-[#e6f7fb] border border-[#bde8f4] text-[#1F2937] space-y-1">
                <div className="font-black text-[#0a1735]">
                  Colunas reconhecidas automaticamente do Excel:
                </div>
                <div className="font-mono text-[11px]">
                  Nome Vendedor | Cód. Vendedor | Cargo | Cód. Agente Venda | Razão Social | Senha URA | Data de Expiração URA
                </div>
                <div className="text-[11px] text-[#475569] pt-1">
                  Códigos PDV atrelados: <strong>{ALLOWED_PDVS.join(' / ')}</strong>
                </div>
              </div>

              {importFeedback && (
                <div
                  className={`p-3 rounded-xl font-bold flex items-center gap-2 border ${
                    importFeedback.type === 'success'
                      ? 'bg-[#e9f8ef] text-[#12813d] border-[#bfe8ce]'
                      : 'bg-[#fdeaed] text-[#8d0d20] border-[#f4c2ca]'
                  }`}
                >
                  {importFeedback.type === 'success' ? (
                    <Check className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{importFeedback.text}</span>
                </div>
              )}

              <div className="flex items-center justify-between gap-2 bg-[#f8fafc] p-3 rounded-xl border border-[#e2e8f0]">
                <label className="flex items-center gap-2 font-bold text-[#1F2937] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={replaceOnImport}
                    onChange={(e) => setReplaceOnImport(e.target.checked)}
                    className="accent-[#0F214A]"
                  />
                  <span>Substituir lista atual pela planilha importada</span>
                </label>
              </div>

              {/* Botão de Upload Excel */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".xlsx,.xls,.csv,.txt"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="w-full py-4 px-4 border-2 border-dashed border-[#0F214A] hover:bg-[#e6f7fb] rounded-xl flex flex-col items-center justify-center gap-1.5 text-[#1F2937] font-black transition-all bg-[#f8fafc] cursor-pointer"
                >
                  <Upload className="w-6 h-6 text-[#0F214A]" />
                  <span className="text-sm text-[#0F214A]">
                    Selecionar Arquivo Excel (.XLSX / .XLS) ou .CSV
                  </span>
                  <span className="text-[11px] font-medium text-[#64748b]">
                    Funciona pelo Computador e pelo Celular
                  </span>
                </button>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-[#e2e8f0]"></div>
                <span className="flex-shrink mx-2 text-[#64748b] text-[10px] uppercase font-bold">
                  Ou copie e cole células direto do Excel
                </span>
                <div className="flex-grow border-t border-[#e2e8f0]"></div>
              </div>

              <div>
                <textarea
                  rows="4"
                  placeholder="Cole aqui as linhas copiadas direto do Excel..."
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  className="w-full p-3 font-mono text-xs bg-[#f8fafc] border border-[#e2e8f0] rounded-xl focus:outline-none focus:border-[#0F214A]"
                />
              </div>

              <div className="pt-3 border-t border-[#e2e8f0] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 font-bold text-[#475569] hover:bg-[#f1f5f9] rounded-xl"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={handleProcessPastedText}
                  disabled={!csvText.trim()}
                  className="px-5 py-2 bg-[#0F214A] hover:bg-[#0a1735] disabled:opacity-50 text-white font-bold rounded-xl shadow-sm"
                >
                  Importar Texto Colado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
