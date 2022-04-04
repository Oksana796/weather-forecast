//show current time:
let currentTime = new Date();
//let time = document.querySelector("#now-time");
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[currentTime.getDay()];
let hour = currentTime.getHours();
let minutes = currentTime.getMinutes();

if (hour < 10) {
  hour = `0${hour}`;
}
if (minutes < 10) {
  minutes = `0${minutes}`;
}
let date = currentTime.getDate();
//console.log(date);

let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let month = months[currentTime.getMonth()];
let year = currentTime.getFullYear();

let clock = document.querySelector("#now-time");
clock.innerHTML = `${day}, ${date} ${month} ${year}, ${hour}:${minutes}`;

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function showForecast(response) {
  //console.log(response.data.daily);
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
            <div class="forecast-day">${formatDay(forecastDay.dt)}</div>
            <img
              src="http://openweathermap.org/img/wn/${
                forecastDay.weather[0].icon
              }@2x.png"
              alt="forecast-icon"
              id="forecast-icon"
            />
            <div class="forecast-t">
              <span class="forecast-t-max">${Math.round(
                forecastDay.temp.max
              )}° </span>
              <span span class="forecast-t-min">${Math.round(
                forecastDay.temp.min
              )}° </span>
            </div>
          </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;

  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = `991998db0badeb6d622936ac5a6c4c2e`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude={part}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showForecast);
}

function showTemperature(response) {
  let h1 = (document.querySelector("#location").innerHTML = response.data.name);

  let description = response.data.weather[0].description;
  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = `${description}`;

  //let iconUrl = http://openweathermap.org/img/wn/10d@2x.png;
  let icon = response.data.weather[0].icon;
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${icon}@2x.png`
  );
  iconElement.setAttribute("alt", description);

  celsiusT = response.data.main.temp;

  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusT);

  let humidity = response.data.main.humidity;
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = `${humidity}%`;

  let wind = Math.round(response.data.wind.speed);
  let windElement = document.querySelector("#wind");
  windElement.innerHTML = `${wind}km/h`;
  //console.log(response.data);

  getForecast(response.data.coord);
}

function submitCity(event) {
  event.preventDefault();
  let city = document.querySelector("#input-city");
  search(city.value);
}
function search(city) {
  let units = `metric`;
  let apiKey = `991998db0badeb6d622936ac5a6c4c2e`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showTemperature);
}

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  let units = `metric`;
  let apiKey = `991998db0badeb6d622936ac5a6c4c2e`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showTemperature);
}

//GPS
function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

let celsiusT = null;

let currentButton = document.querySelector("#current-butt");
currentButton.addEventListener("click", getCurrentPosition);

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", submitCity);

//C/F
function displayC(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let todayTemp = document.querySelector("#temperature");
  todayTemp.innerHTML = Math.round(celsiusT);
}
let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayC);

function displayF(event) {
  event.preventDefault();
  let fahrenheitT = (celsiusT * 9) / 5 + 32;
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let todayTemp = document.querySelector("#temperature");

  todayTemp.innerHTML = Math.round(fahrenheitT);
}
let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayF);

search("London");
