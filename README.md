# Contoso Envios — API de cotizacion

API que calcula el costo de un envio a partir del origen, el destino y las
caracteristicas del paquete. La consumen el portal de clientes y el call center.

> Este repositorio es el entorno de la demostracion **Desarrollo agentico con
> GitHub Copilot**. Esta preparado para que el cloud agent pueda trabajar de forma
> autonoma: tiene estandares escritos, un entorno preinstalado y una verificacion
> automatica que define que significa "terminado".

## Como correrlo

```bash
npm ci
npm test
npm run dev
```

La API queda en `http://localhost:3000`.

## Endpoints

| Metodo | Ruta | Descripcion |
|---|---|---|
| `GET` | `/health` | Estado del servicio |
| `POST` | `/cotizar` | Devuelve el desglose tarifario de un envio |

Ejemplo:

```bash
curl -X POST http://localhost:3000/cotizar \
  -H "Content-Type: application/json" \
  -d '{
    "origenCp": "06600",
    "destinoCp": "44100",
    "paquete": { "pesoKg": 8, "largoCm": 40, "anchoCm": 30, "altoCm": 20 },
    "servicio": "express",
    "valorDeclarado": 5000
  }'
```

## Modelo de tarifa

1. **Peso facturable** — el mayor entre el peso real y el volumetrico
   (`largo x ancho x alto / 5000`), redondeado hacia arriba en escalones de 0.5 kg.
2. **Tarifa base** — depende de la zona (metropolitana, nacional, remota,
   internacional) y del nivel de servicio.
3. **Sobrepeso** — se cobra solo por los kilos que exceden los 5 kg incluidos.
4. **Seguro** — 1.5 % del valor declarado, si se envia.
5. **Combustible** — 8 % sobre base mas sobrepeso.
6. **IVA** — 16 % sobre el subtotal.

Todos los montos se manejan y devuelven como **enteros en centavos**.

## Configuracion agentica del repositorio

| Archivo | Para que sirve |
|---|---|
| `.github/copilot-instructions.md` | Estandares de codigo para todo el repo |
| `AGENTS.md` | Procedimiento operativo de los agentes autonomos |
| `.github/instructions/pruebas.instructions.md` | Reglas que aplican solo a `*.test.ts` |
| `.github/agents/revisor-seguridad.md` | Agente especializado en seguridad y dinero |
| `.github/agents/ingeniero-pruebas.md` | Agente especializado en cobertura de pruebas |
| `.github/workflows/copilot-setup-steps.yml` | Prepara el entorno del cloud agent |

## Verificacion

Los tres comandos deben quedar en verde antes de abrir un pull request:

```bash
npm run typecheck
npm run lint
npm test
```
