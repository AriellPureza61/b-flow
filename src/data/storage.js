import {
  initialStoresData,
  initialVendedoresData,
  initialSenhasRcvData,
  initialReembolsosData,
  initialRotasData,
  initialPendenciasData
} from './briefingData';

const DB_KEY = 'bflow_portfolio_demo_v1';

export function loadDatabase() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Erro ao ler banco local:', err);
  }

  const defaultDb = {
    gnProfile: {
      nome: 'Gestor Executivo — B. Flow (Demo)',
      cargo: 'Gerente Regional de Operações',
      regional: 'Regional Sudeste (Portfólio Demo)'
    },
    stores: initialStoresData,
    vendedores: initialVendedoresData,
    senhasRcv: initialSenhasRcvData,
    reembolsos: initialReembolsosData,
    rotas: initialRotasData,
    pendencias: initialPendenciasData,
    lastUpdated: new Date().toISOString()
  };

  saveDatabase(defaultDb);
  return defaultDb;
}

export function saveDatabase(data) {
  try {
    data.lastUpdated = new Date().toISOString();
    localStorage.setItem(DB_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Erro ao salvar banco local:', err);
  }
}

export function resetDatabase() {
  localStorage.removeItem(DB_KEY);
  return loadDatabase();
}
