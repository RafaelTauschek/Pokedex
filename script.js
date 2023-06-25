let limit = 20;
let pokemonNames = [];
let pokemonDetails = [];
let pokemonSpecies = [];


async function init() {
    await loadAllPokemonData();
    console.log(pokemonDetails);
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
    let type = pokemonDetails[i]['types'][0]['type']['name'];
    modal.classList.remove('d-none');
    modal.classList.add(`${type}-type-secondary`)
    backgroundModal.classList.remove('d-none');
    backgroundModal.addEventListener('click', closePokemonCard);
    modal.innerHTML = '';
    modal.innerHTML += generateSingleCardHTML(i);
    generateAboutSection(i);
}


function generateSingleCardHTML(i) {
    return `
        <div class="single-pokemon-card">
            <div class="single-pokemon-card-top-section">
                <div class="arrows">
                <a class="arrow-btn"><img src="./img/left.png"></a>  <a class="arrow-btn"><img src="./img/right.png"></a>
                </div>
                <div class="top-section-name">${pokemonDetails[i]['name']}</div>
                <div class="top-section-id">${pokemonDetails[i]['id']}</div>
                <div class="top-section-type" id="top-section-type"></div>
                <div class="pokemon-card-image-container"><img class="top-section-image" src="${pokemonDetails[i]['sprites']['other']['official-artwork']['front_default']}"></div>
            </div>
            <div class="single-pokemon-card-bottom-section flex-column">
                <ul>
                    <li id="about-section${i}" onclick="generateAboutSection(${i})">About</li>
                    <li id="base-section${i}" onclick="generateBaseStats(${i})">Base Stats</li>
                    <li id="move-section${i}" onclick="generateMoves(${i})">Moves</li>
                </ul>
                <div class="single-card-content" id="single-card-content"></div>
            </div>
        </div>
    `;
}


function generateAboutSection(i) {
    let content = document.getElementById('single-card-content');
    content.innerHTML = '';
    content.innerHTML += generateAboutHTML(i);
    let about = document.getElementById(`about-section${i}`);
    about.classList.add('li-border-bottom');
}


function generateAboutHTML(i) {
    return `
            <div class="card-about">
                <div class="pokemon-description">${pokemonSpecies[i]['flavor_text_entries'][10]['flavor_text']}</div>
                <div class="pokemon-height"><b>Height: </b><p>${pokemonDetails[i]['height']}</p></div>
                <div class="pokemon-weight"><b>Weight: </b><p>${pokemonDetails[i]['weight']}</p></div>
                <div class="pokemon-abilities"><b>Abilities:</b><p id="pokemon-abilities"></p></div>
                <div class="pokemon-egg-groups"><div><b>Egg Groups:</b></div><div id="pokemon-egg-group"></div></div>
            </div>  
            `;
}


function generateBaseStats(i) {
    let content = document.getElementById('single-card-content');
    content.innerHTML = '';
    content.innerHTML += `<canvas id="myChart"></canvas>`;
    generateChart(i);
}


function generateMoves(i) {
    let content = document.getElementById('single-card-content');
    content.innerHTML = '';
    content.classList.add('moves');
    content.classList.add('p-relative');
    content.classList.remove('flex-column');


    for (let j = 0; j < pokemonDetails[i]['moves'].length; j++) {
        const move = pokemonDetails[i]['moves'][j];
        content.innerHTML += `
        <div class="pokemon-single-move">${move['move']['name']}</div>
        `;
    }

}


function closePokemonCard() {
    let modal = document.getElementById('pokemon-modal');
    let backgroundModal = document.getElementById('pokemon-background-modal');
    modal.classList = '';
    modal.classList.add('pokemon-modal');
    modal.classList.add('d-none');
    backgroundModal.classList.add('d-none');
}


function baseStats(i) {
    let stats = pokemonDetails[i]['stats']
    console.log(stats);
    let hp = stats[0]['base_stat'];
    let atk = stats[1]['base_stat'];
    let def = stats[2]['base_stat'];
    let spAtk = stats[3]['base_stat'];
    let spDef = stats[4]['base_stat'];
    let speed = stats[5]['base_stat'];
    return {hp, atk, def, spAtk, spDef, speed}
}


function generateChart(i) {
    const stats = baseStats(i);
    const labels = ['HP', 'ATK', 'DEF', 'SP-ATK', 'SP-DEF', 'SPEED'];
    const data = {
        labels: labels,
        datasets: [{
            axis: 'y',
            data: Object.values(stats),
            fill: false,
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 205, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(201, 203, 207, 1)'
            ],
            borderWidth: 1
        }]
    };
    const ctx = document.getElementById('myChart');
    const config = {
        type: 'bar',
        data,
        options: {
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    };
    new Chart(ctx, config);
}