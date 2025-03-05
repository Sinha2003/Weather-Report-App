//making object of weatherapi
const weatherApi = {
    key: '4eb3703790b356562054106543b748b2',
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather'
}

// Debounce function to limit API calls while typing
function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// Fetch city suggestions from OpenWeather API
function getCitySuggestions(query) {
    if (query.length < 3) {
        document.getElementById('city-dropdown').style.display = 'none';
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/find?q=${query}&appid=${weatherApi.key}`)
        .then(response => response.json())
        .then(data => {
            let dropdown = document.getElementById('city-dropdown');
            dropdown.innerHTML = ''; // Clear previous results

            // Show results in the dropdown
            data.list.forEach(city => {
                let div = document.createElement('div');
                div.textContent = `${city.name}, ${city.sys.country}`;
                div.onclick = () => selectCity(city.name); // Select city on click
                dropdown.appendChild(div);
            });

            dropdown.style.display = data.list.length ? 'block' : 'none';
        });
}

// Select city from the dropdown
function selectCity(city) {
    document.getElementById('input-box').value = city;
    document.getElementById('city-dropdown').style.display = 'none';
    getWeatherReport(city); // Fetch weather report for the selected city
}

// Event listener for input field to get suggestions
let searchInputBox = document.getElementById('input-box');
searchInputBox.addEventListener('input', debounce((event) => {
    getCitySuggestions(searchInputBox.value);
}, 300));


// Get weather report
function getWeatherReport(city) {
    fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)  // fetch method fetching the data from base url ...metric is used for unit in Celsius
        .then(weather => {   //weather is from api
            return weather.json(); // return data from api in JSON
        }).then(showWeaterReport);  // calling showweatherreport function
}

// Show weather report
function showWeaterReport(weather) {
    let city_code = weather.cod;
    if (city_code === '400') {
        swal("Empty Input", "Please enter any city", "error");
        reset();
    } else if (city_code === '404') {
        swal("Bad Input", "Entered city didn't match", "warning");
        reset();
    } else {
        let op = document.getElementById('weather-body');
        op.style.display = 'block';
        let todayDate = new Date();
        let parent = document.getElementById('parent');
        let weather_body = document.getElementById('weather-body');
        weather_body.innerHTML =
            `
        <div class="location-deatils">
            <div class="city" id="city">${weather.name}, ${weather.sys.country}</div>
            <div class="date" id="date"> ${dateManage(todayDate)}</div>
        </div>
        <div class="weather-status">
            <div class="temp" id="temp">${Math.round(weather.main.temp)}&deg;C </div>
            <div class="weather" id="weather"> ${weather.weather[0].main} <i class="${getIconClass(weather.weather[0].main)}"></i>  </div>
            <div class="min-max" id="min-max">${Math.floor(weather.main.temp_min)}&deg;C (min) / ${Math.ceil(weather.main.temp_max)}&deg;C (max) </div>
            <div id="updated_on">Updated as of ${getTime(todayDate)}</div>
        </div>
        <hr>
        <div class="day-details">
            <div class="basic">Feels like ${weather.main.feels_like}&deg;C | Humidity ${weather.main.humidity}%  <br> Pressure ${weather.main.pressure} mb | Wind ${weather.wind.speed} KMPH</div>
        </div>
        `;
        parent.append(weather_body);
        changeBg(weather.weather[0].main);
        reset();
    }
}

// Function for the last update current time 
function getTime(todayDate) {
    let hour = addZero(todayDate.getHours());
    let minute = addZero(todayDate.getMinutes());
    return `${hour}:${minute}`;
}

// Date management for current date
function dateManage(dateArg) {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let year = dateArg.getFullYear();
    let month = months[dateArg.getMonth()];
    let date = dateArg.getDate();
    let day = days[dateArg.getDay()];
    return `${date} ${month} (${day}) , ${year}`;
}

// Dynamic background change according to weather status
function changeBg(status) {
    if (status === 'Clouds') {
        document.body.style.backgroundImage = 'url(clouds.jpg)';
    } else if (status === 'Rain') {
        document.body.style.backgroundImage = 'url(rainy.jpg)';
    } else if (status === 'Clear') {
        document.body.style.backgroundImage = 'url(clear.jpg)';
    } else if (status === 'Snow') {
        document.body.style.backgroundImage = 'url(snow.jpg)';
    } else if (status === 'Sunny') {
        document.body.style.backgroundImage = 'url(sunny.jpg)';
    } else if (status === 'Thunderstorm') {
        document.body.style.backgroundImage = 'url(thunderstrom.jpg)';
    } else if (status === 'Drizzle') {
        document.body.style.backgroundImage = 'url(drizzle.jpg)';
    } else if (status === 'Mist' || status === 'Haze' || status === 'Fog') {
        document.body.style.backgroundImage = 'url(mist.jpg)';
    } else {
        document.body.style.backgroundImage = 'url(bg.jpg)';
    }
}

// Function to get the icon class based on weather status
function getIconClass(classarg) {
    if (classarg === 'Rain') {
        return 'fas fa-cloud-showers-heavy';
    } else if (classarg === 'Clouds') {
        return 'fas fa-cloud';
    } else if (classarg === 'Clear') {
        return 'fas fa-cloud-sun';
    } else if (classarg === 'Snow') {
        return 'fas fa-snowman';
    } else if (classarg === 'Sunny') {
        return 'fas fa-sun';
    } else if (classarg === 'Mist') {
        return 'fas fa-smog';
    } else if (classarg === 'Thunderstorm' || classarg === 'Drizzle') {
        return 'fas fa-thunderstorm';
    } else {
        return 'fas fa-cloud-sun';
    }
}

// Reset input field
function reset() {
    let input = document.getElementById('input-box');
    input.value = "";
}

// Add zero to hour or minute if they are less than 10
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
