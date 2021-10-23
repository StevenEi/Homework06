// openweather api key = b3ef0740db1c5eb0b6b4da627c46cbc3       

// plug into the One Call API because it has more data and the 16 day forecast

function currentWeather() {
    var userInput = $("#user-search").val()
    var weatherURL1 = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&units=imperial&appid=b3ef0740db1c5eb0b6b4da627c46cbc3`
    fetch(weatherURL1)
        .then(function (response) {
            if (response.status !== 200) {
                alert("Error, city not found")
            }
            else {
                return response.json()
            }
        })
        .then(function (data) {
            var lat = data.coord.lat
            var lon = data.coord.lon
            console.log(data)
            showWeatherInitial(data)
            extendedWeather(lat, lon)
        })
}

function showWeatherInitial(data) {
   // $("#search-history").append($(data.name).attr(type, "button"))

    $("#daily-weather").text("Current Weather Information")
    $("#city-name").text("City: " + data.name)
    $("#weather-condition").text("Conditions: " + data.weather[0].description)
    $("#current-temp").text("Temperature: " + data.main.temp + " degrees fahrenheit")
    $("#current-humid").text("Humidity: " + data.main.humidity + "%")
    $("#current-wind").text("Wind Speed: " + data.wind.speed + " mph")
}

function extendedWeather(lat, lon) {
    var weatherURL2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely&exclude=hourly&appid=b3ef0740db1c5eb0b6b4da627c46cbc3`
    fetch(weatherURL2)
        .then(function (response) {
            if (response.status !== 200) {
                alert("Error, city name not found")
            }
            else {
                return response.json()
            }
        })
        .then(function (data) {
            console.log(data)
            showWeatherExtended(data)
        });
}

function showWeatherExtended(data) {
    $("#current-uv").text("UV Index: " + data.current.uvi)
    if (data.current.uvi > 8) {
        $("#current-uv").css("color", "red")
    }
    else if (data.current.uvi >= 5.01) {
        $("#current-uv").css("color", "orange")
    }
    else {
        $("#current-uv").css("color", "green")
    }
}

$("#search-button").on("click", function() {
    currentWeather()
});

function forecastCard(forecast, timezone) {
 // variables for data from api
 var unixTs = forecast.dt;
 var iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
 var iconDescription = forecast.weather[0].description;
 var tempF = forecast.temp.day;
 var humidity = forecast;
 var windMph = forecast.wind_speed;

 // Create elements for a card
 var col = document.createElement('div');
 var card = document.createElement('div');
 var cardBody = document.createElement('div');
 var cardTitle = document.createElement('h5');
 var weatherIcon = document.createElement('img');
 var tempEl = document.createElement('p');
 var windEl = document.createElement('p');
 var humidityEl = document.createElement('p');
 var forecastContainer = document.getElementById("#weather-forecast");

 col.append(card);
 card.append(cardBody);
 cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

 col.setAttribute('class', 'col-md');
 col.classList.add('five-day');
 card.setAttribute('class','card text-white ');
 cardBody.setAttribute('class', 'card-body p-2');
 cardTitle.setAttribute('class','card-text');
 tempEl.setAttribute('class','card-text');
 humidityEl.setAttribute('class','card-text');
 windEl.setAttribute('class', 'card-text');


 cardTitle.textContent = dayjs.unix(unixTs).tz(timezone).format('M/D/YYYY');
 tempEl.textContent=`Temp: ${tempF} F`
 humidityEl.textContent=`Humidity: ${humidity}` 
 windEl.textContent=`Wind Speed: ${windMph}`
 weatherIcon.setAttribute('src', iconURL)
 forecastContainer.append(col)
}

function weatherForecast(daily, timezone) {
    var startDate = dayjs().tz(timezone).add(1, 'day').startOf('day').unix();
    var endDate = dayjs().tz(timezone).add(6, 'day').startOf('day').unix();
    var heading = document.createElement("h3")
    heading.setAttribute("class", "col-12")
    heading.textContent = "Five day forecast"
    forecastContainer.innerHTML = " "
    forecastContainer.append(heading)
    for (let i = 0; i < daily.length; i++) {
    if (daily[i].dt >= startDate && daily[i].dt < endDate) {
        forecastCard(daily, timezone);
      }
   }
}

// need to declare startDate and endDate variables (similar to what Arm slacked)
// connect dayjs API (cdn) to convert unix to day


