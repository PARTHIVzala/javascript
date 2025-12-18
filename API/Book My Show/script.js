const movies = [
  {
    id: 1,
    title: 'Avatar: The Way of Water',
    genre: 'Sci-fi',
    rating: 'UA',
    img: 'images/avatar.jfif',
    language: 'English, Hindi',
    duration: '3h 12m',
    release: '2022'
  },
  {
    id: 2,
    title: 'Interstellar',
    genre: 'Sci-fi',
    rating: 'UA',
    img: 'images/insteller.webp',
    language: 'English',
    duration: '2h 49m',
    release: '2014'
  },
  {
    id: 3,
    title: 'Spider-Man: No Way Home',
    genre: 'Action, Adventure',
    rating: 'UA',
    img: 'images/spider.webp',
    language: 'English, Hindi',
    duration: '2h 28m',
    release: '2021'
  },
  {
    id: 4,
    title: 'The Hercules',
    genre: 'Action, Crime',
    rating: 'UA',
    img: 'images/hercules.webp',
    language: 'English',
    duration: '1h 39m',
    release: '2014'
  },
  {
    id: 5,
    title: 'Dune',
    genre: 'Sci-fi',
    rating: 'UA',
    img: 'images/dune.webp',
    language: 'English, Hindi',
    duration: '2h 35m',
    release: '2021'
  },
  {
    id: 6,
    title: 'RRR',
    genre: 'Drama, Action',
    rating: 'UA',
    img: 'images/rrr.jfif',
    language: 'Telugu, Hindi, Tamil',
    duration: '3h 7m',
    release: '2022'
  },
  {
    id: 7,
    title: 'Jawan',
    genre: 'Action, Thriller',
    rating: 'UA',
    img: 'images/jawan.jfif',
    language: 'Hindi, Tamil, Telugu',
    duration: '2h 49m',
    release: '2023'
  },
  {
    id: 8,
    title: 'Ponniyin Selvan',
    genre: 'Historical',
    rating: 'U',
    img: 'images/ponni.jfif',
    language: 'Tamil, Hindi',
    duration: '2h 50m',
    release: '2022'
  },
  {
    id: 9,
    title: 'Lalo',
    genre: 'Historical',
    rating: 'U',
    img: 'images/lalo.avif',
    language: 'Hindi',
    duration: '2h 15m',
    release: '2024'
  }
];

// ACTIVITIES DATA (with offers)
const activities = [
  {
    title: "Bollywood Dance Workshop",
    type: "Workshop",
    location: "Andheri, Mumbai",
    price: "₹699",
    offerPrice: "₹499",
    isOffer: true,
    icon: "💃",
    tag: "Dance"
  },
  {
    title: "Night Trek to Kalsubai",
    type: "Trek & Adventure",
    location: "Kalsubai Peak",
    price: "₹1,499",
    offerPrice: "₹1,299",
    isOffer: true,
    icon: "⛰️",
    tag: "Trek"
  },
  {
    title: "Stand-up Comedy Night",
    type: "Comedy Show",
    location: "Bandra, Mumbai",
    price: "₹899",
    offerPrice: "₹699",
    isOffer: true,
    icon: "🎤",
    tag: "Comedy"
  },
  {
    title: "Weekend Gaming Arena",
    type: "Gaming",
    location: "Lower Parel",
    price: "₹399",
    offerPrice: null,
    isOffer: false,
    icon: "🎮",
    tag: "LAN Party"
  },
  {
    title: "Pottery & Art Workshop",
    type: "Art & Craft",
    location: "Juhu, Mumbai",
    price: "₹599",
    offerPrice: "₹499",
    isOffer: true,
    icon: "🎨",
    tag: "Workshop"
  },
  {
    title: "Kids Science Camp",
    type: "Kids Activity",
    location: "Thane",
    price: "₹999",
    offerPrice: null,
    isOffer: false,
    icon: "🧪",
    tag: "Kids"
  },
  {
    title: "Yoga & Wellness Morning",
    type: "Health & Wellness",
    location: "Marine Drive",
    price: "₹399",
    offerPrice: "₹299",
    isOffer: true,
    icon: "🧘",
    tag: "Wellness"
  },
  {
    title: "Open Mic Night",
    type: "Open Mic",
    location: "Versova",
    price: "₹249",
    offerPrice: "₹199",
    isOffer: true,
    icon: "🎙️",
    tag: "Open Mic"
  }
];
// SLIDER DATA
const slidesData = [
  {
    title: "Avatar: The Way of Water",
    meta: "3D • Action • Sci-Fi",
    img: "images/avatar.jfif"
  },
  {
    title: "Interstellar",
    meta: "IMAX • Sci-Fi • Drama",
    img: "images/insteller.webp"
  },
  {
    title: "Lalo",
    meta: "Historical • Drama",
    img: "images/lalo.avif"
  }
];

// GLOBAL DOM REFS
let moviesGrid,
  activitiesGrid,
  searchInput,
  searchBtn,
  slidesContainer,
  dotsContainer,
  modal,
  modalClose;

