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
  alta: 'bg-[#FF2A2A] text-white border-2 border-black',
  media: 'bg-[#FF7A00] text-black border-2 border-black',
  baja: 'bg-[#00D26A] text-black border-2 border-black',
};

/**
 * Vista de Detalle y Ficha Técnica con estética Industrial Brutalista (sin colores pastel).
 * Cumple con RA 2 / CE 2.b, RA 3 / CE 3.e y distribución vh responsiva.
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
            <IonTitle className="font-black">REGISTRO NO ENCONTRADO</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding bg-[#f4f4f0]">
          <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center text-center">
            <div className="rounded border-[3px] border-black bg-[#FF2A2A] p-8 text-white shadow-[6px_6px_0px_#000]">
              <IonIcon icon={alertCircleOutline} className="text-6xl text-white" />
              <h2 className="mt-4 text-2xl font-black">REGISTRO INEXISTENTE</h2>
              <p className="mt-2 text-sm font-bold">
                El código <span className="border border-white bg-black px-1 font-mono text-[#FFE600]">{id}</span> no existe en la memoria local.
              </p>
              <button
                type="button"
                onClick={() => history.replace('/home')}
                className="mt-6 inline-flex items-center gap-2 rounded-none border-2 border-black bg-[#FFE600] px-4 py-2 font-black text-black shadow-[3px_3px_0px_#000] transition-all hover:shadow-[5px_5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
              >
                <IonIcon icon={arrowBackOutline} />
                Regresar al Monitor
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
    setToastMessage('Descripción técnica actualizada con éxito.');
  };

  const handleStatusToggle = () => {
    toggleIncidentStatus(incident.id);
    setToastMessage(
      isResolved
        ? `Incidencia ${incident.id} reabierta en cola de trabajo.`
        : `Incidencia ${incident.id} marcada como verificada/resuelta.`
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
            EXPEDIENTE TÉCNICO // {incident.id}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="bg-[#f4f4f0]">
        <div className="mx-auto flex min-h-[90vh] max-w-3xl flex-col justify-between px-4 py-5 sm:px-6">
          {/* Ficha técnica principal */}
          <div className="rounded border-2 md:border-[3px] border-black bg-white p-5 md:p-7 shadow-[6px_6px_0px_#000]">
            {/* Cabecera de la ficha */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black pb-4">
              <div className="flex items-center gap-2">
                <span className="border-2 border-black bg-black px-3 py-1 font-mono text-sm font-black text-[#FFE600] shadow-[2px_2px_0px_#000]">
                  {incident.id}
                </span>
                <span
                  className={`border-2 px-3 py-1 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000] ${
                    PRIORITY_BADGE_CLASSES[incident.priority]
                  }`}
                >
                  PRIORIDAD: {incident.priority}
                </span>
              </div>

              {/* Sello de estado saturado */}
              <div
                className={`flex items-center gap-1.5 border-2 border-black px-3 py-1 font-black uppercase tracking-wider text-xs shadow-[2px_2px_0px_#000] ${
                  isResolved ? 'bg-[#00D26A] text-black' : 'bg-[#FF7A00] text-black'
                }`}
              >
                <IonIcon
                  icon={isResolved ? checkmarkCircleOutline : timeOutline}
                  className="text-base font-black"
                />
                <span>{isResolved ? 'ESTADO: RESUELTA' : 'ESTADO: PENDIENTE'}</span>
              </div>
            </div>

            {/* Título de la incidencia */}
            <div className="mt-5">
              <div className="inline-block border border-black bg-black px-1.5 py-0.5 font-mono text-[10px] font-black uppercase tracking-widest text-[#FFE600]">
                DETALLE DE ANOMALÍA
              </div>
              <h1 className="mt-1.5 text-xl md:text-2xl font-black text-black tracking-tight">
                {incident.title}
              </h1>
            </div>

            {/* Datos Técnicos en Rejilla Industrial */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded border-2 border-black bg-white p-3.5 shadow-[3px_3px_0px_#000]">
                <div className="flex items-center gap-1.5 font-mono text-xs font-black uppercase text-black">
                  <IonIcon icon={locationOutline} className="text-base text-black" />
                  <span>UBICACIÓN ASIGNADA</span>
                </div>
                <p className="mt-1.5 text-sm font-black text-black">{incident.location}</p>
              </div>

              <div className="rounded border-2 border-black bg-white p-3.5 shadow-[3px_3px_0px_#000]">
                <div className="flex items-center gap-1.5 font-mono text-xs font-black uppercase text-black">
                  <IonIcon icon={timeOutline} className="text-base text-black" />
                  <span>REGISTRO DE TIMESTAMP</span>
                </div>
                <p className="mt-1.5 text-sm font-black text-black">{incident.createdAt}</p>
              </div>
            </div>

            {/* Sección de Descripción Técnica Editable */}
            <div className="mt-6 border-2 border-black bg-[#EEEEEE] p-4 shadow-[4px_4px_0px_#000]">
              <div className="flex items-center justify-between border-b-2 border-black/20 pb-2">
                <span className="font-mono text-xs font-black uppercase tracking-wider text-black">
                  /// REPORTE TÉCNICO OBSERVADO ///
                </span>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditedDescription(incident.description);
                      setIsEditing(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-none border-2 border-black bg-[#FFE600] px-3 py-1 text-xs font-black uppercase transition-all shadow-[2px_2px_0px_#000] hover:bg-black hover:text-[#FFE600] active:translate-x-0.5 active:translate-y-0.5"
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
                    className="w-full border-2 border-black bg-white p-3 font-mono text-sm font-bold shadow-[2px_2px_0px_#000]"
                    placeholder="Detalla observaciones técnicas, pasos ejecutados..."
                  />
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="inline-flex items-center gap-1 border-2 border-black bg-white px-3 py-1.5 text-xs font-black uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
                    >
                      <IonIcon icon={closeOutline} />
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveDescription}
                      className="inline-flex items-center gap-1 border-2 border-black bg-[#00D26A] px-4 py-1.5 text-xs font-black uppercase shadow-[2px_2px_0px_#000] hover:bg-[#00B85C] active:translate-x-0.5 active:translate-y-0.5"
                    >
                      <IonIcon icon={saveOutline} />
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-3 whitespace-pre-wrap font-mono text-sm font-bold leading-relaxed text-black">
                  {incident.description}
                </p>
              )}
            </div>

            {/* Pie de auditoría */}
            <div className="mt-6 flex items-center gap-2 border-2 border-black bg-black p-2.5 text-xs font-black text-[#FFE600]">
              <IonIcon icon={shieldCheckmarkOutline} className="text-lg text-[#FFE600]" />
              <span className="font-mono text-[11px]">
                PROTOCOLO DAM-0488 · SISTEMA DE GESTIÓN OPERATIVA SMARTLAB
              </span>
            </div>
          </div>

          {/* Barra de Acciones Operativas con Botones de Alto Impacto */}
          <div className="my-5 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleStatusToggle}
              className={`inline-flex min-h-[46px] items-center gap-2 rounded border-2 md:border-[3px] border-black px-5 py-2.5 font-black uppercase tracking-wider text-xs md:text-sm shadow-[4px_4px_0px_#000] transition-all hover:shadow-[6px_6px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none ${
                isResolved
                  ? 'bg-[#FF7A00] text-black hover:bg-[#E66E00]'
                  : 'bg-[#00D26A] text-black hover:bg-[#00B85C]'
              }`}
            >
              <IonIcon
                icon={isResolved ? timeOutline : checkmarkCircleOutline}
                className="text-lg font-black"
              />
              <span>
                {isResolved ? 'Reabrir Registro (Pendiente)' : 'Validar y Marcar Resuelta'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex min-h-[46px] items-center gap-2 rounded border-2 md:border-[3px] border-black bg-[#FF2A2A] px-5 py-2.5 font-black uppercase tracking-wider text-xs md:text-sm text-white shadow-[4px_4px_0px_#000] transition-all hover:bg-black hover:text-[#FF2A2A] hover:shadow-[6px_6px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              <IonIcon icon={trashOutline} className="text-lg" />
              <span>Eliminar Registro</span>
            </button>
          </div>
        </div>

        {/* Notificación Toast reactiva */}
        <IonToast
          isOpen={toastMessage !== null}
          message={toastMessage ?? ''}
          duration={2200}
          position="bottom"
          onDidDismiss={() => setToastMessage(null)}
        />
      </IonContent>
    </IonPage>
  );
};

export default IncidentDetail;
