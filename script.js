let allPokemon = [];
let limit = 20;
let currentPokemon;
let currentPokemonDetails;


async function init() {
    await loadAllPokemon();
    render();
}

async function loadAllPokemon() {
    let url = `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${0}`
    let response = await fetch(url);
    allPokemon = await response.json();
}

async function loadSinglePokemon(pokemonName) {
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    let response = await fetch(url);
    return response.json();
}

async function loadPokemonDetails() {
    let url = `https://pokeapi.co/api/v2/pokemon-species/${currentPokemon['name']}/`;
    let response = await fetch(url);
    currentPokemonDetails = await response.json();
}


async function loadPokemonEvolution() {
    let species = await loadPokemonSpecies();
    let url = species['evolution_chain']['url'];
    let response = await fetch(url);
    let evolution = await response.json();
    
    let evolutionChain = evolution['chain']['evolves_to'][0];
    console.log(evolutionChain);
}

async function loadPokemonSpecies() {
    let url = currentPokemon['species']['url'];
    let response = await fetch(url);
    let species = await response.json();
    return species;
}

async function render() {
    let content = document.getElementById('content');
    content.innerHTML = '';
    for (let i = 0; i < allPokemon['results'].length; i++) {
        const pokemon = allPokemon['results'][i];
        content.innerHTML += generatePokemonCardHTML(pokemon, i);

        currentPokemon = await loadSinglePokemon(pokemon['name']);
        let type = document.getElementById(`pokemon-type${i}`);
        let pokemonCard = document.getElementById(`pokemon-card${i}`);
        type.innerHTML = '';
        for (let j = 0; j < currentPokemon['types'].length; j++) {
            const pkmType = currentPokemon['types'][j]['type'];
            const mainType = pkmType['name'];
            const secondaryType = pkmType['name'].charAt(0).toUpperCase() + pkmType['name'].slice(1);

            type.innerHTML += `<div class="single-pokemon-type">${secondaryType}</div>`;
            let typeElements = document.querySelectorAll(`#pokemon-type${i} div`);
            typeElements.forEach((element) => {
                if (element.textContent === secondaryType) {
                    element.classList.add(`${mainType}-type-main`);
                }
            });
            let image = document.getElementById(`pokemon-image${i}`);
            let number = document.getElementById(`pokemon-number${i}`);
            image.src = currentPokemon['sprites']['other']['official-artwork']['front_default'];
            let formatedNumber = '#' + (currentPokemon['id'].toString().padStart(4, '0'));
            number.innerHTML = formatedNumber;

            pokemonCard.classList.add(`${currentPokemon['types'][0]['type']['name']}-type-secondary`);
        }
    }
}


function generatePokemonCardHTML(pokemon, i) {
    return `
    <div onclick="openPokemonCard(${i})" id="pokemon-card${i}" class="pokemon-card">
    <div class="pokemon-name-number-wrapper">
        <div id="pokemon-name${i}" class="pokemon-name">${(pokemon['name']).charAt(0).toUpperCase() + pokemon['name'].slice(1)}</div>
        <div id="pokemon-number${i}"></div>
    </div>
        <div><img class="pokemon-image" id="pokemon-image${i}"></div>
        <div class="pokemon-types" id="pokemon-type${i}"></div>
    </div>
    `;
}


async function loadMore() {
    let newLimit = limit + 20;
    limit = newLimit;
    await loadAllPokemon();
    render();
}

function closePokemonCard() {
    let background = document.getElementById('single-pokemon-card');
    if (background.className != '') {
    background.className = '';
}
    let overlay = document.getElementById('pokemon-modal');
    let overlayBackground = document.getElementById('pokemon-background-modal');
    overlayBackground.classList.add('d-none');
    overlay.classList.add('d-none');
}

