let batallaActiva = false;
let jugadorPokemon = [];
let oponentePokemon = [];
let pokemonJugadorActivo = null;
let pokemonOponenteActivo = null;
let turnoJugador = true;
let movimientosPokemon = {};

// Inventario de objetos
let inventario = {
  pocion: { nombre: "Poción", cantidad: 5, cura: 20 },
  superpocion: { nombre: "Superpoción", cantidad: 3, cura: 50 },
  hiperpocion: { nombre: "Hiperpoción", cantidad: 1, cura: 200 },
  revivir: { nombre: "Revivir", cantidad: 2, curaPercent: 50 },
};

// Tabla de efectividad de tipos
const typeChart = {
  normal: { roca: 0.5, fantasma: 0, acero: 0.5 },
  fuego: {
    fuego: 0.5,
    agua: 0.5,
    planta: 2,
    hielo: 2,
    bicho: 2,
    roca: 0.5,
    dragon: 0.5,
    acero: 2,
  },
  agua: { fuego: 2, agua: 0.5, planta: 0.5, tierra: 2, roca: 2, dragon: 0.5 },
  planta: {
    fuego: 0.5,
    agua: 2,
    planta: 0.5,
    veneno: 0.5,
    tierra: 2,
    volador: 0.5,
    bicho: 0.5,
    roca: 2,
    dragon: 0.5,
    acero: 0.5,
  },
  electrico: {
    agua: 2,
    electrico: 0.5,
    planta: 0.5,
    tierra: 0,
    volador: 2,
    dragon: 0.5,
  },
  hielo: {
    fuego: 0.5,
    agua: 0.5,
    planta: 2,
    hielo: 0.5,
    tierra: 2,
    volador: 2,
    dragon: 2,
    acero: 0.5,
  },
  lucha: {
    normal: 2,
    hielo: 2,
    veneno: 0.5,
    volador: 0.5,
    psiquico: 0.5,
    bicho: 0.5,
    roca: 2,
    fantasma: 0,
    siniestro: 2,
    acero: 2,
    hada: 0.5,
  },
  veneno: {
    planta: 2,
    veneno: 0.5,
    tierra: 0.5,
    roca: 0.5,
    fantasma: 0.5,
    acero: 0,
    hada: 2,
  },
  tierra: {
    fuego: 2,
    electrico: 2,
    planta: 0.5,
    veneno: 2,
    volador: 0,
    bicho: 0.5,
    roca: 2,
    acero: 2,
  },
  volador: {
    electrico: 0.5,
    planta: 2,
    lucha: 2,
    bicho: 2,
    roca: 0.5,
    acero: 0.5,
  },
  psiquico: { lucha: 2, veneno: 2, psiquico: 0.5, siniestro: 0, acero: 0.5 },
  bicho: {
    fuego: 0.5,
    planta: 2,
    lucha: 0.5,
    veneno: 0.5,
    volador: 0.5,
    psiquico: 2,
    fantasma: 0.5,
    siniestro: 2,
    acero: 0.5,
    hada: 0.5,
  },
  roca: {
    fuego: 2,
    hielo: 2,
    lucha: 0.5,
    tierra: 0.5,
    volador: 2,
    bicho: 2,
    acero: 0.5,
  },
  fantasma: { normal: 0, psiquico: 2, fantasma: 2, siniestro: 0.5 },
  dragon: { dragon: 2, acero: 0.5, hada: 0 },
  siniestro: {
    lucha: 0.5,
    psiquico: 2,
    fantasma: 2,
    siniestro: 0.5,
    hada: 0.5,
  },
  acero: {
    fuego: 0.5,
    agua: 0.5,
    electrico: 0.5,
    hielo: 2,
    roca: 2,
    acero: 0.5,
    hada: 2,
  },
  hada: {
    fuego: 0.5,
    lucha: 2,
    veneno: 0.5,
    dragon: 2,
    siniestro: 2,
    acero: 0.5,
  },
};

// Traducción de tipos
const tiposEspanol = {
  normal: "normal",
  fighting: "lucha",
  flying: "volador",
  poison: "veneno",
  ground: "tierra",
  rock: "roca",
  bug: "bicho",
  ghost: "fantasma",
  steel: "acero",
  fire: "fuego",
  water: "agua",
  grass: "planta",
  electric: "electrico",
  psychic: "psiquico",
  ice: "hielo",
  dragon: "dragon",
  dark: "siniestro",
  fairy: "hada",
};

async function iniciarBatalla() {
  if (!pokemonGuardados || pokemonGuardados.length === 0) {
    alert("Necesitas al menos 1 Pokémon en tu equipo para iniciar una batalla");
    return;
  }

  batallaActiva = true;

  const modal = document.getElementById("battle-modal");
  modal.style.display = "block";

  await mostrarTransicionPokebolas();

  await prepararBatalla();

  await mostrarAnimacionIntro();
}

