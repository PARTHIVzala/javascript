const API_KEY = '14951c93f3d11e8ac8bed96dd90e8bc7';

function fetchWeather() {
  const city = document.getElementById('cityInput').value.trim();
  const tbody = document.getElementById('weather-data');

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    .then(response => response.json())
    .then(data => {
      if (data.cod !== 200) {
        tbody.innerHTML = `<tr><td colspan="5">City not found ❌</td></tr>`;
        return;
      }

      const weatherRow = `
        <tr>
          <td>${data.name}, ${data.sys.country}</td>
          <td>${data.main.temp} °C</td>
          <td>${data.main.humidity}%</td>
          <td>${data.wind.speed} m/s</td>
          <td>${data.weather[0].main} (${data.weather[0].description})</td>
        </tr>
      `;

      tbody.innerHTML = weatherRow;
    })
    .catch(error => {
      tbody.innerHTML = `<tr><td colspan="5">Error fetching data ⚠️</td></tr>`;
      console.log(error);
    });
}

window.onload = fetchWeather;