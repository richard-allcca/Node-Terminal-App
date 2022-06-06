const fs = require("fs");

const axios = require("axios");

class Busquedas {
  historial = [];
  dbPath = "./db/database.json";

  get getHistorial() {
    return this.historial;
  }

  get historialCapitalizado() {
    return this.historial.map((lugar) => {
      let palabras = lugar.split(" ");
      palabras = palabras.map((p) => p[0].toUpperCase() + p.substring(1));

      return palabras.join(" ");
    });
    // return this.historial.map((lugar) => {
    //   let result = lugar.charAt(0).toUpperCase() + lugar.slice(1);
    //   return result;
    // });
  }

  get capitalizarPersonal() {
    let newArr = [];
    this.historial.forEach((el) => {
      newArr.push(this.capitalizar(el));
    });
    return (this.historial = newArr);
  }

  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: "es",
    };
  }
  get getParamsWeather() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      units: "metric",
      lang: "es",
    };
  }

  // =================================================================
  constructor() {
    // lee db si existe
    this.leerDb();
  }

  // =================================================================
  //  peticion https - ciudad
  async ciudad(nombre) {
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${nombre}.json`,
        params: this.paramsMapbox,
      });

      const resp = await instance.get();
      // console.log(resp.data.features);
      return resp.data.features.map((lugar) => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1],
      }));
    } catch (error) {
      return [];
    }
  }

  // =================================================================
  // petición http - clima
  async lugarClima(lat, lon) {
    try {
      const instance = axios.create({
        baseURL: "https://api.openweathermap.org/data/2.5/weather",
        params: { ...this.getParamsWeather, lat, lon },
      });

      const resp = await instance.get();
      // return resp.data
      const { weather, main } = resp.data;
      const { temp_min, temp_max, temp } = main;
      return {
        desc: weather[0].description,
        min: temp_min,
        max: temp_max,
        temp: temp,
      };
    } catch (error) {
      console.log(error);
    }
  }
  // =================================================================
  // Historial
  agregarHistorial(lugar = "") {
    // pravenir duplicados
    if (this.historial.includes(lugar.toLocaleLowerCase())) return;

    this.historial = this.historial.splice(0, 5);

    // agregar historial
    this.historial.unshift(lugar.toLocaleLowerCase());
  }

  // =================================================================
  //  DB
  guardarDb() {
    const payload = {
      historial: this.historial,
    };

    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }
  leerDb() {
    if (!fs.existsSync(this.dbPath)) return;

    // const historialDb = fs.readFileSync(this.dbPath, "utf8");
    const historialDb = fs.readFileSync(this.dbPath, { encoding: "utf8" });
    const data = JSON.parse(historialDb.toLocaleLowerCase());
    this.historial = data.historial;
  }
  capitalizar(frace) {
    let texto = frace.split(" ");
    for (let i = 0; i < texto.length; i++) {
      texto[i] = texto[i][0].toUpperCase() + texto[i].substring(1);
    }
    return texto.join(" ");
  }
}

module.exports = Busquedas;
