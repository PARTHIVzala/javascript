const API_KEY = ": http://www.omdbapi.com/?i=tt3896198&apikey=365a1346";
let page = 1;
let currentQuery = "";

function toggleTheme(){
  document.body.classList.toggle("light");
}

async function searchMovie(){
  currentQuery = searchInput.value;
  page = 1;
  loadMovies();
}

async function loadMovies(){
  movieList.innerHTML = "Loading...";
  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&s=${currentQuery}&page=${page}`
  );
  const data = await res.json();

  movieList.innerHTML = "";
  data.Search.forEach(m=>{
    movieList.innerHTML += `
      <div class="movie" onclick="openDetails('${m.imdbID}')">
        <img src="${m.Poster}">
        <h3>${m.Title}</h3>
      </div>
    `;
  });
  pageNo.innerText = page;
}

function openDetails(id){
  location.href = `details.html?id=${id}`;
}

function nextPage(){ page++; loadMovies(); }
function prevPage(){ if(page>1){page--; loadMovies();} }
