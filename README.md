## CuponME
**CuponMe** es un sistema de gestion de eventos y socios que permite a organizadores y usuarios:
- Crear y administrar eventos.
- Asignar lugares y controlar cupos disponibles.
- Registrar participantes o permitir que compren cupones de asiento.
- Gestionar perfiles de usuarios y socios.
- Garantizar consistencia de datos con concurrencia en SQL Server.

Stack: Next.js 15 + TailwindCSS (Front) | ASP.NET Core 8 Web API + EF Core (Back) | SQL Server (DB).

## Como Ejecutarlo Localmente

## Estado del proyecto
- **Version:** V.0.1.0
- **Ambientes:** DEV | QA | Prod
- **Ramas Git:**
    - Main: Produccion.
    - Develop: Desarrollo.
    - Feature: Funcionalidades nuevas.

## Arquitectura
- **Front-End:** Next.js (SSR/SPA) con TailwindCSS.
- **Back-End:** ASP.NET Core 8 Web API con autenticacion JWT + Roles (user, member, admin, superadmin).
- **ORM:** EF Core para migraciones y acceso de datos.
- **DB:** SQL Server (con transacciones y stored procedures).
- **Seguridad:** Cifrado de contrasenas, JWT, Control de concurrencias con **rowversion**.
- **QA:** Pruebas unitarias, automatizadas, matriz de riesgos.

# Flujo principal (registro a un evento sin sobreventa):
1.- El usuario inicia sesion -> API genera JWT.

2.- El front almacena JWT y lo envia en headers **(authorization: bearer <token>)**.

3.- Al registrarse en un evento, la API abre la transaccion **SERIALIZABLE**, aplica lock **(UPDLOCK, HOLDLOCK)** y valida los cupos.

4.- Inserta **CONFIRMED** o **WAITLISTED** segun la disponibilidad.

5.- Se garantiza la consistencia y no sobreventa.

## Diagrama de flujo (Simple):

USER -> Front-End (Next.js) -> API.NET -> EF CORE -> SQL SERVER


## Roles y Planes
- **Roles Validos:** user(default), member. admin, superadmin.

- **Planes Validos:** free(default), basic, premium, gold.

## API Reference
**Base URL(Dev):** http://localhost:5009
**CORS Dev:** http://localhost:3000

Swagger habilitado en Development.

### Auth
- Post /api/auth/register -> Crea el usuario
- POST /api/auth/login -> login(dev retorna token placeholder)

### Admin (admin/superadmin)
- GET /api/admin/users -> Listar usuarios
- PUT /api/admin/users/{id}/role -> cambiar rol
- PUT /api/admin/users/{id}/plan -> Cambiar plan
- DELETE /api/admin/users/{id} -> eliminar usuario

### Profile
- GET /api/users/me -> Perfil autenticado
- PUT /api/users/me -> Actualizar perfil
- PUT /api/users/me/password -> Cambiar Contrasena
- DELETE /api/users/me -> eliminar cuenta

### Proximo es Billing
- POST /api/billing/select-plan -> asignar el plan
- POST /api/billing/create-checkout -> checkout simulado

### Modelos principales
- **User:** Email, PasswordHash, Role, Plan, Datos Personales.
- **Venue:** Nombre, Direccion, Capacidad.
- **Event:** Titulo, Fecha, Capacidad, ConfirmedCount.
- **Registration:** EventID, UserID, Status **(CONFIRMED/WAITLISTED/CANCELLED)**

## Proximo Concurrencia
