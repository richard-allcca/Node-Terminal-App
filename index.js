/* eslint-disable no-await-in-loop */
/* eslint-disable no-case-declarations */
require('dotenv').config();

const {
  inquirerMenu,
  pausa,
  leerInput,
  listaLugares,
} = require('./helpers/inquirer');
const Searches = require('./models/searches');

require('colors');

const main = async () => {
  const search = new Searches();
  let opt;

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        // Mostrar msj
        const lugarSearch = await leerInput('Ciudad');

        // Buscar lugar
        const lugarResp = await search.ciudad(lugarSearch);

        // obtener id de selección
        const id = await listaLugares(lugarResp);
        if (id === '0') return;

        // Seleccionar lugar por id
        const lugarSelect = lugarResp.find((l) => l.id === id);

        // agregar al historial
        search.agregarHistorial(lugarSelect.nombre);
        search.guardarDb();

        // Obtener Clima
        const clima = await search.lugarClima(
          lugarSelect.lat,
          lugarSelect.lng,
        );
        // console.log(clima);
        const {
          desc, min, max, temp,
        } = clima;

        // Mostrar resultado
        console.log('\n Información de la ciudad\n'.green);
        console.log('Ciudad:', lugarSelect.nombre.green);
        console.log('Lat:', lugarSelect.lat);
        console.log('Long:', lugarSelect.lng);
        console.log('Temperatura:', temp);
        console.log('Minima:', min);
        console.log('Maxima:', max);
        console.log('Esta con:', desc.green);

        break;
      case 2:
        search.historialCapitalizado.forEach((lugar, i) => {
          const idx = `${i + 1}`.green;

          console.log(`${idx} ${lugar}`);
        });
        break;

      default:
        break;
    }

    await pausa();
  } while (opt !== 0);
};

main();
