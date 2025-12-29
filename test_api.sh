#!/bin/bash

# ==========================================
# API Test Script - Customers
# ==========================================
#
# Este script prueba los endpoints de clientes
# Úsalo para verificar que todo funciona
#
# Uso: chmod +x test_api.sh && ./test_api.sh
#
# ==========================================

BASE_URL="http://localhost:3000/api/customers"

echo "🧪 Testing Customers API..."
echo ""

# ==========================================
# TEST 1: GET - Obtener todos los clientes
# ==========================================

echo "📋 TEST 1: GET /api/customers"
echo "---"

curl -s -X GET "$BASE_URL" \
  -H "Content-Type: application/json" | jq '.'

echo ""
echo ""

# ==========================================
# TEST 2: POST - Crear un nuevo cliente
# ==========================================

echo "➕ TEST 2: POST /api/customers"
echo "---"

RESPONSE=$(curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cliente Test Script",
    "phone": "+1-305-555-9999",
    "notes": "Creado via script de test"
  }')

echo "$RESPONSE" | jq '.'

# Extraer el ID del cliente creado
CUSTOMER_ID=$(echo "$RESPONSE" | jq -r '.id')

echo ""
echo "✅ Cliente creado con ID: $CUSTOMER_ID"
echo ""
echo ""

# ==========================================
# TEST 3: GET - Obtener cliente específico
# ==========================================

if [ ! -z "$CUSTOMER_ID" ] && [ "$CUSTOMER_ID" != "null" ]; then
  echo "🔍 TEST 3: GET /api/customers/$CUSTOMER_ID"
  echo "---"
  
  curl -s -X GET "$BASE_URL/$CUSTOMER_ID" \
    -H "Content-Type: application/json" | jq '.'
  
  echo ""
  echo ""
  
  # ==========================================
  # TEST 4: PATCH - Actualizar cliente
  # ==========================================
  
  echo "✏️ TEST 4: PATCH /api/customers/$CUSTOMER_ID"
  echo "---"
  
  curl -s -X PATCH "$BASE_URL/$CUSTOMER_ID" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Cliente Test Script - ACTUALIZADO",
      "phone": "+1-305-555-9999",
      "notes": "Actualizado via script"
    }' | jq '.'
  
  echo ""
  echo ""
  
  # ==========================================
  # TEST 5: DELETE - Eliminar cliente
  # ==========================================
  
  echo "🗑️ TEST 5: DELETE /api/customers/$CUSTOMER_ID"
  echo "---"
  
  curl -s -X DELETE "$BASE_URL/$CUSTOMER_ID" \
    -H "Content-Type: application/json" | jq '.'
  
  echo ""
  echo ""
  
  # ==========================================
  # TEST 6: GET - Verificar que se eliminó
  # ==========================================
  
  echo "🔎 TEST 6: GET /api/customers/$CUSTOMER_ID (después de borrar)"
  echo "---"
  
  curl -s -X GET "$BASE_URL/$CUSTOMER_ID" \
    -H "Content-Type: application/json" | jq '.'
  
fi

echo ""
echo "✅ Tests completados"
echo ""
