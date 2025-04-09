# gestion-planes-fronted

Este es el frontend para la aplicación de Gestión de Planes, construido con React y Vite.

## Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu sistema:

* **Node.js:** (Se recomienda la última versión LTS) Puedes descargarlo desde [https://nodejs.org/](https://nodejs.org/)
* **npm** o **yarn:** (Vienen instalados con Node.js)

## Instalación

Sigue estos pasos para configurar el proyecto en tu entorno local:

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/Elimin4te/gestion-planes-frontend.git .
    cd gestion-planes-fronted
    ```

2.  **Instala las dependencias:**
    Utiliza `npm`:
    ```bash
    npm install
    ```
    O utiliza `yarn`:
    ```bash
    yarn install
    ```

## Configuración del Entorno

1.  **Copia el archivo de ejemplo de entorno:**
    ```bash
    cp .env.example .env
    ```

2.  **Configura las variables de entorno en el archivo `.env`:**
    Abre el archivo `.env` con un editor de texto y ajusta las variables según tu configuración. Por ejemplo, podrías necesitar configurar la URL de la API del backend.

    ```
    VITE_API_BASE_URL=[http://tu-backend.com/api](http://tu-backend.com/api)
    # ... otras variables de entorno ...
    ```

## Ejecución del Proyecto

Para iniciar el servidor de desarrollo de Vite, ejecuta el siguiente comando:

Con `npm`:
```bash
npm run dev
```

Con `yarn`:
```bash
yarn dev
```

Esto iniciará la aplicación en un servidor de desarrollo local. La URL a la que puedes acceder (normalmente `http://localhost:5173`) se mostrará en tu terminal.

## Construcción para Producción

Para construir una versión optimizada para producción, ejecuta el siguiente comando:

Con `npm`:
```bash
npm run build
```

Con `yarn`:
```bash
yarn build
```

Esto generará los archivos estáticos de la aplicación optimizados para producción en la carpeta `dist`.

## Notas Adicionales

* Asegúrate de que tu backend esté en funcionamiento y accesible desde la URL configurada en el archivo `.env`.
* Consulta la documentación específica del backend para conocer los endpoints de la API y los formatos de datos esperados.
* Si encuentras algún problema durante la instalación o ejecución, revisa los mensajes de error en la terminal y asegúrate de tener las versiones correctas de Node.js y npm/yarn instaladas.

¡Disfruta trabajando en el frontend de Gestión de Planes!
