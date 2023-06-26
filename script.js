let limit = 25;
let pokemonNames = [];
let pokemonDetails = [];
let pokemonSpecies = [];


async function init() {
    startLoadingAnimation();
    await loadAllPokemonData();
    render();
    stopLoadingAnimation();
}


async function loadAllPokemonData() {
    await loadPokemonNames();
    await loadPokemonDetails();
    await loadPokemonSpecies();
}


function render() {
    document.getElementById('searchInput').addEventListener('input', filterPokemon);
    const content = document.getElementById('content');
    content.innerHTML = '';
    for (let i = 0; i < pokemonNames.length; i++) {
        generatePokemonCardContent(i);
    }

}


/*API Requests*/
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


/*Home Page*/
function generatePokemonCardContent(i) {
    const name = pokemonNames[i];
    const formatedName = name.charAt(0).toUpperCase() + name.slice(1);
    const id = '#' + pokemonDetails[i]['id'].toString().padStart(4, '0');
    const image = pokemonDetails[i]['sprites']['other']['official-artwork']['front_default'];
    content.innerHTML += generatePokemonCardHTML(i, formatedName, id, image);
    addPokemonTypes(i);
    addBackgroundColor(i);
}


function addPokemonTypes(i) {
    let pokemonTypes = document.getElementById(`pokemon-card-type${i}`);
    pokemonTypes.innerHTML = '';
    for (let j = 0; j < pokemonDetails[i]['types'].length; j++) {
        const type = pokemonDetails[i]['types'][j];
        const formatedType = type['type']['name'].charAt(0).toUpperCase() + type['type']['name'].slice(1);
        pokemonTypes.innerHTML += `<div class="${type['type']['name']}-type-main single-pokemon-type">${formatedType}</div>`;
    }
}


function addBackgroundColor(i) {
    let pokemonCardBackground = document.getElementById(`pokemon-card${i}`);
    for (let k = 0; k < pokemonDetails.length; k++) {
        const mainType = pokemonDetails[i]['types'][0]['type']['name'];
        pokemonCardBackground.classList.add(`${mainType}-type-secondary`)
    }
}


async function loadMore() {
    const button = document.getElementById('load-btn');
    button.disabled = true;
    await init();
}


function generatePokemonCardHTML(i, formatedName, id, image) {
    return `
    <div onclick="openPokemonCard(${i})" class="pokemon-card" id="pokemon-card${i}">
        <div class="pokemon-card-top">
            <div class="pokemon-name">${formatedName}</div>
            <div>${id}</div>
        </div>
        <div class="pokemon-card-bottom">
            <div class="image-container"><img class="pokemon-card-image" src="${image}"></div>
            <div class="pokemon-card-type" id="pokemon-card-type${i}"></div>
        </div> 
    </div>`;
}


function startLoadingAnimation() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.remove('d-none');
}

function stopLoadingAnimation() {
    const button = document.getElementById('load-btn');
    const loadingScreen = document.getElementById('loading-screen');
    button.disabled = false;
    loadingScreen.classList.add('d-none');
}


/*Single Pokemon Card Main Section*/
function openPokemonCard(i) {
    document.getElementById('content').classList.add('f-blur');
    const modal = document.getElementById('pokemon-modal');
    const backgroundModal = document.getElementById('pokemon-background-modal');
    const type = pokemonDetails[i]['types'][0]['type']['name'];
    checkClassLists(modal, backgroundModal, type);
    modal.innerHTML = '';
    modal.innerHTML += generateSingleCardHTML(i);
    checkArrows(i);
    generateAboutSection(i);
}


function checkClassLists(modal, backgroundModal, type) {
    modal.classList = '';
    modal.classList.add(`${type}-type-secondary`, 'pokemon-modal');
    backgroundModal.classList.remove('d-none');
    backgroundModal.addEventListener('click', closePokemonCard);
}


function checkArrows(i) {
    if (i === 0) {
        document.getElementById(`left-arrow${i}`).classList.add('d-none');
        document.getElementById(`arrows${i}`).classList.add('flex-end');
    } else if (i > 1280) {
        document.getElementById(`right-arrow${i}`).classList.add('d.none');
        document.getElementById(`arrows${i}`).classList.add('flex-start');
    }
}


