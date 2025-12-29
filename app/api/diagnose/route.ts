import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

/**
 * Endpoint de diagnóstico
 * GET /api/diagnose
 * 
 * Verifica que todo esté conectado correctamente
 */
export async function GET(req: NextRequest) {
  const results: any = {
    timestamp: new Date().toISOString(),
    checks: {}
  };

  // ✅ Check 1: Supabase client initialized
  try {
    results.checks.supabaseClient = "✅ Supabase client initialized";
  } catch (error) {
    results.checks.supabaseClient = `❌ ${error}`;
  }

  // ✅ Check 2: Environment variables
  results.checks.env = {
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"
  };

  // ✅ Check 3: Can connect to Supabase
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      results.checks.supabaseConnection = `❌ ${error.message}`;
    } else {
      results.checks.supabaseConnection = "✅ Connected";
    }
  } catch (error) {
    results.checks.supabaseConnection = `❌ ${error instanceof Error ? error.message : error}`;
  }

  // ✅ Check 4: Table structure
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .limit(0);
    
    if (error) {
      results.checks.tableStructure = `❌ ${error.message}`;
    } else {
      results.checks.tableStructure = "✅ Table accessible";
    }
  } catch (error) {
    results.checks.tableStructure = `❌ ${error instanceof Error ? error.message : error}`;
  }

  // ✅ Check 5: Try a test insert
  try {
    const testPhone = `+1-305-DIAGNOSTIC-${Date.now()}`;
    const { data, error } = await supabase
      .from('customers')
      .insert({
        name: "DIAGNOSTIC TEST",
        phone: testPhone,
        notes: "Auto-generated test entry",
        active: true
      })
      .select()
      .single();
    
    if (error) {
      results.checks.testInsert = `❌ ${error.message}`;
    } else if (data) {
      // Clean up the test entry
      await supabase.from('customers').delete().eq('id', data.id);
      results.checks.testInsert = "✅ Insert works (test cleaned up)";
    }
  } catch (error) {
    results.checks.testInsert = `❌ ${error instanceof Error ? error.message : error}`;
  }

  return NextResponse.json(results);
}
