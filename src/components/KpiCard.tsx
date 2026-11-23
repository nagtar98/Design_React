import React from 'react';
import { IonIcon } from '@ionic/react';

export type KpiColorScheme = 'total' | 'pending' | 'critical' | 'resolved';

export interface KpiCardProps {
  title: string;
  count: number;
  icon: string;
  colorScheme: KpiColorScheme;
  isActive?: boolean;
  onClick?: () => void;
}

const SCHEME_STYLES: Record<
  KpiColorScheme,
  {
    bg: string;
    border: string;
    text: string;
    iconColor: string;
    badgeBg: string;
  }
> = {
  total: {
    bg: 'bg-sky-200',
    border: 'border-black',
    text: 'text-black',
    iconColor: 'text-black',
    badgeBg: 'bg-black text-white',
  },
  pending: {
    bg: 'bg-amber-200',
    border: 'border-black',
    text: 'text-black',
    iconColor: 'text-black',
    badgeBg: 'bg-black text-amber-300',
  },
  critical: {
    bg: 'bg-rose-200',
    border: 'border-black',
    text: 'text-black',
    iconColor: 'text-black',
    badgeBg: 'bg-black text-rose-300',
  },
  resolved: {
    bg: 'bg-emerald-200',
    border: 'border-black',
    text: 'text-black',
    iconColor: 'text-black',
    badgeBg: 'bg-black text-emerald-300',
  },
};

/**
 * Componente reutilizable KpiCard con estilo Neo-Brutalista e interactividad táctil.
 * Cumple con RA 1 / CE 1.b y RA 3 / CE 3.a.
 */
export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  count,
  icon,
  colorScheme,
  isActive = false,
  onClick,
}) => {
  const styles = SCHEME_STYLES[colorScheme];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role={onClick ? 'button' : 'region'}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`Métrica ${title}: ${count} incidencias`}
      aria-pressed={onClick ? isActive : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`relative select-none rounded-lg border-2 md:border-3 border-black p-3 md:p-4 transition-all duration-150 min-h-[9vh] flex flex-col justify-between ${
        styles.bg
      } ${
        isActive
          ? 'shadow-brutal-press translate-x-1 translate-y-1 ring-2 ring-black'
          : 'shadow-brutal hover:-translate-y-1 hover:shadow-brutal-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-sm'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wider text-black">
          {title}
        </span>
        <div className="flex h-7 w-7 items-center justify-center rounded border border-black bg-white shadow-[1px_1px_0px_#000]">
          <IonIcon icon={icon} className={`text-base font-bold ${styles.iconColor}`} />
        </div>
      </div>

      <div className="mt-2 flex items-baseline justify-between">
        <p className="text-3xl font-black tracking-tight text-black">{count}</p>
        {isActive && (
          <span className="rounded border border-black bg-black px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-yellow-300">
            Filtro activo
          </span>
        )}
      </div>
    </div>
  );
};

export default KpiCard;
