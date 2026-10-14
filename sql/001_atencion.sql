-- Ejecutar como propietario de la base atencion_db.
CREATE TABLE IF NOT EXISTS public.solicitudes_atencion (
 id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 codigo UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
 nombre VARCHAR(120) NOT NULL,
 correo VARCHAR(254) NOT NULL,
 asunto VARCHAR(150) NOT NULL,
 descripcion TEXT NOT NULL CHECK (char_length(descripcion) BETWEEN 10 AND 3000),
 estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK(estado IN ('pendiente','en_proceso','resuelto')),
 respuesta TEXT,
 creado_en TIMESTAMPTZ NOT NULL DEFAULT now(),
 actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_atencion_estado_fecha ON public.solicitudes_atencion(estado,creado_en DESC);
-- Sin usuario_mongo_id, sin foreign key, sin relación con MongoDB.
