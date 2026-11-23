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
 * Integra estética Neo-Brutalista, micro-interacciones táctiles, componentes modulares
 * y un layout responsivo estructurado con unidades vh.
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
      setToastMessage('Sincronización completada con almacenamiento local');
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
      {/* Cabecera Brutalista con contador reactivo */}
      <IonHeader className="ion-no-border">
        <IonToolbar className="min-h-[7vh]">
          <IonTitle className="font-black tracking-tight text-black text-lg md:text-xl">
            ⚡ SmartLab Incident Manager
          </IonTitle>
          <IonButtons slot="end">
            <div className="mr-3 flex items-center gap-2">
              <span className="hidden text-xs font-black uppercase tracking-wider text-black sm:inline">
                Pendientes:
              </span>
              <span className="flex items-center gap-1 rounded border-2 border-black bg-black px-2.5 py-1 font-mono text-xs font-black text-yellow-300 shadow-[2px_2px_0px_#000]">
                {metrics.pending}
              </span>
            </div>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="bg-[#faf8f5]">
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
            {/* Bloque 1: Panel KPI modular con Tailwind Grid e interacción de filtrado táctil */}
            <section
              aria-label="Resumen operativo de incidencias"
              className="min-h-[12vh]"
            >
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-xs font-black uppercase tracking-wider text-black">
                  Estado Operativo del Centro (KPIs)
                </h2>
                <span className="text-[11px] font-bold text-slate-600 hidden sm:inline">
                  Pulsa una tarjeta para filtrar rápidamente
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

            {/* Bloque 2: Buscador y Segment Tabs con estilo Neo-Brutalista */}
            <section
              aria-label="Filtros y buscador de incidencias"
              className="space-y-2.5 pt-1"
            >
              <IonSearchbar
                value={searchQuery}
                onIonInput={(e) => setSearchQuery(e.detail.value ?? '')}
                placeholder="Buscar por ID (INC-101), aula, título..."
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
                <h2 className="text-xs font-black uppercase tracking-wider text-black">
                  Incidencias Registradas ({filteredIncidents.length})
                </h2>
                <span className="text-[11px] font-bold text-slate-500">
                  Desliza para opciones · Clic para ficha técnica
                </span>
              </div>

              {filteredIncidents.length === 0 ? (
                <div className="flex h-[32vh] flex-col items-center justify-center rounded-xl border-2 md:border-3 border-dashed border-black bg-white p-6 text-center shadow-brutal">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-black bg-yellow-300 shadow-[2px_2px_0px_#000]">
                    <IonIcon icon={searchOutline} className="text-2xl text-black" />
                  </div>
                  <h3 className="mt-3 text-base font-black text-black">
                    Sin coincidencias registradas
                  </h3>
                  <p className="mt-1 max-w-sm text-xs font-bold text-slate-600">
                    No hay incidencias que correspondan al filtro aplicado o término de búsqueda.
                  </p>
                  {(searchQuery || activeFilter !== 'todas') && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setActiveFilter('todas');
                      }}
                      className="mt-3 inline-flex items-center gap-1.5 rounded border-2 border-black bg-amber-300 px-3 py-1.5 text-xs font-black uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
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
          <footer className="mt-8 border-t-2 border-black/20 pt-3 text-center text-[11px] font-bold text-slate-600">
            SmartLab Incident Manager · Módulo DAM 0488 · Arquitectura Ionic React + Tailwind CSS
          </footer>
        </div>

        {/* Botón Flotante de Alta (FAB) con área accesible >= 48x48px y micro-interacción */}
        <IonFab slot="fixed" vertical="bottom" horizontal="end" className="mb-4 mr-4">
          <IonFabButton
            onClick={() => setIsModalOpen(true)}
            aria-label="Registrar nueva incidencia"
            className="h-14 w-14 cursor-pointer"
          >
            <IonIcon icon={addOutline} className="text-2xl font-black text-black" />
          </IonFabButton>
        </IonFab>

        {/* Modal Neo-Brutalista de Alta con soporte para operabilidad de teclado (CE 4.d) */}
        <IonModal
          isOpen={isModalOpen}
          onDidDismiss={() => setIsModalOpen(false)}
          className="brutal-modal"
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle className="font-black text-black">
                Nueva Incidencia Técnica
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

          <IonContent className="ion-padding bg-[#faf8f5]">
            <div className="mx-auto max-w-lg min-h-[50vh] flex flex-col justify-between py-2">
              <form onSubmit={handleCreateIncident} className="space-y-4">
                {/* Campo Título */}
                <div className="rounded-lg border-2 border-black bg-white p-1 shadow-[2px_2px_0px_#000]">
                  <IonItem lines="none" className="--background: transparent;">
                    <IonInput
                      label="Título de la Incidencia *"
                      labelPlacement="stacked"
                      placeholder="Ej. Fallo de red en Switch 04"
                      value={title}
                      onIonInput={(e) => setTitle(e.detail.value ?? '')}
                      required
                      className="font-bold text-black"
                    />
                  </IonItem>
                </div>

                {/* Campo Aula/Ubicación */}
                <div className="rounded-lg border-2 border-black bg-white p-1 shadow-[2px_2px_0px_#000]">
                  <IonItem lines="none" className="--background: transparent;">
                    <IonInput
                      label="Aula o Ubicación *"
                      labelPlacement="stacked"
                      placeholder="Ej. Laboratorio 102 - Informática"
                      value={location}
                      onIonInput={(e) => setLocation(e.detail.value ?? '')}
                      required
                      className="font-bold text-black"
                    />
                  </IonItem>
                </div>

                {/* Campo Prioridad */}
                <div className="rounded-lg border-2 border-black bg-white p-1 shadow-[2px_2px_0px_#000]">
                  <IonItem lines="none" className="--background: transparent;">
                    <IonSelect
                      label="Nivel de Prioridad"
                      labelPlacement="stacked"
                      value={priority}
                      onIonChange={(e) =>
                        setPriority(e.detail.value as IncidentPriority)
                      }
                      className="font-bold text-black"
                    >
                      <IonSelectOption value="alta">Alta (Crítica)</IonSelectOption>
                      <IonSelectOption value="media">Media (Operativa)</IonSelectOption>
                      <IonSelectOption value="baja">Baja (Mantenimiento)</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </div>

                {/* Campo Descripción */}
                <div className="rounded-lg border-2 border-black bg-white p-1 shadow-[2px_2px_0px_#000]">
                  <IonItem lines="none" className="--background: transparent;">
                    <IonTextarea
                      label="Descripción Técnica Detallada"
                      labelPlacement="stacked"
                      rows={3}
                      placeholder="Indica síntomas, equipos afectados y observaciones..."
                      value={description}
                      onIonInput={(e) => setDescription(e.detail.value ?? '')}
                      className="font-medium text-black"
                    />
                  </IonItem>
                </div>

                {/* Botón de Envío Táctil Brutalista */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full min-h-[46px] rounded-lg border-2 md:border-3 border-black bg-yellow-300 py-3 font-black uppercase tracking-wider text-black shadow-brutal transition-all hover:bg-yellow-400 hover:shadow-brutal-lg active:translate-x-1 active:translate-y-1 active:shadow-none"
                  >
                    + Registrar Incidencia
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
