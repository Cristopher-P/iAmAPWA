# iAmAPWA 🚀

Una Progressive Web App (PWA) moderna para el reporte de actividades del alumno, desarrollada con React, TypeScript y Vite.

## ✨ Características Principales

### 📱 Funcionalidades PWA
- **Instalable**: Puede instalarse como aplicación nativa en escritorio y móvil
- **Offline First**: Funciona completamente sin conexión a internet
- **Notificaciones Push**: Sistema completo de notificaciones push
- **Responsive**: Diseño adaptable a todos los dispositivos

### 🔄 Gestión de Actividades
- **Formulario Offline**: Guarda actividades localmente usando IndexedDB
- **Sincronización Automática**: Sincroniza automáticamente cuando hay conexión
- **Persistencia de Datos**: Los datos se mantienen localmente
- **Estado en Tiempo Real**: Muestra el estado de sincronización de cada actividad

### 🛠 Tecnologías Implementadas
- **Service Worker**: Cache avanzado y funcionalidades offline
- **IndexedDB**: Base de datos local para almacenamiento offline
- **Background Sync**: Sincronización en segundo plano
- **Cache Strategies**: Múltiples estrategias de cache (Cache First, Network First, Stale-While-Revalidate)

## 🚀 Instalación y Desarrollo

### Prerrequisitos
- Node.js 16+ 
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/Cristopher-P/iAmAPWA.git

# Navegar al directorio
cd iAmAPWA

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build
npm run preview
```

## 📁 Estructura del Proyecto

```
iAmAPWA/
├── public/
│   ├── sw.js                 # Service Worker
│   ├── manifest.json         # Configuración PWA
│   ├── offline.html          # Página offline
│   └── icons/                # Iconos PWA
├── src/
│   ├── components/           # Componentes React
│   │   ├── OfflineForm.tsx   # Formulario offline
│   │   ├── ActivityList.tsx  # Lista de actividades
│   │   └── ConnectionStatus.tsx
│   ├── hooks/                # Custom Hooks
│   │   ├── useIndexedDB.ts   # Gestión de IndexedDB
│   │   └── useConnectionStatus.ts
│   ├── services/             # Servicios
│   │   ├── indexedDB.ts      # API IndexedDB
│   │   └── pushNotifications.ts
│   ├── utils/                # Utilidades
│   │   └── types.ts          # Tipos TypeScript
│   ├── App.tsx               # Componente principal
│   └── main.tsx              # Punto de entrada
└── package.json
```

## 🎯 Uso de la Aplicación

### 1. **Agregar Actividades**
- Completa el formulario con nombre, descripción, fecha y tiempo
- Las actividades se guardan localmente inmediatamente
- Estado visual: ⏳ Pendiente / ✅ Sincronizado

### 2. **Modo Offline**
- La aplicación funciona completamente sin conexión
- Las actividades se guardan localmente
- Se sincronizan automáticamente al recuperar la conexión

### 3. **Instalación como PWA**
- Busca el botón "📲 Instalar App" en el header
- La aplicación se instalará como app nativa
- Funciona independientemente del navegador

### 4. **Notificaciones Push**
- Permite notificaciones en el navegador
- Recibe notificaciones de nuevas actividades
- Prueba con el botón "🔔 Probar Notificación"

## 🔧 Configuración PWA

### Service Worker
El service worker implementa:
- **Cache First**: Para archivos estáticos (HTML, CSS, JS)
- **Network First**: Para datos que requieren frescura
- **Stale-While-Revalidate**: Para imágenes
- **Background Sync**: Para sincronización offline

### Manifest.json
Configuración para instalación:
- Display standalone
- Temas y colores
- Iconos múltiples resoluciones
- Orientación portrait

## 📊 Funcionalidades Técnicas

### IndexedDB
```typescript
// Estructura de datos
interface Activity {
  id?: number;
  name: string;
  description: string;
  date: string;
  time: number;
  timestamp: number;
  synced: boolean;
}
```

### Estrategias de Cache
- **App Shell**: Cacheado en instalación
- **Recursos Dinámicos**: Actualizados en background
- **Fallback Offline**: Página offline personalizada

## 🧪 Testing

### Pruebas de Funcionalidad
```bash
# Probar modo offline
1. Abrir DevTools → Network → Offline
2. Agregar actividad → Debe guardarse localmente
3. Volver online → Debe sincronizarse automáticamente

# Probar instalación PWA
1. Esperar evento beforeinstallprompt
2. Hacer clic en "Instalar App"
3. Verificar funcionamiento como app nativa

# Probar notificaciones
1. Permitir notificaciones
2. Hacer clic en "Probar Notificación"
3. Verificar recepción
```

### Auditoría Lighthouse
```bash
# Ejecutar en Chrome DevTools
1. Abrir Lighthouse
2. Ejecutar auditoría PWA
3. Verificar score > 90
```

## 🌐 Deployment

### GitHub Pages
```bash
# Instalar gh-pages
npm install --save-dev gh-pages

# Agregar scripts al package.json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://Cristopher-P.github.io/iAmAPWA"
}

# Desplegar
npm run build
npm run deploy
```

### Netlify/Vercel
- Conectar repositorio
- Configurar build command: `npm run build`
- Configurar publish directory: `dist`

## 🐛 Solución de Problemas

### El botón de instalación no aparece
- Verificar que el service worker esté registrado
- Comprobar que el manifest.json sea válido
- Esperar 30 segundos entre visitas

### Las actividades no se sincronizan
- Revisar consola para errores de IndexedDB
- Verificar conexión a internet
- Comprobar el estado del service worker

### Las notificaciones no funcionan
- Asegurar permisos del navegador
- Verificar que esté en HTTPS (en producción)
- Comprobar configuración del service worker

## 📈 Roadmap

- [ ] **Exportación de datos** (PDF/Excel)
- [ ] **Sincronización con backend real**
- [ ] **Categorías y etiquetas**
- [ ] **Búsqueda y filtros**
- [ ] **Estadísticas y reportes**
- [ ] **Modo oscuro**

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Cristopher Pérez**
- GitHub: [@Cristopher-P](https://github.com/Cristopher-P)

## 🙏 Agradecimientos

- [Vite](https://vitejs.dev/) - Build tool
- [React](https://reactjs.org/) - Biblioteca UI
- [TypeScript](https://www.typescriptlang.org/) - Tipado estático
- [Workbox](https://developers.google.com/web/tools/workbox) - Service Worker tools

---

**⭐ Si este proyecto te fue útil, por favor dale una estrella en GitHub!**
