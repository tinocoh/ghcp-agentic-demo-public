## Contexto de negocio

Operaciones necesita prometerle al cliente una **ventana de recoleccion** al
momento de cotizar. Hoy se promete por telefono, sin criterio, y las quejas por
recolecciones fallidas ya son el segundo motivo de llamada.

## Que se necesita

Un modulo nuevo que, dada una zona y la hora en que se solicita, devuelva la
ventana de recoleccion comprometida.

| Zona | Corte | Si entra antes del corte | Si entra despues |
|---|---|---|---|
| `metropolitana` | 14:00 | mismo dia, 16:00 a 20:00 | siguiente dia habil, 09:00 a 13:00 |
| `nacional` | 12:00 | mismo dia, 15:00 a 19:00 | siguiente dia habil, 09:00 a 13:00 |
| `remota` | 11:00 | siguiente dia habil, 10:00 a 14:00 | en dos dias habiles, 10:00 a 14:00 |
| `internacional` | 11:00 | siguiente dia habil, 10:00 a 14:00 | en dos dias habiles, 10:00 a 14:00 |

## Criterios de aceptacion

- [ ] Todo el codigo vive en `src/recoleccion.ts`, con sus pruebas en
      `src/recoleccion.test.ts`. **No modifiques ningun otro archivo.**
- [ ] Puedes importar el tipo `Zona` desde `./types.js`, pero **no lo edites**.
- [ ] Sabado y domingo no son dias habiles. Si la ventana cae en fin de semana,
      se recorre al siguiente lunes.
- [ ] La funcion recibe la fecha y hora como parametro. No leas el reloj del
      sistema dentro del modulo: eso lo vuelve imposible de probar.
- [ ] La ventana devuelta incluye fecha, hora de inicio y hora de fin.
- [ ] Hay pruebas para cada zona, antes y despues del corte, y para el caso que
      cae en fin de semana.
- [ ] `npm run typecheck && npm run lint && npm test` queda en verde.

## Notas

No hay dias festivos por ahora. Deja el codigo preparado para agregarlos
despues, pero no los implementes.
