const apiKey = "7a6411d4e574db09020956154e13a14b";

// Button: Get weather by city name
document.getElementById("getWeatherBtn").addEventListener("click", function () {
  const city = document.getElementById("cityInput").value.trim();
  if (city === "") {
    alert("Please enter a city name.");
    return;
  }

  getCurrentWeather(city);
  get3DayForecast(city);
});

// Button: Get weather using geolocation
document.getElementById("getLocationWeatherBtn").addEventListener("click", function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    alert("Geolocation is not supported by this browser.");
  }

  function success(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        const weatherInfo = `
          <h2>${data.name}</h2>
          <p><strong>🌡 Temp:</strong> ${data.main.temp} °F</p>
          <p><strong>🌥 Description:</strong> ${data.weather[0].description}</p>
          <p><strong>💨 Wind:</strong> ${data.wind.speed} mph</p>
          <img src="${iconUrl}" alt="Weather Icon">
        `;

        document.getElementById("weatherResult").innerHTML = weatherInfo + "<div id='forecastContainer'></div>";

        // Call forecast using coordinates
        getForecastByCoords(lat, lon);
      })
      .catch(() => {
        document.getElementById("weatherResult").innerHTML = `<p>Unable to retrieve weather.</p>`;
      });
  }

  function error() {
    alert("Unable to retrieve your location.");
  }
});

// Get current weather by city name
function getCurrentWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("City not found.");
      }
      return response.json();
    })
    .then(data => {
      const iconCode = data.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

      const weatherInfo = `
        <h2>${data.name}</h2>
        <p><strong>🌡 Temp:</strong> ${data.main.temp} °F</p>
        <p><strong>🌥 Description:</strong> ${data.weather[0].description}</p>
        <p><strong>💨 Wind:</strong> ${data.wind.speed} mph</p>
        <img src="${iconUrl}" alt="Weather Icon">
      `;

      document.getElementById("weatherResult").innerHTML = weatherInfo;
    })
    .catch(error => {
      document.getElementById("weatherResult").innerHTML = `<p>${error.message}</p>`;
    });
}

// Get 3-day forecast by city name
function get3DayForecast(city) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

  fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
      const forecastList = data.list;
      const dailyForecasts = forecastList.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 3);

      let forecastHTML = `<h3>3-Day Forecast</h3>`;
      dailyForecasts.forEach(item => {
        const date = new Date(item.dt_txt).toDateString();
        const temp = item.main.temp;
        const desc = item.weather[0].description;
        const icon = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        forecastHTML += `
          <div class="forecast-day">
            <p><strong>${date}</strong></p>
            <img src="${iconUrl}" alt="${desc}">
            <p>${desc}, ${temp} °F</p>
          </div>
        `;
      });

      document.getElementById("weatherResult").innerHTML += `<div id="forecastContainer">${forecastHTML}</div>`;
    })
    .catch(() => {
      document.getElementById("weatherResult").innerHTML += `<p>Unable to load forecast.</p>`;
    });
}

// Get 3-day forecast by coordinates
function getForecastByCoords(lat, lon) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

  fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
      const forecastList = data.list;
      const dailyForecasts = forecastList.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 3);

      let forecastHTML = `<h3>3-Day Forecast</h3>`;
      dailyForecasts.forEach(item => {
        const date = new Date(item.dt_txt).toDateString();
        const temp = item.main.temp;
        const desc = item.weather[0].description;
        const icon = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        forecastHTML += `
          <div class="forecast-day">
            <p><strong>${date}</strong></p>
            <img src="${iconUrl}" alt="${desc}">
            <p>${desc}, ${temp} °F</p>
          </div>
        `;
      });

      document.getElementById("forecastContainer").innerHTML = forecastHTML;
    })
    .catch(() => {
      document.getElementById("forecastContainer").innerHTML = `<p>Unable to load forecast.</p>`;
    });
}