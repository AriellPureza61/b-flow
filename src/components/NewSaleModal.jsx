import React, { useState } from 'react';
import { X, Check, ShoppingBag, Sparkles } from 'lucide-react';

export default function NewSaleModal({ isOpen, onClose, onSave, stores, sellers, productCategories }) {
  if (!isOpen) return null;

  const [vendedor, setVendedor] = useState(sellers[0]?.nome || '');
  const [loja, setLoja] = useState(sellers[0]?.loja || '3QCV');
  const [tipo, setTipo] = useState('Ativação Controle');
  const [plano, setPlano] = useState('CLARO CONTROLE 2025 ON+ 25GB');
  const [qtd, setQtd] = useState(1);
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));

  const handleVendedorChange = (e) => {
    const nome = e.target.value;
    setVendedor(nome);
    const sellerObj = sellers.find((s) => s.nome === nome);
    if (sellerObj && sellerObj.loja) {
      setLoja(sellerObj.loja);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storeObj = stores.find((s) => s.code === loja);
    const newRecord = {
      id: `SALE-${Date.now()}`,
      data,
      loja,
      lojaNome: storeObj ? storeObj.name.replace('Unidade ', 'Loja ') : loja,
      vendedor,
      tipo,
      plano,
      qtd: Number(qtd) || 1
    };

    onSave(newRecord);
    onClose();
  };

  const samplePlans = {
    'Ativação Controle': [
      'CLARO CONTROLE 2025 ON+ 25GB',
      'CLARO CONTROLE 2025 ON+ 30GB',
      'CLARO CONTROLE 2025 ON+ 30GB CM',
      'CLARO CONTROLE 2025 ON+ 25GB FÁCIL',
      'CLARO CONTROLE 2025 ON+ 30GB GEFORCE'
    ],
    'Ativação Pós': [
      'CLARO PÓS ON 25GB',
      'CLARO PÓS ON 25GB COMBO CONVERGENTE',
      'CLARO PÓS ON 50GB',
      'CLARO PÓS ON 100GB COMBO',
      'CLARO PÓS ON 150GB COMBO',
      'CLARO PÓS ON 300GB COMBO'
    ],
    'Instalação TV': [
      'CLARO TV+ BOX',
      'CLARO TV+ BOX NETFLIX',
      'CLARO TV+ 4K'
    ],
    'Instalação Vírtua': [
      'VIRTUA 350MB',
      'VIRTUA 500MB',
      'VIRTUA 600MB',
      'VIRTUA 750MB',
      'VIRTUA 1GB'
    ],
    'Troca de Aparelho': [
      'CLARO CONTROLE 2025 ON+ 30GB (COM APARELHO)',
      'CLARO PÓS ON 150GB COMBO (COM APARELHO)',
      'CLARO PÓS+ 100GB COMBO (COM APARELHO)'
    ],
    'Migração Pré - Controle': [
      'CLARO CONTROLE 2025 ON+ 25GB',
      'CLARO CONTROLE 2025 ON+ 30GB'
    ],
    'Serviços Gerais': [
      'Troca de SimCard',
      'Seguro Proteção Móvel',
      'Troca de Titularidade Pós',
      'Troca de MSISDN'
    ],
    'Comissões Adicionais': [
      'Plugin Combo Multi',
      'Plugin Combo Multi UR',
      'Solicitação de Portabilidade',
      'Bônus Débito Automático UR'
    ]
  };

  const availablePlans = samplePlans[tipo] || ['Plano Padrão Claro'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-sky-50/60 to-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#0F214A] text-white rounded-xl shadow-sm">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Lançar Nova Produção / Venda
              </h2>
              <p className="text-xs text-slate-500">
                Lançamento rápido no sistema do GN
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Vendedor */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Vendedor Responsável
            </label>
            <select
              value={vendedor}
              onChange={handleVendedorChange}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-[#0F214A] focus:outline-none"
              required
            >
              {sellers.map((s) => (
                <option key={s.id} value={s.nome}>
                  {s.nome} ({s.lojaNome})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Loja */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Loja / PDV
              </label>
              <select
                value={loja}
                onChange={(e) => setLoja(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-[#0F214A] focus:outline-none"
              >
                {stores.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.code} - {s.name.replace('Unidade ', '')}
                  </option>
                ))}
              </select>
            </div>

            {/* Data */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Data do Registro
              </label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-[#0F214A] focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Tipo de Operação */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tipo de Operação / Produto
            </label>
            <select
              value={tipo}
              onChange={(e) => {
                const newTipo = e.target.value;
                setTipo(newTipo);
                const plans = samplePlans[newTipo] || ['Plano Padrão'];
                setPlano(plans[0]);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-[#0F214A] focus:outline-none"
            >
              {productCategories.map((cat) => (
                <option key={cat.categoria} value={cat.categoria.split(' (')[0]}>
                  {cat.categoria}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Plano */}
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Serviço / Plano Específico
              </label>
              <select
                value={plano}
                onChange={(e) => setPlano(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-[#0F214A] focus:outline-none"
              >
                {availablePlans.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantidade */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Quantidade
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={qtd}
                onChange={(e) => setQtd(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-[#0F214A] focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0F214A] hover:bg-[#B81D12] text-white text-xs font-bold rounded-xl shadow-md shadow-slate-900/10 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Confirmar Venda</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
