let limit = 20;
let pokemonNames = [];
let pokemonDetails = [];
let pokemonSpecies = [];


async function init() {
    await loadAllPokemonData();
    render();
}


async function loadAllPokemonData() {
    await loadPokemonNames();
    await loadPokemonDetails();
    await loadPokemonSpecies();
}


function render() {
    document.getElementById('searchInput').addEventListener('input', filterPokemon);
    let content = document.getElementById('content');
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


async function loadMore() {
    await init();
}


function generatePokemonCardHTML(i, name, id, image) {
    return `
    <div onclick="openPokemonCard(${i})" class="pokemon-card" id="pokemon-card${i}">
        <div class="pokemon-card-top">
            <div class="pokemon-name">${name}</div>
            <div>${id}</div>
        </div>
        <div class="pokemon-card-bottom">
            <div><img class="pokemon-card-image" src="${image}"></div>
            <div class="pokemon-card-type" id="pokemon-card-type${i}"></div>
        </div> 
    </div>`;
}


/*Single Pokemon Card Main Section*/
function openPokemonCard(i) {
    let modal = document.getElementById('pokemon-modal');
    let backgroundModal = document.getElementById('pokemon-background-modal');
    let type = pokemonDetails[i]['types'][0]['type']['name'];
    modal.classList = '';
    modal.classList.add(`${type}-type-secondary`);
    modal.classList.add('pokemon-modal');
    backgroundModal.classList.remove('d-none');
    backgroundModal.addEventListener('click', closePokemonCard);
    modal.innerHTML = '';
    modal.innerHTML += generateSingleCardHTML(i);
    if (i === 0) {
        document.getElementById(`left-arrow${i}`).classList.add('d-none');
        document.getElementById(`arrows${i}`).classList.add('flex-end');
    } else if (i > 1280) {
        document.getElementById(`right-arrow${i}`).classList.add('d.none');
        document.getElementById(`arrows${i}`).classList.add('flex-start');
    }
    generateAboutSection(i);
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
                <a id="left-arrow${i}" onclick="lastPokemon(${i})" class="arrow-btn"><img src="./img/left.png"></a>  <a id="right-arrow${i}" onclick="nextPokemon(${i})" class="arrow-btn"><img src="./img/right.png"></a>
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
    let modal = document.getElementById('pokemon-modal');
    let backgroundModal = document.getElementById('pokemon-background-modal');
    modal.classList = '';
    modal.classList.add('pokemon-modal');
    modal.classList.add('d-none');
    backgroundModal.classList.add('d-none');
}


/*Single Pokemon Card - About Section*/
function generateAboutSection(i) {
    let content = document.getElementById('single-card-content');
    content.innerHTML = '';
    content.innerHTML += generateAboutHTML(i);
    generateAbilities(i);
    generateEggGroup(i);
    let about = document.getElementById(`about-section${i}`);
    about.classList.add('li-border-bottom');
}


function generateAboutHTML(i) {
    return `
            <div class="card-about">
                <div class="pokemon-description">${pokemonSpecies[i]['flavor_text_entries'][10]['flavor_text']}</div>
                <div class="pokemon-height"><b>Height: </b><p>${pokemonDetails[i]['height']}</p></div>
                <div class="pokemon-weight"><b>Weight: </b><p>${pokemonDetails[i]['weight']}</p></div>
                <div class="pokemon-abilities"><b>Abilities:</b><p id="pokemon-abilities${i}"></p></div>
                <div class="pokemon-egg-groups"><b>Egg Groups:</b><p id="pokemon-egg-group${i}"></p></div>
            </div>  
            `;
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
    let about = document.getElementById(`about-section${i}`);
    about.classList.remove('li-border-bottom');
    let content = document.getElementById('single-card-content');
    content.innerHTML = '';
    content.innerHTML += `<canvas id="myChart"></canvas>`;
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
    let about = document.getElementById(`about-section${i}`);
    about.classList.remove('li-border-bottom');
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















