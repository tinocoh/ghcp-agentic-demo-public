import type { Zona } from './types.js';

/**
 * Mapa de prefijos de codigo postal (Mexico) a zona tarifaria.
 * El prefijo son los dos primeros digitos del CP de 5 digitos.
 */
const PREFIJOS_METROPOLITANA = new Set(['01', '02', '03', '04', '05', '06', '07', '08', '09']);
const PREFIJOS_REMOTA = new Set(['23', '24', '29', '30', '77', '96', '97']);

/** Codigos postales de 5 digitos, tal como los usa Correos de Mexico. */
const CP_VALIDO = /^\d{5}$/;

/**
 * Determina si un codigo postal tiene el formato esperado.
 */
export function esCpValido(cp: string): boolean {
  return CP_VALIDO.test(cp);
}

/**
 * Resuelve la zona tarifaria a partir del par origen-destino.
 *
 * Reglas de negocio:
 * - Si alguno de los dos CP no es mexicano (no cumple el formato), es internacional.
 * - Si ambos estan en el area metropolitana, es metropolitana.
 * - Si alguno cae en un prefijo remoto, es remota (la mas cara).
 * - En cualquier otro caso, es nacional.
 */
export function resolverZona(origenCp: string, destinoCp: string): Zona {
  if (!esCpValido(origenCp) || !esCpValido(destinoCp)) {
    return 'internacional';
  }

  const pOrigen = origenCp.slice(0, 2);
  const pDestino = destinoCp.slice(0, 2);

  if (PREFIJOS_REMOTA.has(pOrigen) || PREFIJOS_REMOTA.has(pDestino)) {
    return 'remota';
  }

  if (PREFIJOS_METROPOLITANA.has(pOrigen) && PREFIJOS_METROPOLITANA.has(pDestino)) {
    return 'metropolitana';
  }

  return 'nacional';
}
