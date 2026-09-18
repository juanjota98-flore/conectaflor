#!/bin/bash

# Obtener el token de Supabase del archivo de configuración
PROJECT_ID="jbsgahlfsixbltvpdmqt"

# Leer el archivo fuente
FUNC_SOURCE=$(cat supabase/functions/notify-empresa/index.ts)

# Hacer deploy usando curl a la API de Supabase
curl -X POST \
  "https://${PROJECT_ID}.supabase.co/functions/v1/notify-empresa" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "{\"function_code\": \"$FUNC_SOURCE\"}"

echo "Deploy completado"
