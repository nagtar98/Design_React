# SmartLab Monitor — Ionic React + TypeScript + Tailwind CSS

Proyecto base para el módulo **Desarrollo de Interfaces (Código 0488)** — 2.º CFGS DAM (Comunidad de Madrid).

## Estructura del Proyecto

- `src/pages/Home.tsx`: Vista principal con cabecera reactiva, Pull-to-Refresh, KPIs en Tailwind Grid, búsqueda y filtrado segmentado, lista con gestos laterales (`IonItemSliding`), modal de alta (`IonModal`), botón flotante (`IonFab`) y notificaciones (`IonToast`).
- `src/types/incident.ts`: Definición estricta de interfaces y tipos de dominio en TypeScript.
- `src/theme/variables.css`: Directivas `@tailwind` y variables CSS de personalización para Shadow DOM de Ionic.
- `Dockerfile` y `nginx.conf`: Empaquetado multietapa listo para despliegue en contenedor.

## Puesta en Marcha Local (Node.js >= 20 LTS)

```bash
npm install
npm run dev
```

## Compilación de Producción

```bash
npm run build
```

## Despliegue en Contenedor Docker

```bash
docker build -t smartlab-ionic-tw:1.0 .
docker run -d -p 8080:80 --name smartlab-container smartlab-ionic-tw:1.0
```
