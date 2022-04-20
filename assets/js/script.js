var searchBtn = document.querySelector('#searchBtn');
var searchInputEl = document.querySelector('#search-box');
var searchInput = searchInputEl.value;
var displaySearch = document.querySelector('#displaySearch');
var searchHistory = document.querySelector('#searchHistory');
let searchHistoryBtns = [];

//search
var searchCall = function (event) {
    event.preventDefault();
    searchHistoryFunction();

    var searchInputEl = document.querySelector('#search-box');
    var searchInput = searchInputEl.value;
    currentWeatherAPI(searchInput);

    document.querySelector('#displaySearch').innerHTML = '';
}

//pulls searched city from api
var currentWeatherAPI = function (search) {
    console.log("Searched City: ", search)

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${search}&units=imperial&appid=7dbc84f7c262272b1b3286380cc36962`)
        .then(response => response.json())
        .then(function (data) {
            oneCall(data.coord.lat, data.coord.lon, search)
        });
};

var oneCall = function (lat, lon, city) {
    var oneCallKey = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=7dbc84f7c262272b1b3286380cc36962`;
    fetch(oneCallKey)
        .then(response => response.json())
        .then(function (data) {
            document.querySelector('#displaySearch').innerHTML = '';

            var displaySearchEl = document.createElement("div");
            var displaySearchAEl = document.createElement("a");
            var displaySearchH2El = document.createElement("h2");

            displaySearchH2El.setAttribute("id", "displaySearchH2");
            displaySearchH2El.textContent = city + " (" + moment().format('MMMM Do YYYY') + ")";

            var tempEl = document.createElement("div");

            tempEl.setAttribute("id", "temp");
            tempEl.setAttribute("class", "displayText");
            tempEl.textContent = "Temp: " + data.current.temp + "°F";

            var windEl = document.createElement("div");

            windEl.setAttribute("id", "wind");
            windEl.setAttribute("class", "displayText");
            windEl.textContent = "Wind: " + data.current.wind_speed + " MPH";

            var humidityEl = document.createElement("div");

            humidityEl.setAttribute("id", "humidity");
            humidityEl.setAttribute("class", "displayText");
            humidityEl.textContent = "Humidity: " + data.current.humidity + "%";

            var uvEl = document.createElement("div");

            uvEl.setAttribute("id", "UV");
            uvEl.setAttribute("class", "displayText");
            uvEl.textContent = "UV Index: " + data.current.uvi;

            var displaySearchImgEl = document.createElement("img");

            displaySearchImgEl.setAttribute("class", "Symbol");

            displaySearch.append(displaySearchAEl);
            displaySearchAEl.append(displaySearchEl);
            humidityEl.append(uvEl);
            windEl.append(humidityEl);
            tempEl.append(windEl);
            displaySearchH2El.append(tempEl);
            displaySearchEl.append(displaySearchH2El);
            displaySearchEl.append(displaySearchImgEl);

            document.querySelector('#fiveDay').innerHTML = '';
            var fiveDay = document.querySelector("#fiveDay")

            for (var i=1; i<6; i++){
                
                var dayEl = document.createElement("div");
                dayEl.setAttribute("id", "day");
             
                var dateEl = document.createElement("p");
                dateEl.setAttribute("id", "date");
                dateEl.setAttribute("class", "fiveDayText");

                dateEl.textContent = "Date: " + moment().add(i, 'days').format('MM/DD/YYYY');

                dayEl.append(dateEl);
                fiveDay.append(dayEl);

                var symbolEl = document.createElement("img");
                symbolEl.setAttribute("id", "symbol");
                symbolEl.setAttribute("class", "fiveDayText");
                var symbolUrl = "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png";
                symbolEl.setAttribute("src", symbolUrl);
                dateEl.append(symbolEl);

                var tempEl = document.createElement("div");
                tempEl.setAttribute("id", "temp5");
                tempEl.setAttribute("class", "displayText");
                tempEl.textContent = "Temp: " + data.daily[i].temp.day + "°F";
                dateEl.append(tempEl);
    
                var windEl = document.createElement("div");
                windEl.setAttribute("id", "wind5");
                windEl.setAttribute("class", "displayText");
                windEl.textContent = "Wind: " + data.daily[i].wind_speed + " MPH";
                dateEl.append(windEl);
    
                var humidityEl = document.createElement("div");
                humidityEl.setAttribute("id", "humidity5");
                humidityEl.setAttribute("class", "displayText");
                humidityEl.textContent = "Humidity: " + data.daily[i].humidity + "%";
                dateEl.append(humidityEl);
    
                var uvEl = document.createElement("div");
                uvEl.setAttribute("id", "UV5");
                uvEl.setAttribute("class", "displayText");
                var severity = data.daily[i].uvi;
                if (severity < 3) {
                    uvEl.setAttribute("class", "UVfavorable");
                }
                if (severity > 2 && severity < 6) {
                    uvEl.setAttribute("class", "UVmoderate");
                }
                if (severity > 5) {
                    uvEl.setAttribute("class", "UVsevere");
                }

                uvEl.textContent = "UV Index: " + data.daily[i].uvi;
                dateEl.append(uvEl);
            }
        })
}

//search history
var searchHistoryFunction = function () {
    document.querySelector('#searchHistory').innerHTML = '';
    if (searchHistoryBtns.length >= 7) {
        //removes and replaces old search buttons
        searchHistoryBtns.shift();
    }
    searchHistoryBtns.push(searchInputEl.value);
    for (var i = 0; i < searchHistoryBtns.length; i++) {
        localStorage.setItem("historyItem" + i, searchHistoryBtns[i]);
        localStorage.getItem("historyItem" + i);
        let btn = document.createElement("button");
        btn.textContent = searchHistoryBtns[i];
        btn.setAttribute("value", searchHistoryBtns[i]);
        searchHistory.append(btn);

        btn.addEventListener("click", function () {
            document.querySelector('#displaySearch').innerHTML = '';
            var historySearchTerm = this.value;
            console.log("HistorySearchTerm", historySearchTerm)
            currentWeatherAPI(historySearchTerm);
        });
    }
};

searchBtn.addEventListener("click", searchCall);
//Allows user to hit enter instead of clicking button to submit input
$("#search-box").keyup(function (event) {
    if (event.keyCode === 13) {
        $("#search-btn").click();
    }
});