// Base de dados fictícia para demonstração de portfólio — B. Flow

export const initialStores = [
  {
    code: 'UN01',
    name: 'Unidade 01 - Shopping Morumbi',
    nickname: 'MORUMBI SHOP',
    city: 'São Paulo',
    state: 'SP',
    type: 'SHOPPING',
    layout: 'LAYOUT CONCEITO',
    coordinator: 'Marcelo',
    manager: 'RICARDO MONTENEGRO',
    phone: '(11) 98800-1001',
    email: 'ricardo.montenegro@bflow-demo.com.br',
    cnpj: '12.345.678/0001-10',
    address: 'Av. Roque Petroni Júnior, 1089 - Loja 112',
    cep: '04707-900',
    hoursWeek: '10:00 às 22:00',
    hoursSat: '10:00 às 22:00',
    hoursSun: '14:00 às 20:00',
    headcountPA: 8,
    headcountIW: 8,
    ip: '10.10.1.101',
    adquirente: 'REDE',
    sapClient: '0009001001',
    macTV: '00:1A:2B:3C:4D:01',
    macTablet: '00:1A:2B:3C:4D:11',
    atlas: '700101',
    salesTeam: 'EQP_01_VAREJO_PREMIUM',
    pexScore: 0.965,
    meta: 60,
    real: 54,
    gap: -6,
    metaDia: -0.85
  },
  {
    code: 'UN02',
    name: 'Unidade 02 - Shopping Eldorado',
    nickname: 'ELDORADO SHOP',
    city: 'São Paulo',
    state: 'SP',
    type: 'SHOPPING',
    layout: 'LAYOUT CONCEITO',
    coordinator: 'Marcelo',
    manager: 'FERNANDA VASCONCELOS',
    phone: '(11) 98800-1002',
    email: 'fernanda.vasconcelos@bflow-demo.com.br',
    cnpj: '12.345.678/0002-91',
    address: 'Av. Rebouças, 3970 - Loja 245',
    cep: '05402-600',
    hoursWeek: '10:00 às 22:00',
    hoursSat: '10:00 às 22:00',
    hoursSun: '14:00 às 20:00',
    headcountPA: 7,
    headcountIW: 7,
    ip: '10.10.2.102',
    adquirente: 'CIELO',
    sapClient: '0009001002',
    macTV: '00:1A:2B:3C:4D:02',
    macTablet: '00:1A:2B:3C:4D:12',
    atlas: '700102',
    salesTeam: 'EQP_02_VAREJO_PREMIUM',
    pexScore: 0.948,
    meta: 55,
    real: 58,
    gap: 3,
    metaDia: 0
  }
];

export const initialCampaign = {
  nome: 'Campanha Trimestral de Expansão — Demo',
  diasUteis: 22,
  diasRealizados: 14,
  diasFaltantes: 8,
  metaGeral: 320,
  realGeral: 245,
  gapGeral: -75,
  ritmoNecessarioDia: 9.38
};

export const initialProductSummary = [
  { categoria: 'Planos Corporativos & Assinaturas', total: 840, icon: 'ShieldCheck', color: 'text-blue-600', bg: 'bg-blue-50' },
  { categoria: 'Serviços Adicionais & Portabilidade', total: 512, icon: 'Zap', color: 'text-amber-600', bg: 'bg-amber-50' },
  { categoria: 'Upgrade de Pacote', total: 310, icon: 'TrendingUp', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { categoria: 'Renovação com Hardware / Aparelho', total: 275, icon: 'Smartphone', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { categoria: 'Conectividade Fibra Empresarial', total: 198, icon: 'Wifi', color: 'text-cyan-600', bg: 'bg-cyan-50' }
];

export const initialSellers = [
  { id: 1, nome: 'LUCAS MENDES RIBEIRO', loja: 'UN01', lojaNome: 'Shopping Morumbi', coordenador: 'Marcelo', total: 68, pos: 18, controle: 22, pre: 8, aparelho: 6, virtua: 8, tv: 6, comissoes: 14, servicos: 20, dependente: 4 },
  { id: 2, nome: 'BEATRIZ ROCHA MARTINS', loja: 'UN02', lojaNome: 'Shopping Eldorado', coordenador: 'Marcelo', total: 64, pos: 16, controle: 20, pre: 10, aparelho: 5, virtua: 7, tv: 6, comissoes: 12, servicos: 18, dependente: 3 },
  { id: 3, nome: 'MARIANA COSTA FERREIRA', loja: 'UN01', lojaNome: 'Shopping Morumbi', coordenador: 'Marcelo', total: 59, pos: 14, controle: 19, pre: 9, aparelho: 4, virtua: 7, tv: 6, comissoes: 11, servicos: 16, dependente: 2 }
];

export const initialBacklog = {
  total: 42,
  resumoStatus: [
    { status: 'AG HOJE', count: 24, color: 'emerald' },
    { status: 'AG FUTURA', count: 9, color: 'blue' },
    { status: 'AG DIA SEGUINTE', count: 6, color: 'amber' },
    { status: 'SEM AGENDA', count: 3, color: 'rose' }
  ],
  porCidade: [
    { cidade: 'São Paulo', total: 32, agHoje: 19, agDiaSeguinte: 4, agFutura: 6, semAgenda: 3 },
    { cidade: 'Campinas', total: 6, agHoje: 3, agDiaSeguinte: 1, agFutura: 2, semAgenda: 0 },
    { cidade: 'Barueri', total: 4, agHoje: 2, agDiaSeguinte: 1, agFutura: 1, semAgenda: 0 }
  ],
  motivosQuebra: [
    { motivo: '106 - Cliente Ausente no Local', count: 2 },
    { motivo: '206 - Adequação de Infraestrutura Predial', count: 1 }
  ]
};

export const initialSolarAdhesion = [
  { data: 'Semana 1', elegiveis: 45, solar: 32, aderencia: 0.711 },
  { data: 'Semana 2', elegiveis: 52, solar: 41, aderencia: 0.788 },
  { data: 'Semana 3', elegiveis: 60, solar: 51, aderencia: 0.850 }
];

export const initialPex = [
  { loja: 'UN01', cidade: 'Shopping Morumbi', gn: 'CARLOS', tipo: 'SHOPPING', visitas: 2, atitude: 1.0, gestao: 0.95, visual: 1.0, geral: 0.983 },
  { loja: 'UN02', cidade: 'Shopping Eldorado', gn: 'CARLOS', tipo: 'SHOPPING', visitas: 2, atitude: 1.0, gestao: 0.92, visual: 0.96, geral: 0.960 },
  { loja: 'UN03', cidade: 'Paulista Flagship', gn: 'CARLOS', tipo: 'RUA', visitas: 2, atitude: 0.98, gestao: 0.90, visual: 0.95, geral: 0.943 }
];
