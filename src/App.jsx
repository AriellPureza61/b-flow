import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import StoresBriefingView from './views/StoresBriefingView';
import VendedoresBriefingView from './views/VendedoresBriefingView';
import SenhasRcvView from './views/SenhasRcvView';
import ReembolsosView from './views/ReembolsosView';
import RotasView from './views/RotasView';
import PendenciasView from './views/PendenciasView';
import BackupView from './views/BackupView';
import { loadDatabase, saveDatabase, resetDatabase } from './data/storage';

export default function App() {
  const [db, setDb] = useState(() => loadDatabase());
  const [currentView, setCurrentView] = useState('lojas');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleChangeView = (view) => {
    setCurrentView(view);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0 });
  };

  const counts = {
    stores: db.stores?.length || 0,
    vendedores: db.vendedores?.length || 0,
    senhasRcv: db.senhasRcv?.length || 0,
    reembolsos: db.reembolsos?.length || 0,
    rotas: db.rotas?.length || 0,
    pendencias: db.pendencias?.length || 0
  };
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('claro_gn_theme') === 'dark';
  });

  // Sync theme to localStorage
  useEffect(() => {
    localStorage.setItem('claro_gn_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Sync state changes to localStorage
  useEffect(() => {
    saveDatabase(db);
  }, [db]);

  // 1° STORES (LOJAS) CRUD
  const handleAddStore = (newStore) => {
    setDb((prev) => ({
      ...prev,
      stores: [newStore, ...(prev.stores || [])]
    }));
  };

  const handleUpdateStore = (updatedStore) => {
    setDb((prev) => ({
      ...prev,
      stores: (prev.stores || []).map((s) =>
        s.cnpj === updatedStore.cnpj || s.pdv === updatedStore.pdv ? updatedStore : s
      )
    }));
  };

  const handleDeleteStore = (cnpjOrPdv) => {
    setDb((prev) => ({
      ...prev,
      stores: (prev.stores || []).filter(
        (s) => s.cnpj !== cnpjOrPdv && s.pdv !== cnpjOrPdv
      )
    }));
  };

  // 2° VENDEDORES CRUD
  const handleAddVendedor = (newVendedor) => {
    setDb((prev) => ({
      ...prev,
      vendedores: [newVendedor, ...(prev.vendedores || [])]
    }));
  };

  const handleUpdateVendedor = (updatedVendedor) => {
    setDb((prev) => ({
      ...prev,
      vendedores: (prev.vendedores || []).map((v) =>
        v.id === updatedVendedor.id ? updatedVendedor : v
      )
    }));
  };

  const handleDeleteVendedor = (vendedorId) => {
    setDb((prev) => ({
      ...prev,
      vendedores: (prev.vendedores || []).filter((v) => v.id !== vendedorId)
    }));
  };

  // 3° SENHAS RCV / URA CRUD
  const handleAddSenha = (newSenha) => {
    setDb((prev) => ({
      ...prev,
      senhasRcv: [newSenha, ...(prev.senhasRcv || [])]
    }));
  };

  const handleUpdateSenha = (updatedSenha) => {
    setDb((prev) => ({
      ...prev,
      senhasRcv: (prev.senhasRcv || []).map((s) =>
        s.id === updatedSenha.id ? updatedSenha : s
      )
    }));
  };

  const handleDeleteSenha = (senhaId) => {
    setDb((prev) => ({
      ...prev,
      senhasRcv: (prev.senhasRcv || []).filter((s) => s.id !== senhaId)
    }));
  };

  const handleBatchImportSenhas = (newSenhasArray, replaceAll = false) => {
    setDb((prev) => ({
      ...prev,
      senhasRcv: replaceAll ? newSenhasArray : [...newSenhasArray, ...(prev.senhasRcv || [])]
    }));
  };

  // 4° REEMBOLSOS CRUD
  const handleAddReembolso = (newReembolso) => {
    setDb((prev) => ({
      ...prev,
      reembolsos: [newReembolso, ...(prev.reembolsos || [])]
    }));
  };

  const handleUpdateReembolso = (updatedReembolso) => {
    setDb((prev) => ({
      ...prev,
      reembolsos: (prev.reembolsos || []).map((r) =>
        r.id === updatedReembolso.id ? updatedReembolso : r
      )
    }));
  };

  const handleDeleteReembolso = (reembolsoId) => {
    setDb((prev) => ({
      ...prev,
      reembolsos: (prev.reembolsos || []).filter((r) => r.id !== reembolsoId)
    }));
  };

  // 5° ROTAS & AUDITORIAS CRUD
  const handleAddRota = (newRota) => {
    setDb((prev) => ({
      ...prev,
      rotas: [newRota, ...(prev.rotas || [])]
    }));
  };

  const handleUpdateRota = (updatedRota) => {
    setDb((prev) => ({
      ...prev,
      rotas: (prev.rotas || []).map((r) =>
        r.id === updatedRota.id ? updatedRota : r
      )
    }));
  };

  const handleDeleteRota = (rotaId) => {
    setDb((prev) => ({
      ...prev,
      rotas: (prev.rotas || []).filter((r) => r.id !== rotaId)
    }));
  };

  // 6° PENDÊNCIAS CRUD
  const handleAddPendencia = (newPendencia) => {
    setDb((prev) => ({
      ...prev,
      pendencias: [newPendencia, ...(prev.pendencias || [])]
    }));
  };

  const handleUpdatePendencia = (updatedPendencia) => {
    setDb((prev) => ({
      ...prev,
      pendencias: (prev.pendencias || []).map((p) =>
        p.id === updatedPendencia.id ? updatedPendencia : p
      )
    }));
  };

  const handleDeletePendencia = (pendenciaId) => {
    setDb((prev) => ({
      ...prev,
      pendencias: (prev.pendencias || []).filter((p) => p.id !== pendenciaId)
    }));
  };

  // PERFIL & BASE HANDLERS
  const handleUpdateGnProfile = (updatedProfile) => {
    setDb((prev) => ({
      ...prev,
      gnProfile: updatedProfile
    }));
  };

  const handleRestoreDatabase = (restoredData) => {
    setDb(restoredData);
    saveDatabase(restoredData);
  };

  const handleResetDatabase = () => {
    const fresh = resetDatabase();
    setDb(fresh);
  };

  return (
    <div
      className={`min-h-screen w-full flex bg-[#F1F5F9] font-sans antialiased text-[#1F2937] bflow-page-bg ${
        darkMode ? 'dark-mode' : ''
      }`}
    >
      {/* Menu lateral B.Flow (PC) */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-40">
        <Sidebar currentView={currentView} onViewChange={handleChangeView} counts={counts} />
      </div>

      {/* Menu lateral B.Flow (Celular) */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex bg-[#0F214A]/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}>
          <div className="h-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <Sidebar
              currentView={currentView}
              onViewChange={handleChangeView}
              counts={counts}
              onClose={() => setIsMenuOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col lg:pl-[250px]">
      <Header
        currentView={currentView}
        lastUpdated={db.lastUpdated}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenMenu={() => setIsMenuOpen(true)}
      />

      {/* Área Principal */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-[1500px] mx-auto">
          {/* 1° ABA: LOJAS */}
          {currentView === 'lojas' && (
            <StoresBriefingView
              stores={db.stores || []}
              onAddStore={handleAddStore}
              onUpdateStore={handleUpdateStore}
              onDeleteStore={handleDeleteStore}
            />
          )}

          {/* 2° ABA: VENDEDORES */}
          {currentView === 'vendedores' && (
            <VendedoresBriefingView
              vendedores={db.vendedores || []}
              onAddVendedor={handleAddVendedor}
              onUpdateVendedor={handleUpdateVendedor}
              onDeleteVendedor={handleDeleteVendedor}
              stores={db.stores || []}
            />
          )}

          {/* 3° ABA: SENHAS RCV */}
          {currentView === 'rcv' && (
            <SenhasRcvView
              senhasRcv={db.senhasRcv || []}
              onAddSenha={handleAddSenha}
              onUpdateSenha={handleUpdateSenha}
              onDeleteSenha={handleDeleteSenha}
              onBatchImportSenhas={handleBatchImportSenhas}
              stores={db.stores || []}
            />
          )}

          {/* 4° ABA: REEMBOLSOS */}
          {currentView === 'reembolsos' && (
            <ReembolsosView
              reembolsos={db.reembolsos || []}
              onAddReembolso={handleAddReembolso}
              onUpdateReembolso={handleUpdateReembolso}
              onDeleteReembolso={handleDeleteReembolso}
            />
          )}

          {/* 5° ABA: ROTAS & AUDITORIAS */}
          {currentView === 'rotas' && (
            <RotasView
              rotas={db.rotas || []}
              onAddRota={handleAddRota}
              onUpdateRota={handleUpdateRota}
              onDeleteRota={handleDeleteRota}
              stores={db.stores || []}
            />
          )}

          {/* 6° ABA: PENDÊNCIAS */}
          {currentView === 'pendencias' && (
            <PendenciasView
              pendencias={db.pendencias || []}
              onAddPendencia={handleAddPendencia}
              onUpdatePendencia={handleUpdatePendencia}
              onDeletePendencia={handleDeletePendencia}
              stores={db.stores || []}
            />
          )}

          {/* BASE DE DADOS & BACKUP */}
          {currentView === 'backup' && (
            <BackupView
              fullDatabase={db}
              onUpdateGnProfile={handleUpdateGnProfile}
              onRestoreDatabase={handleRestoreDatabase}
              onResetDatabase={handleResetDatabase}
            />
          )}
        </div>
      </main>
      </div>
    </div>
  );
}
