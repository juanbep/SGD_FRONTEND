# 🎓 Front-End — Sistema de Gestión Docente FIET

> Trabajo de Grado en Modalidad Práctica Profesional  
> **Universidad del Cauca — Facultad de Ingeniería Electrónica y Telecomunicaciones**

---

## 📋 Descripción

Aplicación web desarrollada en **Angular** que apoya los procesos de gestión docente de la Facultad de Ingeniería Electrónica y Telecomunicaciones (FIET) de la Universidad del Cauca. El sistema centraliza y sistematiza las actividades de gestión de calendarios académicos, actividades de labor docente, planes y necesidades, y estadísticas; permitiendo que todos los actores involucrados trabajen con la misma información de forma organizada y trazable.

---

## 🚀 Demo

🔗 [https://bit.ly/4d5zuBu](https://bit.ly/4d5zuBu)

---

## 🧩 Módulos del sistema

| Módulo | Submódulos |
|--------|-----------|
| **Gestión de Calendarios** | Consulta, Creación y Gestión de calendarios académicos |
| **Gestión de Actividades de Labor Docente** | Consulta, Creación y Gestión de actividades |
| **Gestión de Planes y Necesidades** | Gestión de planes; Necesidades por rol: Coordinador, Secretario y Jefe de Departamento |
| **Estadísticas y Reportes** | Generación de reportes gráficos descargables |

---

## 👥 Roles del sistema

- **Secretario/a de Facultad** — Gestión central de calendarios y consolidación de necesidades
- **Coordinador de Programa** — Gestión de planes de estudio y solicitud de necesidades
- **Jefe de Departamento** — Asignación de docentes y validación de necesidades
- **Decano** — Validación, aprobación y consulta de estadísticas

---

## 🛠️ Tecnologías utilizadas

### Diseño
- [Excalidraw](https://excalidraw.com/) — Prototipado y mockups

### Implementación
- [Angular](https://angular.io/) — Framework principal del Front-End
- [Visual Studio Code](https://code.visualstudio.com/) — Entorno de desarrollo
- [GitHub](https://github.com/) — Control de versiones
- [Firebase](https://firebase.google.com/) — Despliegue en la nube

### Pruebas
- [Jasmine](https://jasmine.github.io/) — Framework de pruebas unitarias
- [Karma](https://karma-runner.github.io/) — Ejecutor de pruebas

---

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── core/
│   ├── guards/
│   ├── interceptors/
│   ├── modules/
│   │   ├── auth/
│   │   ├── gestion-actividades/
│   │   ├── gestion-calendarios/
│   │   ├── gestion-estadisticas/
│   │   ├── gestion-necesidades/
│   │   ├── gestion-planes/
│   │   ├── gestion-usuarios/
│   │   └── layout/
│   ├── resolvers/
│   └── shared/
└── assets/
    ├── fonts/
    ├── icons/
    ├── images/
    └── customStyles/
```

---

## ⚙️ Instalación y ejecución local

### Prerrequisitos

- Node.js >= 18
- Angular CLI >= 17
- Acceso al Back-End del SGD (microservicios en ejecución)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/juanbep/SGD_FRONTEND.git
cd SGD_FRONTEND

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
ng serve

# 4. Abrir en el navegador
# http://localhost:4200
```

---

## 🧪 Pruebas

```bash
# Ejecutar pruebas unitarias
ng test
```

El proyecto cuenta con **92 pruebas unitarias** implementadas con Jasmine y Karma, cubriendo los principales servicios y componentes del sistema.

---

## 🏗️ Arquitectura

El sistema sigue una arquitectura de microservicios. El Front-End en Angular se comunica con el Back-End mediante **API REST/JSON**. Los sistemas externos integrados incluyen **Google Authenticator** (autenticación) y **Google Gmail SMTP** (mensajería/notificaciones).

```
[Usuario] → [Angular App] → [Microservicio SGD]
                          → [Microservicio de Autenticación] → [Google Authenticator]
                          → [Microservicio de Mensajería]    → [Google Gmail SMTP]
```

---

## ✅ Pruebas de humo (Smoke Tests)

Todas las siguientes funcionalidades fueron verificadas en el entorno de despliegue:

- ✅ Acceso al sistema por roles
- ✅ Visualización, creación y edición de calendarios académicos
- ✅ Descarga de calendario en PDF
- ✅ Visualización, creación y edición de actividades de labor docente
- ✅ Gestión completa de planes y necesidades (por rol)
- ✅ Asignación y gestión de docentes (rol Jefe de Departamento)
- ✅ Generación de reportes estadísticos

---

## 📊 Resultados de percepción de usuarios

| Indicador | Resultado |
|-----------|-----------|
| Impresión general | 50% Positiva / 50% Muy positiva |
| ¿Facilita los procesos de gestión docente? | 100% Definitivamente sí |
| ¿Qué tan completo es el sistema? | 50% Completo / 50% Muy completo |

---

## 🔮 Trabajos futuros

- Conexión con plataformas existentes de la Universidad del Cauca
- Retroalimentación de usuarios finales en producción
- Desarrollo e implementación de nuevos módulos
- Mejoras de usabilidad basadas en pruebas de percepción

---

## 👨‍💻 Autor

**Juan David Beca Pillimue**  
Programa Ingeniería de Sistemas  
Facultad de Ingeniería Electrónica y Telecomunicaciones  
Universidad del Cauca — 2026

**Directora:** Dra. Luz Marina Sierra Martínez  
**Codirector:** Mg. Alejandro Toledo Tovar
