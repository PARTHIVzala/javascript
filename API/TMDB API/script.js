
const API_KEY = "04ac52894c87b6a8ebc21405a1667a95";
const API_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w500";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const listEl = document.getElementById("list");
const statusEl = document.getElementById("status");
const tabs = document.querySelectorAll(".tab");
const prevBtn = document.getElementById("prevPage");
const nextBtn = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");

// modal
const modal = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");
const modalTitle = document.getElementById("modalTitle");
const modalPoster = document.getElementById("modalPoster");
const modalMeta = document.getElementById("modalMeta");
const modalOverview = document.getElementById("modalOverview");
const modalExtra = document.getElementById("modalExtra");
const modalTrailer = document.getElementById("modalTrailer");

let state = {
  tab: "trending", 
  query: "",
  page: 1,
  totalPages: 1,
  lastResults: []
};

function url(path, params = {}) {
  const p = new URL(`${API_BASE}${path}`);
  p.searchParams.set("api_key", API_KEY);
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== "") p.searchParams.set(k, v); });
  return p.toString();
}

function setStatus(msg, error = false) {
  statusEl.textContent = msg;
  statusEl.style.color = error ? "tomato" : "";
}

function renderList(movies) {
  listEl.innerHTML = "";
  if (!movies || !movies.length) {
    setStatus("No results.");
    pageInfo.textContent = "Page 0 / 0";
    return;
  }
  movies.forEach((m, idx) => {
    const card = document.createElement("article");
    card.className = "card";
    const poster = m.poster_path ? `${IMG_BASE}${m.poster_path}` : `https://via.placeholder.com/500x750?text=No+Image`;
    card.innerHTML = `
      <img src="${poster}" alt="${escapeHtml(m.title)} poster" loading="lazy">
      <div class="info">
        <h3 class="title">${escapeHtml(m.title)}</h3>
        <p class="sub">${m.release_date ? m.release_date.slice(0, 4) : "—"} • ⭐ ${m.vote_average ?? "—"}</p>
      </div>
    `;
    card.addEventListener("click", () => openMovieDetail(m.id));
    listEl.appendChild(card);
  });
  state.lastResults = movies;
}

function escapeHtml(s = "") {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

async function fetchList() {
  setStatus("Loading...");
  let path;
  let params = { page: state.page };
  try {
    if (state.tab === "trending") {
      const res = await fetch(url("/trending/movie/week", params));
      const j = await res.json();
      state.totalPages = j.total_pages || 1;
      renderList(j.results);
      setStatus(`Trending — ${j.total_results} results`);
      pageInfo.textContent = `${state.page} / ${state.totalPages}`;
      return;
    }
    if (state.tab === "popular") path = "/movie/popular";
    if (state.tab === "top_rated") path = "/movie/top_rated";
    if (state.tab === "search") {
      // search
      if (!state.query) { setStatus("Type a query and press Search."); renderList([]); return; }
      const res = await fetch(url("/search/movie", { ...params, query: state.query }));
      const j = await res.json();
      state.totalPages = j.total_pages || 1;
      renderList(j.results);
      setStatus(`Search: "${state.query}" — ${j.total_results} results`);
      pageInfo.textContent = `${state.page} / ${state.totalPages}`;
      return;
    }

    // popular / top_rated
    const res = await fetch(url(path, params));
    const j = await res.json();
    state.totalPages = j.total_pages || 1;
    renderList(j.results);
    setStatus(`${state.tab.replace("_", " ").toUpperCase()} — page ${state.page}`);
    pageInfo.textContent = `${state.page} / ${state.totalPages}`;
  } catch (err) {
    console.error(err);
    setStatus("Failed to load — check your API key & network.", true);
    renderList([]);
  }
}

// Tab handlers
tabs.forEach(t => {
  t.addEventListener("click", () => {
    tabs.forEach(x => x.classList.remove("active"));
    t.classList.add("active");
    const val = t.dataset.tab;
    state.tab = val;
    state.page = 1;
    state.query = "";
    searchInput.value = "";
    fetchList();
  });
});

// Search
searchBtn.addEventListener("click", () => {
  const q = searchInput.value.trim();
  if (!q) return;
  state.tab = "search";
  // update tab UI
  tabs.forEach(x => x.classList.toggle("active", x.dataset.tab === "search"));
  state.query = q;
  state.page = 1;
  fetchList();
});
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

// Pagination
prevBtn.addEventListener("click", () => {
  if (state.page <= 1) return;
  state.page--;
  fetchList();
});
nextBtn.addEventListener("click", () => {
  if (state.page >= state.totalPages) return;
  state.page++;
  fetchList();
});

// Movie detail modal
modalClose.addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.add("hidden"); });

// open detail: fetch movie details + videos
async function openMovieDetail(id) {
  try {
    setStatus("Loading movie...");
    const [detailRes, videoRes] = await Promise.all([
      fetch(url(`/movie/${id}`, { append_to_response: "" })),
      fetch(url(`/movie/${id}/videos`))
    ]);
    const detail = await detailRes.json();
    const vids = await videoRes.json();

    // populate modal
    modalTitle.textContent = detail.title || detail.original_title || "Movie";
    modalPoster.src = detail.poster_path ? `${IMG_BASE}${detail.poster_path}` : `https://via.placeholder.com/500x750?text=No+Image`;
    modalMeta.textContent = `${detail.release_date ?? "—"} • ⭐ ${detail.vote_average ?? "—"} • ${detail.runtime ?? "—"} min`;
    modalOverview.textContent = detail.overview || "No overview available.";
    modalExtra.innerHTML = `<p class="muted">Genres: ${detail.genres?.map(g => g.name).join(", ") || "—"}</p>
                            <p class="muted">Language: ${detail.original_language?.toUpperCase() || "—"}</p>`;

    // trailer: prefer YouTube official trailer
    modalTrailer.innerHTML = "";
    if (vids && vids.results && vids.results.length) {
      const yt = vids.results.find(v => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")) || vids.results.find(v => v.site === "YouTube");
      if (yt) {
        const embed = document.createElement("iframe");
        embed.src = `https://www.youtube.com/embed/${yt.key}?rel=0`;
        embed.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        embed.title = "Trailer";
        modalTrailer.appendChild(embed);
      }
    }

    modal.classList.remove("hidden");
    setStatus("");
  } catch (err) {
    console.error(err);
    setStatus("Failed to load movie details.", true);
  }
}

// On load: initial trending
(function init() {
  // basic validation hint
  if (!API_KEY || API_KEY === "YOUR_TMDB_API_KEY") {
    setStatus("Replace YOUR_TMDB_API_KEY in script.js with your TMDB API key.", true);
  } else {
    setStatus("Ready — loading trending...");
  }
  fetchList();
})();