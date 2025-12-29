# Estructura de Base de Datos Supabase

Esta carpeta contiene los scripts necesarios para configurar la base de datos de Copper Beauty Salon.

## Archivos Principales

1.  **`schema.sql`**: Contiene la estructura completa de la base de datos (tablas, índices, políticas de seguridad).
    *   Ejecuta este archivo PRIMERO para crear la base de datos desde cero.

2.  **`seeds.sql`**: Contiene los datos iniciales (categorías, servicios, staff, administrador, etc.).
    *   Ejecuta este archivo SEGUNDO para poblar la base de datos con información.

## Cómo reiniciar la base de datos

1.  Ve al **SQL Editor** en tu dashboard de Supabase.
2.  Copia y pega el contenido de `schema.sql` y ejecútalo.
3.  Copia y pega el contenido de `seeds.sql` y ejecútalo.
