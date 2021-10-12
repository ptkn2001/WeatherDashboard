const key = "b0c43b1ed43591d261dfd26cabb18859"
const mainElement = document.querySelector('#main');

//weatherType = sunny, cloudy, windy, snowy, rainy, default 
const rainOrShine = (typeOfWeather) => {
    let weatherType = 'default';

    switch (typeOfWeather) {
        case 'Clouds':
            weatherType = 'cloudy';
            break;
        case 'Clear':
            weatherType = 'sunny';
            break;
        case 'Rain':
            weatherType = 'rainny';
            break;
        case 'Snow':
            weatherType = 'snowy';
            break;
        case 'Wind':
            weatherType = 'windy';
            break;
        default:
            break;
    }

    return weatherType;
}

//convert degree Kelvin to Fahrenheit
const kToF = (degreeK) => {
    const degreeF = (degreeK - 273.15) * 9 / 5 + 32;
    return Math.round(degreeF * 100) / 100
}

//returns the data saved in the local storage
const getHistory = () => {
    json_data = JSON.parse(localStorage.getItem("cities"));
    if (!json_data) { return };
    return Object.keys(json_data).map((key) => json_data[key]);
}

//save history data to local storage
const saveHistory = (history) => {
    localStorage.setItem("cities", JSON.stringify(history));
}

//get weather forcast data from API
const getWeatherDataForCity = async(city) => {
    const requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}`

    const response = await fetch(requestUrl, {
        method: 'GET',
    });

    let responseData;

    if (response.ok) {

        await response.json().then((data) => {
            responseData = data;
        });

    } else {
        alert('Unable to get data from Weather API');
    }

    if (!responseData) { return };

    return {
        city_name: city,
        temperature: kToF(responseData.list[0].main.temp),
        type: responseData.list[0].weather[0].main,
        humidity: responseData.list[0].main.humidity,
        wind: responseData.list[0].wind.speed,
        forcast: [{
                day: moment(responseData.list[0].dt_txt).format('MM/DD/YYYY'),
                type: responseData.list[0].weather[0].main,
                temperature: kToF(responseData.list[0].main.temp),
                wind: responseData.list[0].wind.speed,
                humidity: responseData.list[0].main.humidity,
            },
            {
                day: moment(responseData.list[8].dt_txt).format('MM/DD/YYYY'),
                type: responseData.list[8].weather[0].main,
                temperature: kToF(responseData.list[8].main.temp),
                wind: responseData.list[8].wind.speed,
                humidity: responseData.list[8].main.humidity,
            },
            {
                day: moment(responseData.list[16].dt_txt).format('MM/DD/YYYY'),
                type: responseData.list[16].weather[0].main,
                temperature: kToF(responseData.list[16].main.temp),
                wind: responseData.list[16].wind.speed,
                humidity: responseData.list[16].main.humidity,
            },
            {
                day: moment(responseData.list[24].dt_txt).format('MM/DD/YYYY'),
                type: responseData.list[24].weather[0].main,
                temperature: kToF(responseData.list[24].main.temp),
                wind: responseData.list[24].wind.speed,
                humidity: responseData.list[24].main.humidity,
            },
            {
                day: moment(responseData.list[32].dt_txt).format('MM/DD/YYYY'),
                type: responseData.list[32].weather[0].main,
                temperature: kToF(responseData.list[32].main.temp),
                wind: responseData.list[32].wind.speed,
                humidity: responseData.list[32].main.humidity,
            },
        ]
    }
}

//generate the history elements
const generateHistoryItem = (city, isCurrent) => {
    let backgroundColor;

    if (isCurrent) {
        backgroundColor = 'bg-primary';
    } else {
        backgroundColor = 'bg-secondary';
    }

    return `<li class="list-group-item history-city ${backgroundColor} d-flex justify-content-center text-light">${city}</li>`;
}

//generate the current day weather info
const generateCurrentInfo = (cityData) => {
    return `
        <h2 class="current-date display-5" id="current_date">${cityData.city_name} ${moment().format('(MM/D/YYYY)')}</h2>
        <img class="card-img-top" src="img/${rainOrShine(cityData.type)}.jpg" alt="Weather icon" style="width: 40px; margin-left: 20px;" >
        <p id="current_temp"><span style="font-weight: 600;">Temp:</span> ${cityData.temperature} &deg; F</p>
        <p id="current_humidity"><span style="font-weight: 600;">Humidity:</span> ${cityData.humidity} %</p>
        <p id="current_wind"><span style="font-weight: 600;">Wind:</span> ${cityData.wind} MPH</p> 
    `
}

//generate 5 days forcast elements
const generateForcastDay = (forcastData) => {
    return `
    <div class="card bg-primary m-2">
        <h3 class="card-title text-light p-2">${forcastData.day}</h3>
        <img class="card-img-top" src="img/${rainOrShine(forcastData.type)}.jpg" alt="Weather icon" style="width: 40px; margin-left: 20px;" >
        <div class="card-body">
            <p class="card-text text-light"><span style="font-weight: 600;">Temp:</span> ${forcastData.temperature} &deg; F</p>
            <p class="card-text text-light"><span style="font-weight: 600;">Wind:</span> ${forcastData.wind} MPH</p>
            <p class="card-text text-light"><span style="font-weight: 600;">Humidity:</span> ${forcastData.humidity} %</p>
        </div>
    </div>
    `
}

//generate the main section elements
const generateMainSection = (historyData, currentData, forcastData) => {
    return `
