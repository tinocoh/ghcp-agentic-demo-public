# Contoso Envios API — instrucciones para GitHub Copilot

Este archivo aplica a **todo** el repositorio. Copilot lo lee en cada peticion:
completions, chat, code review y el cloud agent.

## Que es este proyecto

API de cotizacion de envios de Contoso Envios. Recibe un origen, un destino y un
paquete, y devuelve el desglose de la tarifa. La consumen el portal de clientes y
el call center, asi que un error de calculo se convierte en un error de facturacion.

Stack: Node 20, TypeScript en modo `strict`, Express 4, Vitest, ESLint 9.

## Reglas que no se negocian

### 1. El dinero siempre va en centavos, como entero
Nunca representes montos con flotantes. Toda propiedad monetaria termina en
`Centavos` y es un `number` entero. Redondea con `Math.round` en cada paso
intermedio, no solo al final.

```ts
// Correcto
const ivaCentavos = Math.round(subtotalCentavos * TASA_IVA);

// Incorrecto: introduce error de punto flotante en la factura
const iva = subtotal * 0.16;
```

### 2. La validacion vive en el dominio, no en la capa HTTP
Valida dentro de `src/cotizador.ts` y lanza `ErrorCotizacion` con un `codigo`
estable. La capa Express solo traduce ese error a un HTTP 400. Asi cualquier
transporte futuro (cola, CLI, gRPC) hereda las mismas garantias.

### 3. Nada de `any`, nada de `console.log`
El lint corre con `--max-warnings 0`. `@typescript-eslint/no-explicit-any` y
`no-console` estan en `error`. Si necesitas registrar algo, usa el logger o
justifica el `eslint-disable` en la misma linea.

### 4. Toda regla de negocio nueva llega con su prueba
Si tocas `cotizador.ts` o `zonas.ts`, agrega o actualiza casos en
`src/cotizador.test.ts`. Una regla de negocio sin prueba se considera incompleta
y sera rechazada en el code review.

### 5. Las constantes de negocio se declaran arriba y se documentan
Tarifas, tasas y umbrales van como `const` en mayusculas al inicio del modulo,
con un comentario que explique de donde sale el numero. Prohibido el numero
magico en medio de una funcion.

## Convenciones de codigo

- El codigo, los identificadores y los comentarios van **en espanol**, sin acentos
  en los identificadores.
- Imports con extension `.js` explicita, porque el proyecto es ESM nativo.
- Funciones exportadas siempre con JSDoc que explique la **regla de negocio**, no
  la mecanica obvia del codigo.
- Prefiere funciones puras. El estado y la E/S se quedan en `app.ts` e `index.ts`.

## Antes de dar por terminado un cambio

Ejecuta los tres, en este orden, y deja los tres en verde:

```bash
npm run typecheck
npm run lint
npm test
```

## Seguridad

- Ningun secreto en el codigo ni en los tests. Se leen de `process.env`.
- Todo input externo se valida antes de usarse.
- No construyas consultas ni comandos concatenando strings con datos del usuario.
