const API_KEY = "YOUR_API_KEY";

function toggleTheme(){
  document.body.classList.toggle("dark");
}

async function getWeather(){
  const city = document.getElementById("city").value;
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );
  const data = await res.json();
  showCurrent(data);
  getForecast(data.coord.lat, data.coord.lon);
}

function getLocationWeather(){
  navigator.geolocation.getCurrentPosition(pos=>{
    const {latitude, longitude} = pos.coords;
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    )
    .then(r=>r.json())
    .then(showCurrent);

    getForecast(latitude, longitude);
  });
}

function showCurrent(d){
  current.innerHTML = `
    <h3>${d.name}</h3>
    <h1>${Math.round(d.main.temp)}°C</h1>
    <p>${d.weather[0].main}</p>
  `;
}

async function getForecast(lat, lon){
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  const data = await res.json();
  forecast.innerHTML = "";
  data.list.slice(0,7).forEach(d=>{
    forecast.innerHTML += `
      <div class="day">
        <p>${Math.round(d.main.temp)}°</p>
        <img src="https://openweathermap.org/img/wn/${d.weather[0].icon}.png">
      </div>
    `;
  });
}
