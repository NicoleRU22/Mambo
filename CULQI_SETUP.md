# Configuración de Culqi para Mambo PetShop

## Pasos para configurar Culqi

### 1. Crear cuenta en Culqi
1. Ve a [https://www.culqi.com](https://www.culqi.com)
2. Regístrate y crea una cuenta
3. Completa la verificación de tu cuenta

### 2. Obtener las claves de API
1. En el dashboard de Culqi, ve a **Configuración > API Keys**
2. Copia tu **Public Key** (pk_test_... para pruebas, pk_live_... para producción)
3. Copia tu **Secret Key** (sk_test_... para pruebas, sk_live_... para producción)

### 3. Configurar variables de entorno

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:4000/api
VITE_CULQI_PUBLIC_KEY=pk_test_TU_CLAVE_PUBLICA_AQUI
```

#### Backend (.env)
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="tu_jwt_secret"
CULQI_SECRET_KEY=sk_test_TU_CLAVE_SECRETA_AQUI
CULQI_PUBLIC_KEY=pk_test_TU_CLAVE_PUBLICA_AQUI
```

### 4. Configurar el backend para procesar pagos

Necesitarás agregar las siguientes rutas en tu backend:

```javascript
// routes/payments.js
import express from 'express';
import { culqi } from 'culqi-node';

const router = express.Router();

// Procesar pago con Culqi
router.post('/process-payment', async (req, res) => {
  try {
    const { token, amount, currency, order_id } = req.body;
    
    const charge = await culqi.charges.create({
      amount: amount * 100, // Culqi requiere el monto en centavos
      currency: currency || 'PEN',
      source_id: token,
      description: `Pedido ${order_id}`,
    });
    
    res.json({ success: true, charge });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
```

### 5. Instalar dependencias

#### Backend
```bash
cd backend
npm install culqi-node
```

### 6. Configurar webhooks (opcional pero recomendado)

1. En el dashboard de Culqi, ve a **Configuración > Webhooks**
2. Agrega tu URL de webhook: `https://tu-dominio.com/api/webhooks/culqi`
3. Selecciona los eventos que quieres recibir:
   - `charge.succeeded`
   - `charge.failed`

### 7. Probar la integración

#### Tarjetas de prueba de Culqi:

**Visa:**
- Número: 4111 1111 1111 1111
- CVV: 123
- Fecha: Cualquier fecha futura

**Mastercard:**
- Número: 5555 5555 5555 4444
- CVV: 123
- Fecha: Cualquier fecha futura

### 8. Flujo de pago

1. El usuario agrega productos al carrito
2. En el checkout, selecciona "Tarjeta de crédito/débito"
3. Se carga Culqi y se procesa el pago
4. Si el pago es exitoso, se crea el pedido
5. Se redirige al usuario a la página de éxito

### 9. Consideraciones de seguridad

- Nunca expongas tu Secret Key en el frontend
- Siempre valida los pagos en el backend
- Usa HTTPS en producción
- Implementa validación de webhooks
- Maneja errores de pago apropiadamente

### 10. Producción

Cuando estés listo para producción:

1. Cambia las claves de `test` a `live`
2. Actualiza las URLs de webhook
3. Configura SSL/HTTPS
4. Prueba exhaustivamente con montos pequeños
5. Implementa logging detallado para transacciones

## Soporte

Para más información sobre la integración con Culqi:
- [Documentación oficial de Culqi](https://docs.culqi.com/)
- [API Reference](https://docs.culqi.com/api/)
- [SDK de Node.js](https://github.com/culqi/culqi-node) 