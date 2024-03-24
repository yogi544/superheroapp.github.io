var MD5 = CryptoJS

const publicKey = '72b24ad761792650dc6ba6ec80a9e1de';
const privateKey = '830fee8ceed09e824825f2f3c972cbcfb577f940';
const baseURL = 'https://gateway.marvel.com:443/v1/public/characters';

function getHash(ts) {
    const textToHash = ts + privateKey + publicKey;
    const hashedText = CryptoJS.MD5(textToHash).toString();
    return hashedText;
}


function fetchSuperheroDetails(superheroId) {
    const ts = new Date().getTime();
    const hash = getHash(ts);
    const apiUrl = `${baseURL}/${superheroId}?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => displaySuperheroDetails(data.data.results[0]))
        .catch(error => console.error('Error fetching superhero details:', error));
}

function displaySuperheroDetails(superhero) {
    const superheroDetailsContainer = document.getElementById('superhero-details');
    superheroDetailsContainer.innerHTML = `
        <img src="${superhero.thumbnail.path}.${superhero.thumbnail.extension}" alt="${superhero.name}">
        <h2>${superhero.name}</h2>
        <p>${superhero.description || 'No description available.'}</p>
        <h3>Comics:</h3>
        <ul>${getItemsList(superhero.comics.items)}</ul>
        <h3>Events:</h3>
        <ul>${getItemsList(superhero.events.items)}</ul>
        <h3>Series:</h3>
        <ul>${getItemsList(superhero.series.items)}</ul>
        <h3>Stories:</h3>
        <ul>${getItemsList(superhero.stories.items)}</ul>
    `;
}

function getItemsList(items) {
    return items.map(item => `<li>${item.name}</li>`).join('');
}

// Extract superheroId from the URL
const urlParams = new URLSearchParams(window.location.search);
const superheroId = urlParams.get('id');

if (superheroId) {
    fetchSuperheroDetails(superheroId);
}
