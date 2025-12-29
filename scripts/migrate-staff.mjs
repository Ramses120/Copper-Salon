#!/usr/bin/env node

/**
 * Script para ejecutar la migración de la tabla Staff en Supabase
 * Convierte 'specialty' a 'specialties' con formato JSON array
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Falta NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.error('Asegúrate de tener un archivo .env configurado correctamente');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrateStaff() {
  try {
    console.log('🚀 Iniciando migración de tabla Staff...\n');

    // Paso 1: Obtener todos los records actuales
    console.log('📋 Paso 1: Obteniendo datos actuales de staff...');
    const { data: staffData, error: fetchError } = await supabase
      .from('staff')
      .select('*');

    if (fetchError) {
      console.error('❌ Error al obtener datos:', fetchError);
      process.exit(1);
    }

    console.log(`✅ Se encontraron ${staffData.length} registros\n`);

    // Paso 2: Actualizar cada registro para convertir specialty a specialties
    console.log('🔄 Paso 2: Convirtiendo specialty a specialties (JSON array)...');
    
    for (const staff of staffData) {
      let specialties = [];
      
      // Si existe 'specialty' con valor, convertirlo a array
      if (staff.specialty && staff.specialty.trim() !== '') {
        specialties = [staff.specialty];
      }

      // Actualizar el registro
      const { error: updateError } = await supabase
        .from('staff')
        .update({
          specialties: JSON.stringify(specialties),
        })
        .eq('id', staff.id);

      if (updateError) {
        console.error(`❌ Error al actualizar ${staff.id}:`, updateError);
      } else {
        console.log(`✅ ${staff.name || staff.id}: ${JSON.stringify(specialties)}`);
      }
    }

    console.log('\n✅ Migración completada exitosamente!');
    console.log('\n📝 Próximos pasos:');
    console.log('1. Verifica la estructura en Supabase');
    console.log('2. Asegúrate de que la columna specialties exista');
    console.log('3. Inicia el servidor: npm run dev');

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    process.exit(1);
  }
}

migrateStaff();
