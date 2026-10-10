# Atención al cliente independiente
El módulo NO usa cuentas, JWT, colecciones, IDs ni permisos de MongoDB. PostgreSQL usa credenciales propias mediante DATABASE_URL. El formulario POST es público y la gestión GET/PUT/DELETE requiere ATENCION_ADMIN_KEY mediante cabecera x-atencion-admin-key. No colocar esa clave en archivos públicos.

Instalar: `npm install` (regenerar y versionar package-lock.json), configurar `.env`, ejecutar `sql/001_atencion.sql` como propietario PostgreSQL y `npm start`. Express arranca sin esperar a MongoDB. La conexión MongoDB se intenta al iniciar y cada 30 segundos. Si MongoDB está caído, /api/auth y /api/usuarios responden 503, pero /atencion/ y /api/atencion siguen operativos mientras PostgreSQL esté disponible. /api/health mide la disponibilidad HTTP, no la de las bases de datos.

No se requiere relacionar usuarios MongoDB con solicitudes PostgreSQL. Se mantiene UN servicio web Render. El formulario es público; proteger contra spam antes de producción. El pool PostgreSQL no bloquea el arranque.
