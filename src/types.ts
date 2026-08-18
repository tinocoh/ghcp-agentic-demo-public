/**
 * Tipos del dominio de cotizacion de envios.
 */

/** Zonas tarifarias en las que Contoso Envios opera. */
export type Zona = 'metropolitana' | 'nacional' | 'remota' | 'internacional';

/** Nivel de servicio contratado. */
export type Servicio = 'estandar' | 'express' | 'mismo_dia';

/** Paquete a cotizar. Las dimensiones van en centimetros y el peso en kilogramos. */
export interface Paquete {
  pesoKg: number;
  largoCm: number;
  anchoCm: number;
  altoCm: number;
}

/** Solicitud de cotizacion recibida por el endpoint POST /cotizar. */
export interface SolicitudCotizacion {
  origenCp: string;
  destinoCp: string;
  paquete: Paquete;
  servicio: Servicio;
  /** Valor declarado en MXN. Si se envia, se cobra seguro sobre este monto. */
  valorDeclarado?: number;
}

/** Desglose devuelto al cliente. Todos los montos van en centavos para evitar errores de redondeo. */
export interface Cotizacion {
  zona: Zona;
  servicio: Servicio;
  pesoFacturableKg: number;
  desglose: {
    baseCentavos: number;
    sobrepesoCentavos: number;
    seguroCentavos: number;
    combustibleCentavos: number;
  };
  subtotalCentavos: number;
  ivaCentavos: number;
  totalCentavos: number;
  diasHabilesEstimados: number;
}