async function mostrarTransicionPokebolas() {
  const transitionContainer = document.getElementById("pokeball-transition");
  transitionContainer.style.display = "flex";

  transitionContainer.classList.add("active");

  await esperarSegundos(0.8);

  await esperarSegundos(0.3);
}

async function ocultarTransicionPokebolas() {
  const transitionContainer = document.getElementById("pokeball-transition");

  transitionContainer.classList.remove("active");
  transitionContainer.classList.add("opening");

  await esperarSegundos(0.8);

  transitionContainer.style.display = "none";
  transitionContainer.classList.remove("opening");
}

async function mostrarAnimacionIntro() {
  const introDiv = document.getElementById("battle-intro");
  const arenaDiv = document.getElementById("battle-arena");

  introDiv.style.display = "flex";
  arenaDiv.style.display = "none";

  document.getElementById("intro-title").textContent =
    "Un entrenador te ha desafiado!";
  document.getElementById("intro-trainer-name").textContent =
    "Entrenador Rocket";

  await esperarSegundos(0.5);
  await ocultarTransicionPokebolas();

  await esperarSegundos(2.5);

  introDiv.style.display = "none";
  mostrarBatallaArena();
}

async function prepararBatalla() {
  jugadorPokemon = JSON.parse(JSON.stringify(pokemonGuardados));

  const cantidadOponente = Math.floor(Math.random() * 6) + 1;
  oponentePokemon = [];

  for (let i = 0; i < cantidadOponente; i++) {
    const pokemonAleatorio = await obtenerPokemonAleatorio();
    oponentePokemon.push(pokemonAleatorio);
  }

  pokemonJugadorActivo = jugadorPokemon[0];
  pokemonOponenteActivo = oponentePokemon[0];

  await cargarMovimientos(pokemonJugadorActivo);
  await cargarMovimientos(pokemonOponenteActivo);

  jugadorPokemon.forEach((p) => {
    p.hpMax = calcularHPTotal(p);
    if (p.hpActual === undefined) p.hpActual = p.hpMax;
  });

  oponentePokemon.forEach((p) => {
    p.hpMax = calcularHPTotal(p);
    p.hpActual = p.hpMax;
  });
}

