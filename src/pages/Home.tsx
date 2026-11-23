import React, { useMemo, useRef, useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar,
  RefresherEventDetail,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {
  addOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
  closeOutline,
  layersOutline,
  timeOutline,
  searchOutline,
  refreshOutline,
} from 'ionicons/icons';
import { FilterOption, IncidentPriority } from '../types/incident';
import { useIncidentsStorage } from '../hooks/useIncidentsStorage';
import { KpiCard } from '../components/KpiCard';
import { IncidentItem } from '../components/IncidentItem';

/**
 * Página principal SmartLab Incident Manager.
 * Estilo Industrial Brutalista (colores vivos y saturados, cero tonos pastel).
 * Layout proporcional en vh, micro-interacciones táctiles y modularización.
 */
const Home: React.FC = () => {
  const history = useHistory();
  const {
    incidents,
    addIncident,
    toggleIncidentStatus,
    deleteIncident,
  } = useIncidentsStorage();

  // Estados de control UI
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('todas');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Estados del formulario modal de alta
  const [title, setTitle] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<IncidentPriority>('media');

  // Referencia al contenedor de lista IonList
  const listRef = useRef<HTMLIonListElement | null>(null);

  // Cálculo memoizado de indicadores KPI (CE 3.e: optimización de renderizado)
  const metrics = useMemo(() => {
    const total = incidents.length;
    const pending = incidents.filter((item) => item.status === 'pendiente').length;
    const resolved = incidents.filter((item) => item.status === 'resuelta').length;
    const critical = incidents.filter(
      (item) => item.status === 'pendiente' && item.priority === 'alta'
    ).length;
    return { total, pending, resolved, critical };
  }, [incidents]);

  // Filtrado reactivo combinado por estado y búsqueda textual
  const filteredIncidents = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return incidents.filter((item) => {
      const matchesStatus =
        activeFilter === 'todas' || item.status === activeFilter;
      const matchesQuery =
        normalizedQuery === '' ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.location.toLowerCase().includes(normalizedQuery) ||
        item.id.toLowerCase().includes(normalizedQuery);
      return matchesStatus && matchesQuery;
    });
  }, [incidents, activeFilter, searchQuery]);

  // Gesto táctil Pull-to-Refresh con confirmación reactiva
  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    setTimeout(() => {
      setToastMessage('Sincronización de registros completada');
      event.detail.complete();
    }, 600);
  };

  // Alternar estado pendiente / resuelta
  const handleToggleStatus = async (id: string) => {
    toggleIncidentStatus(id);
    await listRef.current?.closeSlidingItems();
    setToastMessage(`Estado de ${id} actualizado`);
  };

  // Eliminación de incidencia
  const handleDeleteIncident = async (id: string) => {
    deleteIncident(id);
    await listRef.current?.closeSlidingItems();
    setToastMessage(`Incidencia ${id} eliminada`);
  };

  // Navegación a la ficha técnica detallada
  const handleSelectIncident = (id: string) => {
    history.push(`/incident/${id}`);
  };

  // Creación de nueva incidencia desde el modal
  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) {
      setToastMessage('El título y la ubicación son obligatorios');
      return;
    }

    const created = addIncident({
      title,
      location,
      description,
      priority,
    });

    setTitle('');
    setLocation('');
    setDescription('');
    setPriority('media');
    setIsModalOpen(false);
    setToastMessage(`Incidencia ${created.id} registrada`);
  };

  // Filtro interactivo mediante pulsación directa en tarjetas KPI
  const handleKpiFilter = (scheme: 'total' | 'pending' | 'resolved') => {
    if (scheme === 'total') {
      setActiveFilter('todas');
    } else if (scheme === 'pending') {
      setActiveFilter(activeFilter === 'pendiente' ? 'todas' : 'pendiente');
    } else if (scheme === 'resolved') {
      setActiveFilter(activeFilter === 'resuelta' ? 'todas' : 'resuelta');
    }
  };

  return (
    <IonPage>
      {/* Cabecera Industrial Brutalista con banda de advertencia y conteo dinámico */}
      <IonHeader className="ion-no-border">
        <IonToolbar className="min-h-[7vh]">
          <IonTitle className="font-black tracking-tight text-black text-base md:text-lg">
            ⚡ SMARTLAB // INCIDENT_MONITOR [DAM-0488]
          </IonTitle>
          <IonButtons slot="end">
            <div className="mr-3 flex items-center gap-2">
              <span className="hidden font-mono text-[11px] font-black uppercase tracking-wider text-black sm:inline">
                EN COLA:
              </span>
              <span className="flex items-center gap-1.5 border-2 border-black bg-black px-2.5 py-1 font-mono text-xs font-black text-[#FFE600] shadow-[2px_2px_0px_#000]">
                <span className="h-2 w-2 rounded-full bg-[#00D26A] animate-pulse"></span>
                {metrics.pending} PND
              </span>
            </div>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="bg-[#f4f4f0]">
        {/* Pull-to-Refresh nativo */}
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent
            pullingText="Desliza para sincronizar..."
            refreshingSpinner="crescent"
            refreshingText="Sincronizando incidencias..."
          />
        </IonRefresher>

        {/* Contenedor principal con restricciones responsivas y espaciado proporcional en vh */}
        <div className="mx-auto flex min-h-[93vh] max-w-5xl flex-col justify-between px-3.5 pb-24 pt-4 sm:px-6">
          <div className="space-y-4">
            {/* Bloque 1: Panel KPI modular con colores saturados e interacción de filtrado táctil */}
            <section
              aria-label="Resumen operativo de incidencias"
              className="min-h-[12vh]"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="border border-black bg-black px-1.5 font-mono text-[10px] font-black uppercase text-[#FFE600]">
                    SYS
                  </span>
                  <h2 className="text-xs font-black uppercase tracking-wider text-black">
                    Panel Operativo en Tiempo Real
                  </h2>
                </div>
                <span className="text-[11px] font-black uppercase text-slate-700 hidden sm:inline">
                  [Clic en tarjeta para filtrar]
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-4">
                <KpiCard
                  title="Total"
                  count={metrics.total}
                  icon={layersOutline}
                  colorScheme="total"
                  isActive={activeFilter === 'todas'}
                  onClick={() => handleKpiFilter('total')}
                />
                <KpiCard
                  title="Pendientes"
                  count={metrics.pending}
                  icon={timeOutline}
                  colorScheme="pending"
                  isActive={activeFilter === 'pendiente'}
                  onClick={() => handleKpiFilter('pending')}
                />
                <KpiCard
                  title="Críticas"
                  count={metrics.critical}
                  icon={alertCircleOutline}
                  colorScheme="critical"
                />
                <KpiCard
                  title="Resueltas"
                  count={metrics.resolved}
                  icon={checkmarkCircleOutline}
                  colorScheme="resolved"
                  isActive={activeFilter === 'resuelta'}
                  onClick={() => handleKpiFilter('resolved')}
                />
              </div>
            </section>

            {/* Bloque 2: Buscador y Segment Tabs con estilo Industrial Brutalista */}
            <section
              aria-label="Filtros y buscador de incidencias"
              className="space-y-2.5 pt-1"
            >
              <IonSearchbar
                value={searchQuery}
                onIonInput={(e) => setSearchQuery(e.detail.value ?? '')}
                placeholder="Buscar por código (INC-101), aula, título..."
                debounce={150}
                className="brutal-searchbar"
                aria-label="Buscar incidencias"
              />

              <IonSegment
                value={activeFilter}
                onIonChange={(e) =>
                  setActiveFilter((e.detail.value as FilterOption) ?? 'todas')
                }
                className="brutal-segment"
              >
                <IonSegmentButton
                  value="todas"
                  className={`brutal-segment-btn ${
                    activeFilter === 'todas' ? 'segment-button-checked' : ''
                  }`}
                >
                  <IonLabel className="font-black text-black">Todas ({metrics.total})</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton
                  value="pendiente"
                  className={`brutal-segment-btn ${
                    activeFilter === 'pendiente' ? 'segment-button-checked' : ''
                  }`}
                >
                  <IonLabel className="font-black text-black">Pendientes ({metrics.pending})</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton
                  value="resuelta"
                  className={`brutal-segment-btn ${
                    activeFilter === 'resuelta' ? 'segment-button-checked' : ''
                  }`}
                >
                  <IonLabel className="font-black text-black">Resueltas ({metrics.resolved})</IonLabel>
                </IonSegmentButton>
              </IonSegment>
            </section>

            {/* Bloque 3: Listado interactivo modular de incidencias con altura proporcional vh */}
            <section
              aria-label="Listado de incidencias registradas"
              className="min-h-[48vh] pt-1"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="border border-black bg-black px-1.5 font-mono text-[10px] font-black uppercase text-[#FFE600]">
                    REG
                  </span>
                  <h2 className="text-xs font-black uppercase tracking-wider text-black">
                    Registro de Incidencias ({filteredIncidents.length})
                  </h2>
                </div>
                <span className="font-mono text-[11px] font-black uppercase text-slate-700">
                  DESLIZAR = ACCIONES · CLIC = DETALLE
                </span>
              </div>

              {filteredIncidents.length === 0 ? (
                <div className="flex h-[32vh] flex-col items-center justify-center rounded border-2 md:border-[3px] border-black bg-white p-6 text-center shadow-[6px_6px_0px_#000]">
                  <div className="flex h-12 w-12 items-center justify-center border-2 border-black bg-[#FFE600] shadow-[2px_2px_0px_#000]">
                    <IonIcon icon={searchOutline} className="text-2xl text-black" />
                  </div>
                  <h3 className="mt-3 text-base font-black text-black uppercase tracking-tight">
                    Sin Coincidencias en el Sistema
                  </h3>
                  <p className="mt-1 max-w-sm text-xs font-bold text-slate-700">
                    No existen registros que correspondan al filtro activo o al criterio de búsqueda introducido.
                  </p>
                  {(searchQuery || activeFilter !== 'todas') && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setActiveFilter('todas');
                      }}
                      className="mt-3 inline-flex items-center gap-1.5 border-2 border-black bg-[#FFE600] px-4 py-2 text-xs font-black uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
                    >
                      <IonIcon icon={refreshOutline} />
                      Restablecer Filtros
                    </button>
                  )}
                </div>
              ) : (
                <IonList
                  ref={listRef}
                  lines="none"
                  className="space-y-2 bg-transparent p-0"
                >
                  {filteredIncidents.map((incident) => (
                    <IncidentItem
                      key={incident.id}
                      incident={incident}
                      onToggleStatus={handleToggleStatus}
                      onDelete={handleDeleteIncident}
                      onSelect={handleSelectIncident}
                    />
                  ))}
                </IonList>
              )}
            </section>
          </div>

          {/* Pie informativo técnico */}
          <footer className="mt-8 border-t-2 border-black pt-3 text-center font-mono text-[10px] font-black uppercase tracking-wider text-black">
            SMARTLAB INCIDENT MANAGER · DAM 0488 · IONIC REACT + VITE + TAILWIND CSS
          </footer>
        </div>

        {/* Botón Flotante de Alta (FAB) con micro-interacción */}
        <IonFab slot="fixed" vertical="bottom" horizontal="end" className="mb-4 mr-4">
          <IonFabButton
            onClick={() => setIsModalOpen(true)}
            aria-label="Registrar nueva incidencia"
            className="h-14 w-14 cursor-pointer"
          >
            <IonIcon icon={addOutline} className="text-3xl font-black text-black" />
          </IonFabButton>
        </IonFab>

        {/* Modal de Alta con soporte para operabilidad de teclado (CE 4.d) */}
        <IonModal
          isOpen={isModalOpen}
          onDidDismiss={() => setIsModalOpen(false)}
          className="brutal-modal"
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle className="font-black text-black">
                NUEVO REGISTRO TÉCNICO
              </IonTitle>
              <IonButtons slot="end">
                <IonButton
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Cerrar formulario"
                  className="font-black text-black"
                >
                  <IonIcon icon={closeOutline} className="text-2xl text-black" />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent className="ion-padding bg-[#f4f4f0]">
            <div className="mx-auto max-w-lg min-h-[50vh] flex flex-col justify-between py-2">
              <form onSubmit={handleCreateIncident} className="space-y-4">
                {/* Campo Título */}
                <div className="border-2 border-black bg-white p-1 shadow-[3px_3px_0px_#000]">
                  <IonItem lines="none" className="--background: transparent;">
                    <IonInput
                      label="Título de la Incidencia *"
                      labelPlacement="stacked"
                      placeholder="Ej. Fallo de enlace en Switch Rack B"
                      value={title}
                      onIonInput={(e) => setTitle(e.detail.value ?? '')}
                      required
                      className="font-black text-black"
                    />
                  </IonItem>
                </div>

                {/* Campo Aula/Ubicación */}
                <div className="border-2 border-black bg-white p-1 shadow-[3px_3px_0px_#000]">
                  <IonItem lines="none" className="--background: transparent;">
                    <IonInput
                      label="Aula o Ubicación *"
                      labelPlacement="stacked"
                      placeholder="Ej. Aula 204 - Redes"
                      value={location}
                      onIonInput={(e) => setLocation(e.detail.value ?? '')}
                      required
                      className="font-black text-black"
                    />
                  </IonItem>
                </div>

                {/* Campo Prioridad */}
                <div className="border-2 border-black bg-white p-1 shadow-[3px_3px_0px_#000]">
                  <IonItem lines="none" className="--background: transparent;">
                    <IonSelect
                      label="Nivel de Prioridad"
                      labelPlacement="stacked"
                      value={priority}
                      onIonChange={(e) =>
                        setPriority(e.detail.value as IncidentPriority)
                      }
                      className="font-black text-black"
                    >
                      <IonSelectOption value="alta">Alta (Crítica)</IonSelectOption>
                      <IonSelectOption value="media">Media (Operativa)</IonSelectOption>
                      <IonSelectOption value="baja">Baja (Mantenimiento)</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </div>

                {/* Campo Descripción */}
                <div className="border-2 border-black bg-white p-1 shadow-[3px_3px_0px_#000]">
                  <IonItem lines="none" className="--background: transparent;">
                    <IonTextarea
                      label="Descripción Técnica Detallada"
                      labelPlacement="stacked"
                      rows={3}
                      placeholder="Indica síntomas observados, equipos afectados..."
                      value={description}
                      onIonInput={(e) => setDescription(e.detail.value ?? '')}
                      className="font-bold text-black"
                    />
                  </IonItem>
                </div>

                {/* Botón de Envío Táctil */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full min-h-[48px] border-2 md:border-[3px] border-black bg-[#FFE600] py-3 font-black uppercase tracking-wider text-black shadow-[4px_4px_0px_#000] transition-all hover:bg-black hover:text-[#FFE600] hover:shadow-[6px_6px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
                  >
                    + Guardar Registro Técnico
                  </button>
                </div>
              </form>
            </div>
          </IonContent>
        </IonModal>

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

export default Home;
