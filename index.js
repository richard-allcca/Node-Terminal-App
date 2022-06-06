require("dotenv").config();

const {
  inquirerMenu,
  pausa,
  leerInput,
  listaLugares,
} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

require("colors");

const main = async () => {
  const busquedas = new Busquedas();
  let opt;

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        // Mostrar msj
        const lugarSearch = await leerInput("Ciudad");

        // Buscar lugar
        const lugarResp = await busquedas.ciudad(lugarSearch);

        // obtener id de seleccion
        const id = await listaLugares(lugarResp);
        if (id == "0") continue;

        // Seleccionar lugar por id
        const lugarSelect = lugarResp.find((l) => l.id === id);

        // agregar al historial
        busquedas.agregarHistorial(lugarSelect.nombre);
        busquedas.guardarDb();

        // Obtener Clima
        const clima = await busquedas.lugarClima(
          lugarSelect.lat,
          lugarSelect.lng
        );
        // console.log(clima);
        const { desc, min, max, temp } = clima;

        // Mostrar resultado
        console.log("\n Información de la ciudad\n".green);
        console.log("Ciudad:", lugarSelect.nombre.green);
        console.log("Lat:", lugarSelect.lat);
        console.log("Long:", lugarSelect.lng);
        console.log("Temperatura:", temp);
        console.log("Minima:", min);
        console.log("Maxima:", max);
        console.log("Esta con:", desc.green);

        break;
      case 2:
        busquedas.historialCapitalizado.forEach((lugar, i) => {
          const idx = `${i + 1}`.green;

          console.log(`${idx} ${lugar}`);
        });
        break;

      default:
        break;
    }

    await pausa();
  } while (opt != 0);
};

main();