let currentSlide = 0;
let slideIntervalId = null;

// MOVIES RENDER
function renderMovies(list = movies) {
  if (!moviesGrid) return;

  moviesGrid.innerHTML = "";

  if (!list.length) {
    moviesGrid.innerHTML = `<div class="muted small">No movies found.</div>`;
    return;
  }

  list.forEach(movie => {
    const card = document.createElement("div");
    card.className = "movie-card";
    card.dataset.id = movie.id;

    card.innerHTML = `
      <img src="${movie.img}" alt="${movie.title}" class="movie-img">
      <div class="movie-info">
        <div class="movie-title">${movie.title}</div>
        <div class="movie-meta">
          <span>Rated: ${movie.rating}</span>
          <span class="badge">${movie.genre}</span>
        </div>
        <div class="movie-meta" style="margin-top:6px">
          <button class="btn small" data-role="book">Book</button>
          <button class="btn small" data-role="trailer">Trailer</button>
        </div>
      </div>
    `;
    moviesGrid.appendChild(card);
  });
}

// ACTIVITIES RENDER
function renderActivities(list = activities) {
  if (!activitiesGrid) return;

  activitiesGrid.innerHTML = "";

  list.forEach(act => {
    const hasOffer = !!act.offerPrice && act.offerPrice !== act.price;

    const card = document.createElement("div");
    card.className = "activity-card";

    card.innerHTML = `
      <div class="activity-top">
        <div class="activity-icon">${act.icon}</div>
        <div>
          <div class="activity-title">${act.title}</div>
          <div class="activity-meta">${act.type}</div>
        </div>
      </div>
      <div class="activity-meta">${act.location}</div>

      <div class="activity-bottom">
        <div>
          ${hasOffer
        ? `<div class="old-price">${act.price}</div>
                 <div class="activity-price">${act.offerPrice}</div>`
        : `<div class="activity-price">${act.price}</div>`
      }
        </div>
        ${hasOffer
        ? `<span class="activity-tag offer-pill">Offer</span>`
        : `<span class="activity-tag">${act.tag}</span>`
      }
      </div>
    `;

    activitiesGrid.appendChild(card);
  });
}
// OPEN MOVIE DETAILS PAGE
function openMovieDetails(movie) {
  localStorage.setItem("selectedMovie", JSON.stringify(movie));
  window.location.href = "movie.html";
}
// SEARCH
function doSearch() {
  if (!moviesGrid) return;
  const term = (searchInput?.value || "").trim().toLowerCase();

  if (!term) {
    renderMovies();
    return;
  }

  const filtered = movies.filter(m =>
    m.title.toLowerCase().includes(term) ||
    m.genre.toLowerCase().includes(term)
  );

  renderMovies(filtered);
}
// CAROUSEL FUNCTIONS
function buildCarousel() {
  if (!slidesContainer || !dotsContainer) return;

  slidesContainer.innerHTML = "";
  dotsContainer.innerHTML = "";

  slidesData.forEach((s, index) => {
    const slideEl = document.createElement("div");
    slideEl.className = "slide";
    slideEl.innerHTML = `
      <img src="${s.img}" alt="${s.title}"
           onerror="this.src='https://via.placeholder.com/900x400?text=Banner'">
      <div class="slide-overlay">
        <div class="slide-title">${s.title}</div>
        <div class="slide-meta">${s.meta}</div>
      </div>
    `;
    slidesContainer.appendChild(slideEl);

    const dot = document.createElement("div");
    dot.className = "dot";
    dot.dataset.index = index;
    dotsContainer.appendChild(dot);
  });

  updateCarousel();
}

