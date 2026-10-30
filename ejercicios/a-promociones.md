## Contexto de negocio

Mercadotecnia lanza campanas con **cupones de descuento** y hoy no hay forma de
aplicarlos: el call center los captura a mano al final del proceso y se pierden
en la conciliacion.

## Que se necesita

Un modulo nuevo de promociones que valide un cupon y devuelva el descuento que
le corresponde, en centavos, sobre un subtotal dado.

| Cupon | Descuento | Tope |
|---|---|---|
| `BIENVENIDA` | 10 % | 15000 centavos |
| `FLETEGRATIS` | 100 % del envio base | sin tope |
| `TEMPORADA` | 7 % | 8000 centavos |

## Criterios de aceptacion

- [ ] Todo el codigo vive en `src/promociones.ts`, con sus pruebas en
      `src/promociones.test.ts`. **No modifiques ningun otro archivo.**
- [ ] Los tipos que necesites se declaran dentro de `src/promociones.ts`.
      No toques `src/types.ts`.
- [ ] Un cupon desconocido o vencido devuelve descuento cero, no lanza excepcion.
- [ ] El cupon se compara sin distinguir mayusculas ni espacios alrededor.
- [ ] El descuento nunca excede el subtotal ni el tope de la tabla.
- [ ] El monto devuelto es un entero en centavos.
- [ ] Hay pruebas para cada cupon, para el tope, para el cupon desconocido y
      para el subtotal de cero.
- [ ] `npm run typecheck && npm run lint && npm test` queda en verde.

## Notas

Esta tarea es independiente del cotizador. No la integres todavia en
`cotizar()`: eso se hara en un issue posterior, cuando comercial confirme las
reglas de acumulacion con la tarifa preferencial.
