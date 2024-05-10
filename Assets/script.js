const apiKey = 'fbfabaa44a03e64601217a89aacf9fa6';
const apiUrl = 'https://api.openweathermap.org/data/2.5';

const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeatherSection = document.getElementById('current-weather');
const forecastSection = document.getElementById('forecast');
const searchHistoryList = document.querySelector('#search-history ul');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    }
});

function getWeatherData(city) {
    fetch(`${apiUrl}/weather?q=${city}&appid=${apiKey}&units=imperial`)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            addToSearchHistory(city);
        })
        .catch(error => console.error('Error fetching current weather:', error));
    
    fetch(`${apiUrl}/forecast?q=${city}&appid=${apiKey}&units=imperial`)
        .then(response => response.json())
        .then(data => displayForecast(data))
        .catch(error => console.error('Error fetching forecast:', error));
}

function displayCurrentWeather(data) {
    currentWeatherSection.innerHTML = `
        <h2>${data.name}</h2>
        <p>Date: ${new Date().toLocaleDateString()}</p>
        <p>Temperature: ${data.main.temp}F</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} mph</p>
    `;
}

function displayForecast(data) {
    forecastSection.innerHTML = ''; 
    for (let i = 0; i < 5; i++) { 
        const forecast = data.list[i];
        const iconCode = forecast.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
        const date = new Date(forecast.dt * 1000).toLocaleDateString();
        const temperature = forecast.main.temp;
        const humidity = forecast.main.humidity;
        const windSpeed = forecast.wind.speed;
        
        forecastSection.innerHTML += `
            <div class="forecast-card">
                <h3>${date}</h3>
                <img src="${iconUrl}" alt="Weather Icon">
                <p>Temperature: ${temperature}°F</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind Speed: ${windSpeed} mph</p>
            </div>
        `;
    }
}

function addToSearchHistory(city) {
    const listItem = document.createElement('li');
    listItem.textContent = city;
    listItem.addEventListener('click', () => {
        cityInput.value = city;
        getWeatherData(city);
    });
    searchHistoryList.prepend(listItem);
}
