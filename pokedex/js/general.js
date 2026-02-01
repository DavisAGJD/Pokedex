let numeroIngresado = "";
let pokemonGuardados = [];
let pokemonActual = null;
let vistaActual = {
  frente: true,
  shiny: false,
};
let ivsGenerados = null;
let generoSeleccionado = null;

function asignarNumero(boton) {
  let numero = boton.innerText;
  numeroIngresado += numero;
  document.getElementById("pokemon-numero").innerText = numeroIngresado;
}

async function buscarPokemon() {
  if (numeroIngresado === "") {
    alert("Por favor ingresa un número de Pokémon");
    return;
  }

  try {
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${numeroIngresado}`,
    );

    if (!res.ok) {
      alert("Pokémon no encontrado");
      return;
    }

    const pokemon = await res.json();
    pokemonActual = pokemon;

    vistaActual = {
      frente: true,
      shiny: false,
    };

    const esShiny = Math.random() < 0.001;

    if (esShiny) {
      document.getElementById("screen-left-image").classList.add("shiny");
      vistaActual.shiny = true;
      alert("¡Has encontrado un Pokémon SHINY!");
    } else {
      document.getElementById("screen-left-image").classList.remove("shiny");
    }

    actualizarImagenPokemon();

    document.getElementById("pokemon-title").innerText =
      pokemon.name.toUpperCase();

    document.getElementById("pokemon-height").innerText =
      pokemon.height / 10 + " m";
    document.getElementById("pokemon-weight").innerText =
      pokemon.weight / 10 + " kg";

    const hp = pokemon.stats.find((stat) => stat.stat.name === "hp").base_stat;
    const attack = pokemon.stats.find(
      (stat) => stat.stat.name === "attack",
    ).base_stat;
    const defense = pokemon.stats.find(
      (stat) => stat.stat.name === "defense",
    ).base_stat;
    const spAttack = pokemon.stats.find(
      (stat) => stat.stat.name === "special-attack",
    ).base_stat;
    const spDefense = pokemon.stats.find(
      (stat) => stat.stat.name === "special-defense",
    ).base_stat;
    const speed = pokemon.stats.find(
      (stat) => stat.stat.name === "speed",
    ).base_stat;

    document.getElementById("pokemon-hp").innerText = hp;
    document.getElementById("pokemon-attack").innerText = attack;
    document.getElementById("pokemon-defense").innerText = defense;
    document.getElementById("pokemon-sp-attack").innerText = spAttack;
    document.getElementById("pokemon-sp-defense").innerText = spDefense;
    document.getElementById("pokemon-speed").innerText = speed;

    const speciesRes = await fetch(pokemon.species.url);
    const speciesData = await speciesRes.json();
    const genderRate = speciesData.gender_rate;

    let genero = determinarGenero(genderRate);
    document.getElementById("pokemon-genero").innerText = genero;

    mostrarTipos(pokemon.types);
  } catch (error) {
    console.error("Error al buscar el Pokémon:", error);
    alert("Hubo un error al buscar el Pokémon");
  }
}

function determinarGenero(genderRate) {
  if (genderRate === -1) {
    return "Sin Genero";
  }

  // genderRate es la probabilidad sobre 8 de ser hembra
  // 0 = 0% hembra (100% macho)
  // 1 = 12.5% hembra
  // 2 = 25% hembra
  // 4 = 50% hembra
  // 6 = 75% hembra
  // 8 = 100% hembra (0% macho)

  const probabilidadHembra = genderRate / 8;
  const random = Math.random();

  if (random < probabilidadHembra) {
    return "Hembra";
  } else {
    return "Macho";
  }
}

function generarIVs(esShiny) {
  const ivs = {
    hp: Math.floor(Math.random() * 32),
    attack: Math.floor(Math.random() * 32),
    defense: Math.floor(Math.random() * 32),
    spAttack: Math.floor(Math.random() * 32),
    spDefense: Math.floor(Math.random() * 32),
    speed: Math.floor(Math.random() * 32),
  };

  if (esShiny) {
    ivs.hp = Math.min(ivs.hp + 10, 31);
    ivs.attack = Math.min(ivs.attack + 10, 31);
    ivs.defense = Math.min(ivs.defense + 10, 31);
    ivs.spAttack = Math.min(ivs.spAttack + 10, 31);
    ivs.spDefense = Math.min(ivs.spDefense + 10, 31);
    ivs.speed = Math.min(ivs.speed + 10, 31);
  }

  return ivs;
}

function buscarPokemonRandom() {
  const numeroAleatorio = Math.floor(Math.random() * 1025) + 1;
  numeroIngresado = numeroAleatorio.toString();
  document.getElementById("pokemon-numero").innerText = numeroIngresado;
  buscarPokemon();
}

function actualizarImagenPokemon() {
  if (!pokemonActual) return;

  let imagenUrl;

  if (vistaActual.frente && !vistaActual.shiny) {
    imagenUrl = pokemonActual.sprites.front_default;
  } else if (!vistaActual.frente && !vistaActual.shiny) {
    imagenUrl = pokemonActual.sprites.back_default;
  } else if (vistaActual.frente && vistaActual.shiny) {
    imagenUrl = pokemonActual.sprites.front_shiny;
  } else {
    imagenUrl = pokemonActual.sprites.back_shiny;
  }

  document.getElementById("screen-left-image").src = imagenUrl;
}

function cambiarVistaPokemon(direccion) {
  if (!pokemonActual) {
    alert("Primero busca un Pokémon");
    return;
  }

  vistaActual.frente = !vistaActual.frente;

  actualizarImagenPokemon();
}

function navegarPokemon(direccion) {
  if (numeroIngresado === "") {
    numeroIngresado = "1";
  }

  let numeroActual = parseInt(numeroIngresado);

  if (direccion === "siguiente") {
    numeroActual++;
    if (numeroActual > 1025) {
      numeroActual = 1;
    }
  } else if (direccion === "anterior") {
    numeroActual--;
    if (numeroActual < 1) {
      numeroActual = 1025;
    }
  }

  numeroIngresado = numeroActual.toString();
  document.getElementById("pokemon-numero").innerText = numeroIngresado;

  buscarPokemon();
}

function mostrarTipos(tipos) {
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
    unknown: "desconocido",
  };

  document.getElementById("pokemon-type-1").innerHTML = "";
  document.getElementById("pokemon-type-2").innerHTML = "";

  const container1 = document.getElementById("tipo-container-1");
  const container2 = document.getElementById("tipo-container-2");

  if (tipos[0]) {
    const tipoNombre = tipos[0].type.name;
    const tipoEspanol = tiposEspanol[tipoNombre];
    const imagenTipo = `<img src="tipos/Tipo_${tipoEspanol}.png" alt="${tipoEspanol}" style="width: 100%; height: auto;">`;
    document.getElementById("pokemon-type-1").innerHTML = imagenTipo;
    container1.style.display = "block";
  } else {
    container1.style.display = "none";
  }

  if (tipos[1]) {
    const tipoNombre = tipos[1].type.name;
    const tipoEspanol = tiposEspanol[tipoNombre];
    const imagenTipo = `<img src="tipos/Tipo_${tipoEspanol}.png" alt="${tipoEspanol}" style="width: 100%; height: auto;">`;
    document.getElementById("pokemon-type-2").innerHTML = imagenTipo;
    container2.style.display = "block";
  } else {
    container2.style.display = "none";
  }
}

let pokemonTemporal = null;

function agregarPokemon() {
  const numero = document.getElementById("pokemon-numero").innerText;
  const nombre = document.getElementById("pokemon-title").innerText;
  const hp = document.getElementById("pokemon-hp").innerText;
  const attack = document.getElementById("pokemon-attack").innerText;
  const defense = document.getElementById("pokemon-defense").innerText;
  const spAttack = document.getElementById("pokemon-sp-attack").innerText;
  const spDefense = document.getElementById("pokemon-sp-defense").innerText;
  const velocidad = document.getElementById("pokemon-speed").innerText;
  const genero = document.getElementById("pokemon-genero").innerText;

  if (!numero || !nombre) {
    alert("Primero busca un Pokémon");
    return;
  }

  if (pokemonGuardados.length >= 6) {
    alert(
      "¡Tu equipo ya está completo! Solo puedes tener 6 Pokémon. Elimina uno para agregar otro.",
    );
    return;
  }

  const esShiny = vistaActual.shiny;
  ivsGenerados = generarIVs(esShiny);

  document.getElementById("iv-hp-display").innerText = ivsGenerados.hp;
  document.getElementById("iv-attack-display").innerText = ivsGenerados.attack;
  document.getElementById("iv-defense-display").innerText =
    ivsGenerados.defense;
  document.getElementById("iv-sp-attack-display").innerText =
    ivsGenerados.spAttack;
  document.getElementById("iv-sp-defense-display").innerText =
    ivsGenerados.spDefense;
  document.getElementById("iv-speed-display").innerText = ivsGenerados.speed;

  if (esShiny) {
    document.getElementById("shiny-bonus-msg").style.display = "block";
  } else {
    document.getElementById("shiny-bonus-msg").style.display = "none";
  }

  generoSeleccionado = genero;
  document.getElementById("genero-display").innerText = genero;

  pokemonTemporal = {
    numero: numero,
    nombre: nombre,
    genero: genero,
    hp: hp,
    attack: attack,
    defense: defense,
    spAttack: spAttack,
    spDefense: spDefense,
    velocidad: velocidad,
    esShiny: esShiny,
    ivs: ivsGenerados,
    sprites: pokemonActual.sprites,
    types: pokemonActual.types,
    moves: pokemonActual.moves,
  };

  document.getElementById("nombre_agregar").value = nombre;
  document.getElementById("modal-agregar").style.display = "block";
}

function confirmarAgregarPokemon() {
  if (!pokemonTemporal) return;

  const nombrePersonalizado = document.getElementById("nombre_agregar").value;
  if (nombrePersonalizado && nombrePersonalizado.trim() !== "") {
    pokemonTemporal.nombre = nombrePersonalizado.trim();
  }

  if (generoSeleccionado) {
    pokemonTemporal.genero = generoSeleccionado;
  }

  pokemonGuardados.push(pokemonTemporal);
  pokemonTemporal = null;
  ivsGenerados = null;
  generoSeleccionado = null;

  actualizarTabla();
  cerrarModalAgregar();

  numeroIngresado = "";
  document.getElementById("pokemon-numero").innerText = "";

  alert("¡Pokémon agregado a tu equipo!");
}

function seleccionarGenero(genero) {
  generoSeleccionado = genero;
  document.getElementById("genero-display").innerText = genero;

  const botones = document.querySelectorAll(".genero-btn");
  botones.forEach(
    (btn) =>
      (btn.style.background =
        "linear-gradient(135deg, #868e96 0%, #495057 100%)"),
  );

  event.target.style.background =
    "linear-gradient(135deg, #ffcb05 0%, #f7b500 100%)";
}

function cerrarModalAgregar() {
  document.getElementById("modal-agregar").style.display = "none";
  pokemonTemporal = null;
  ivsGenerados = null;
  generoSeleccionado = null;
}

function actualizarTabla() {
  const tbody = document.getElementById("contenido-tabla");

  tbody.innerHTML = "";

  pokemonGuardados.forEach((pokemon, index) => {
    const fila = document.createElement("tr");

    const shinyIcon = pokemon.esShiny ? "Si" : "-";

    fila.innerHTML = `
            <td>${pokemon.numero}</td>
            <td>${pokemon.nombre}</td>
            <td>${pokemon.genero}</td>
            <td>${pokemon.hp} (IV:${pokemon.ivs.hp})</td>
            <td>${pokemon.attack} (IV:${pokemon.ivs.attack})</td>
            <td>${pokemon.defense} (IV:${pokemon.ivs.defense})</td>
            <td>${pokemon.spAttack} (IV:${pokemon.ivs.spAttack})</td>
            <td>${pokemon.spDefense} (IV:${pokemon.ivs.spDefense})</td>
            <td>${pokemon.velocidad} (IV:${pokemon.ivs.speed})</td>
            <td>${shinyIcon}</td>
            <td>
                <button onclick="abrirModalEditar(${index})">Editar</button>
                <button onclick="eliminarPokemon(${index})">Eliminar</button>
            </td>
        `;

    tbody.appendChild(fila);
  });
}

function eliminarPokemon(index) {
  if (confirm("¿Seguro que deseas eliminar este Pokémon de tu equipo?")) {
    pokemonGuardados.splice(index, 1);
    actualizarTabla();
  }
}

function abrirModalEditar(index) {
  document.getElementById("index").value = index;
  document.getElementById("nombre_editar").value =
    pokemonGuardados[index].nombre;
  document.getElementById("modal-editar").style.display = "block";
}

function cerrarModalEditar() {
  document.getElementById("modal-editar").style.display = "none";
}

function editarPokemon() {
  const index = document.getElementById("index").value;
  const nuevoNombre = document.getElementById("nombre_editar").value;

  if (nuevoNombre && nuevoNombre.trim() !== "") {
    pokemonGuardados[index].nombre = nuevoNombre.trim();
    actualizarTabla();
    cerrarModalEditar();
  } else {
    alert("El nombre no puede estar vacío");
  }
}
