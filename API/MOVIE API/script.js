function getMovie(){
  const name = document.getElementById("search").value;
  const apiKey = "YOUR_API_KEY";
  
  fetch(`https://www.omdbapi.com/?s=${name}&apikey=${apiKey}`)
  .then(res => res.json())
  .then(data => {
    const movies = document.getElementById("movies");
    movies.innerHTML = "";

    data.Search.forEach(movie => {
      movies.innerHTML += `
        <div class="card">
          <img src="${movie.Poster}">
          <h4>${movie.Title}</h4>
          <p>${movie.Year}</p>
        </div>
      `;
    });
  });
}