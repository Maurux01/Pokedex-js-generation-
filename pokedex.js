async function buscarPokemon(nombre) {
  const url = "https://pokeapi.co/api/v2/pokemon/" + nombre.toLowerCase();
  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    console.log("No se encontró el pokémon " + nombre + ". Estado: " + respuesta.status);
    return null;
  }
  const datos = await respuesta.json();
  return datos;
}
function mostrarFicha(datos) {
  if (!datos) {
    console.log("No hay datos para mostrar, porfavor escribe el nomnre de un pokemon");
    return;
  }
  console.log("===== " + datos.name.toUpperCase() + " =====");
  console.log("Número de Pokédex: " + datos.id);
  const nombresTipos = [];
  for (const t of datos.types) {
    nombresTipos.push(t.type.name);
  }
  console.log("Tipos: " + nombresTipos.join(" / "));
  const alturaCm = datos.height * 10;
  const pesoKg = datos.weight / 10;
  console.log("Altura: " + alturaCm + " cm");
  console.log("Peso: " + pesoKg + " kg");
  console.log("Stats:");
  for (const s of datos.stats) {
    console.log(s.stat.name + ": " + s.base_stat);
  }
  console.log("Habilidades:");
  for (const a of datos.abilities) {
    if (a.is_hidden) {
      console.log(a.ability.name + " (oculta)");
    } else {
      console.log(a.ability.name);
    }
  }
}
function obtenerStat(datos, nombreStat) {
  for (const s of datos.stats) {
    if (s.stat.name === nombreStat) {
      return s.base_stat;
    }
  }
  return null;
}
async function compararPokemon(nombre1, nombre2, stat) {
  const datos1 = await buscarPokemon(nombre1);
  const datos2 = await buscarPokemon(nombre2);
  if (!datos1 || !datos2) {
    console.log("No se puede comparar porque falta uno de los pokémon.");
    return;
  }
  const valor1 = obtenerStat(datos1, stat);
  const valor2 = obtenerStat(datos2, stat);
  if (valor1 === null || valor2 === null) {
    console.log("La stat " + stat + " no existe. Usa una de estas: hp, attack, defense, special-attack, special-defense, speed.");
    return;
  }
  console.log(nombre1 + " tiene " + stat + ": " + valor1);
  console.log(nombre2 + " tiene " + stat + ": " + valor2);
  if (valor1 > valor2) {
    console.log("Gana " + nombre1 + " en " + stat + ".");
  } else if (valor2 > valor1) {
    console.log("Gana " + nombre2 + " en " + stat + ".");
  } else {
    console.log("Hay un empate en " + stat + " entre " + nombre1 + " y " + nombre2 + ".");
  }
}
async function pokemonMasFuerte(listaNombres, stat) {
  let mejorNombre = "";
  let mejorValor = -1;
  for (const nombre of listaNombres) {
    const datos = await buscarPokemon(nombre);
    if (!datos) {
      continue;
    }
    const valor = obtenerStat(datos, stat);
    if (valor === null) {
      continue;
    }
    if (valor > mejorValor) {
      mejorValor = valor;
      mejorNombre = nombre;
    }
  }
  console.log("El más fuerte en " + stat + " es " + mejorNombre + " con " + mejorValor + ".");
  return mejorNombre;
}
const prompt = require("prompt-sync")();

