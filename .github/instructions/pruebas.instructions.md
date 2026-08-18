---
applyTo: "**/*.test.ts"
---

# Como se escriben las pruebas en este repositorio

Estas instrucciones aplican unicamente a los archivos de prueba.

## Framework y estilo

- Vitest, con `describe` / `it` en espanol.
- El nombre del `it` describe la **regla de negocio**, no la mecanica.
  - Bien: `it('cobra sobrepeso solo por los kilos que exceden el peso incluido')`
  - Mal: `it('funciona correctamente')` o `it('test 3')`
- Un `expect` por concepto. Si necesitas cinco asserts para una idea, esta bien;
  si necesitas cinco asserts para cinco ideas distintas, son cinco pruebas.

## Datos de prueba

- Usa la funcion auxiliar `solicitud(overrides)` que ya existe en
  `src/cotizador.test.ts` en vez de construir el objeto completo cada vez.
- Los codigos postales de ejemplo deben ser reales y coherentes con la zona que
  quieres ejercitar:
  - `06600` y `03100` para metropolitana
  - `44100` para nacional
  - `77500` para remota
  - cualquier cadena no numerica para internacional

## Que hay que cubrir siempre

Cuando agregues una regla de negocio, cubre estos cuatro casos:

1. El camino feliz con valores tipicos.
2. El limite exacto de la regla (el valor justo en la frontera).
3. El caso que debe ser rechazado, verificando que lanza `ErrorCotizacion`.
4. Que los montos devueltos siguen siendo enteros en centavos.

## Lo que no se hace

- No uses `any`. Si necesitas un objeto invalido para probar el rechazo, construyelo
  con un cast puntual y comentado.
- No pruebes detalles de implementacion privados. Prueba a traves de la funcion
  exportada.
- No dejes pruebas con `it.skip` ni `it.only` en la rama.
- No hagas llamadas de red reales. Si necesitas HTTP, usa `supertest` sobre
  `crearApp()`.
