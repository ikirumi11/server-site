const state = { sites: [], query: '', category: '' };

const search = document.getElementById('search');
const category = document.getElementById('category');
const results = document.getElementById('results');
const count = document.getElementById('count');
const clear = document.getElementById('clear');

async function loadSites() {
  try {
    const response = await fetch('sites.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Could not load sites');
    state.sites = await response.json();
    buildCategories();
    render();
  } catch (error) {
    count.textContent = 'Server error';
    results.innerHTML = '<div class="empty">Could not load the site registry.</div>';
  }
}

function buildCategories() {
  const categories = [...new Set(state.sites.map(site => site.category).filter(Boolean))].sort();
  category.innerHTML = '<option value="">All categories</option>';
  for (const name of categories) {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    category.appendChild(option);
  }
}

function render() {
  const q = state.query.trim().toLowerCase();
  const filtered = state.sites.filter(site => {
    const text = `${site.name} ${site.description} ${site.category}`.toLowerCase();
    return (!q || text.includes(q)) && (!state.category || site.category === state.category);
  });

  count.textContent = `${filtered.length} site${filtered.length === 1 ? '' : 's'}`;
  results.innerHTML = '';

  if (!filtered.length) {
    results.innerHTML = '<div class="empty">No sites found.</div>';
    return;
  }

  for (const site of filtered) {
    const card = document.createElement('a');
    card.className = 'card';
    card.href = site.url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.innerHTML = `<h2></h2><p></p><span class="tag"></span>`;
    card.querySelector('h2').textContent = site.name || 'Unnamed site';
    card.querySelector('p').textContent = site.description || '';
    card.querySelector('.tag').textContent = site.category || 'Other';
    results.appendChild(card);
  }
}

search.addEventListener('input', () => { state.query = search.value; render(); });
category.addEventListener('change', () => { state.category = category.value; render(); });
clear.addEventListener('click', () => { search.value = ''; category.value = ''; state.query = ''; state.category = ''; render(); });

loadSites();
