## Contexto de negocio

Contoso abrio operacion en la frontera norte y hoy toda esa region cae en
`nacional`. El costo real de esos envios es mayor y la operacion los esta
subsidiando sin saberlo.

Finanzas define la tarifa de la zona nueva hasta el proximo trimestre. Mientras
tanto, necesitamos **identificar** esos envios para poder medir cuanto estamos
perdiendo.

## Que se necesita

Ampliar `src/zonas.ts` con la capacidad de reconocer la **region fronteriza** a
partir del codigo postal, sin alterar la clasificacion que ya devuelve
`resolverZona`.

Se considera region fronteriza los codigos postales de Baja California, Sonora,
Chihuahua, Coahuila, Nuevo Leon y Tamaulipas.

## Criterios de aceptacion

- [ ] Los cambios viven en `src/zonas.ts`, con sus pruebas en un archivo nuevo
      `src/zonas.test.ts`. **No modifiques ningun otro archivo**, en particular
      ni `src/types.ts` ni `src/cotizador.ts`.
- [ ] Se exporta `esRegionFronteriza(cp: string): boolean` y
      `envioCruzaFrontera(origenCp: string, destinoCp: string): boolean`.
- [ ] `resolverZona` **no cambia su comportamiento**: los casos que hoy dan
      `metropolitana`, `nacional`, `remota` o `internacional` siguen dando lo
      mismo. Esto es lo mas importante del issue.
- [ ] Un CP invalido o vacio devuelve `false`, no lanza excepcion.
- [ ] Hay pruebas que cubren cada estado fronterizo, un CP nacional que **no**
      es frontera, la simetria origen/destino y el CP invalido.
- [ ] `npm run typecheck && npm run lint && npm test` queda en verde.

## Notas

Deliberadamente **no** se agrega un valor nuevo al tipo `Zona`. Cambiar ese tipo
obligaria a tocar las tablas de tarifas de `src/cotizador.ts`, y eso pertenece
al issue de tarifas, no a este. Aqui solo clasificamos.
