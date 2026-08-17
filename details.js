const params = new URLSearchParams(window.location.search);
const animeId = params.get('id');

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

function renderAnimeDetails(anime) {
    resultsEl.innerHTML = '';
    const container = document.createElement('div');
    container.className = 'details-container';

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
    container.appendChild(img);

    const titlesHeading = document.createElement('h3');
    titlesHeading.textContent = 'Titles';
    container.appendChild(titlesHeading);

    const titlesList = document.createElement('ul');
    let titles;
    if (anime.titles) {
        titles = anime.titles;
    } else {
        titles = [];
    }
    if (titles.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No titles available';
        titlesList.appendChild(li);
    } else {
        for (let i = 0; i < titles.length; i++) {
            const t = titles[i];
            const li = document.createElement('li');
            li.textContent = t.type + ': ' + t.title;
            titlesList.appendChild(li);
        }
    }
    container.appendChild(titlesList);

    const synopsisHeading = document.createElement('h3');
    synopsisHeading.textContent = 'Synopsis';
    container.appendChild(synopsisHeading);

    const synopsis = document.createElement('p');
    if (anime.synopsis) {
        synopsis.textContent = anime.synopsis;
    } else {
        synopsis.textContent = 'No synopsis available.';
    }
    container.appendChild(synopsis);

    const startHeading = document.createElement('h3');
    startHeading.textContent = 'Start Date';
    container.appendChild(startHeading);

    const startDate = document.createElement('p');
    if (anime.aired && anime.aired.from) {
        startDate.textContent = anime.aired.from;
    } else {
        startDate.textContent = 'N/A';
    }
    container.appendChild(startDate);

    const endHeading = document.createElement('h3');
    endHeading.textContent = 'End Date';
    container.appendChild(endHeading);

    const endDate = document.createElement('p');
    if (anime.aired && anime.aired.to) {
        endDate.textContent = anime.aired.to;
    } else {
        endDate.textContent = 'N/A';
    }
    container.appendChild(endDate);

    resultsEl.appendChild(container);
}

async function fetchAnimeDetails() {
    if (!animeId) {
        showState('empty');
        return;
    }

    showState('loading');
    try {
        const response = await fetch('https://api.jikan.moe/v4/anime/' + animeId);
        if (!response.ok) {
            throw new Error('Request failed');
        }
        const data = await response.json();
        const anime = data.data;
        if (!anime) {
            showState('empty');
        } else {
            renderAnimeDetails(anime);
            showState('results');
        }
    } catch (err) {
        console.error(err);
        showState('error');
    }
}

fetchAnimeDetails();
