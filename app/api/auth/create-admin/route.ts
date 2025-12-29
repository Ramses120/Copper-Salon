import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    const email = 'admin@copperbeauty.com';
    const password = 'admin123@';
    const name = 'Administrador Principal';
    const rol = 'superadmin';

    console.log('[CreateAdmin] Creating admin user:', email);

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Verificar si ya existe
    const { data: existing } = await supabase
      .from('admins')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      console.log('[CreateAdmin] Admin already exists, updating...');
      
      // Actualizar
      const { data: updated, error } = await supabase
        .from('admins')
        .update({
          password: hashedPassword,
          name: name,
          rol: rol,
          activo: true,
        })
        .eq('email', email)
        .select()
        .single();

      if (error) {
        console.error('[CreateAdmin] Update error:', error);
        return NextResponse.json({
          error: 'Error updating admin',
          details: error.message,
        }, { status: 500 });
      }

      return NextResponse.json({
        message: 'Admin updated successfully',
        admin: {
          id: updated.id,
          email: updated.email,
          name: updated.name,
          rol: updated.rol,
        },
      });
    }

    // Crear nuevo admin
    const { data: created, error } = await supabase
      .from('admins')
      .insert({
        email: email,
        password: hashedPassword,
        name: name,
        rol: rol,
        activo: true,
      })
      .select()
      .single();

    if (error) {
      console.error('[CreateAdmin] Insert error:', error);
      return NextResponse.json({
        error: 'Error creating admin',
        details: error.message,
      }, { status: 500 });
    }

    console.log('[CreateAdmin] Admin created successfully');

    return NextResponse.json({
      message: 'Admin created successfully',
      admin: {
        id: created.id,
        email: created.email,
        name: created.name,
        rol: created.rol,
      },
      credentials: {
        email: email,
        password: password,
      },
    });

  } catch (error) {
    console.error('[CreateAdmin] Error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
