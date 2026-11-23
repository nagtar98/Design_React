import React from 'react';
import {
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
} from '@ionic/react';
import {
  checkmarkCircleOutline,
  trashOutline,
  locationOutline,
  timeOutline,
  arrowForwardOutline,
  closeCircleOutline,
} from 'ionicons/icons';
import { Incident, IncidentPriority } from '../types/incident';

export interface IncidentItemProps {
  incident: Incident;
  onToggleStatus: (id: string) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
  onSelect?: (id: string) => void;
}

const PRIORITY_BADGE_CLASSES: Record<IncidentPriority, string> = {
  alta: 'bg-[#FF2A2A] text-white border-2 border-black',
  media: 'bg-[#FF7A00] text-black border-2 border-black',
  baja: 'bg-[#00D26A] text-black border-2 border-black',
};

/**
 * Fila modular de incidencia con estilo Industrial Brutalista y colores vivos saturados.
 * Cumple con RA 1 / CE 1.b, RA 3 / CE 3.a y RA 4 / CE 4.c.
 */
export const IncidentItem: React.FC<IncidentItemProps> = ({
  incident,
  onToggleStatus,
  onDelete,
  onSelect,
}) => {
  const isResolved = incident.status === 'resuelta';

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(incident.id);
    }
  };

  const handleStatusToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleStatus(incident.id);
  };

  return (
    <IonItemSliding className="mb-3.5 overflow-hidden rounded">
      <IonItem
        lines="none"
        className="incident-item w-full p-0"
        detail={false}
      >
        <div
          role="article"
          tabIndex={0}
          aria-label={`Incidencia ${incident.id}: ${incident.title}. Prioridad ${incident.priority}. Estado ${incident.status}.`}
          onClick={handleCardClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleCardClick();
            }
          }}
          className={`w-full cursor-pointer rounded border-2 md:border-[3px] border-black p-4 transition-all duration-150 shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0px_#000] ${
            isResolved ? 'bg-[#EEEEEE]' : 'bg-white'
          }`}
        >
          {/* Fila superior: ID en caja negra, Prioridad saturada, Hora */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black/10 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="border-2 border-black bg-black px-2 py-0.5 font-mono text-xs font-black tracking-wider text-[#FFE600] shadow-[1px_1px_0px_#000]">
                {incident.id}
              </span>
              <span
                className={`border-2 px-2 py-0.5 text-xs font-black uppercase tracking-wider shadow-[1px_1px_0px_#000] ${
                  PRIORITY_BADGE_CLASSES[incident.priority]
                }`}
              >
                {incident.priority}
              </span>
            </div>

            <div className="flex items-center gap-1.5 border border-black/40 bg-black/5 px-2 py-0.5 font-mono text-xs font-black text-black">
              <IonIcon icon={timeOutline} className="text-sm" />
              <span>{incident.createdAt}</span>
            </div>
          </div>

          {/* Título */}
          <h3
            className={`mt-2.5 text-base md:text-lg font-black tracking-tight ${
              isResolved ? 'text-slate-400 line-through' : 'text-black'
            }`}
          >
            {incident.title}
          </h3>

          {/* Descripción técnica */}
          <p className="mt-1 text-xs md:text-sm font-medium text-slate-800 line-clamp-2">
            {incident.description}
          </p>

          {/* Fila inferior: Ubicación y botones de interacción directa */}
          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t-2 border-black pt-3">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-black">
              <span className="border border-black bg-black px-1 font-mono text-[10px] text-white">
                LOC
              </span>
              <IonIcon icon={locationOutline} className="text-sm text-black" />
              <span>{incident.location}</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Botón táctil conmutador de estado */}
              <button
                type="button"
                onClick={handleStatusToggle}
                aria-label={
                  isResolved
                    ? `Reabrir incidencia ${incident.id}`
                    : `Resolver incidencia ${incident.id}`
                }
                className={`inline-flex items-center gap-1.5 rounded-none border-2 border-black px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all min-h-[38px] ${
                  isResolved
                    ? 'bg-[#00D26A] text-black shadow-[2px_2px_0px_#000] hover:bg-[#00B85C]'
                    : 'bg-[#FFE600] text-black shadow-[2px_2px_0px_#000] hover:bg-[#E5CE00]'
                } active:translate-x-0.5 active:translate-y-0.5 active:shadow-none`}
              >
                <IonIcon
                  icon={isResolved ? checkmarkCircleOutline : timeOutline}
                  className="text-base font-black"
                />
                <span>{isResolved ? 'Resuelta' : 'Pendiente'}</span>
              </button>

              {/* Botón de acceso a ficha completa */}
              <div
                title="Abrir ficha técnica completa"
                className="flex h-9 w-9 items-center justify-center rounded-none border-2 border-black bg-black text-[#FFE600] shadow-[2px_2px_0px_#000] transition-all hover:bg-[#FFE600] hover:text-black active:translate-x-0.5 active:translate-y-0.5"
              >
                <IonIcon icon={arrowForwardOutline} className="text-base font-black" />
              </div>
            </div>
          </div>
        </div>
      </IonItem>

      {/* Opciones deslizables con swipe horizontal */}
      <IonItemOptions side="end">
        <IonItemOption
          color={isResolved ? 'warning' : 'success'}
          onClick={() => onToggleStatus(incident.id)}
          aria-label={isResolved ? 'Reabrir incidencia' : 'Resolver incidencia'}
          className="min-w-[70px] font-black text-black border-l-2 border-black"
        >
          <div className="flex flex-col items-center justify-center gap-1">
            <IonIcon
              slot="icon-only"
              icon={isResolved ? closeCircleOutline : checkmarkCircleOutline}
              className="text-2xl"
            />
            <span className="text-[10px] uppercase font-black">
              {isResolved ? 'Reabrir' : 'Resolver'}
            </span>
          </div>
        </IonItemOption>

        <IonItemOption
          color="danger"
          onClick={() => onDelete(incident.id)}
          aria-label="Eliminar incidencia"
          className="min-w-[70px] font-black text-white border-l-2 border-black bg-[#FF2A2A]"
        >
          <div className="flex flex-col items-center justify-center gap-1">
            <IonIcon slot="icon-only" icon={trashOutline} className="text-2xl" />
            <span className="text-[10px] uppercase font-black">Eliminar</span>
          </div>
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default IncidentItem;
