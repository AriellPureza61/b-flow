import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'red', progress, badge, onClick }) {
  const colorMap = {
    red: {
      bar: 'bg-[#0F214A]',
      badgeBg: 'bg-[#e6f7fb]',
      badgeText: 'text-[#0a1735]',
      border: 'border-l-[#0F214A]',
      iconBg: 'bg-[#e6f7fb]',
      iconText: 'text-[#0F214A]'
    },
    green: {
      bar: 'bg-[#16a34a]',
      badgeBg: 'bg-[#e9f8ef]',
      badgeText: 'text-[#12813d]',
      border: 'border-l-[#16a34a]',
      iconBg: 'bg-[#e9f8ef]',
      iconText: 'text-[#16a34a]'
    },
    amber: {
      bar: 'bg-[#f59e0b]',
      badgeBg: 'bg-[#fff6e5]',
      badgeText: 'text-[#a86800]',
      border: 'border-l-[#f59e0b]',
      iconBg: 'bg-[#fff6e5]',
      iconText: 'text-[#f59e0b]'
    },
    blue: {
      bar: 'bg-[#00A6D4]',
      badgeBg: 'bg-[#ecf2ff]',
      badgeText: 'text-[#20439c]',
      border: 'border-l-[#00A6D4]',
      iconBg: 'bg-[#ecf2ff]',
      iconText: 'text-[#00A6D4]'
    },
    crit: {
      bar: 'bg-[#b3001b]',
      badgeBg: 'bg-[#fdeaed]',
      badgeText: 'text-[#8d0d20]',
      border: 'border-l-[#b3001b]',
      iconBg: 'bg-[#fdeaed]',
      iconText: 'text-[#b3001b]'
    }
  };

  const c = colorMap[color] || colorMap.red;

  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-2xl p-4 sm:p-5 border border-[#e2e8f0] shadow-sm border-l-[5px] ${c.border} transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:-translate-y-1 hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#64748b]">
          {title}
        </span>
        {Icon && (
          <div className={`w-8 h-8 rounded-xl ${c.iconBg} ${c.iconText} flex items-center justify-center text-xs shrink-0 font-bold`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-black text-[#1F2937] tracking-tight tabular-nums">
          {value}
        </span>
        {badge && (
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${c.badgeBg} ${c.badgeText}`}>
            {badge}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-[#64748b] font-medium leading-tight">
          {subtitle}
        </p>
      )}

      {progress !== undefined && (
        <div className="w-full h-1.5 rounded-full bg-[#e2e8f0] mt-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${c.bar}`}
            style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