function updateCarousel() {
  if (!slidesContainer || !dotsContainer) return;

  const offset = -currentSlide * 100;
  slidesContainer.style.transform = `translateX(${offset}%)`;

  Array.from(dotsContainer.children).forEach((dot, idx) => {
    dot.classList.toggle("active", idx === currentSlide);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slidesData.length;
  updateCarousel();
}

function startCarousel() {
  if (!slidesContainer) return;
  if (slideIntervalId) clearInterval(slideIntervalId);
  slideIntervalId = setInterval(nextSlide, 4000);
}

// DETAIL PAGE INIT
function initDetailPage() {
  const detailPage = document.getElementById("detailPage");
  if (!detailPage) return;

  const raw = localStorage.getItem("selectedMovie");
  if (!raw) {
    window.location.href = "index.html";
    return;
  }

  const movie = JSON.parse(raw);

  const imgEl = document.getElementById("detailImg");
  const titleEl = document.getElementById("detailTitle");
  const grEl = document.getElementById("detailGenreRating");
  const genreBadge = document.getElementById("detailGenreBadge");
  const ratingBadge = document.getElementById("detailRatingBadge");
  const langBadge = document.getElementById("detailLanguageBadge");
  const formatBadge = document.getElementById("detailFormatBadge");
  const descEl = document.getElementById("detailDesc");
  const durationEl = document.getElementById("detailDuration");
  const releaseEl = document.getElementById("detailRelease");
  const genreSmallEl = document.getElementById("detailGenreSmall");

  imgEl.src = movie.img;
  imgEl.alt = movie.title;
  imgEl.onerror = () => {
    imgEl.src = "https://via.placeholder.com/400x600?text=No+Image";
  };

  titleEl.textContent = movie.title;
  grEl.textContent = `${movie.genre} • Rated ${movie.rating}`;
  genreBadge.textContent = movie.genre;
  ratingBadge.textContent = `Rating: ${movie.rating}`;
  langBadge.textContent = movie.language || "Multiple languages";
  formatBadge.textContent = "2D / 3D";

  descEl.textContent = `${movie.title} ek ${movie.genre} film hai, jise aap BookMyShow style demo page par dekh rahe ho. Yahan par aap real project me cast, duration, language, synopsis, director, trailer link wagaira add kar sakte ho. Ye sirf UI demo hai, real ticketing system nahi.`;

  if (durationEl) durationEl.textContent = movie.duration || "2h 30m";
  if (releaseEl) releaseEl.textContent = movie.release || "2024";
  if (genreSmallEl) genreSmallEl.textContent = movie.genre;
}

// DOM
document.addEventListener("DOMContentLoaded", () => {
  // DOM refs
  moviesGrid = document.getElementById("moviesGrid");
  activitiesGrid = document.getElementById("activitiesGrid");
  searchInput = document.getElementById("searchInput");
  searchBtn = document.getElementById("searchBtn");
  slidesContainer = document.getElementById("slides");
  dotsContainer = document.getElementById("dots");
  modal = document.getElementById("modal");
  modalClose = document.getElementById("modalClose");

  // sections
  const moviesSection = document.getElementById("moviesSection");
  const activitiesSection = document.getElementById("activitiesSection");

  // Initial render
  if (moviesGrid) {
    renderMovies();
  }
  if (activitiesGrid) {
    renderActivities();
  }
  if (slidesContainer && dotsContainer) {
    buildCarousel();
    startCarousel();
  }
  initDetailPage();

  // MOVIE CARD CLICKS
  if (moviesGrid) {
    moviesGrid.addEventListener("click", (e) => {
      const card = e.target.closest(".movie-card");
      if (!card) return;

      const movieId = Number(card.dataset.id);
      const movie = movies.find(m => m.id === movieId);
      if (!movie) return;

      if (e.target.matches("[data-role='book']")) {
        alert(`Booking started for: ${movie.title}`);
        return;
      }

      if (e.target.matches("[data-role='trailer']")) {
        if (modal && modalClose) {
          const modalTitle = document.getElementById("modalTitle");
          if (modalTitle) {
            modalTitle.textContent = `${movie.title} — Trailer`;
          }
          modal.classList.add("open");
          modal.setAttribute("aria-hidden", "false");
        }
        return;
      }

      openMovieDetails(movie);
    });
  }

  // QUICK SELECT
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action='select']");
    if (btn) {
      const title = btn.parentElement.querySelector(".q-title")?.textContent || "movie";
      alert(`Selected show: ${title}`);
    }
  });
  // SEARCH
  if (searchBtn) {
    searchBtn.addEventListener("click", doSearch);
  }
  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        doSearch();
      }
    });
  }
  // CAROUSEL DOT CLICK
  if (dotsContainer) {
    dotsContainer.addEventListener("click", (e) => {
      const dot = e.target.closest(".dot");
      if (!dot) return;
      currentSlide = Number(dot.dataset.index);
      updateCarousel();
      startCarousel();
    });
  }
  // MODAL CLOSE
  if (modal && modalClose) {
    modalClose.addEventListener("click", () => {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
      }
    });
  }
  // OFFERS → ONLY DISCOUNTED ACTIVITIES
  const offersLink = document.getElementById("offersLink");
  if (offersLink) {
    offersLink.addEventListener("click", (e) => {
      e.preventDefault();

      // Movies hide, Activities show
      if (moviesSection) moviesSection.style.display = "none";
      if (activitiesSection) activitiesSection.style.display = "block";

      // Sirf offer wali activities render karo
      const offerActivities = activities.filter(a => a.isOffer);
      renderActivities(offerActivities);

      // Scroll to Activities
      if (activitiesSection) {
        activitiesSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

      // Nav active state
      document.querySelectorAll(".bms-nav a").forEach(a => a.classList.remove("active"));
      offersLink.classList.add("active");
    });
  }

  // ⭐ Movies tab → full activities + movies show
  const moviesNavLink = document.querySelector(".bms-nav-left a:first-child");
  if (moviesNavLink) {
    moviesNavLink.addEventListener("click", (e) => {
      e.preventDefault();

      // Movies show
      if (moviesSection) moviesSection.style.display = "block";

      // Activities ko full list wapas dikhao
      if (activitiesSection) activitiesSection.style.display = "block";
      renderActivities(activities);

      // Scroll to movies
      if (moviesSection) {
        moviesSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

      document.querySelectorAll(".bms-nav a").forEach(a => a.classList.remove("active"));
      moviesNavLink.classList.add("active");
    });
  }
});