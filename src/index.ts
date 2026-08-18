import { crearApp } from './app.js';

const puerto = Number(process.env.PORT ?? 3000);

crearApp().listen(puerto, () => {
  // eslint-disable-next-line no-console
  console.log(`contoso-envios-api escuchando en el puerto ${puerto}`);
});
