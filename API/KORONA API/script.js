let chart = null;

// DOM elements
const casesEl = document.getElementById("cases");
const recoveredEl = document.getElementById("recovered");
const deathsEl = document.getElementById("deaths");
const updatedEl = document.getElementById("updated");
const countryInput = document.getElementById("countryInput");
const covidChart = document.getElementById("covidChart");

window.onload = () => {
    fetchData("India");

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("sw.js");
    }
};

function getData() {
    const country = countryInput.value.trim();
    if (country) fetchData(country);
}

function fetchData(country) {
    fetch(`https://disease.sh/v3/covid-19/countries/${country}`)
        .then(res => {
            if (!res.ok) throw new Error("Country not found");
            return res.json();
        })
        .then(data => {
            casesEl.innerText = data.cases.toLocaleString();
            recoveredEl.innerText = data.recovered.toLocaleString();
            deathsEl.innerText = data.deaths.toLocaleString();
            updatedEl.innerText =
                "Last Updated: " + new Date(data.updated).toLocaleString();

            drawChart(data);
        })
        .catch(() => {
            alert("❌ Country not found. Try: India, USA, UK");
        });
}

function drawChart(data) {
    if (chart) chart.destroy();

    chart = new Chart(covidChart, {
        type: "bar",
        data: {
            labels: ["Cases", "Recovered", "Deaths"],
            datasets: [{
                data: [data.cases, data.recovered, data.deaths],
                backgroundColor: ["#f59e0b", "#10b981", "#ef4444"]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function toggleTheme() {
    document.body.classList.toggle("light");
}

// 1. let chart;
//    Chart.js chart store કરવા (old chart delete karva)

//window.onload
//    Page load thata j India data fetch kare
//    Service Worker register kare (PWA support)

//getData()
//    Input ma country lakhine Search click karta call thai

//fetchData(country)
//    disease.sh COVID API thi country data laave
//    Cases, Recovered, Deaths HTML ma show kare
//    Last updated time batave
//    hart draw kare
//    Country wrong hoy to alert aape

//drawChart(d)
//    Old chart destroy kare
//    Bar chart banave (Cases, Recovered, Deaths)

//toggleTheme()
//    Body ma light class add/remove kare
//    Dark / Light mode change //