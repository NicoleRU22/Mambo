#!/usr/bin/env node

const fetch = require('node-fetch');

const API_URL = process.env.API_URL || 'http://localhost:4000/api';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

async function checkBackendHealth() {
  console.log('🔍 Verificando conectividad del backend...');
  
  try {
    const response = await fetch(`${API_URL}/health/detailed`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Backend conectado correctamente');
      console.log(`📊 Estado: ${data.status}`);
      console.log(`🕒 Timestamp: ${data.timestamp}`);
      console.log(`🌍 Ambiente: ${data.environment}`);
      
      if (data.database) {
        console.log('🗄️ Base de datos:');
        console.log(`   - Estado: ${data.database.status}`);
        console.log(`   - Usuarios: ${data.database.stats.users}`);
        console.log(`   - Productos: ${data.database.stats.products}`);
        console.log(`   - Pedidos: ${data.database.stats.orders}`);
      }
      
      if (data.services) {
        console.log('🔧 Servicios activos:');
        Object.entries(data.services).forEach(([service, status]) => {
          console.log(`   - ${service}: ${status}`);
        });
      }
      
      return true;
    } else {
      console.log('❌ Backend respondió con error:', data);
      return false;
    }
  } catch (error) {
    console.log('❌ Error conectando al backend:', error.message);
    return false;
  }
}

async function checkFrontendHealth() {
  console.log('\n🔍 Verificando conectividad del frontend...');
  
  try {
    const response = await fetch(FRONTEND_URL);
    
    if (response.ok) {
      console.log('✅ Frontend conectado correctamente');
      console.log(`📄 Status: ${response.status}`);
      return true;
    } else {
      console.log('❌ Frontend respondió con error:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Error conectando al frontend:', error.message);
    return false;
  }
}

async function checkAPIConnection() {
  console.log('\n🔍 Verificando endpoints de la API...');
  
  const endpoints = [
    '/auth',
    '/products',
    '/categories',
    '/cart',
    '/orders',
    '/blog',
    '/newsletter',
    '/search',
    '/offers',
    '/return'
  ];
  
  let successCount = 0;
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`);
      if (response.ok || response.status === 401) { // 401 es normal para endpoints protegidos
        console.log(`✅ ${endpoint}: OK`);
        successCount++;
      } else {
        console.log(`❌ ${endpoint}: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint}: Error - ${error.message}`);
    }
  }
  
  console.log(`\n📊 Endpoints verificados: ${successCount}/${endpoints.length}`);
  return successCount === endpoints.length;
}

async function main() {
  console.log('🚀 Verificación de conectividad Mambo PetShop\n');
  console.log(`🔗 API URL: ${API_URL}`);
  console.log(`🌐 Frontend URL: ${FRONTEND_URL}\n`);
  
  const backendOk = await checkBackendHealth();
  const frontendOk = await checkFrontendHealth();
  const apiOk = await checkAPIConnection();
  
  console.log('\n📋 Resumen:');
  console.log(`Backend: ${backendOk ? '✅' : '❌'}`);
  console.log(`Frontend: ${frontendOk ? '✅' : '❌'}`);
  console.log(`API Endpoints: ${apiOk ? '✅' : '❌'}`);
  
  if (backendOk && frontendOk && apiOk) {
    console.log('\n🎉 ¡Todo está funcionando correctamente!');
    console.log('Puedes acceder a:');
    console.log(`   - Frontend: ${FRONTEND_URL}`);
    console.log(`   - API: ${API_URL}`);
    process.exit(0);
  } else {
    console.log('\n⚠️ Hay problemas de conectividad. Revisa:');
    if (!backendOk) console.log('   - Backend no está ejecutándose');
    if (!frontendOk) console.log('   - Frontend no está ejecutándose');
    if (!apiOk) console.log('   - Problemas con endpoints de la API');
    process.exit(1);
  }
}

main().catch(console.error); 