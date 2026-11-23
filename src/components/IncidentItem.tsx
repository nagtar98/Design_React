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
  alta: 'bg-rose-300 text-black border-2 border-black',
  media: 'bg-amber-300 text-black border-2 border-black',
  baja: 'bg-emerald-300 text-black border-2 border-black',
};

/**
 * Componente modular de fila de incidencia con soporte para gestos táctiles IonItemSliding,
 * navegación a ficha técnica e interactividad Neo-Brutalista.
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
    <IonItemSliding className="mb-3 overflow-hidden rounded-lg">
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
          className={`w-full cursor-pointer rounded-lg border-2 md:border-3 border-black bg-white p-3.5 transition-all duration-150 shadow-brutal hover:shadow-brutal-lg hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-sm ${
            isResolved ? 'bg-slate-100/90' : 'bg-white'
          }`}
        >
          {/* Fila superior: ID, Prioridad, Fecha/Hora */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="rounded border border-black bg-black px-2 py-0.5 font-mono text-xs font-black tracking-wider text-yellow-300 shadow-[1px_1px_0px_#000]">
                {incident.id}
              </span>
              <span
                className={`rounded px-2 py-0.5 text-xs font-black uppercase tracking-wider shadow-[1px_1px_0px_#000] ${
                  PRIORITY_BADGE_CLASSES[incident.priority]
                }`}
              >
                {incident.priority}
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
              <IonIcon icon={timeOutline} className="text-sm" />
              <span>{incident.createdAt}</span>
            </div>
          </div>

          {/* Título */}
          <h3
            className={`mt-2 text-base font-black tracking-tight ${
              isResolved ? 'text-slate-500 line-through' : 'text-black'
            }`}
          >
            {incident.title}
          </h3>

          {/* Descripción corta */}
          <p className="mt-1 line-clamp-2 text-xs font-medium text-slate-700">
            {incident.description}
          </p>

          {/* Fila inferior: Ubicación y botón interactivo de estado */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t-2 border-black/20 pt-2.5">
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
              <IonIcon icon={locationOutline} className="text-base text-black" />
              <span>{incident.location}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleStatusToggle}
                aria-label={
                  isResolved
                    ? `Marcar ${incident.id} como pendiente`
                    : `Marcar ${incident.id} como resuelta`
                }
                className={`inline-flex items-center gap-1.5 rounded border-2 border-black px-2.5 py-1 text-xs font-black uppercase tracking-wider transition-all min-h-[36px] ${
                  isResolved
                    ? 'bg-emerald-300 text-black shadow-[2px_2px_0px_#000] hover:bg-emerald-400'
                    : 'bg-amber-300 text-black shadow-[2px_2px_0px_#000] hover:bg-amber-400'
                } active:translate-x-0.5 active:translate-y-0.5 active:shadow-none`}
              >
                <IonIcon
                  icon={isResolved ? checkmarkCircleOutline : timeOutline}
                  className="text-sm font-black"
                />
                <span>{isResolved ? 'Resuelta' : 'Pendiente'}</span>
              </button>

              <div
                title="Ver detalles completos"
                className="flex h-9 w-9 items-center justify-center rounded border-2 border-black bg-yellow-300 shadow-[2px_2px_0px_#000] transition-all hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5"
              >
                <IonIcon icon={arrowForwardOutline} className="text-base font-black text-black" />
              </div>
            </div>
          </div>
        </div>
      </IonItem>

      {/* Opciones ocultas desplegables mediante swipe lateral */}
      <IonItemOptions side="end">
        <IonItemOption
          color={isResolved ? 'warning' : 'success'}
          onClick={() => onToggleStatus(incident.id)}
          aria-label={isResolved ? 'Marcar pendiente' : 'Marcar resuelta'}
          className="min-w-[65px] font-black text-black border-l-2 border-black"
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
          className="min-w-[65px] font-black text-black border-l-2 border-black"
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
