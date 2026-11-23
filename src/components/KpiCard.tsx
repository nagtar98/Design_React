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
    text: string;
    iconColor: string;
    code: string;
  }
> = {
  total: {
    bg: 'bg-[#0052FF]',
    text: 'text-white',
    iconColor: 'text-white',
    code: 'TOT',
  },
  pending: {
    bg: 'bg-[#FF7A00]',
    text: 'text-black',
    iconColor: 'text-black',
    code: 'PND',
  },
  critical: {
    bg: 'bg-[#FF2A2A]',
    text: 'text-white',
    iconColor: 'text-white',
    code: 'CRT',
  },
  resolved: {
    bg: 'bg-[#00D26A]',
    text: 'text-black',
    iconColor: 'text-black',
    code: 'RES',
  },
};

/**
 * Componente modular KpiCard con estética Industrial Brutalista y colores saturados (cero tonos pastel).
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
      className={`relative select-none rounded border-2 md:border-[3px] border-black p-3 md:p-3.5 transition-all duration-150 min-h-[9.5vh] flex flex-col justify-between ${
        styles.bg
      } ${
        isActive
          ? 'translate-x-1 translate-y-1 shadow-[1px_1px_0px_#000] ring-4 ring-black'
          : 'shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0px_#000]'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Barra superior con identificador técnico y icono */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="border border-black bg-black px-1 py-0.2 font-mono text-[10px] font-black text-[#FFE600]">
            [{styles.code}]
          </span>
          <span className={`text-[11px] font-black uppercase tracking-wider ${styles.text}`}>
            {title}
          </span>
        </div>
        <div className="flex h-6 w-6 items-center justify-center rounded-none border border-black bg-black/20">
          <IonIcon icon={icon} className={`text-base font-black ${styles.iconColor}`} />
        </div>
      </div>

      {/* Número de conteo y badge de filtro activo */}
      <div className="mt-2 flex items-baseline justify-between">
        <p className={`text-3xl font-black tracking-tighter ${styles.text}`}>
          {count}
        </p>
        {isActive && (
          <span className="border border-black bg-black px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-[#FFE600] animate-pulse">
            FILTRO
          </span>
        )}
      </div>
    </div>
  );
};

export default KpiCard;
