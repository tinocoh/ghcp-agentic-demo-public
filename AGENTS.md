# AGENTS.md — como trabajar en este repositorio de forma autonoma

Este archivo lo leen los agentes de codificacion: el cloud agent de GitHub Copilot,
Copilot CLI y los agentes de terceros habilitados en la organizacion.

Complementa a `.github/copilot-instructions.md`, que contiene los estandares de
codigo. Aqui esta el **procedimiento operativo**: como preparar el entorno,
como verificar y cuando detenerse.

## Preparacion del entorno

Las dependencias ya vienen instaladas por
`.github/workflows/copilot-setup-steps.yml`. No corras `npm install` de nuevo
salvo que hayas modificado `package.json`.

## Ciclo de trabajo esperado

1. Lee el issue completo antes de tocar codigo. Si los criterios de aceptacion son
   ambiguos, resuelvelos de la forma mas conservadora y anotalo en la descripcion
   del pull request.
2. Localiza el modulo correcto. La logica de negocio vive en `src/cotizador.ts` y
   `src/zonas.ts`. `src/app.ts` es solo transporte HTTP.
3. Escribe primero la prueba que falla, luego la implementacion.
4. Corre la verificacion completa antes de hacer commit.

## Comando de verificacion

Este es el unico criterio de "terminado". Los tres deben quedar en verde:

```bash
npm run typecheck && npm run lint && npm test
```

Si alguno falla, arreglalo. No abras el pull request con la verificacion en rojo
ni desactives una regla de lint para que pase.

## Alcance de los cambios

- Cambia solo lo que el issue pide. No aproveches para refactorizar de mas.
- No toques `package.json`, `tsconfig.json` ni `eslint.config.js` salvo que el
  issue lo pida explicitamente.
- No modifiques pruebas existentes para que pasen. Si una prueba existente falla,
  es que tu cambio rompio algo: arregla el codigo, no la prueba.
- No agregues dependencias nuevas sin justificarlo en el pull request. Este
  proyecto prefiere la libreria estandar.

## Descripcion del pull request

Escribe la descripcion en espanol y estructurala asi:

- **Que cambia** — una frase.
- **Por que** — la regla de negocio detras del cambio.
- **Como se verifico** — que pruebas agregaste y el resultado de la verificacion.
- **Riesgos** — que podria romperse, o "ninguno identificado".

## Cuando detenerte y pedir ayuda

Detente y explicalo en el pull request en vez de improvisar si:

- El issue requiere cambiar el contrato publico de la API sin decirlo.
- Necesitas un secreto, una credencial o un servicio externo que no esta disponible.
- La solucion correcta implica tocar mas de cinco archivos.
