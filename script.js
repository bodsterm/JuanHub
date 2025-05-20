// Sample game data (replace with actual game links or iframes)
const games = [
    { id: 1, title: "Game 1", category: "action", thumbnail: "images/game1.jpg", url: "https://example.com/game1" },
    { id: 2, title: "Game 2", category: "puzzle", thumbnail: "images/game2.jpg", url: "https://example.com/game2" },
    { id: 3, title: "Game 3", category: "arcade", thumbnail: "images/game3.jpg", url: "https://example.com/game3" },
    // Add more games as needed
];

// Load favorites from local storage
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

const gameGrid = document.getElementById('game-grid');
const searchInput = document.getElementById('game-search');
const navLinks = document.querySelectorAll('nav ul li a');

// Function to display games
function displayGames(filteredGames) {
    gameGrid.innerHTML = '';
    filteredGames.forEach(game => {
        const isFavorited = favorites.includes(game.id);
        const gameCard = document.createElement('div');
        gameCard.classList.add('game-card');
        gameCard.innerHTML = `
            <img src="${game.thumbnail}" alt="${game.title}">
            <h3>${game.title}</h3>
            <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" data-id="${game.id}">&#9733;</button>
        `;
        gameCard.addEventListener('click', (e) => {
            if (e.target.classList.contains('favorite-btn')) {
                toggleFavorite(game.id);
            } else {
                window.location.href = game.url; // Redirect to game URL
            }
        });
        gameGrid.appendChild(gameCard);
    });
}

// Toggle favorite status
function toggleFavorite(gameId) {
    if (favorites.includes(gameId)) {
        favorites = favorites.filter(id => id !== gameId);
    } else {
        favorites.push(gameId);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayGames(getFilteredGames());
}

// Get filtered games based on category and search
function getFilteredGames(category = 'all', searchTerm = '') {
    let filteredGames = games;
    if (category !== 'all' && category !== 'favorites') {
        filteredGames = games.filter(game => game.category === category);
    } else if (category === 'favorites') {
        filteredGames = games.filter(game => favorites.includes(game.id));
    }
    if (searchTerm) {
        filteredGames = filteredGames.filter(game => game.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return filteredGames;
}

// Event listeners
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        const category = link.getAttribute('data-category');
        displayGames(getFilteredGames(category, searchInput.value));
    });
});

searchInput.addEventListener('input', () => {
    const activeCategory = document.querySelector('nav ul li a.active')?.getAttribute('data-category') || 'all';
    displayGames(getFilteredGames(activeCategory, searchInput.value));
});

// Initial display
displayGames(games);
