const publicKey = '72b24ad761792650dc6ba6ec80a9e1de';
const privateKey = '830fee8ceed09e824825f2f3c972cbcfb577f940';
const baseURL = 'https://gateway.marvel.com:443/v1/public/characters';



function getHash(ts) {
    const textToHash = ts + privateKey + publicKey;
    const hashedText = CryptoJS.MD5(textToHash).toString();
    return hashedText;
}




function fetchSuperheroes(searchQuery) {
    const ts = new Date().getTime();
    const hash = getHash(ts);
    const apiUrl = `${baseURL}?ts=${ts}&apikey=${publicKey}&hash=${hash}&nameStartsWith=${searchQuery}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => displaySuperheroes(data.data.results))
        .catch(error => console.error('Error fetching superheroes:', error));
}

function displaySuperheroes(superheroes) {
    const superheroesList = document.getElementById('superheroes-list');
    superheroesList.innerHTML = '';

    superheroes.forEach(superhero => {
        const superheroCard = document.createElement('div');
        superheroCard.classList.add('superhero-card');
        superheroCard.innerHTML = `
            <img src="${superhero.thumbnail.path}.${superhero.thumbnail.extension}" alt="${superhero.name}">
            <h3>${superhero.name}</h3>
            <button onclick="addToFavorites(${superhero.id})">Add to Favorites</button>
            <a href="superhero.html?id=${superhero.id}">More Info</a>
        `;
        superheroesList.appendChild(superheroCard);
    });
}

function searchSuperheroes() {
    const searchInput = document.getElementById('search-input');
    const searchQuery = searchInput.value.trim();

    if (searchQuery !== '') {
        fetchSuperheroes(searchQuery);
    }
}

function addToFavorites(superheroId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(superheroId)) {
        favorites.push(superheroId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}


