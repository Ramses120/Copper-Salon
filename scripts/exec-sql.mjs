/**
 * Script para ejecutar SQL directamente en Supabase usando el cliente
 * Agrega la columna 'specialties' a la tabla staff
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Falta NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Ejecuta SQL raw directamente en Supabase
 * Nota: Esto requiere permisos especiales o usar una función RPC
 */
async function executeSQL() {
  try {
    console.log('🚀 Iniciando migración SQL para tabla staff...\n');

    // Intentar usar el método SQL de Supabase (si existe)
    console.log('📋 Paso 1: Intentando agregar columna specialties...');
    
    // Nota: Supabase no expone directamente un método para ejecutar SQL raw
    // Se debe hacer manualmente o mediante una función RPC
    console.log('⚠️  Supabase no permite ejecutar SQL raw desde el cliente');
    console.log('   Debes hacerlo manualmente en el SQL Editor\n');

    console.log('✅ SOLUCIÓN ALTERNATIVA:');
    console.log('1. Ve a https://app.supabase.com/');
    console.log('2. Selecciona tu proyecto "CopperBeauty"');
    console.log('3. Ve a SQL Editor');
    console.log('4. Copia y pega este SQL:\n');

    const sql = `
-- Agregar columna specialties
ALTER TABLE staff 
ADD COLUMN IF NOT EXISTS specialties TEXT DEFAULT '[]';

-- Migrar datos
UPDATE staff
SET specialties = CASE 
  WHEN specialty IS NOT NULL AND specialty != '' 
  THEN jsonb_build_array(specialty)::text
  ELSE '[]'
END
WHERE specialties = '[]';

-- Verificar
SELECT id, name, specialty, specialties FROM staff LIMIT 10;
    `;

    console.log(sql);
    console.log('5. Haz clic en Run (o Control+Enter)');
    console.log('6. Luego ejecuta: npm run dev\n');

    // Alternativamente, intentar actualizar directamente
    console.log('✅ MIENTRAS TANTO:');
    console.log('El sistema seguirá funcionando sin la columna specialties');
    console.log('Solo guarda los datos directamente en el campo existente.\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

executeSQL();
