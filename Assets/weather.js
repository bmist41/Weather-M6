const savedLocations = document.getElementById('saved-locations');
const weatherInfo = document.getElementById('weather-info');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const forecastInfo = document.getElementById('forecast-info');
const apiKey = 'fbfabaa44a03e64601217a89aacf9fa6';

const locations = ['New York', 'San Francisco', 'Atlanta', 'Denver'];

function getLatLon(cityName) {
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
    return fetch(geoUrl)
        .then((response) => response.json())
        .then((data) => {
            if (data.length > 0) {
                return { lat: data[0].lat, lon: data[0].lon };
            } else {
                throw new Error(`Coordinates not found for ${cityName}`);
            }
        })
        .catch((error) => {
            console.error("Error fetching coordinates:", error);
            return null;
        });
}

function fetchWeather(lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    return fetch(weatherUrl)
        .then((response) => response.json())
        .then((data) => {
            if (data.list && data.list.length > 0) {
                const weather = data.list[0];
                weatherInfo.innerHTML = `
                    <h2>Weather in ${data.city.name}</h2>
                    <p>Temperature: ${weather.main.temp}°F</p>
                    <p>Weather: ${weather.weather[0].description}</p>
                    <p>Date: ${weather.dt}</p>
                    <p>${weather.icon}</p>
                `;
            } else {
                weatherInfo.innerHTML = `<p>Error: Weather data not found.</p>`;
            }
        })
        .catch((error) => {
            weatherInfo.innerHTML = `<p>Error fetching weather data: ${error.message}</p>`;
        });
}

function displayWeather(cityName) {
    getLatLon(cityName)
        .then((coords) => {
            if (coords) {
                return fetchWeather(coords.lat, coords.lon);
            } else {
                weatherInfo.innerHTML = `<p>Could not find coordinates for ${cityName}.</p>`;
            }
        })
        .catch((error) => {
            weatherInfo.innerHTML = `<p>Error: ${error.message}</p>`;
        });
}

function fetchForecast(lat, lon) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    fetch(forecastUrl)
        .then((response) => response.json())
        .then((data) => {
            if (response.ok) {
                
                const forecastsByDay = {};

                for (let i = 0; i < data.list.length; i++) {
                    const forecast = data.list[i];
                    const date = new Date(forecast.dt * 1000); 
                    const day = date.toDateString(); 

                    if (!forecastsByDay[day]) {
                        forecastsByDay[day] = [];
                    }
                
                    forecastsByDay[day].push(forecast);
                }

                const forecastHtml = Object.keys(forecastsByDay).slice(0, 5).map((day) => {
                    const dailyForecasts = forecastsByDay[day];
                    const highTemp = Math.max(...dailyForecasts.map(f => f.main.temp));
                    const lowTemp = Math.min(...dailyForecasts.map(f => f.main.temp));

                    return `
                        <div class="forecast-cards">
                            <h3>${day}</h3>
                            <p>High: ${highTemp.toFixed(1)}°F</p>
                            <p>Low: ${lowTemp.toFixed(1)}°F</p>
                        </div>
                    `;
                }).join('');

                forecastInfo.innerHTML = `
                    <h2>Five-Day Forecast</h2>
                    <div class="forecast-cards">
                        ${forecastHtml}
                    </div>
                `;
            } else {
                forecastInfo.innerHTML = `<p>Error: ${data.message}</p>`;
            }
        })
        .catch((error) => {
            forecastInfo.innerHTML = `<p>Error fetching forecast data: ${error.message}</p>`;
        });
}

function displayForecast(cityName) {
    getLatLon(cityName)
        .then((coords) => {
            if (coords) {
                fetchForecast(coords.lat, coords.lon);
            } else {
                forecastInfo.innerHTML = `<p>Could not find coordinates for ${cityName}.</p>`;
            }
        })
        .catch((error) => {
            forecastInfo.innerHTML = `<p>Error fetching coordinates: ${error.message}</p>`;
        });
}

function populateSavedLocations() {
    savedLocations.innerHTML = ''; 
    locations.forEach((location) => {
        const li = document.createElement('li');
        li.textContent = location;
        li.addEventListener('click', () => displayWeather(location));
        savedLocations.appendChild(li);
    });
}

searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    const cityName = searchInput.value.trim();
    if (cityName && !locations.includes(cityName)) {
        locations.push(cityName);
        populateSavedLocations();
    }
    displayWeather(cityName);
});

populateSavedLocations();