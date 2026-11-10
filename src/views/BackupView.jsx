import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import {
  Download,
  Upload,
  RotateCcw,
  Database,
  Check,
  AlertTriangle,
  UserCheck,
  Share2,
  Copy,
  FileSpreadsheet
} from 'lucide-react';

export default function BackupView({
  fullDatabase,
  onUpdateGnProfile,
  onRestoreDatabase,
  onResetDatabase
}) {
  const fileInputRef = useRef(null);
  const [statusMessage, setStatusMessage] = useState(null);

  const [profileForm, setProfileForm] = useState(
    fullDatabase.gnProfile || {
      nome: 'Gestor de Negócios Claro',
      cargo: 'GN Comercial',
      regional: 'Regional Centro-Oeste'
    }
  );

  // Exportar JSON usando Blob (Funciona 100% no PC e Celular Android/iOS)
  const handleExportJson = () => {
    try {
      const jsonContent = JSON.stringify(fullDatabase, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
      const fileName = `gestao_gn_claro_backup_${new Date().toISOString().slice(0, 10)}.json`;
      const url = URL.createObjectURL(blob);

      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = url;
      downloadAnchor.download = fileName;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      setTimeout(() => {
        document.body.removeChild(downloadAnchor);
        URL.revokeObjectURL(url);
      }, 500);

      setStatusMessage({
        type: 'success',
        text: 'Backup completo baixado com sucesso em arquivo JSON!'
      });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: 'Erro ao exportar: ' + err.message
      });
    }
  };

  // Compartilhar Arquivo Nativo no Celular (WhatsApp, E-mail, Arquivos do Celular)
  const handleShareMobileBackup = async () => {
    try {
      const jsonContent = JSON.stringify(fullDatabase, null, 2);
      const fileName = `gestao_gn_claro_backup_${new Date().toISOString().slice(0, 10)}.json`;
      const file = new File([jsonContent], fileName, { type: 'application/json' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Backup B.Flow - Gestão Comercial',
          text: 'Arquivo de backup completo do sistema Gestão Comercial Claro.',
          files: [file]
        });
        setStatusMessage({
          type: 'success',
          text: 'Backup compartilhado com sucesso pelo celular!'
        });
      } else {
        handleExportJson();
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        handleExportJson();
      }
    }
  };

  // Exportar Planilha Excel Completa (.XLSX) com todas as 6 Abas para PC e Celular
  const handleExportFullExcel = () => {
    try {
      const wb = XLSX.utils.book_new();

      const wsLojas = XLSX.utils.json_to_sheet(fullDatabase.stores || []);
      XLSX.utils.book_append_sheet(wb, wsLojas, '1_Lojas');

      const wsVend = XLSX.utils.json_to_sheet(fullDatabase.vendedores || []);
      XLSX.utils.book_append_sheet(wb, wsVend, '2_Vendedores');

      const wsRcv = XLSX.utils.json_to_sheet(fullDatabase.senhasRcv || []);
      XLSX.utils.book_append_sheet(wb, wsRcv, '3_Senhas_RCV');

      const wsReemb = XLSX.utils.json_to_sheet(fullDatabase.reembolsos || []);
      XLSX.utils.book_append_sheet(wb, wsReemb, '4_Reembolsos');

      const wsPend = XLSX.utils.json_to_sheet(fullDatabase.pendencias || []);
      XLSX.utils.book_append_sheet(wb, wsPend, '6_Pendencias');

      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Planilha_Geral_Claro_GN_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 500);

      setStatusMessage({
        type: 'success',
        text: 'Planilha Excel (.XLSX) completa gerada com sucesso!'
      });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: 'Erro ao exportar Excel: ' + err.message
      });
    }
  };

  const handleImportJson = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.stores || parsed.vendedores || parsed.senhasRcv) {
          onRestoreDatabase(parsed);
          setStatusMessage({
            type: 'success',
            text: 'Banco de dados restaurado com sucesso!'
          });
        } else {
          setStatusMessage({
            type: 'error',
            text: 'Arquivo inválido: formato incompatível com o sistema.'
          });
        }
      } catch (err) {
        setStatusMessage({
          type: 'error',
          text: 'Erro ao processar arquivo JSON: ' + err.message
        });
      }
      setTimeout(() => setStatusMessage(null), 4000);
    };
    reader.readAsText(file);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    onUpdateGnProfile(profileForm);
    setStatusMessage({
      type: 'success',
      text: 'Perfil do Gestor de Negócios atualizado com sucesso!'
    });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl select-none animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm">
        <h2 className="text-xl font-black text-[#1F2937] tracking-tight flex items-center gap-2">
          <Database className="w-5 h-5 text-[#0F214A]" />
          <span>Configurações & Exportação (PC e Celular)</span>
        </h2>
        <p className="text-xs text-gray-700 font-medium mt-1">
          Faça backup de segurança, exporte pelo celular ou computador, restaure dados e configure a identidade do GN.
        </p>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <Check className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Estatísticas do Banco */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 text-center">
          <div className="text-lg font-black text-[#1F2937]">
            {fullDatabase.stores?.length || 0}
          </div>
          <div className="text-[11px] font-bold text-gray-700 uppercase mt-0.5">
            1° Lojas / CNPJs
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 text-center">
          <div className="text-lg font-black text-[#1F2937]">
            {fullDatabase.vendedores?.length || 0}
          </div>
          <div className="text-[11px] font-bold text-gray-700 uppercase mt-0.5">
            2° Vendedores
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 text-center">
          <div className="text-lg font-black text-[#1F2937]">
            {fullDatabase.senhasRcv?.length || 0}
          </div>
          <div className="text-[11px] font-bold text-gray-700 uppercase mt-0.5">
            3° Senhas RCV
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 text-center">
          <div className="text-lg font-black text-[#1F2937]">
            {fullDatabase.reembolsos?.length || 0}
          </div>
          <div className="text-[11px] font-bold text-gray-700 uppercase mt-0.5">
            4° Reembolsos
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 text-center">
          <div className="text-lg font-black text-[#1F2937]">
            {fullDatabase.rotas?.length || 0}
          </div>
          <div className="text-[11px] font-bold text-gray-700 uppercase mt-0.5">
            5° Visitas / Rotas
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 text-center">
          <div className="text-lg font-black text-[#1F2937]">
            {fullDatabase.pendencias?.length || 0}
          </div>
          <div className="text-[11px] font-bold text-gray-700 uppercase mt-0.5">
            6° Pendências
          </div>
        </div>
      </div>

      {/* Backup e Restauração (Compatível com PC e Celular) */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm">
        <h3 className="text-sm font-black text-[#1F2937] mb-1">
          Exportação & Backup de Dados (Celular e PC)
        </h3>
        <p className="text-xs text-gray-700 mb-4">
          Exporte um arquivo com todos os dados salvos tanto pelo celular quanto pelo computador.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors bg-gray-50/50 flex flex-col justify-between space-y-3">
            <div>
              <div className="font-black text-xs text-[#1F2937] flex items-center gap-1.5 mb-1">
                <Download className="w-4 h-4 text-[#0F214A]" />
                <span>Exportar Backup (PC & Celular)</span>
              </div>
              <p className="text-[11px] text-gray-700">
                Baixe o backup JSON ou compartilhe diretamente no WhatsApp / Arquivos do seu celular.
              </p>
            </div>
            <div className="space-y-2">
              <button
                onClick={handleExportJson}
                className="w-full py-2.5 px-3 bg-[#0F214A] hover:bg-[#0a1735] text-white font-black text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Baixar Backup JSON</span>
              </button>

              <button
                onClick={handleShareMobileBackup}
                className="w-full py-2 px-3 bg-white hover:bg-gray-100 text-[#1F2937] font-bold text-xs border border-gray-300 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <Share2 className="w-3.5 h-3.5 text-[#0F214A]" />
                <span>Compartilhar / Salvar no Celular</span>
              </button>

              <button
                onClick={handleExportFullExcel}
                className="w-full py-2 px-3 bg-white hover:bg-gray-100 text-[#12813d] font-bold text-xs border border-gray-300 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#12813d]" />
                <span>Exportar Tudo em Planilha Excel (.XLSX)</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors bg-gray-50/50 flex flex-col justify-between">
            <div>
              <div className="font-black text-xs text-[#1F2937] flex items-center gap-1.5 mb-1">
                <Upload className="w-4 h-4 text-[#0F214A]" />
                <span>Restaurar / Importar Backup</span>
              </div>
              <p className="text-[11px] text-gray-700">
                Selecione um arquivo de backup JSON previamente exportado para recuperar todas as informações no celular ou computador.
              </p>
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportJson}
                accept=".json,application/json"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 w-full py-2.5 px-3 bg-white hover:bg-gray-100 text-[#1F2937] font-black text-xs border border-gray-300 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4 text-[#0F214A]" />
                <span>Importar Arquivo Backup JSON</span>
              </button>
            </div>
          </div>
        </div>

        {/* Reset */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="font-bold text-xs text-[#b3001b]">
              Restaurar Dados Padrão da Planilha
            </div>
            <p className="text-[11px] text-gray-700">
              Recarrega as 11 lojas e todos os 89 consultores e credenciais padrão da planilha original.
            </p>
          </div>
          <button
            onClick={() => {
              if (
                window.confirm(
                  'ATENÇÃO: Deseja restaurar os dados originais da planilha? Qualquer alteração não exportada será redefinida.'
                )
              ) {
                onResetDatabase();
                setStatusMessage({
                  type: 'success',
                  text: 'Base de dados restaurada para o padrão com sucesso!'
                });
                setTimeout(() => setStatusMessage(null), 3000);
              }
            }}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-sky-50 hover:bg-sky-100 text-[#b3001b] font-bold text-xs rounded-xl transition-colors border border-sky-200 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrão</span>
          </button>
        </div>
      </div>

      {/* Perfil do GN Card */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm">
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
          <div className="p-2.5 bg-sky-50 text-[#0F214A] rounded-xl border border-sky-100">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#1F2937]">
              Identificação do Gestor de Negócios (GN)
            </h3>
            <p className="text-xs text-gray-700">
              Personalize o nome e regional do GN responsável
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Nome do GN
              </label>
              <input
                type="text"
                placeholder="Ex: Carlos / Amanda T."
                value={profileForm.nome}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, nome: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F214A] font-semibold"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Cargo / Função
              </label>
              <input
                type="text"
                value={profileForm.cargo}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, cargo: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F214A] font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Regional de Atuação
            </label>
            <input
              type="text"
              value={profileForm.regional}
              onChange={(e) =>
                setProfileForm({ ...profileForm, regional: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F214A] font-semibold"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#0F214A] hover:bg-[#d00000] text-white font-black rounded-xl shadow-md shadow-slate-900/10 active:scale-95 transition-all text-xs"
            >
              Salvar Perfil do GN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
