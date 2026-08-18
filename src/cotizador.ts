import type { Cotizacion, Paquete, Servicio, SolicitudCotizacion, Zona } from './types.js';
import { esCpValido, resolverZona } from './zonas.js';

/** Divisor volumetrico estandar de la industria: cm3 por kilogramo. */
const DIVISOR_VOLUMETRICO = 5000;

/** El peso facturable se redondea hacia arriba en escalones de 0.5 kg. */
const ESCALON_KG = 0.5;

/** Peso incluido en la tarifa base. Lo que exceda paga sobrepeso. */
const PESO_INCLUIDO_KG = 5;

/** Tarifa base en centavos de peso mexicano, por zona y servicio. */
const TARIFA_BASE: Record<Zona, Record<Servicio, number>> = {
  metropolitana: { estandar: 9900, express: 15900, mismo_dia: 24900 },
  nacional: { estandar: 14900, express: 23900, mismo_dia: 39900 },
  remota: { estandar: 21900, express: 34900, mismo_dia: 0 },
  internacional: { estandar: 49900, express: 89900, mismo_dia: 0 },
};

/** Costo por kilogramo excedente, en centavos, por zona. */
const SOBREPESO_POR_KG: Record<Zona, number> = {
  metropolitana: 1800,
  nacional: 2600,
  remota: 4200,
  internacional: 9800,
};

/** Dias habiles estimados de entrega por zona y servicio. */
const DIAS_HABILES: Record<Zona, Record<Servicio, number>> = {
  metropolitana: { estandar: 2, express: 1, mismo_dia: 0 },
  nacional: { estandar: 4, express: 2, mismo_dia: 0 },
  remota: { estandar: 7, express: 4, mismo_dia: 0 },
  internacional: { estandar: 12, express: 6, mismo_dia: 0 },
};

/** Prima de seguro sobre el valor declarado: 1.5 %. */
const TASA_SEGURO = 0.015;

/** Cargo por combustible sobre base mas sobrepeso: 8 %. */
const TASA_COMBUSTIBLE = 0.08;

/** IVA mexicano. */
const TASA_IVA = 0.16;

/** Error de negocio: la solicitud es invalida y debe devolver 400. */
export class ErrorCotizacion extends Error {
  constructor(
    message: string,
    readonly codigo: string,
  ) {
    super(message);
    this.name = 'ErrorCotizacion';
  }
}

/**
 * Calcula el peso volumetrico de un paquete y lo compara contra el peso real.
 * Se factura el mayor de los dos, redondeado hacia arriba al siguiente escalon.
 */
export function calcularPesoFacturable(paquete: Paquete): number {
  const volumetrico = (paquete.largoCm * paquete.anchoCm * paquete.altoCm) / DIVISOR_VOLUMETRICO;
  const mayor = Math.max(paquete.pesoKg, volumetrico);
  return Math.ceil(mayor / ESCALON_KG) * ESCALON_KG;
}

/**
 * Valida la solicitud y lanza ErrorCotizacion si algo no cuadra.
 * Se valida aqui, en el dominio, para que cualquier transporte (HTTP, cola, CLI)
 * obtenga las mismas garantias.
 */
function validar(solicitud: SolicitudCotizacion): void {
  const { origenCp, destinoCp, paquete, servicio, valorDeclarado } = solicitud;

  if (typeof origenCp !== 'string' || typeof destinoCp !== 'string') {
    throw new ErrorCotizacion('Los codigos postales son obligatorios', 'CP_REQUERIDO');
  }

  // Un CP no mexicano es valido: se cotiza como internacional. Pero vacio no.
  if (origenCp.trim() === '' || destinoCp.trim() === '') {
    throw new ErrorCotizacion('Los codigos postales no pueden ir vacios', 'CP_VACIO');
  }

  if (!paquete || typeof paquete !== 'object') {
    throw new ErrorCotizacion('Falta la descripcion del paquete', 'PAQUETE_REQUERIDO');
  }

  const dimensiones = [paquete.pesoKg, paquete.largoCm, paquete.anchoCm, paquete.altoCm];
  if (dimensiones.some((v) => typeof v !== 'number' || !Number.isFinite(v) || v <= 0)) {
    throw new ErrorCotizacion(
      'El peso y las dimensiones deben ser numeros mayores a cero',
      'DIMENSIONES_INVALIDAS',
    );
  }

  if (paquete.pesoKg > 70) {
    throw new ErrorCotizacion('El peso maximo por paquete es de 70 kg', 'PESO_EXCEDIDO');
  }

  if (!(servicio in TARIFA_BASE.nacional)) {
    throw new ErrorCotizacion(`Servicio no reconocido: ${String(servicio)}`, 'SERVICIO_INVALIDO');
  }

  if (valorDeclarado !== undefined) {
    if (typeof valorDeclarado !== 'number' || !Number.isFinite(valorDeclarado) || valorDeclarado < 0) {
      throw new ErrorCotizacion('El valor declarado debe ser un numero positivo', 'VALOR_INVALIDO');
    }
    if (valorDeclarado > 500_000) {
      throw new ErrorCotizacion(
        'El valor declarado maximo es de 500,000 MXN',
        'VALOR_EXCEDIDO',
      );
    }
  }
}

/**
 * Cotiza un envio.
 *
 * Todos los montos se manejan como enteros en centavos. Nunca se usan flotantes
 * para representar dinero: se redondea con Math.round en cada paso intermedio.
 */
export function cotizar(solicitud: SolicitudCotizacion): Cotizacion {
  validar(solicitud);

  const zona = resolverZona(solicitud.origenCp, solicitud.destinoCp);
  const servicio = solicitud.servicio;

  const baseCentavos = TARIFA_BASE[zona][servicio];
  if (baseCentavos === 0) {
    throw new ErrorCotizacion(
      `El servicio ${servicio} no esta disponible para la zona ${zona}`,
      'SERVICIO_NO_DISPONIBLE',
    );
  }

  const pesoFacturableKg = calcularPesoFacturable(solicitud.paquete);

  const kgExcedente = Math.max(0, pesoFacturableKg - PESO_INCLUIDO_KG);
  const sobrepesoCentavos = Math.round(kgExcedente * SOBREPESO_POR_KG[zona]);

  const seguroCentavos = solicitud.valorDeclarado
    ? Math.round(solicitud.valorDeclarado * 100 * TASA_SEGURO)
    : 0;

  const combustibleCentavos = Math.round((baseCentavos + sobrepesoCentavos) * TASA_COMBUSTIBLE);

  const subtotalCentavos =
    baseCentavos + sobrepesoCentavos + seguroCentavos + combustibleCentavos;
  const ivaCentavos = Math.round(subtotalCentavos * TASA_IVA);

  return {
    zona,
    servicio,
    pesoFacturableKg,
    desglose: { baseCentavos, sobrepesoCentavos, seguroCentavos, combustibleCentavos },
    subtotalCentavos,
    ivaCentavos,
    totalCentavos: subtotalCentavos + ivaCentavos,
    diasHabilesEstimados: DIAS_HABILES[zona][servicio],
  };
}

export { esCpValido, resolverZona };
