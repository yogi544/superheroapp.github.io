
const publicKey = '72b24ad761792650dc6ba6ec80a9e1de';
const privateKey = '830fee8ceed09e824825f2f3c972cbcfb577f940';
const baseURL = 'https://gateway.marvel.com:443/v1/public/characters';


function getHash(ts) {
    const textToHash = ts + privateKey + publicKey;
    const hashedText = CryptoJS.MD5(textToHash).toString();
    return hashedText;
}




function fetchFavoriteSuperheroes(favorites) {
    const ts = new Date().getTime();
    const hash = getHash(ts);

    const promises = favorites.map(superheroId => {
        const apiUrl = `${baseURL}/${superheroId}?ts=${ts}&apikey=${publicKey}&hash=${hash}`;
        return fetch(apiUrl)
            .then(response => response.json())
            .then(data => data.data.results[0]);
    });

    Promise.all(promises)
        .then(superheroes => displayFavoriteSuperheroes(superheroes))
        .catch(error => console.error('Error fetching favorite superheroes:', error));
}

function displayFavoriteSuperheroes(superheroes) {
    const favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = '';

    superheroes.forEach(superhero => {
        const superheroCard = document.createElement('div');
        superheroCard.classList.add('superhero-card');
        superheroCard.innerHTML = `
            <img src="${superhero.thumbnail.path}.${superhero.thumbnail.extension}" alt="${superhero.name}">
            <h3>${superhero.name}</h3>
            <button onclick="removeFromFavorites(${superhero.id})">Remove from Favorites</button>
            <a href="superhero.html?id=${superhero.id}">More Info</a>
        `;
        favoritesList.appendChild(superheroCard);
    });
}

function removeFromFavorites(superheroId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(id => id !== superheroId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    fetchFavoriteSuperheroes(favorites);
}

// Fetch and display favorite superheroes on page load
const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
fetchFavoriteSuperheroes(favorites);
