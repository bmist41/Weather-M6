const savedLocations = document.getElementById('saved-locations');
const weatherInfo = document.getElementById('weather-info');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const forcastInfo = document.getElementById('forcast-info')
const apiKey = 'fbfabaa44a03e64601217a89aacf9fa6'

const locations = ['New York', 'San Francisco', 'Atlanta', 'Denver'];

async function getLatLon(cityName) {
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
    try {
        const response = await fetch(geoUrl);
        const data = await response.json();
        if (data.length > 0) {
            return { lat: data[0].lat, lon: data[0].lon };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching coordinates:", error);
        return null;
    }
}
    
async function fetchWeather(lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    try {
        const response = await fetch(weatherUrl);
        const data = await response.json();
        if (response.ok) {
            const weather = data.list[0]; 
            weatherInfo.innerHTML = `
                <h2>Weather in ${data.city.name}</h2>
                <p>Temperature: ${weather.main.temp}°F</p>
                <p>Weather: ${weather.weather[0].description}</p>
            `;
        } else {
            weatherInfo.innerHTML = `<p>Error: ${data.message}</p>`;
        }
    } catch (error) {
        weatherInfo.innerHTML = `<p>Error fetching weather data.</p>`;
    }
}

async function fetchForcast(lat, lon){
    const forcastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    try {
        const forcastResponse = await fetch(forcastURL)
        const data = await forcastResponse.json();
        if (response.ok){
            const forcast = data.list[0];
            forcastInfo.innerHTML = `
                <h2> Five Day Forcast in ${data.city.name} </h2>
                <p> ${forcast.main.temp} </p>
            `
        } else {
                forcastInfo.innerHTML = `<p>Error: ${data.message}</p>`;
        }
    } catch (error) {
        forcastInfo.innerHTML = `<p>Error Fetching Forcast data</p>`
    }
}


async function displayWeather(cityName) {
    const coords = await getLatLon(cityName);
    if (coords) {
        await fetchWeather(coords.lat, coords.lon);
    } else {
        weatherInfo.innerHTML = `<p>Could not find coordinates for ${cityName}.</p>`;
    }
}

function populateSavedLocations() {
    savedLocations.innerHTML = ''; // Clear existing list
    locations.forEach(location => {
        const li = document.createElement('li');
        li.textContent = location;
        li.addEventListener('click', () => displayWeather(location));
        savedLocations.appendChild(li);
    });
}

searchButton.addEventListener('click', async () => {
    const cityName = searchInput.value.trim();
    if (cityName && !locations.includes(cityName)) {
        locations.push(cityName); 
        populateSavedLocations();
    }
    await displayWeather(cityName);
});

populateSavedLocations(); 

        
