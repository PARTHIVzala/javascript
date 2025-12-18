let chart;

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
            if (!res.ok) throw Error();
            return res.json();
        })
        .then(data => {
            cases.innerText = data.cases.toLocaleString();
            recovered.innerText = data.recovered.toLocaleString();
            deaths.innerText = data.deaths.toLocaleString();
            updated.innerText = "Last Updated: " +
                new Date(data.updated).toLocaleString();
            drawChart(data);
        })
        .catch(() => alert("Country not found"));
}

function drawChart(d) {
    if (chart) chart.destroy();

    chart = new Chart(covidChart, {
        type: "bar",
        data: {
            labels: ["Cases", "Recovered", "Deaths"],
            datasets: [{
                data: [d.cases, d.recovered, d.deaths],
                backgroundColor: ["#f59e0b", "#10b981", "#ef4444"]
            }]
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