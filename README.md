# Proyecto APT – CUPONME: Gestión y Control de Eventos

Este repositorio contiene **toda la documentación, entregables y planificación** del Proyecto APT (Aplicación Profesional de Titulación) desarrollado en Duoc UC.

El sistema implementado es **CUPONME**, una plataforma web de gestión y control de eventos y cupones, construida con:

- **Back-End:** ASP.NET Core Web API + SQL Server  
- **Front-End:** Next.js + TailwindCSS (deploy en Vercel)  
- **Seguridad:** Autenticación JWT, control de roles y manejo de sesiones  
- **Pagos y planes:** Módulo de planes por suscripción y compras de tickets

El proyecto se trabajó siguiendo una **metodología ágil** basada en Sprints, organizados en 3 fases principales:

- **Fase 1:** Levantamiento de requisitos y definición del proyecto.  
- **Fase 2:** Desarrollo, documentación y presentación de avance.  
- **Fase 3:** Entrega final, presentación y cierre.

---

## Estructura de Entregables

### Fase 1 – Inicio y definición

**Evidencias individuales**

- `Apellido_Nombre_1.1_APT122_AutoevaluacionCompetenciasFase1.docx`  
- `Apellido_Nombre_1.2_APT122_DiarioReflexionFase1.docx`  
- `Apellido_Nombre_1.3_APT122_AutoevaluacionFase1.docx`  

**Evidencias grupales**

- `Presentacion_Proyecto_Fase1.pptx`  
- `1.4_APT122_FormativaFase1.docx`  
- `1.5_GuiaEstudiante_Fase1_DefinicionProyectoAPT(Espanol).docx`  
- `1.5_GuiaEstudiante_Fase1_DefinicionProyectoAPT(Ingles).docx` (optativo)  
- `Planilla_Evaluacion_Fase1.xlsx` (enviada por el docente vía correo)

---

### Fase 2 – Desarrollo y documentación

**Evidencias individuales**

- `Apellido_Nombre_2.1_APT122_DiarioReflexionFase2.docx`  

**Evidencias grupales**

- `2.4_GuiaEstudiante_Fase2_DesarrolloProyectoAPT(Espanol).docx`  
- `2.4_GuiaEstudiante_Fase2_DesarrolloProyectoAPT(Ingles).docx` (optativo)  
- `Planilla_Evaluacion_Avance_Fase2.xlsx`  
- `2.6_GuiaEstudiante_Fase2_InformeFinalProyectoAPT(Espanol).docx`  
- `2.6_GuiaEstudiante_Fase2_InformeFinalProyectoAPT(Ingles).docx` (optativo)  
- `Planilla_Evaluacion_Final_Fase2.xlsx`  

**Evidencias de proyecto (técnicas)**

- **Evidencias de documentación**
  - README técnico del Back-End (ASP.NET Core) y del Front-End (Next.js).
  - Guía de despliegue y configuración (API, Vercel, conexión a SQL Server, JWT, etc.).
  - Documento de arquitectura (diagrama general del sistema, capas y flujos).
  - Modelo de datos y diagrama relacional de la base de datos (Users, Events, EventPriceTiers, Orders, Payments, Subscriptions, etc.).
  - Manual de usuario (organizador y usuario final) con capturas del sistema funcionando.

- **Evidencias del sistema (aplicación + base de datos)**
  - Código fuente del Back-End y Front-End integrado y en funcionamiento.
  - Colección de pruebas (Postman / pruebas funcionales) sobre los principales endpoints.
  - Scripts de creación y migración de la base de datos.
  - Capturas y/o video del sistema operando en ambiente de prueba (API + Front en Vercel).

- **Presentación de proyecto**
  - `Presentacion_Proyecto_Fase2.pptx` con demo del sistema y avance técnico.

---

### Fase 3 – Cierre y entrega final

**Evidencias individuales**

- `Apellido_Nombre_3.1_APT122_DiarioReflexionFase3.docx`  

**Evidencias grupales**

- `Planilla_Evaluacion_Fase3.xlsx`  
- `Presentacion_Final_Proyecto(Espanol).pptx`  
- `Presentacion_Final_Proyecto(Ingles).pptx` (optativo)

---

## Cronograma (Carta Gantt)

El proyecto se organizó en **actividades semanales** según la planificación definida en:

- `Carta_Gantt_Completa.xlsx`

La carta Gantt detalla hitos como:

- Levantamiento de requisitos y definición de alcance.  
- Diseño de arquitectura y modelo de datos.  
- Implementación Back-End (API + seguridad).  
- Implementación Front-End (Next.js + TailwindCSS).  
- Integración completa Front/Back y pruebas.  
- Documentación final y preparación de la presentación.

![Carta Gantt](https://github.com/user-attachments/assets/6bc0a0f4-0700-4026-ac00-1b50af973f39)

---

## Metodología

Se aplicó un enfoque **Ágil** (Scrum/Kanban adaptado) para gestionar el proyecto:

- División del trabajo en **Sprints de 2 semanas**, con objetivos claros por iteración.  
- **Reuniones de avance** con el equipo y el docente guía para revisar progreso y riesgos.  
- Uso de **Product Backlog** y **Sprint Backlog** para priorizar funcionalidades (autenticación, gestión de eventos, pagos, etc.).  
- Entregables **incrementales**, combinando:
  - Documentación (informes, guías, modelo de datos).  
  - Software funcional (API en ASP.NET Core, Front-End en Next.js desplegado en Vercel).

Este enfoque permitió **inspeccionar y adaptar** el proyecto constantemente, garantizando que la solución técnica de CUPONME se mantuviera alineada con los objetivos del Proyecto APT y los plazos establecidos por la asignatura.
