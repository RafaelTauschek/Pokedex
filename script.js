let limit = 20;
let pokemonNames = [];
let pokemonDetails = [];
let pokemonSpecies = [];


async function init() {
    await loadAllPokemonData();
    console.log(pokemonNames);
    console.log(pokemonDetails);
    console.log(pokemonSpecies);
    render();
}


async function loadAllPokemonData() {
    await loadPokemonNames();
    await loadPokemonDetails();
    await loadPokemonSpecies();
}


async function loadPokemonNames() {
    let offset = pokemonNames.length;
    let url = `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`;
    let response = await fetch(url);
    let fetchedData = await response.json();
    for (let i = 0; i < fetchedData['results'].length; i++) {
        const names = fetchedData['results'][i];
        pokemonNames.push(names['name']);
    }
}


async function loadPokemonDetails() {
    for (let i = pokemonDetails.length; i < pokemonNames.length; i++) {
        const pokemonName = pokemonNames[i];
        let url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
        let response = await fetch(url)
        let fetchedData = await response.json();
        pokemonDetails.push(fetchedData)
    }
}


async function loadPokemonSpecies() {
    for (let i = pokemonSpecies.length; i < pokemonNames.length; i++) {
        const pokemonName = pokemonNames[i];
        let url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}/`;
        let response = await fetch(url);
        let fetchedData = await response.json();
        pokemonSpecies.push(fetchedData);
    }
}


async function loadMore() {
    await init();
}


function render() {
    let content = document.getElementById('content');
    content.innerHTML = '';
    for (let i = 0; i < pokemonNames.length; i++) {
        generatePokemonCardContent(i);
    }
}


function generatePokemonCardContent(i) {
    const name = pokemonNames[i];
    const id = pokemonDetails[i]['id'];
    const image = pokemonDetails[i]['sprites']['other']['official-artwork']['front_default'];
    content.innerHTML += generatePokemonCardHTML(i, name, id, image);
    addPokemonTypes(i);
    addBackgroundColor(i);
}


function addPokemonTypes(i) {
    let pokemonTypes = document.getElementById(`pokemon-card-type${i}`);
    pokemonTypes.innerHTML = '';
    for (let j = 0; j < pokemonDetails[i]['types'].length; j++) {
        const type = pokemonDetails[i]['types'][j];
        pokemonTypes.innerHTML += `<div class="${type['type']['name']}-type-main single-pokemon-type">${type['type']['name']}</div>`;
    }  
}


function addBackgroundColor(i) {
    let pokemonCardBackground = document.getElementById(`pokemon-card${i}`);
    for (let k = 0; k < pokemonDetails.length; k++) {
        const mainType = pokemonDetails[i]['types'][0]['type']['name'];
        pokemonCardBackground.classList.add(`${mainType}-type-secondary`)
    }
}


function generatePokemonCardHTML(i, name, id, image) {
    return `
    <div onclick="openPokemonCard(${i})" class="pokemon-card" id="pokemon-card${i}">
        <div class="pokemon-card-top">
            <div>${name}</div>
            <div>${id}</div>
        </div>
        <div class="pokemon-card-bottom">
            <div><img class="pokemon-card-image" src="${image}"></div>
            <div class="pokemon-card-type" id="pokemon-card-type${i}"></div>
        </div> 
    </div>`;
}


function openPokemonCard(i) {
    let modal = document.getElementById('pokemon-modal');
    let backgroundModal = document.getElementById('pokemon-background-modal');
    modal.classList.remove('d-none');
    backgroundModal.classList.remove('d-none');
    backgroundModal.addEventListener('click', closePokemonCard);
    modal.innerHTML = '';
    modal.innerHTML += generateSingleCardHTML(i);
    console.log(i);
    generateAboutSection(i);
}


function generateSingleCardHTML(i) {
    return `
        <div class="single-pokemon-card">
            <div class="single-pokemon-card-top-section">
                <div class="arrows">
                <button>$</button>  <button></button>
                </div>
                <div class="top-section-name">${pokemonDetails[i]['name']}</div>
                <div class="top-section-id">${pokemonDetails[i]['id']}</div>
                <div class="top-section-type" id="top-section-type"></div>
                <div class="top-section-image"><img src="${pokemonDetails[i]['sprites']['other']['official-artwork']['front_default']}"></div>
            </div>
        
            <div class="single-pokemon-card-bottom-section">
                <ul>
                    <li onclick="showAboutSection(${i})">About</li>
                    <li onclick="showBaseSection(${i})">Base Stats</li>
                    <li onclick="showMovesSection(${i})">Moves</li>
                </ul>
                <div class="single-card-content" id="single-card-content"></div>
            </div>
        </div>
    `;
}

function generateAboutSection(i) {
    let content = document.getElementById('single-card-content');
    content.innerHTML = '';
    content.innerHTML +=  generateAboutHTML(i);
}


function generateAboutHTML(i) {
    return `
            <div class="card-about">
                <div>${pokemonSpecies[i]['flavor_text_entries'][10]['flavor_text']}</div>
                <div><b>Height: </b><p>${pokemonDetails[i]['height']}</p></div>
                <div><b>Weight: </b><p>${pokemonDetails[i]['weight']}</p></div>
                <div><b>Abilities:</b><p id="pokemon-abilities"></p></div>
                <div class="about-egg-groups"><div><b>Egg Groups:</b></div><div id="pokemon-egg-group"></div></div>
            </div>  
            `;
}

function generateBaseStats() {
    let content = document.getElementById('single-card-content');
    content.innerHTML = '';
    content.innerHTML += ``;
}

function generateMoves() {
    let content = document.getElementById('single-card-content');
    content.innerHTML = '';
    content.innerHTML += ``;
}




function closePokemonCard() {
    let modal = document.getElementById('pokemon-modal');
    let backgroundModal = document.getElementById('pokemon-background-modal');
    modal.classList.add('d-none');
    backgroundModal.classList.add('d-none');
}