async function principal() {
  // ===== Ejercicio 2 =====
  console.log("===== Ejercicio 2: probar buscarPokemon() =====");
  console.log("Escribe 3 Pokémon distintos para buscarlos.");
  const nombresPrueba = [];
  for (let i = 1; i <= 3; i++) {
    const escrito = prompt("Escribe el Pokémon " + i + ": ").trim().toLowerCase();
    nombresPrueba.push(escrito);
  }
  for (const nombre of nombresPrueba) {
    const datos = await buscarPokemon(nombre);
    if (datos !== null) {
      console.log("name: " + datos.name + ", id: " + datos.id);
    }
  }
  const pruebaError = prompt("Escribe un nombre que NO exista para probar el error: ").trim().toLowerCase();
  const inexistente = await buscarPokemon(pruebaError);
  if (inexistente !== null) {
    console.log("name: " + inexistente.name + ", id: " + inexistente.id);
  }

  // ===== Ejercicio 3 =====
  console.log("\n===== Ejercicio 3: mostrarFicha() de dos Pokémon nuevos =====");
  console.log("Escribe 2 Pokémon diferentes a los anteriores.");
  const nombreA = prompt("Escribe un Pokémon nuevo: ").trim().toLowerCase();
  const datosA = await buscarPokemon(nombreA);
  mostrarFicha(datosA);
  const nombreB = prompt("Escribe otro Pokémon nuevo: ").trim().toLowerCase();
  const datosB = await buscarPokemon(nombreB);
  mostrarFicha(datosB);

  // Para responder por escrito:
  // ¿Por qué es útil que buscarPokemon() y mostrarFicha() sean funciones separadas,
  // en vez de un solo bloque de código que haga todo junto?
  // Respuesta: porque cada una tiene una sola responsabilidad (buscarPokemon trae el dato,
  // mostrarFicha lo muestra). Así si mañana cambia la URL de la API solo tocas buscarPokemon,
  // y si quieres mostrar la ficha de otra forma (guardar en archivo en vez de imprimir)
  // solo tocas mostrarFicha. Son reutilizables, fáciles de probar y fáciles de modificar.

  // ===== Ejercicio 4 =====
  console.log("\n===== Ejercicio 4.1: comparar dos Pokémon por una stat =====");
  console.log("(En el PDF se sugiere snorlax vs machamp. Escríbelos si quieres seguir el ejemplo.)");
  const nombre1 = prompt("Escribe el primer Pokémon a comparar: ").trim().toLowerCase();
  const nombre2 = prompt("Escribe el segundo Pokémon a comparar: ").trim().toLowerCase();
  const stat1 = prompt("Escribe la stat a comparar (ej: attack): ").trim().toLowerCase();
  // Elijo la stat "attack" porque snorlax y machamp son Pokémon físicos y pesados:
  // su rol principal en combate es pegar fuerte con ataques físicos, así que attack
  // es la stat más relevante para compararlos entre ellos.
  await compararPokemon(nombre1, nombre2, stat1);

  console.log("\n===== Ejercicio 4.2: dos Pokémon en defense =====");
  const nombre3 = prompt("Escribe el primer Pokémon a comparar en defense: ").trim().toLowerCase();
  const nombre4 = prompt("Escribe el segundo Pokémon a comparar en defense: ").trim().toLowerCase();
  await compararPokemon(nombre3, nombre4, "defense");

  console.log("\n===== Ejercicio 4.3: stat que no existe =====");
  console.log('Escribe una stat que NO exista (por ejemplo "fuerza") para verificar el aviso.');
  const nombre5 = prompt("Escribe el primer Pokémon: ").trim().toLowerCase();
  const nombre6 = prompt("Escribe el segundo Pokémon: ").trim().toLowerCase();
  const statMala = prompt('Escribe la stat inexistente (ej: "fuerza"): ').trim().toLowerCase();
  await compararPokemon(nombre5, nombre6, statMala);

  // ===== Ejercicio 5: Desafío final =====
  console.log("\n===== Ejercicio 5: pokemonMasFuerte() =====");
  console.log("Arma tu equipo de 6 Pokémon.");
  const miEquipo = [];
  for (let i = 1; i <= 6; i++) {
    const p = prompt("Escribe el Pokémon " + i + " de tu equipo: ").trim().toLowerCase();
    miEquipo.push(p);
  }
  const ganadorAttack = await pokemonMasFuerte(miEquipo, "attack");
  await pokemonMasFuerte(miEquipo, "defense");
  console.log("\n===== Ficha completa del ganador en attack =====");
  const datosGanador = await buscarPokemon(ganadorAttack);
  mostrarFicha(datosGanador);
}

principal();
