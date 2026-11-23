import React, { useState, useEffect } from 'react';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import {
  checkmarkCircleOutline,
  timeOutline,
  trashOutline,
  createOutline,
  saveOutline,
  closeOutline,
  locationOutline,
  alertCircleOutline,
  arrowBackOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';
import { useIncidentsStorage } from '../hooks/useIncidentsStorage';
import { IncidentPriority } from '../types/incident';

const PRIORITY_BADGE_CLASSES: Record<IncidentPriority, string> = {
  alta: 'bg-rose-300 text-black border-2 border-black',
  media: 'bg-amber-300 text-black border-2 border-black',
  baja: 'bg-emerald-300 text-black border-2 border-black',
};

/**
 * Vista de Detalle y Ficha Técnica de Incidencia (RA 2 / CE 2.b, RA 3 / CE 3.e).
 * Aplica diseño Neo-Brutalista, interacciones táctiles y layout proporcional con vh.
 */
export const IncidentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const {
    getIncidentById,
    updateIncident,
    toggleIncidentStatus,
    deleteIncident,
  } = useIncidentsStorage();

  const incident = getIncidentById(id);

  // Estado para la edición en vivo de la descripción
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedDescription, setEditedDescription] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (incident) {
      setEditedDescription(incident.description);
    }
  }, [incident]);

  if (!incident) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home" text="Volver" />
            </IonButtons>
            <IonTitle className="font-black">Incidencia No Encontrada</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center text-center">
            <div className="rounded-xl border-3 border-black bg-rose-200 p-8 shadow-brutal">
              <IonIcon icon={alertCircleOutline} className="text-6xl text-black" />
              <h2 className="mt-4 text-2xl font-black text-black">
                Incidencia no localizada
              </h2>
              <p className="mt-2 text-sm font-bold text-black">
                El identificador <span className="font-mono bg-black text-yellow-300 px-1">{id}</span> no existe o fue eliminado.
              </p>
              <button
                type="button"
                onClick={() => history.replace('/home')}
                className="mt-6 inline-flex items-center gap-2 rounded-lg border-2 border-black bg-yellow-300 px-4 py-2 font-black text-black shadow-brutal transition-all hover:shadow-brutal-lg active:translate-x-0.5 active:translate-y-0.5"
              >
                <IonIcon icon={arrowBackOutline} />
                Regresar al Panel Principal
              </button>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const isResolved = incident.status === 'resuelta';

  const handleSaveDescription = () => {
    if (!editedDescription.trim()) {
      setToastMessage('La descripción técnica no puede quedar vacía.');
      return;
    }
    updateIncident(incident.id, { description: editedDescription.trim() });
    setIsEditing(false);
    setToastMessage('Descripción actualizada con éxito.');
  };

  const handleStatusToggle = () => {
    toggleIncidentStatus(incident.id);
    setToastMessage(
      isResolved
        ? `Incidencia ${incident.id} reabierta como Pendiente.`
        : `Incidencia ${incident.id} marcada como Resuelta.`
    );
  };

  const handleDelete = () => {
    deleteIncident(incident.id);
    history.replace('/home');
  };

  return (
    <IonPage>
      {/* Cabecera Brutalista con botón nativo de retorno */}
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/home"
              text="Volver"
              icon={arrowBackOutline}
              className="font-black text-black"
            />
          </IonButtons>
          <IonTitle className="font-black tracking-tight text-black">
            Ficha Técnica · {incident.id}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="bg-[#faf8f5]">
        {/* Contenedor responsivo utilizando layout proporcional en vh */}
        <div className="mx-auto flex min-h-[90vh] max-w-3xl flex-col justify-between px-4 py-5 sm:px-6">
          {/* Tarjeta Principal de Ficha Técnica */}
          <div className="rounded-xl border-2 md:border-3 border-black bg-white p-5 md:p-7 shadow-brutal">
            {/* Header de la ficha */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 md:border-b-3 border-black pb-4">
              <div className="flex items-center gap-2">
                <span className="rounded border-2 border-black bg-black px-3 py-1 font-mono text-sm font-black text-yellow-300 shadow-[2px_2px_0px_#000]">
                  {incident.id}
                </span>
                <span
                  className={`rounded border-2 px-3 py-1 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000] ${
                    PRIORITY_BADGE_CLASSES[incident.priority]
                  }`}
                >
                  Prioridad {incident.priority}
                </span>
              </div>

              {/* Sello de estado */}
              <div
                className={`flex items-center gap-1.5 rounded-lg border-2 border-black px-3 py-1.5 font-black uppercase tracking-wider text-xs shadow-[2px_2px_0px_#000] ${
                  isResolved ? 'bg-emerald-300 text-black' : 'bg-amber-300 text-black'
                }`}
              >
                <IonIcon
                  icon={isResolved ? checkmarkCircleOutline : timeOutline}
                  className="text-base font-black"
                />
                <span>{isResolved ? 'Estado: Resuelta' : 'Estado: Pendiente'}</span>
              </div>
            </div>

            {/* Título de la incidencia */}
            <div className="mt-5">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                Título del Registro
              </span>
              <h1 className="mt-1 text-xl md:text-2xl font-black text-black">
                {incident.title}
              </h1>
            </div>

            {/* Datos Técnicos en Rejilla Responsiva */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border-2 border-black bg-sky-100 p-3 shadow-[2px_2px_0px_#000]">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase text-black">
                  <IonIcon icon={locationOutline} className="text-base" />
                  <span>Ubicación Asignada</span>
                </div>
                <p className="mt-1 font-bold text-black">{incident.location}</p>
              </div>

              <div className="rounded-lg border-2 border-black bg-purple-100 p-3 shadow-[2px_2px_0px_#000]">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase text-black">
                  <IonIcon icon={timeOutline} className="text-base" />
                  <span>Hora de Notificación</span>
                </div>
                <p className="mt-1 font-bold text-black">{incident.createdAt}</p>
              </div>
            </div>

            {/* Sección de Descripción Técnica Editable */}
            <div className="mt-6 rounded-lg border-2 border-black bg-amber-50 p-4 shadow-[3px_3px_0px_#000]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-black">
                  Descripción Técnica de la Incidencia
                </span>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditedDescription(incident.description);
                      setIsEditing(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded border-2 border-black bg-yellow-300 px-2.5 py-1 text-xs font-black uppercase transition-all shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
                  >
                    <IonIcon icon={createOutline} />
                    Editar
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="mt-3 space-y-3">
                  <IonTextarea
                    value={editedDescription}
                    onIonInput={(e) => setEditedDescription(e.detail.value ?? '')}
                    rows={4}
                    className="w-full rounded border-2 border-black bg-white p-2.5 font-mono text-sm font-semibold shadow-[2px_2px_0px_#000]"
                    placeholder="Describe detalladamente los síntomas y pasos técnicos..."
                  />
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="inline-flex items-center gap-1 rounded border-2 border-black bg-slate-200 px-3 py-1.5 text-xs font-black uppercase transition-all shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
                    >
                      <IonIcon icon={closeOutline} />
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveDescription}
                      className="inline-flex items-center gap-1 rounded border-2 border-black bg-emerald-400 px-4 py-1.5 text-xs font-black uppercase transition-all shadow-[2px_2px_0px_#000] hover:bg-emerald-500 active:translate-x-0.5 active:translate-y-0.5"
                    >
                      <IonIcon icon={saveOutline} />
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-3 whitespace-pre-wrap font-mono text-sm font-medium leading-relaxed text-black">
                  {incident.description}
                </p>
              )}
            </div>

            {/* Protocolo de Diagnóstico */}
            <div className="mt-6 flex items-center gap-2 rounded border border-black/30 bg-slate-100 p-2.5 text-xs font-bold text-slate-700">
              <IonIcon icon={shieldCheckmarkOutline} className="text-base text-black" />
              <span>
                Registro auditado conforme a los estándares de laboratorio DAM (Código 0488).
              </span>
            </div>
          </div>

          {/* Barra de Acciones Operativas (Tactile Brutalist Buttons) */}
          <div className="my-5 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleStatusToggle}
              className={`inline-flex min-h-[44px] items-center gap-2 rounded-lg border-2 md:border-3 border-black px-4 py-2.5 font-black uppercase tracking-wider text-xs md:text-sm shadow-brutal transition-all hover:shadow-brutal-lg active:translate-x-1 active:translate-y-1 active:shadow-none ${
                isResolved
                  ? 'bg-amber-300 text-black hover:bg-amber-400'
                  : 'bg-emerald-300 text-black hover:bg-emerald-400'
              }`}
            >
              <IonIcon
                icon={isResolved ? timeOutline : checkmarkCircleOutline}
                className="text-lg"
              />
              <span>
                {isResolved ? 'Reabrir Incidencia (Pendiente)' : 'Marcar como Resuelta'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border-2 md:border-3 border-black bg-rose-400 px-4 py-2.5 font-black uppercase tracking-wider text-xs md:text-sm text-black shadow-brutal transition-all hover:bg-rose-500 hover:shadow-brutal-lg active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              <IonIcon icon={trashOutline} className="text-lg" />
              <span>Eliminar Ficha</span>
            </button>
          </div>
        </div>

        {/* Notificación Toast reactiva */}
        <IonToast
          isOpen={toastMessage !== null}
          message={toastMessage ?? ''}
          duration={2000}
          position="bottom"
          onDidDismiss={() => setToastMessage(null)}
        />
      </IonContent>
    </IonPage>
  );
};

export default IncidentDetail;
