import express from 'express';
import type { Request, Response } from 'express';
import { ErrorCotizacion, cotizar } from './cotizador.js';
import type { SolicitudCotizacion } from './types.js';

export function crearApp(): express.Express {
  const app = express();
  app.use(express.json({ limit: '32kb' }));

  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', servicio: 'contoso-envios-api', version: process.env.APP_VERSION ?? 'dev' });
  });

  app.post('/cotizar', (req: Request, res: Response) => {
    try {
      const cotizacion = cotizar(req.body as SolicitudCotizacion);
      res.json(cotizacion);
    } catch (error) {
      if (error instanceof ErrorCotizacion) {
        res.status(400).json({ error: error.message, codigo: error.codigo });
        return;
      }
      // eslint-disable-next-line no-console
      console.error('Error inesperado al cotizar', error);
      res.status(500).json({ error: 'Error interno', codigo: 'ERROR_INTERNO' });
    }
  });

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Recurso no encontrado', codigo: 'NO_ENCONTRADO' });
  });

  return app;
}
