function updateDates() {
  let now = new Date();

  let days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  let day = days[now.getDay()];
  let months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'November',
    'December',
  ];
  let month = months[now.getMonth()];
  let date = now.getDate();
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let realDate = document.querySelector('#date-today');
  realDate.innerHTML = `${day}, ${date} ${month} ${hours}:${minutes}`;
}

updateDates();

function formateDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  let day = days[date.getDay()];
  return day;
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector('#forecast');
  let forecastHTML = `<div class = "row">`;
  forecast.forEach(function (forecastDay, index) {
    if ((index > 0) & (index < 5)) {
      forecastHTML =
        forecastHTML +
        `
              <div class="col-3">
                <div class="weather-forecast-date">${formateDay(
                  forecastDay.dt
                )}</div>
              
                 <img src="http://openweathermap.org/img/wn/${
                   forecastDay.weather[0].icon
                 }@2x.png" alt="weathericon" width="50"/>
          <div class= "weather-forecasdescriptiont-" id="description-1"> ${
            forecastDay.weather[0].main
          }</div>
          <div class = "weather-forecast-temperatures">  
          <span class="weather-forecast-temperature-max"> ${Math.round(
            forecastDay.temp.max
          )} ºC </span> |
          <span class="weather-forecast-temperature-min"> ${Math.round(
            forecastDay.temp.min
          )} ºC</span>
              </div>
              </div>
 `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
function getForecast(coordinates) {
  let apiKey = 'b9ba0314a93083136d968577c718e31d';
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function showTemperature(response) {
  let citySelected = document.querySelector('#city-forecast');
  citySelected.innerHTML = `Weather forecast for <strong>${response.data.name}, ${response.data.sys.country}</strong>`;
  let temperatureElement = document.querySelector('#current-temp');
  temperatureElement.innerHTML = `${Math.round(response.data.main.temp)} ºC`;
  celciusTemperature = Math.round(response.data.main.temp);
  let weatherDescription = document.querySelector('#description');
  weatherDescription.innerHTML = response.data.weather[0].description;
  let windSpeed = document.querySelector('#speed');
  windSpeed.innerHTML = Math.round(response.data.wind.speed);
  let iconElement = document.querySelector('#icon');
  iconElement.setAttribute(
    'src',
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  let maxTemperature = document.querySelector('#high');
  maxCelciusTemp = Math.round(response.data.main.temp_max);
  maxTemperature.innerHTML = `${maxCelciusTemp} ºC`;
  let minTemperature = document.querySelector('#low');
  minCelciusTemp = Math.round(response.data.main.temp_min);
  minTemperature.innerHTML = `${minCelciusTemp} ºC`;

  getForecast(response.data.coord);
}
function searchCity(city) {
  let apiKey = 'b9ba0314a93083136d968577c718e31d';
  let units = 'metric';
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector('#search-text-input').value;
  searchCity(city);
}

let form = document.querySelector('#search-form');
form.addEventListener('submit', handleSubmit);

searchCity('Porto');

function searchLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = 'b9ba0314a93083136d968577c718e31d';
  let units = 'metric';
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showTemperature);
}
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let button = document.querySelector('button');
button.addEventListener('click', getCurrentLocation);

function changeMetricstoF() {
  let currentTemp = document.querySelector('#current-temp');
  let fahrenheitTemperature = Math.round((celciusTemperature * 9) / 5 + 32);
  currentTemp.innerHTML = `${fahrenheitTemperature} ºF`;
  celcius.checked = false;
  let maxTemperature = document.querySelector('#high');
  let maxFahrenheitTemp = Math.round((maxCelciusTemp * 9) / 5 + 32);
  maxTemperature.innerHTML = `${maxFahrenheitTemp} ºF`;
  let minTemperature = document.querySelector('#low');
  let minFahrenheitTemp = Math.round((minCelciusTemp * 9) / 5 + 32);
  minTemperature.innerHTML = `${minFahrenheitTemp} ºF`;
}

function changeMetricsToC() {
  let currentTemp = document.querySelector('#current-temp');
  currentTemp.innerHTML = `${celciusTemperature} ºC`;
  fahrenheit.checked = false;
  let maxTemperature = document.querySelector('#high');
  maxTemperature.innerHTML = `${maxCelciusTemp} ºC`;
  let minTemperature = document.querySelector('#low');
  minTemperature.innerHTML = `${minCelciusTemp} ºC`;
}

let fahrenheit = document.querySelector('#temp-fahrenheit');
fahrenheit.addEventListener('click', changeMetricstoF);
let celcius = document.querySelector('#temp-celcius');
celcius.addEventListener('click', changeMetricsToC);
let celciusTemperature = null;
let maxCelciusTemp = null;
let minCelciusTemp = null;
