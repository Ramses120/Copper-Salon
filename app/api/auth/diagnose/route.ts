import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    console.log('[Diagnose] Checking admin user...');

    // Buscar admin por email
    const { data: admins, error } = await supabase
      .from('admins')
      .select('id, email, name, rol, activo, password')
      .limit(10);

    if (error) {
      console.error('[Diagnose] Supabase error:', error);
      return NextResponse.json({
        error: 'Error connecting to database',
        details: error.message,
      }, { status: 500 });
    }

    console.log('[Diagnose] Admins found:', admins?.length || 0);

    if (!admins || admins.length === 0) {
      return NextResponse.json({
        message: 'No admins found in database',
        adminCount: 0,
        defaultAdmin: {
          email: 'admin@copperbeauty.com',
          password: 'admin123@',
          hashedPassword: await bcrypt.hash('admin123@', 12),
        },
      });
    }

    // Información de admins encontrados
    const adminInfo = admins.map(admin => ({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      rol: admin.rol,
      activo: admin.activo,
      hasPassword: !!admin.password,
      passwordLength: admin.password?.length || 0,
    }));

    // Intentar verificar contraseña del primero
    const testPassword = 'admin123@';
    const firstAdmin = admins[0];
    
    let passwordMatch = false;
    if (firstAdmin?.password) {
      try {
        passwordMatch = await bcrypt.compare(testPassword, firstAdmin.password);
      } catch (e) {
        console.error('[Diagnose] bcrypt comparison error:', e);
      }
    }

    return NextResponse.json({
      message: 'Diagnosis complete',
      adminCount: admins.length,
      admins: adminInfo,
      testPassword: {
        password: testPassword,
        matchesFirstAdmin: passwordMatch,
        firstAdminEmail: firstAdmin?.email,
      },
    });

  } catch (error) {
    console.error('[Diagnose] Error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
