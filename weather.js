document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("searchForm");
    const cityInput = document.getElementById("cityInput");
    const windSpeedElement = document.getElementById("wind-speed");
    const humidityElement = document.getElementById("humidity");
    const uvIndexElement = document.getElementById("uv-index");
  
    let weatherChart;
  
    const API_KEY = "5d29e009d26a5b5135ab65aa6169dc6a";
    const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";
  
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const city = cityInput.value.trim();
      if (!city) return alert("Please enter a city name.");
  
      try {
        const response = await fetch(`${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`);
        if (!response.ok) throw new Error("City not found.");
        const data = await response.json();
        updateWeatherUI(data);
      } catch (error) {
        alert(error.message);
      }
    });
  
    function updateWeatherUI(data) {
      const { list } = data;
  
      windSpeedElement.textContent = `${list[0].wind.speed} m/s`;
      humidityElement.textContent = `${list[0].main.humidity}%`;
  
      const labels = list.slice(0, 8).map((item) => new Date(item.dt * 1000).toLocaleTimeString());
      const temperatures = list.slice(0, 8).map((item) => item.main.temp);
  
      renderChart(labels, temperatures);
    }
  
    function renderChart(labels, dataPoints) {
      const ctx = document.getElementById("weatherChart").getContext("2d");
      if (weatherChart) weatherChart.destroy();
  
      weatherChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Temperature (°C)",
              data: dataPoints,
              borderColor: "#1e90ff",
              backgroundColor: "rgba(30, 144, 255, 0.2)",
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true, labels: { color: "#333" } },
          },
          scales: {
            x: { title: { display: true, text: "Time", color: "#333" } },
            y: { title: { display: true, text: "Temperature (°C)", color: "#333" } },
          },
        },
      });
    }
  });
  