const API_URL = 'https://api.jikan.moe/v4/seasons/now';

const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const emptyEl = document.getElementById('empty');
const resultsEl = document.getElementById('results');

function showState(state) {
    loadingEl.classList.add('hidden');
    errorEl.classList.add('hidden');
    emptyEl.classList.add('hidden');
    resultsEl.classList.add('hidden');

    if (state === 'loading') {
        loadingEl.classList.remove('hidden');
    }
    if (state === 'error') {
        errorEl.classList.remove('hidden');
    }
    if (state === 'empty') {
        emptyEl.classList.remove('hidden');
    }
    if (state === 'results') {
        resultsEl.classList.remove('hidden');
    }
}

function renderAnimeList(animes) {
    resultsEl.innerHTML = '';

    const idsQueYaMostre = [];

    for (let i = 0; i < animes.length; i++) {
        const anime = animes[i];

        const idActual = anime.mal_id;
        let yaEsta = false;

        for (let j = 0; j < idsQueYaMostre.length; j++) {
            if (idsQueYaMostre[j] === idActual) {
                yaEsta = true;
            }
        }

        if (yaEsta === true) {
            continue;
        }

        idsQueYaMostre.push(idActual);

        const card = document.createElement('div');
        card.className = 'card';

        const img = document.createElement('img');
        if (anime.images && anime.images.jpg && anime.images.jpg.large_image_url) {
            img.src = anime.images.jpg.large_image_url;
        } else {
            img.src = '';
        }
        if (anime.title) {
            img.alt = anime.title;
        } else {
            img.alt = 'Anime';
        }

        const title = document.createElement('h2');
        if (anime.title) {
            title.textContent = anime.title;
        } else {
            title.textContent = 'No Title';
        }

        const synopsis = document.createElement('p');
        if (anime.synopsis) {
            synopsis.textContent = anime.synopsis;
        } else {
            synopsis.textContent = 'No synopsis available.';
        }

        const btn = document.createElement('button');
        btn.textContent = 'View Details';
        btn.onclick = function() {
            const id = anime.mal_id;
            window.location.href = 'details.html?id=' + id;
        };

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(synopsis);
        card.appendChild(btn);
        resultsEl.appendChild(card);
    }
}

async function fetchAnimeList() {
    showState('loading');
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Request failed');
        }
        const data = await response.json();
        const animes = data.data;

        if (!animes || animes.length === 0) {
            showState('empty');
        } else {
            renderAnimeList(animes);
            showState('results');
        }
    } catch (err) {
        console.error(err);
        showState('error');
    }
}

fetchAnimeList();
