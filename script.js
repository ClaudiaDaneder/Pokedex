let globalURL = 'https://pokeapi.co/api/v2/';
let statvalues = [];
let allPokemonNames = [];
let maxPokemon = 30;
let minPokemon = 1;

function init() {
    loadPokemonOverview();
    fetchAllNames();
}

async function fetchData(endpoint) {
    let response = await fetch(endpoint);
    let data = await response.json();
    return data;
}

async function loadPokemonOverview() {
    for (let i = minPokemon; i <= maxPokemon; i++) {
        await loadOverviewCards(i);
    }
}

async function loadOverviewCards(i) {
    let results = await fetchData(`${globalURL}pokemon/${i}`);

    let pokemonName = results['name'];
    let pokemonImage = results['sprites']['other']['home']['front_default'];
    let id = results['id'];

    let overviewContainer = document.getElementById('overview-container');
    overviewContainer.innerHTML += loadOVerviewCardsHTML(id, pokemonName);
    document.getElementById(`overview-image-${id}`).src = pokemonImage;
    loadTypesInOverview(id);
}

async function loadTypesInOverview(i) {
    let container = document.getElementById(`overview-type-and-img-${i}`);
    if (!container) return;
    let results = await fetchData(`${globalURL}pokemon/${i}`);
    let pokemonTypes = results['types'];

    for (let t = 0; t < pokemonTypes.length; t++) {
        let pokemonType = pokemonTypes[t]['type']['name'];
        container.innerHTML += `<div class="pokemon-type">${firstLetterUppercase(pokemonType)}</div>`
    }
    assignBgColorOverview(pokemonTypes, i);
}

async function loadPokemonDetails(i) {
    showDetailCard();
    let results = await fetchData(`${globalURL}pokemon/${i}`);
    let pokemonName = results['name'];
    document.getElementById('pokemon-name').innerHTML = firstLetterUppercase(pokemonName);

    loadPokemonImage(i);
    loadPokemonType(i);
    loadPokemonStats(i);
    loadPokemonAbout(i);
}

async function loadPokemonImage(i) {
    let results = await fetchData(`${globalURL}pokemon/${i}`);
    let pokemonImage = results['sprites']['other']['home']['front_default'];
    let pokemonID = results['id'];

    document.getElementById('pokemon-detail-image').src = pokemonImage;
    document.getElementById('id-number').innerHTML = pokemonID;
}

async function loadPokemonType(i) {
    let results = await fetchData(`${globalURL}pokemon/${i}`);
    let pokemonTypes = results['types'];
    document.getElementById('pokemon-type-container').innerHTML = '';

    for (let j = 0; j < pokemonTypes.length; j++) {
        let pokemonType = pokemonTypes[j]['type']['name'];
        document.getElementById('pokemon-type-container').innerHTML += `<div class="pokemon-type">${firstLetterUppercase(pokemonType)}</div>`
    }
    assignBgColor(pokemonTypes);
}

async function loadPokemonAbout(i) {
    let results = await fetchData(`${globalURL}pokemon/${i}`);
    let height = results['height'];
    let weight = results['weight'];
    let abilities = results['abilities'];
    
    document.getElementById('height').innerHTML = height * 10 + ' cm';
    document.getElementById('weight').innerHTML = weight / 10 + ' kg';
    setPokemonAbilities(abilities);
    loadPokemonColor(i);

}

function setPokemonAbilities(abilities) {
    document.getElementById('abilities').innerHTML = '';
    for (let a = 0; a < abilities.length; a++) {
        let ability = abilities[a]['ability']['name'];
        document.getElementById('abilities').innerHTML += `<div>${firstLetterUppercase(ability)}</div>`;
    }
}

async function loadPokemonColor(i) {
    let results = await fetchData(`${globalURL}pokemon-species/${i}`);
    let color = results['color']['name'];
    document.getElementById('color').innerHTML = `<div>${firstLetterUppercase(color)}</div>`;
}

async function loadPokemonStats(i) {
    let results = await fetchData(`${globalURL}pokemon/${i}`);
    let stats = results['stats'];
    statvalues = [];

    for (let s = 0; s < stats.length; s++) {
        let stat = stats[s];
        let statvalue = stat['base_stat'];
        statvalues.push(statvalue);
    }
    document.getElementById('pokemon-stats-container').innerHTML = '<canvas id="myChart"></canvas>';
    loadChart();
}

function showDetailCard() {
    document.getElementById('main-page').classList.add('hide');
    document.getElementById('pokemon-detail-card').classList.remove('hide');
}

function showOverview() {
    document.getElementById('main-page').classList.remove('hide');
    document.getElementById('pokemon-detail-card').classList.add('hide');
}

function firstLetterUppercase(word) {
    return word[0].toUpperCase() + word.substring(1)
}

function nextPokemon() {
    let ID = document.getElementById('id-number').innerHTML;

    if (ID < 1025) {
        ID++;
    } else {
        ID = 1;
    }
    loadPokemonDetails(ID);
}

function previousPokemon() {
    let ID = document.getElementById('id-number').innerHTML;

    if (ID > 1) {
        ID--;
    } else {
        ID = 1025;
    }
    loadPokemonDetails(ID);
}

function loadMore() {
    minPokemon = minPokemon + 30;
    maxPokemon = maxPokemon + 30;
    loadPokemonOverview();
}

async function fetchAllNames() {
    let results = await fetchData(`${globalURL}pokemon-species/?limit=1025`);
    let namesCount = results['results'];

    for (let n = 0; n < namesCount.length; n++) {
        let names = namesCount[n];
        let allNames = names['name'];
        allPokemonNames.push(allNames);
    }
}

function prepareFieldForSearch() {
    let search = document.getElementById('pokemon-search').value.toLowerCase();
    let overview = document.getElementById('overview-container');
    let cards = overview.getElementsByClassName('overview-card');
    for (let i = cards.length - 1; i >= 0; i--) {
        overview.removeChild(cards[i]);
    }
    if (search == '') {
        clearSearch(overview);
    } else {
        searchPokemon(search);
    }
}

function clearSearch(overview) {
    overview.innerHTML = '';
    loadPokemonOverview();
    return; 
}

async function searchPokemon(search) {
    for (let i = 0; i < allPokemonNames.length; i++) {
        let pokemonName = allPokemonNames[i].toLowerCase();
        if (pokemonName.startsWith(search)) {
            await loadOverviewCards(i + 1)
        }
    }
}

function assignBgColor(pokemonTypes) {
    let types = pokemonTypes[0]['type']['name'];
    let bgColor = colors[types];
    document.getElementById(`pokemon-card`).style.backgroundColor = bgColor;
}

function assignBgColorOverview(pokemonTypes, i) {
    let container = document.getElementById(`overview-card-${i}`);
    if (!container) return;
    let types = pokemonTypes[0]['type']['name'];
    let bgColor = colors[types];
    container.style.backgroundColor = bgColor;
}

function loadOVerviewCardsHTML(id, pokemonName) {
    return `<div id="overview-card-${id}" class="overview-card" onclick="loadPokemonDetails(${id})">
    <div class="overview-ID">#${id}</div>
    <h2>${firstLetterUppercase(pokemonName)}</h2>
    <div class="overview-type-and-img-container">
        <div id="overview-type-and-img-${id}" class="overview-type"></div>
        <img id="overview-image-${id}" alt="${firstLetterUppercase(pokemonName)}" title="${firstLetterUppercase(pokemonName)}">
    </div>
    </div>`;
}