# kiwi-house-backend

Backend de Kiwi House basado en [Strapi](https://strapi.io/).

## Requisitos

- Node.js 18.18+ o 20.x
- npm 8+
- PostgreSQL

## Configuración

1. Copiar el archivo `.env.example` a `.env` y completar las variables de entorno requeridas.
   Las variables mínimas son:

   - `APP_KEYS`
   - `API_TOKEN_SALT`
   - `ADMIN_JWT_SECRET`
   - `TRANSFER_TOKEN_SALT`
   - `DB_HOST`
   - `DB_PORT`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASS`
2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Ejecutar el servidor de desarrollo:

   ```bash
   npm run develop
   ```

El proyecto usa PostgreSQL y espera las variables `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` y `DB_PASS` definidas.