function filterPokemon() {
    const searchInput = document.getElementById('searchInput');
    const filter = searchInput.value.toLowerCase();
    const allPokemonCards = document.querySelectorAll('.pokemon-card');
    allPokemonCards.forEach((card) => {
        const pokemonName = card.querySelector('.pokemon-name').textContent.toLowerCase();
        if (pokemonName.includes(filter)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}


function generateSingleCardHTML(i) {
    return `
        <div class="single-pokemon-card">
            <div class="single-pokemon-card-top-section">
                <div class="arrows" id="arrows${i}">
                <a id="left-arrow${i}" onclick="lastPokemon(${i})" class="arrow-btn c-pointer"><img src="./img/left.png"></a>  <a id="right-arrow${i}" onclick="nextPokemon(${i})" class="arrow-btn c-pointer"><img src="./img/right.png"></a>
                </div>
                <div class="top-section-name">${pokemonDetails[i]['name'].charAt(0).toUpperCase() + pokemonDetails[i]['name'].slice(1)}</div>
                <div class="top-section-id">${'#' + pokemonDetails[i]['id'].toString().padStart(4, '0')}</div>
                <div class="top-section-type" id="top-section-type"></div>
                <div class="pokemon-card-image-container"><img class="top-section-image" src="${pokemonDetails[i]['sprites']['other']['official-artwork']['front_default']}"></div>
            </div>
            <div class="single-pokemon-card-bottom-section flex-column">
                <ul>
                    <li class="c-pointer" id="about-section${i}" onclick="generateAboutSection(${i})">About</li>
                    <li class="c-pointer" id="base-section${i}" onclick="generateBaseStats(${i})">Base Stats</li>
                    <li class="c-pointer" id="move-section${i}" onclick="generateMoves(${i})">Moves</li>
                </ul>
                <div class="single-card-content" id="single-card-content"></div>
            </div>
        </div>
    `;
}


async function nextPokemon(i) {
    if (i < pokemonNames.length - 1) {
        openPokemonCard(i + 1);
    } else {
        await loadMore();
        openPokemonCard(i + 1);
    }
}


function lastPokemon(i) {
    openPokemonCard(i - 1)
}


function closePokemonCard() {
    document.getElementById('content').classList.remove('f-blur');
    const modal = document.getElementById('pokemon-modal');
    const backgroundModal = document.getElementById('pokemon-background-modal');
    modal.classList = '';
    modal.classList.add('pokemon-modal', 'd-none');
    backgroundModal.classList.add('d-none');
}


/*Single Pokemon Card - About Section*/
function generateAboutSection(i) {
    const sections = getSectionConst(i);
    const formated = getFormatedVariable(i);
    sections.content.innerHTML = '';
    sections.content.innerHTML += generateAboutHTML(i, formated);
    generateAbilities(i);
    generateEggGroup(i);
    sections.about.classList.add('li-border-bottom');
    sections.move.classList.remove('li-border-bottom');
    sections.base.classList.remove('li-border-bottom');
}


function getFormatedVariable(i) {
    const height = pokemonDetails[i]['height'];
    const weight = pokemonDetails[i]['weight'];
    const mHeight = (height / 10).toFixed(2);
    const kWeight = (weight / 10).toFixed(2);
    const ftHeight = (mHeight * 3.28084).toFixed(2);
    const lbsWeight = (kWeight * 2.20462).toFixed(2);
    const description = pokemonSpecies[i]['flavor_text_entries'][10]['flavor_text']

    return {mHeight, kWeight, ftHeight, lbsWeight, description}
}

function generateAboutHTML(i, formated) {
    const { mHeight, kWeight, ftHeight, lbsWeight, description } = formated;
    return `
            <div class="card-about">
                <div class="pokemon-description">${description}</div>
                <div class="pokemon-specifications">
                    <div class="pokemon-height"><b>Height: </b><p>${ftHeight}ft (${mHeight}m)</p></div>
                    <div class="pokemon-weight"><b>Weight: </b><p>${lbsWeight}lbs (${kWeight}kg)</p></div>
                    <div class="pokemon-abilities"><b>Abilities:</b><p id="pokemon-abilities${i}"></p></div>
                    <div class="pokemon-egg-groups"><b>Egg Groups:</b><p id="pokemon-egg-group${i}"></p></div>
                <div>
            </div>`;
}


function generateAbilities(i) {
    let content = document.getElementById(`pokemon-abilities${i}`);
    content.innerHTML = '';
    for (let j = 0; j < pokemonDetails[i]['abilities'].length; j++) {
        const ability = pokemonDetails[i]['abilities'][j];
        if (j === pokemonDetails[i]['abilities'].length - 1) {
            content.innerHTML += `<div>${ability['ability']['name']}</div>`;
        } else {
            content.innerHTML += `<div>${ability['ability']['name']},</div>`;
        }
    }
}


function generateEggGroup(i) {
    let content = document.getElementById(`pokemon-egg-group${i}`);
    content.innerHTML = '';
    for (let j = 0; j < pokemonSpecies[i]['egg_groups'].length; j++) {
        const egg = pokemonSpecies[i]['egg_groups'][j];
        if (j === pokemonSpecies[i]['egg_groups'].length - 1) {
            content.innerHTML += `<div>${egg['name']}</div>`;
        } else {
            content.innerHTML += `<div>${egg['name']},</div>`;
        }
    }
}


/*Single Pokemon Card - Stat Section*/
function generateBaseStats(i) {
    const sections = getSectionConst(i);
    sections.about.classList.remove('li-border-bottom');
    sections.move.classList.remove('li-border-bottom');
    sections.base.classList.add('li-border-bottom');
    sections.content.innerHTML = '';
    sections.content.innerHTML += `<canvas id="myChart"></canvas>`;
    generateChart(i);
}


function baseStats(i) {
    let stats = pokemonDetails[i]['stats']
    let hp = stats[0]['base_stat'];
    let atk = stats[1]['base_stat'];
    let def = stats[2]['base_stat'];
    let spAtk = stats[3]['base_stat'];
    let spDef = stats[4]['base_stat'];
    let speed = stats[5]['base_stat'];
    return { hp, atk, def, spAtk, spDef, speed }
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

/*Single Pokemon Card - Moves Section*/
function generateMoves(i) {
    const sections = getSectionConst(i);
    sections.about.classList.remove('li-border-bottom');
    sections.base.classList.remove('li-border-bottom');
    sections.move.classList.add('li-border-bottom');
    sections.content.innerHTML = '';
    sections.content.classList.add('moves', 'p-relative');
    sections.content.classList.remove('flex-column');
    for (let j = 0; j < pokemonDetails[i]['moves'].length; j++) {
        const moves = pokemonDetails[i]['moves'][j];
        sections.content.innerHTML += `
        <div class="pokemon-single-move">${moves['move']['name']}</div>`;
    }
}


function getSectionConst(i) {
    const about = document.getElementById(`about-section${i}`);
    const base = document.getElementById(`base-section${i}`);
    const move = document.getElementById(`move-section${i}`);
    const content = document.getElementById('single-card-content');
    return { about, base, move, content }
}