<div class="row">
    <div class="container col-3 pl-2">
        <div class="container d-flex row search-container p-3 m-0 justify-content-center" style="border-bottom: 2px solid;">
            <input type="text" class="search-input p-2" id="search_input" placeholder="Search By City">
            <button class="search-button bg-primary text-light" id="search_button">Search</button>
        </div>
        <div class="container history-container p-3 m-0 col">
            <ul class="list-group list-group-flush" id="search_history_list">
            ${historyData}
            </ul>
        </div>
    </div>

    <div class="container col-9">
        <div class="container current-container m-2" style="border: solid 1px; width:auto">
        ${currentData}
        </div>
        <h3 class="p-3">Five Days Forcast:</h3>
        <div class="container container-forcast card-group row">
        ${forcastData}
        </div>
    </div>

</div>
`
}

//handle the search button click
const searchCityHandler = (event) => {
    event.preventDefault();
    const city = document.querySelector('#search_input').value;
    loadMainData(city);
}

//handle when user clicked on one of the cities in the history list
const loadNewCityHandler = (event) => {
    event.preventDefault();
    const city = event.currentTarget.innerHTML;
    if (city) {
        loadMainData(city);
    }
}

//processing the data for the main section
const loadMainData = async(city) => {
    let history = getHistory();

    if (city) {
        if (!history) {
            history = [];
            history.push(city);
        } else {
            history = history.filter(item => item !== city);
            history.unshift(city);
        }
    } else {
        if (!history) {
            history = [];
            history.push('Seattle');
        };
    }

    saveHistory(history);

    let cityData = await getWeatherDataForCity(history[0]);

    if (!cityData) {
        alert('Sorry, we are experiencing difficulty getting Weather data.  Please try again later.')
        return;
    }

    let currentData = generateCurrentInfo(cityData)

    let historyData = [];

    for (i = 0; i < history.length; i++) {
        if (i == 0) {
            historyData.push(generateHistoryItem(history[i], true));
        } else {
            historyData.push(generateHistoryItem(history[i], false));
        }
    }

    const forcast = cityData.forcast;

    let forcastData = [];

    for (i = 0; i < forcast.length; i++) {
        forcastData.push(generateForcastDay(forcast[i]));
    }

    const mainData = generateMainSection(historyData.join(''), currentData, forcastData.join(''));

    mainElement.innerHTML = mainData;

    const searchIconElement = document.querySelector('#search_button');
    searchIconElement.addEventListener('click', searchCityHandler);

    const historyElements = document.querySelectorAll('.history-city');
    Array.from(historyElements).forEach((element) => {
        element.addEventListener('click', loadNewCityHandler);
    });

}

loadMainData();