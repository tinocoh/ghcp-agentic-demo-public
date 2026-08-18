import { describe, expect, it } from 'vitest';
import { ErrorCotizacion, calcularPesoFacturable, cotizar, resolverZona } from './cotizador.js';
import type { SolicitudCotizacion } from './types.js';

const paqueteChico = { pesoKg: 1, largoCm: 20, anchoCm: 15, altoCm: 10 };

function solicitud(over: Partial<SolicitudCotizacion> = {}): SolicitudCotizacion {
  return {
    origenCp: '06600',
    destinoCp: '03100',
    paquete: paqueteChico,
    servicio: 'estandar',
    ...over,
  };
}

describe('resolverZona', () => {
  it('reconoce dos codigos postales del area metropolitana', () => {
    expect(resolverZona('06600', '03100')).toBe('metropolitana');
  });

  it('marca como remota cuando el destino cae en un prefijo remoto', () => {
    expect(resolverZona('06600', '77500')).toBe('remota');
  });

  it('cae a nacional para el resto del pais', () => {
    expect(resolverZona('06600', '44100')).toBe('nacional');
  });

  it('trata un codigo postal no mexicano como internacional', () => {
    expect(resolverZona('06600', 'SW1A1AA')).toBe('internacional');
  });
});

describe('calcularPesoFacturable', () => {
  it('usa el peso real cuando supera al volumetrico', () => {
    expect(calcularPesoFacturable({ pesoKg: 8, largoCm: 10, anchoCm: 10, altoCm: 10 })).toBe(8);
  });

  it('usa el peso volumetrico cuando el paquete es voluminoso y ligero', () => {
    // 60 * 50 * 40 / 5000 = 24 kg volumetricos contra 2 kg reales
    expect(calcularPesoFacturable({ pesoKg: 2, largoCm: 60, anchoCm: 50, altoCm: 40 })).toBe(24);
  });

  it('redondea hacia arriba en escalones de medio kilo', () => {
    expect(calcularPesoFacturable({ pesoKg: 1.2, largoCm: 10, anchoCm: 10, altoCm: 10 })).toBe(1.5);
  });
});

describe('cotizar', () => {
  it('cotiza un envio metropolitano estandar sin sobrepeso', () => {
    const r = cotizar(solicitud());
    expect(r.zona).toBe('metropolitana');
    expect(r.desglose.baseCentavos).toBe(9900);
    expect(r.desglose.sobrepesoCentavos).toBe(0);
    expect(r.desglose.combustibleCentavos).toBe(792);
    expect(r.subtotalCentavos).toBe(10692);
    expect(r.ivaCentavos).toBe(1711);
    expect(r.totalCentavos).toBe(12403);
  });

  it('cobra sobrepeso solo por los kilos que exceden el peso incluido', () => {
    const r = cotizar(solicitud({ paquete: { pesoKg: 9, largoCm: 10, anchoCm: 10, altoCm: 10 } }));
    // 9 kg facturables - 5 kg incluidos = 4 kg a 1800 centavos
    expect(r.desglose.sobrepesoCentavos).toBe(7200);
  });

  it('devuelve montos enteros en centavos, nunca flotantes', () => {
    const r = cotizar(solicitud({ valorDeclarado: 1234.56 }));
    for (const monto of [
      r.desglose.baseCentavos,
      r.desglose.sobrepesoCentavos,
      r.desglose.seguroCentavos,
      r.desglose.combustibleCentavos,
      r.subtotalCentavos,
      r.ivaCentavos,
      r.totalCentavos,
    ]) {
      expect(Number.isInteger(monto)).toBe(true);
    }
  });

  it('aplica la prima de seguro sobre el valor declarado', () => {
    const r = cotizar(solicitud({ valorDeclarado: 10_000 }));
    // 10 000 MXN -> 1 000 000 centavos * 1.5 % = 15 000 centavos
    expect(r.desglose.seguroCentavos).toBe(15_000);
  });

  it('rechaza dimensiones no positivas', () => {
    expect(() =>
      cotizar(solicitud({ paquete: { pesoKg: 0, largoCm: 10, anchoCm: 10, altoCm: 10 } })),
    ).toThrow(ErrorCotizacion);
  });

  it('rechaza paquetes que exceden el peso maximo', () => {
    expect(() =>
      cotizar(solicitud({ paquete: { pesoKg: 90, largoCm: 10, anchoCm: 10, altoCm: 10 } })),
    ).toThrow(/70 kg/);
  });

  it('rechaza mismo dia en zona remota porque no hay cobertura', () => {
    expect(() => cotizar(solicitud({ destinoCp: '77500', servicio: 'mismo_dia' }))).toThrow(
      /no esta disponible/,
    );
  });
});