async function obtenerPokemonAleatorio() {
  const idAleatorio = Math.floor(Math.random() * 898) + 1;

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idAleatorio}`);
    const data = await res.json();

    const esShiny = Math.random() < 0.01; // 1% de shiny para oponentes

    const pokemon = {
      numero: data.id,
      nombre: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      hp: data.stats.find((s) => s.stat.name === "hp").base_stat,
      attack: data.stats.find((s) => s.stat.name === "attack").base_stat,
      defense: data.stats.find((s) => s.stat.name === "defense").base_stat,
      spAttack: data.stats.find((s) => s.stat.name === "special-attack")
        .base_stat,
      spDefense: data.stats.find((s) => s.stat.name === "special-defense")
        .base_stat,
      velocidad: data.stats.find((s) => s.stat.name === "speed").base_stat,
      esShiny: esShiny,
      ivs: {
        hp: Math.floor(Math.random() * 32),
        attack: Math.floor(Math.random() * 32),
        defense: Math.floor(Math.random() * 32),
        spAttack: Math.floor(Math.random() * 32),
        spDefense: Math.floor(Math.random() * 32),
        speed: Math.floor(Math.random() * 32),
      },
      sprites: data.sprites,
      types: data.types,
      moves: data.moves,
      genero: Math.random() < 0.5 ? "Macho" : "Hembra",
    };

    return pokemon;
  } catch (error) {
    console.error("Error al obtener Pokémon aleatorio:", error);
    const res = await fetch("https://pokeapi.co/api/v2/pokemon/25");
    const data = await res.json();

    return {
      numero: 25,
      nombre: "Pikachu",
      hp: 35,
      attack: 55,
      defense: 40,
      spAttack: 50,
      spDefense: 50,
      velocidad: 90,
      esShiny: false,
      ivs: {
        hp: 15,
        attack: 15,
        defense: 15,
        spAttack: 15,
        spDefense: 15,
        speed: 15,
      },
      sprites: data.sprites,
      types: data.types,
      moves: data.moves,
      genero: "Macho",
    };
  }
}

async function cargarMovimientos(pokemon) {
  if (movimientosPokemon[pokemon.nombre]) return;

  const movimientos = [];
  const movesDisponibles = pokemon.moves || [];

  const movimientosConPoder = [];

  for (let i = 0; i < Math.min(movesDisponibles.length, 20); i++) {
    const moveData =
      movesDisponibles[Math.floor(Math.random() * movesDisponibles.length)];

    try {
      const res = await fetch(moveData.move.url);
      const move = await res.json();

      if (move.power && move.power > 0) {
        movimientosConPoder.push({
          nombre: move.name,
          nombreEspanol: traducirMovimiento(move.name),
          poder: move.power,
          tipo: tiposEspanol[move.type.name] || move.type.name,
          categoria: move.damage_class.name,
          precision: move.accuracy || 100,
        });
      }

      if (movimientosConPoder.length >= 4) break;
    } catch (e) {
      continue;
    }
  }

  if (movimientosConPoder.length === 0) {
    movimientosConPoder.push({
      nombre: "tackle",
      nombreEspanol: "Placaje",
      poder: 40,
      tipo: "normal",
      categoria: "physical",
      precision: 100,
    });
  }

  movimientosPokemon[pokemon.nombre] = movimientosConPoder;
}

function traducirMovimiento(nombre) {
  const traducciones = {
    tackle: "Placaje",
    scratch: "Arañazo",
    ember: "Ascuas",
    "water-gun": "Pistola Agua",
    "vine-whip": "Látigo Cepa",
    thunderbolt: "Rayo",
    thunder: "Trueno",
    "ice-beam": "Rayo Hielo",
    flamethrower: "Lanzallamas",
    surf: "Surf",
    earthquake: "Terremoto",
    psychic: "Psíquico",
    "shadow-ball": "Bola Sombra",
    "dragon-claw": "Garra Dragón",
    "iron-tail": "Cola Férrea",
    thunderpunch: "Puño Trueno",
    "fire-punch": "Puño Fuego",
    "ice-punch": "Puño Hielo",
    "hyper-beam": "Hiperrayo",
    "solar-beam": "Rayo Solar",
    "hydro-pump": "Hidrobomba",
    "fire-blast": "Llamarada",
    "close-combat": "A Bocajarro",
    "quick-attack": "Ataque Rápido",
    "body-slam": "Golpe Cuerpo",
    "mega-punch": "Megapuño",
    "mega-kick": "Megapatada",
    headbutt: "Cabezazo",
    bite: "Mordisco",
    crunch: "Triturar",
    slash: "Cuchillada",
    "fury-swipes": "Golpes Furia",
    "wing-attack": "Ataque Ala",
    "aerial-ace": "Golpe Aéreo",
    "drill-peck": "Pico Taladro",
    peck: "Picotazo",
    "razor-leaf": "Hoja Afilada",
    "seed-bomb": "Bomba Germen",
    "energy-ball": "Bola Energía",
    "giga-drain": "Gigadrenado",
    bubble: "Burbuja",
    bubblebeam: "Rayo Burbuja",
    "aqua-tail": "Acua Cola",
    waterfall: "Cascada",
    "flame-wheel": "Rueda Fuego",
    "fire-spin": "Giro Fuego",
    spark: "Chispa",
    discharge: "Chispazo",
    "thunder-wave": "Onda Trueno",
    confusion: "Confusión",
    psybeam: "Psicorrayo",
    "rock-throw": "Lanzarrocas",
    "rock-slide": "Avalancha",
    "stone-edge": "Roca Afilada",
    "mud-slap": "Bofetón Lodo",
    "mud-shot": "Disparo Lodo",
    dig: "Excavar",
    "poison-sting": "Picotazo Ven",
    sludge: "Residuos",
    "sludge-bomb": "Bomba Lodo",
    "metal-claw": "Garra Metal",
    "iron-head": "Cabeza Hierro",
    "flash-cannon": "Foco Resplandor",
    "night-slash": "Tajo Umbrío",
    "dark-pulse": "Pulso Umbrío",
    "dazzling-gleam": "Brillo Mágico",
    moonblast: "Fuerza Lunar",
    "play-rough": "Carantoña",
    "dragon-breath": "Dragoaliento",
    "dragon-pulse": "Pulso Dragón",
    outrage: "Enfado",
    lick: "Lengüetazo",
    hex: "Infortunio",
    "shadow-claw": "Garra Umbría",
    astonish: "Impresionar",
    "x-scissor": "Tijera X",
    "bug-bite": "Picadura",
    "signal-beam": "Señal Rayo",
    "low-kick": "Patada Baja",
    "karate-chop": "Golpe Kárate",
    "dynamic-punch": "Puño Dinámico",
    "cross-chop": "Tajo Cruzado",
    "brick-break": "Demolición",
    blizzard: "Ventisca",
    "ice-fang": "Colmillo Hielo",
    "icy-wind": "Viento Hielo",
    "powder-snow": "Nieve Polvo",
    "take-down": "Derribo",
    "double-edge": "Doble Filo",
    return: "Retribución",
    frustration: "Frustración",
    facade: "Fachada",
    strength: "Fuerza",
    cut: "Corte",
    "rock-smash": "Golpe Roca",
    "power-gem": "Joya de Luz",
    "ancient-power": "Poder Pasado",
    "air-slash": "Tajo Aéreo",
    hurricane: "Huracán",
    "brave-bird": "Pájaro Osado",
    fly: "Vuelo",
    bounce: "Bote",
    "volt-tackle": "Placaje Eléctrico",
    "wild-charge": "Voltio Cruel",
    "thunder-fang": "Colmillo Rayo",
    "fire-fang": "Colmillo Ígneo",
  };

  return traducciones[nombre] || nombre.toUpperCase().replace(/-/g, " ");
}

function calcularHPTotal(pokemon) {
  const baseHP = parseInt(pokemon.hp) || 50;
  const iv = pokemon.ivs?.hp || 15;
  return Math.floor(((2 * baseHP + iv) * 50) / 100) + 60;
}

function mostrarBatallaArena() {
  const arenaDiv = document.getElementById("battle-arena");
  arenaDiv.style.display = "flex";
  arenaDiv.classList.add("arena-fade-in");

  turnoJugador = true;
  volveralMenuPrincipal();
  actualizarInterfazBatalla();
}

function actualizarInterfazBatalla() {
  document.getElementById("player-pokemon-name").textContent =
    pokemonJugadorActivo.nombre;
  document.getElementById("player-pokemon-gender").textContent =
    pokemonJugadorActivo.genero === "Macho"
      ? "♂"
      : pokemonJugadorActivo.genero === "Hembra"
        ? "♀"
        : "";
  document.getElementById("player-pokemon-gender").className =
    "pokemon-gender " +
    (pokemonJugadorActivo.genero === "Macho" ? "male" : "female");
  document.getElementById("player-hp-current").textContent = Math.max(
    0,
    pokemonJugadorActivo.hpActual,
  );
  document.getElementById("player-hp-max").textContent =
    pokemonJugadorActivo.hpMax;

  const playerHpPercent =
    (pokemonJugadorActivo.hpActual / pokemonJugadorActivo.hpMax) * 100;
  const playerHpBar = document.getElementById("player-hp-bar");
  playerHpBar.style.width = Math.max(0, playerHpPercent) + "%";
  actualizarColorBarra(playerHpBar, playerHpPercent);

  document.getElementById("opponent-pokemon-name").textContent =
    pokemonOponenteActivo.nombre;
  document.getElementById("opponent-pokemon-gender").textContent =
    pokemonOponenteActivo.genero === "Macho"
      ? "♂"
      : pokemonOponenteActivo.genero === "Hembra"
        ? "♀"
        : "";
  document.getElementById("opponent-pokemon-gender").className =
    "pokemon-gender " +
    (pokemonOponenteActivo.genero === "Macho" ? "male" : "female");

  const opponentHpPercent =
    (pokemonOponenteActivo.hpActual / pokemonOponenteActivo.hpMax) * 100;
  const opponentHpBar = document.getElementById("opponent-hp-bar");
  opponentHpBar.style.width = Math.max(0, opponentHpPercent) + "%";
  actualizarColorBarra(opponentHpBar, opponentHpPercent);

  const playerSprite =
    pokemonJugadorActivo.sprites.back_default ||
    pokemonJugadorActivo.sprites.front_default;
  const opponentSprite = pokemonOponenteActivo.esShiny
    ? pokemonOponenteActivo.sprites.front_shiny
    : pokemonOponenteActivo.sprites.front_default;

  document.getElementById("player-pokemon-sprite").src = playerSprite;
  document.getElementById("opponent-pokemon-sprite").src = opponentSprite;

  actualizarIndicadoresPokebolas();

  mostrarMensajeBatalla(`¿Qué hará ${pokemonJugadorActivo.nombre}?`);
}

function actualizarIndicadoresPokebolas() {
  const playerIndicators = document.getElementById(
    "player-pokeball-indicators",
  );
  playerIndicators.innerHTML = "";

  for (let i = 0; i < 6; i++) {
    const indicator = document.createElement("div");
    indicator.className = "pokeball-indicator";

    if (i < jugadorPokemon.length) {
      if (jugadorPokemon[i].hpActual <= 0) {
        indicator.classList.add("fainted");
      }
    } else {
      indicator.classList.add("empty");
    }

    playerIndicators.appendChild(indicator);
  }

  const opponentIndicators = document.getElementById(
    "opponent-pokeball-indicators",
  );
  opponentIndicators.innerHTML = "";

  for (let i = 0; i < 6; i++) {
    const indicator = document.createElement("div");
    indicator.className = "pokeball-indicator";

    if (i < oponentePokemon.length) {
      if (oponentePokemon[i].hpActual <= 0) {
        indicator.classList.add("fainted");
      }
    } else {
      indicator.classList.add("empty");
    }

    opponentIndicators.appendChild(indicator);
  }
}

function actualizarColorBarra(barra, porcentaje) {
  if (porcentaje > 50) {
    barra.style.background = "linear-gradient(90deg, #78c850, #a8e078)";
  } else if (porcentaje > 20) {
    barra.style.background = "linear-gradient(90deg, #f8d030, #f8e888)";
  } else {
    barra.style.background = "linear-gradient(90deg, #f08030, #f8b878)";
  }
}

function mostrarSubMenu(menu) {
  if (!turnoJugador) return;

  document.getElementById("battle-main-menu").style.display = "none";
  document.getElementById("battle-attack-menu").style.display = "none";
  document.getElementById("battle-bag-menu").style.display = "none";
  document.getElementById("battle-pokemon-menu").style.display = "none";

  if (menu === "atacar") {
    document.getElementById("battle-attack-menu").style.display = "flex";
    mostrarMovimientosMenu();
  } else if (menu === "mochila") {
    document.getElementById("battle-bag-menu").style.display = "flex";
    mostrarMochilaMenu();
  } else if (menu === "pokemon") {
    document.getElementById("battle-pokemon-menu").style.display = "flex";
    mostrarListaPokemon();
  }
}

function volveralMenuPrincipal() {
  document.getElementById("battle-main-menu").style.display = "grid";
  document.getElementById("battle-attack-menu").style.display = "none";
  document.getElementById("battle-bag-menu").style.display = "none";
  document.getElementById("battle-pokemon-menu").style.display = "none";

  if (pokemonJugadorActivo) {
    mostrarMensajeBatalla(`¿Qué hará ${pokemonJugadorActivo.nombre}?`);
  }
}

function mostrarMovimientosMenu() {
  const movesContainer = document.getElementById("battle-moves");
  movesContainer.innerHTML = "";

  const movimientos = movimientosPokemon[pokemonJugadorActivo.nombre] || [];

  movimientos.forEach((movimiento) => {
    const moveButton = document.createElement("button");
    moveButton.className = `move-btn type-${movimiento.tipo}`;
    moveButton.innerHTML = `
      <span class="move-name">${movimiento.nombreEspanol}</span>
      <span class="move-info">PP: 10/10 | ${movimiento.tipo.toUpperCase()}</span>
    `;
    moveButton.onclick = () => ejecutarAtaqueJugador(movimiento);
    movesContainer.appendChild(moveButton);
  });

  // Rellenar con slots vacíos si hay menos de 4 movimientos
  while (movesContainer.children.length < 4) {
    const emptySlot = document.createElement("div");
    emptySlot.className = "move-btn empty";
    emptySlot.textContent = "-";
    movesContainer.appendChild(emptySlot);
  }
}

function mostrarMochilaMenu() {
  const bagContainer = document.getElementById("bag-items");
  bagContainer.innerHTML = "";

  mostrarMensajeBatalla("¿Qué objeto usarás?");

  Object.entries(inventario).forEach(([key, item]) => {
    const itemButton = document.createElement("button");
    itemButton.className = `bag-item ${item.cantidad === 0 ? "empty" : ""}`;
    itemButton.innerHTML = `
      <span class="item-name">${item.nombre}</span>
      <span class="item-count">x${item.cantidad}</span>
    `;

    if (item.cantidad > 0) {
      itemButton.onclick = () => usarObjeto(key);
    }

    bagContainer.appendChild(itemButton);
  });
}

async function usarObjeto(itemKey) {
  if (!turnoJugador) return;

  const item = inventario[itemKey];
  if (item.cantidad <= 0) return;

  turnoJugador = false;
  deshabilitarBotones();
  volveralMenuPrincipal();

  if (itemKey === "revivir") {
    const pokemonDebilitados = jugadorPokemon.filter((p) => p.hpActual <= 0);
    if (pokemonDebilitados.length === 0) {
      mostrarMensajeBatalla("No hay Pokémon debilitados.");
      await esperarSegundos(1);
      turnoJugador = true;
      habilitarBotones();
      return;
    }
    const pokemon = pokemonDebilitados[0];
    pokemon.hpActual = Math.floor(pokemon.hpMax * (item.curaPercent / 100));
    item.cantidad--;

    mostrarMensajeBatalla(`¡Usaste ${item.nombre} en ${pokemon.nombre}!`);
  } else {
    if (pokemonJugadorActivo.hpActual >= pokemonJugadorActivo.hpMax) {
      mostrarMensajeBatalla(
        `${pokemonJugadorActivo.nombre} ya tiene toda su vida.`,
      );
      await esperarSegundos(1);
      turnoJugador = true;
      habilitarBotones();
      return;
    }

    const curacion = Math.min(
      item.cura,
      pokemonJugadorActivo.hpMax - pokemonJugadorActivo.hpActual,
    );
    pokemonJugadorActivo.hpActual += curacion;
    item.cantidad--;

    mostrarMensajeBatalla(
      `¡Usaste ${item.nombre}! ${pokemonJugadorActivo.nombre} recuperó ${curacion} PS.`,
    );
  }

  actualizarInterfazBatalla();
  await esperarSegundos(1.5);

  await turnoOponente();
}

function mostrarListaPokemon() {
  const listContainer = document.getElementById("pokemon-selection-list");
  listContainer.innerHTML = "";

  mostrarMensajeBatalla("Elige un Pokémon.");

  jugadorPokemon.forEach((pokemon, index) => {
    const item = document.createElement("div");
    item.className = `pokemon-list-item ${pokemon === pokemonJugadorActivo ? "active" : ""} ${pokemon.hpActual <= 0 ? "fainted" : ""}`;

    const hpPercent = Math.max(
      0,
      Math.floor((pokemon.hpActual / pokemon.hpMax) * 100),
    );
    const genderSymbol =
      pokemon.genero === "Macho" ? "♂" : pokemon.genero === "Hembra" ? "♀" : "";

    item.innerHTML = `
      <div class="pokemon-item-sprite">
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.nombre}">
      </div>
      <div class="pokemon-item-info">
        <div class="pokemon-item-name">${pokemon.nombre} <span class="${pokemon.genero === "Macho" ? "male" : "female"}">${genderSymbol}</span></div>
        <div class="pokemon-item-hp-container">
          <div class="pokemon-item-hp-bar" style="width: ${hpPercent}%"></div>
        </div>
        <div class="pokemon-item-hp-text">${pokemon.hpActual}/${pokemon.hpMax}</div>
      </div>
    `;

    if (pokemon.hpActual > 0 && pokemon !== pokemonJugadorActivo) {
      item.onclick = () => cambiarPokemonBatalla(index);
    }

    listContainer.appendChild(item);
  });
}

async function cambiarPokemonBatalla(index) {
  if (!turnoJugador) return;
  turnoJugador = false;

  const nuevoPokemon = jugadorPokemon[index];

  volveralMenuPrincipal();
  deshabilitarBotones();

  await animarRetirada("player");

  mostrarMensajeBatalla(
    `¡Bien hecho, ${pokemonJugadorActivo.nombre}! ¡Regresa!`,
  );
  await esperarSegundos(1);

  pokemonJugadorActivo = nuevoPokemon;
  await cargarMovimientos(pokemonJugadorActivo);

  mostrarMensajeBatalla(`¡Adelante, ${pokemonJugadorActivo.nombre}!`);
  actualizarInterfazBatalla();
  await animarEntrada("player");
  await esperarSegundos(1);

  await turnoOponente();
}

async function intentarHuir() {
  if (!turnoJugador) return;

  mostrarMensajeBatalla("No es posible huir de una pelea de entrenadores!");

  await esperarSegundos(2);

  mostrarMensajeBatalla(`¿Qué hará ${pokemonJugadorActivo.nombre}?`);
}

async function ejecutarAtaqueJugador(movimiento) {
  if (!turnoJugador) return;
  turnoJugador = false;

  volveralMenuPrincipal();
  deshabilitarBotones();

  const acierta = Math.random() * 100 < (movimiento.precision || 100);

  if (!acierta) {
    mostrarMensajeBatalla(
      `¡${pokemonJugadorActivo.nombre} usó ${movimiento.nombreEspanol}!`,
    );
    await esperarSegundos(0.5);
    mostrarMensajeBatalla(`¡Pero falló!`);
    await esperarSegundos(1);
    await turnoOponente();
    return;
  }

  mostrarMensajeBatalla(
    `¡${pokemonJugadorActivo.nombre} usó ${movimiento.nombreEspanol}!`,
  );
  await animarAtaque("player");

  const danio = calcularDanio(
    pokemonJugadorActivo,
    pokemonOponenteActivo,
    movimiento,
  );
  pokemonOponenteActivo.hpActual -= danio;

  await animarDanio("opponent");
  actualizarInterfazBatalla();

  await esperarSegundos(0.5);
  await mostrarMensajeEfectividad(movimiento.tipo, pokemonOponenteActivo.types);

  if (pokemonOponenteActivo.hpActual <= 0) {
    await pokemonOponenteDerrotado();
  } else {
    await turnoOponente();
  }
}

async function turnoOponente() {
  await esperarSegundos(1);

  const movimientos = movimientosPokemon[pokemonOponenteActivo.nombre] || [];

  if (movimientos.length === 0) {
    movimientos.push({
      nombre: "tackle",
      nombreEspanol: "Placaje",
      poder: 40,
      tipo: "normal",
      categoria: "physical",
      precision: 100,
    });
  }

  const movimientoAleatorio =
    movimientos[Math.floor(Math.random() * movimientos.length)];

  const acierta = Math.random() * 100 < (movimientoAleatorio.precision || 100);

  if (!acierta) {
    mostrarMensajeBatalla(
      `¡${pokemonOponenteActivo.nombre} enemigo usó ${movimientoAleatorio.nombreEspanol}!`,
    );
    await esperarSegundos(0.5);
    mostrarMensajeBatalla(`¡Pero falló!`);
    await esperarSegundos(1);
    turnoJugador = true;
    habilitarBotones();
    mostrarMensajeBatalla(`¿Qué hará ${pokemonJugadorActivo.nombre}?`);
    return;
  }

  mostrarMensajeBatalla(
    `¡${pokemonOponenteActivo.nombre} enemigo usó ${movimientoAleatorio.nombreEspanol}!`,
  );
  await animarAtaque("opponent");

  const danio = calcularDanio(
    pokemonOponenteActivo,
    pokemonJugadorActivo,
    movimientoAleatorio,
  );
  pokemonJugadorActivo.hpActual -= danio;

  await animarDanio("player");
  actualizarInterfazBatalla();

  await esperarSegundos(0.5);
  await mostrarMensajeEfectividad(
    movimientoAleatorio.tipo,
    pokemonJugadorActivo.types,
  );

  if (pokemonJugadorActivo.hpActual <= 0) {
    await pokemonJugadorDerrotado();
  } else {
    turnoJugador = true;
    habilitarBotones();
    mostrarMensajeBatalla(`¿Qué hará ${pokemonJugadorActivo.nombre}?`);
  }
}

function calcularDanio(atacante, defensor, movimiento) {
  const nivel = 50;
  const ataque =
    movimiento.categoria === "physical"
      ? parseInt(atacante.attack) || 50
      : parseInt(atacante.spAttack) || 50;
  const defensa =
    movimiento.categoria === "physical"
      ? parseInt(defensor.defense) || 50
      : parseInt(defensor.spDefense) || 50;

  const efectividad = calcularEfectividad(movimiento.tipo, defensor.types);
  const stab = tieneSTAB(movimiento.tipo, atacante.types) ? 1.5 : 1;
  const aleatorio = 0.85 + Math.random() * 0.15;
  const critico = Math.random() < 0.0625 ? 1.5 : 1; // 6.25% de crítico

  const danio = Math.floor(
    ((((2 * nivel) / 5 + 2) * movimiento.poder * ataque) / defensa / 50 + 2) *
      stab *
      efectividad *
      aleatorio *
      critico,
  );

  return Math.max(1, danio);
}

function calcularEfectividad(tipoAtaque, tiposDefensor) {
  let efectividad = 1;

  if (!tiposDefensor) return efectividad;

  tiposDefensor.forEach((tipoData) => {
    const tipoDefensor = tiposEspanol[tipoData.type.name];
    const chartTipoAtaque = typeChart[tipoAtaque];
    if (chartTipoAtaque && chartTipoAtaque[tipoDefensor] !== undefined) {
      efectividad *= chartTipoAtaque[tipoDefensor];
    }
  });

  return efectividad;
}

function tieneSTAB(tipoMovimiento, tiposPokemon) {
  if (!tiposPokemon) return false;

  return tiposPokemon.some(
    (tipoData) => tiposEspanol[tipoData.type.name] === tipoMovimiento,
  );
}

async function mostrarMensajeEfectividad(tipoAtaque, tiposDefensor) {
  const efectividad = calcularEfectividad(tipoAtaque, tiposDefensor);
  if (efectividad > 1) {
    mostrarMensajeBatalla("¡Es súper efectivo!");
    await esperarSegundos(1);
  } else if (efectividad < 1 && efectividad > 0) {
    mostrarMensajeBatalla("No es muy efectivo...");
    await esperarSegundos(1);
  } else if (efectividad === 0) {
    mostrarMensajeBatalla("No le afecta...");
    await esperarSegundos(1);
  }
}

async function pokemonOponenteDerrotado() {
  pokemonOponenteActivo.hpActual = 0;
  actualizarInterfazBatalla();
  await animarDebilitado("opponent");

  mostrarMensajeBatalla(
    `¡${pokemonOponenteActivo.nombre} enemigo se debilitó!`,
  );
  await esperarSegundos(2);

  const siguienteOponente = oponentePokemon.find((p) => p.hpActual > 0);

  if (siguienteOponente) {
    pokemonOponenteActivo = siguienteOponente;
    await cargarMovimientos(pokemonOponenteActivo);

    mostrarMensajeBatalla(
      `¡El enemigo envió a ${pokemonOponenteActivo.nombre}!`,
    );
    await esperarSegundos(0.5);

    document
      .querySelector(".opponent-sprite-container")
      .classList.remove("anim-faint");
    actualizarInterfazBatalla();
    await animarEntrada("opponent");
    await esperarSegundos(1);

    turnoJugador = true;
    habilitarBotones();
    mostrarMensajeBatalla(`¿Qué hará ${pokemonJugadorActivo.nombre}?`);
  } else {
    await finalizarBatalla(true);
  }
}

async function pokemonJugadorDerrotado() {
  pokemonJugadorActivo.hpActual = 0;
  actualizarInterfazBatalla();
  await animarDebilitado("player");

  mostrarMensajeBatalla(`¡${pokemonJugadorActivo.nombre} se debilitó!`);
  await esperarSegundos(2);

  const siguienteJugador = jugadorPokemon.find((p) => p.hpActual > 0);

  if (siguienteJugador) {
    turnoJugador = true;
    mostrarSubMenu("pokemon");
    mostrarMensajeBatalla("¡Envía a otro Pokémon!");
    habilitarBotones();
  } else {
    await finalizarBatalla(false);
  }
}

async function finalizarBatalla(victoria) {
  const mensajeFinal = victoria
    ? "¡Ganaste la batalla!"
    : "¡Perdiste la batalla!";

  mostrarMensajeBatalla(mensajeFinal);

  await esperarSegundos(3);
  cerrarBatalla();
}

async function animarAtaque(atacante) {
  const container =
    atacante === "player"
      ? document.querySelector(".player-sprite-container")
      : document.querySelector(".opponent-sprite-container");

  const animClass =
    atacante === "player" ? "anim-attack-player" : "anim-attack-opponent";
  container.classList.add(animClass);
  await esperarSegundos(0.5);
  container.classList.remove(animClass);
}

async function animarDanio(objetivo) {
  const sprite =
    objetivo === "player"
      ? document.getElementById("player-pokemon-sprite")
      : document.getElementById("opponent-pokemon-sprite");

  sprite.classList.add("anim-damage");
  await esperarSegundos(0.5);
  sprite.classList.remove("anim-damage");
}

async function animarDebilitado(objetivo) {
  const container =
    objetivo === "player"
      ? document.querySelector(".player-sprite-container")
      : document.querySelector(".opponent-sprite-container");

  container.classList.add("anim-faint");
  await esperarSegundos(0.8);
}

async function animarRetirada(lado) {
  const container =
    lado === "player"
      ? document.querySelector(".player-sprite-container")
      : document.querySelector(".opponent-sprite-container");

  container.classList.add("anim-retreat");
  await esperarSegundos(0.5);
  container.classList.remove("anim-retreat");
}

async function animarEntrada(lado) {
  const container =
    lado === "player"
      ? document.querySelector(".player-sprite-container")
      : document.querySelector(".opponent-sprite-container");

  container.classList.remove("anim-faint");
  container.classList.add("anim-enter");
  await esperarSegundos(0.5);
  container.classList.remove("anim-enter");
}

function mostrarMensajeBatalla(mensaje) {
  document.getElementById("battle-message").textContent = mensaje;
}

function deshabilitarBotones() {
  document
    .querySelectorAll(
      ".menu-btn, .move-btn, .back-btn, .bag-item, .pokemon-list-item",
    )
    .forEach((btn) => (btn.style.pointerEvents = "none"));
}

function habilitarBotones() {
  document
    .querySelectorAll(
      ".menu-btn, .move-btn, .back-btn, .bag-item, .pokemon-list-item",
    )
    .forEach((btn) => (btn.style.pointerEvents = "auto"));
}

function cerrarBatalla() {
  document.getElementById("battle-modal").style.display = "none";
  document.getElementById("battle-arena").style.display = "none";
  document.getElementById("battle-intro").style.display = "none";
  document.getElementById("pokeball-transition").style.display = "none";
  document
    .getElementById("pokeball-transition")
    .classList.remove("active", "opening");

  document
    .querySelectorAll(".player-sprite-container, .opponent-sprite-container")
    .forEach((el) => {
      el.classList.remove("anim-faint", "anim-retreat", "anim-enter");
    });

  habilitarBotones();

  volveralMenuPrincipal();

  turnoJugador = true;

  batallaActiva = false;
}

function esperarSegundos(segundos) {
  return new Promise((resolve) => setTimeout(resolve, segundos * 1000));
}
