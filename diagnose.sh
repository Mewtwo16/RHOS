#!/bin/bash

echo "🔍 Diagnóstico do Sistema RHOS"
echo "================================"
echo ""

# 1. Verificar se o servidor Express está rodando
echo "1️⃣ Verificando servidor Express..."
if curl -s http://localhost:4040/api/health > /dev/null 2>&1; then
    echo "   ✅ Servidor Express está respondendo na porta 4040"
else
    echo "   ❌ Servidor Express NÃO está respondendo na porta 4040"
    echo "   💡 Execute: npm run dev"
fi
echo ""

# 2. Testar endpoint de health
echo "2️⃣ Testando endpoint /api/health..."
HEALTH_RESPONSE=$(curl -s http://localhost:4040/api/health 2>&1)
if [ $? -eq 0 ]; then
    echo "   Resposta: $HEALTH_RESPONSE"
else
    echo "   ❌ Falhou ao conectar"
fi
echo ""

# 3. Testar endpoint de login
echo "3️⃣ Testando endpoint /api/login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:4040/api/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","senha":"admin123"}' 2>&1)
  
if [ $? -eq 0 ]; then
    if echo "$LOGIN_RESPONSE" | grep -q "success"; then
        echo "   ✅ Endpoint de login está funcionando!"
        echo "   Resposta (primeiros 100 chars): ${LOGIN_RESPONSE:0:100}..."
    else
        echo "   ⚠️  Endpoint respondeu mas sem sucesso"
        echo "   Resposta: $LOGIN_RESPONSE"
    fi
else
    echo "   ❌ Falhou ao conectar"
fi
echo ""

# 4. Verificar processos Electron
echo "4️⃣ Verificando processos Electron..."
ELECTRON_PROCS=$(pgrep -f electron | wc -l)
if [ "$ELECTRON_PROCS" -gt 0 ]; then
    echo "   ✅ $ELECTRON_PROCS processos Electron em execução"
else
    echo "   ❌ Nenhum processo Electron encontrado"
    echo "   💡 A aplicação não está rodando"
fi
echo ""

# 5. Verificar variáveis de ambiente
echo "5️⃣ Verificando .env..."
if [ -f ".env" ]; then
    echo "   ✅ Arquivo .env existe"
    if grep -q "EXPRESS_PORT=4040" .env; then
        echo "   ✅ EXPRESS_PORT configurada como 4040"
    else
        echo "   ⚠️  EXPRESS_PORT não está como 4040"
    fi
    if grep -q "JWT_SECRET" .env; then
        echo "   ✅ JWT_SECRET configurada"
    else
        echo "   ❌ JWT_SECRET não encontrada!"
    fi
else
    echo "   ❌ Arquivo .env não encontrado!"
fi
echo ""

# 6. Verificar banco de dados
echo "6️⃣ Verificando conexão com banco de dados..."
if command -v mysql &> /dev/null; then
    DB_HOST=$(grep DB_HOST .env 2>/dev/null | cut -d '=' -f2)
    DB_PORT=$(grep DB_PORT .env 2>/dev/null | cut -d '=' -f2)
    DB_USER=$(grep DB_USER .env 2>/dev/null | cut -d '=' -f2)
    DB_PASSWORD=$(grep DB_PASSWORD .env 2>/dev/null | cut -d '=' -f2)
    DB_DATABASE=$(grep DB_DATABASE .env 2>/dev/null | cut -d '=' -f2)
    
    if mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "USE $DB_DATABASE" 2>/dev/null; then
        echo "   ✅ Conexão com banco de dados OK"
    else
        echo "   ❌ Falhou ao conectar no banco de dados"
    fi
else
    echo "   ⚠️  Cliente MySQL não instalado, pulando teste"
fi
echo ""

echo "================================"
echo "✨ Diagnóstico concluído!"
echo ""
echo "💡 Dicas:"
echo "   - Se o servidor não estiver rodando: npm run dev"
echo "   - Verifique os logs no console do Electron (F12)"
echo "   - Verifique o terminal onde o npm run dev está rodando"
