## Contexto de negocio

Dos clientes corporativos pidieron el contrato de la API para integrarse. Hoy no
existe: se les manda un correo con ejemplos de `curl` y cada integracion
interpreta los campos a su manera.

## Que se necesita

Publicar un contrato **OpenAPI 3.1** de la API, servido por la propia
aplicacion.

## Criterios de aceptacion

- [ ] El documento se construye en un archivo nuevo `src/openapi.ts`.
- [ ] `src/app.ts` expone `GET /openapi.json` devolviendo ese documento.
      Esos son los **unicos dos archivos** que debes tocar.
- [ ] El contrato describe `POST /cotizar` con su cuerpo de solicitud, la
      respuesta `200` y la respuesta de error `400`.
- [ ] Los codigos de error del dominio se documentan como valores posibles:
      `CP_REQUERIDO`, `CP_VACIO`, `PAQUETE_REQUERIDO`, `DIMENSIONES_INVALIDAS`,
      `PESO_EXCEDIDO`, `SERVICIO_INVALIDO`, `VALOR_INVALIDO`, `VALOR_EXCEDIDO`,
      `SERVICIO_NO_DISPONIBLE`.
- [ ] Los montos se documentan explicitamente como **enteros en centavos**.
- [ ] El endpoint responde `application/json` y no requiere autenticacion.
- [ ] `npm run typecheck && npm run lint` queda en verde.

## Notas

No agregues dependencias nuevas al proyecto: el documento se arma como un objeto
de TypeScript, no con una libreria generadora. El contrato debe reflejar lo que
la API hace hoy, no lo que quisieramos que hiciera.
