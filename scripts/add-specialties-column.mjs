/**
 * Script para agregar la columna 'specialties' a la tabla staff
 * y migrar los datos de 'specialty' a 'specialties'
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Falta NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function addSpecialtiesColumn() {
  try {
    console.log('🚀 Iniciando agregación de columna specialties...\n');

    // Paso 1: Ejecutar el SQL para agregar la columna
    console.log('📋 Paso 1: Agregando columna specialties...');
    const { error: sqlError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE staff 
        ADD COLUMN IF NOT EXISTS specialties TEXT DEFAULT '[]';
      `
    }).catch(() => {
      // Si el RPC no existe, intentar otra forma
      return { error: { message: 'RPC no disponible' } };
    });

    if (sqlError && sqlError.message !== 'RPC no disponible') {
      console.error('❌ Error:', sqlError);
    }

    console.log('✅ Columna agregada (o ya existía)\n');

    // Paso 2: Obtener datos actuales
    console.log('📋 Paso 2: Obteniendo datos actuales...');
    const { data: staffData, error: fetchError } = await supabase
      .from('staff')
      .select('*');

    if (fetchError) {
      console.error('❌ Error al obtener datos:', fetchError);
      process.exit(1);
    }

    console.log(`✅ Se encontraron ${staffData.length} registros\n`);

    // Paso 3: Migrar datos
    console.log('🔄 Paso 3: Migrando datos...');
    
    for (const staff of staffData) {
      let specialties = [];
      
      if (staff.specialty && staff.specialty.trim() !== '') {
        specialties = [staff.specialty];
      }

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

    console.log('\n✅ Fase 1 completada!\n');
    console.log('📝 Próximo paso:');
    console.log('Ejecuta: npx prisma db push');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addSpecialtiesColumn();