async function openPokemonCard(i) {
    let overlay = document.getElementById('pokemon-modal');
    let overlayBackground = document.getElementById('pokemon-background-modal');

    overlayBackground.classList.remove('d-none');
    overlayBackground.addEventListener('click', closePokemonCard)
    overlay.classList.remove('d-none');
    overlay.innerHTML = '';
    let currentPokemonName = document.getElementById(`pokemon-name${i}`).innerText;
    currentPokemon = await loadSinglePokemon(currentPokemonName.toLowerCase());
    let pkmType = currentPokemon['types'][0]['type']['name'];
    await loadPokemonDetails();
    overlay.innerHTML += `
        <div id="single-pokemon-card" class="single-pokemon-card">
            <div class="single-pokemon-card-top">
                <div class="card-top-buttons">
                    <button id="left-button">&lt;</button>
                    <button id="right-button">&gt;</button>
                </div>

                <div class="card-top-name">${currentPokemonName}</div>

                <div class="card-top-type" id="card-top-type${i}}"></div>

                <div class="card-top-number">${currentPokemon['id']}</div>


            </div>
            <div class="single-pokemon-card-bottom">
            <div class="card-bottom-image-container">
            <img class="card-bottom-image" src="${currentPokemon['sprites']['other']['official-artwork']['front_default']}">
        </div>
                <div class="bottom-card-nav">
                    <ul>
                        <li onclick="showAboutSection()">About</li>
                        <li onclick="showBaseSection()">Base Stats</li>
                        <li onclick="showEvolutionSection()">Evolution</li>
                        <li onclick="showMovesSection()">Moves</li>
                    </ul>
                <div class="flex-column" id="pokemon-card-content">
                    <p>${(currentPokemonDetails['flavor_text_entries'][1]['flavor_text']).replace('/↑/g', "")}</p>
                </div>
                </div>
            </div>
        </div>
    `;

    let background = document.getElementById('single-pokemon-card');
    background.classList.add(`${pkmType}-type-secondary`)
}


async function showAboutSection() {
    let content = document.getElementById('pokemon-card-content');
    content.classList.remove('moves','p-relative');
    content.classList.add('flex-column');
    content.innerHTML = '';
    content.innerHTML += `
    <div class="card-about-pokemon">
    <div><b>Height: </b><p>${currentPokemon['height']}</p></div>
    <div><b>Weight: </b><p>${currentPokemon['weight']}</p></div>
    <div><b>Abilities:</b><p id="pokemon-abilities"></p></div>
    <div class="about-egg-groups"><div><b>Egg Groups:</b></div><div id="pokemon-egg-group"></div></div>
    </div>  
    `;
    let abilities = document.getElementById('pokemon-abilities');
    abilities.innerHTML = ''
    for (let i = 0; i < currentPokemon['abilities'].length; i++) {
        const ability = currentPokemon['abilities'][i];
        if (i === currentPokemon['abilities'].length - 1) {
            abilities.innerHTML += `${ability['ability']['name']}`;
        } else {
            abilities.innerHTML += `${ability['ability']['name']}, `;
        }
    }
    await showEggGroups();
}

function showBaseSection() {
    let content = document.getElementById('pokemon-card-content');
    content.classList.remove('moves','p-relative');
    content.classList.add('flex-column');
    content.innerHTML = '';
    for (let i = 0; i < currentPokemon['stats'].length; i++) {
        const stat = currentPokemon['stats'][i];
        content.innerHTML += `
        <div class="stat-progress-bar">
            <div class="progress">
                <div class="progress-bar" style="width: calc(${((stat['base_stat'] * 100) / 255)}%)" role="progressbar" aria-valuenow="${stat['base_stat']}" aria-valuemin="0" aria-valuemax="255">${stat['stat']['name']}: ${stat['base_stat']}</div>
            </div>
        </div>
        `;
    }
}

async function showEggGroups() {
    let content = document.getElementById('pokemon-egg-group');
    let eggGroup = await loadPokemonSpecies();
    content.innerHTML = '';
    for (let i = 0; i < eggGroup['egg_groups'].length; i++) {
        const egg = eggGroup['egg_groups'][i];
        if (i === eggGroup['egg_groups'].length -1) {
            content.innerHTML += `<span>${egg['name']}</span>`;
        } else {
            content.innerHTML += `<span>${egg['name']}, </spanY`;
        }
         
    }

}

async function showEvolutionSection() {
    loadPokemonEvolution();
}


function showMovesSection() {
    let content = document.getElementById('pokemon-card-content');
    content.classList.remove('flex-column');
    content.classList.add('moves','p-relative');
    let moves = currentPokemon['moves'];
    content.innerHTML = '';

    for (let i = 0; i < moves.length; i++) {
        if (i < 20) {
            const move = moves[i];
            content.innerHTML += `
            <div class="pokemon-moves">${move['move']['name']}</div>
            `;
        } else {
            if (i === 20) 
            content.innerHTML += `<button onclick="nextMoves(${i})">Next Page</button>`;
            {break};
        }   
    }
}

function nextMoves(i) {
    let content = document.getElementById('pokemon-card-content');
    content.innerHTML = '';
    let moves = currentPokemon['moves'];
    let x = i + 20;
    for (let j = i; j < moves.length; j++) {
        if (j < x) {
            const move = moves[j];
            content.innerHTML += `
            <div class="pokemon-moves">${move['move']['name']}</div>
            `;
        } else {
            if (j === x) 
                content.innerHTML += `<button onclick="nextMoves(${j})">Next Page</button>`;
            if (j > 20) {
                content.innerHTML += `<button onclick="lastMoves(${j})">Last Page</button>`
            }
            {break};
        }   
    }
}
