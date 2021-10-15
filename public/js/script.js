import generateHtml from './html.js';
const key = "b0c43b1ed43591d261dfd26cabb18859"

//convert degree Kelvin to Fahrenheit
const kToF = (degreeK) => {
    const degreeF = (degreeK - 273.15) * 9 / 5 + 32;
    return Math.round(degreeF * 100) / 100
}

//returns the data saved in the local storage
const getHistory = () => {
    const json_data = JSON.parse(localStorage.getItem("cities"));
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

//processing the data and build the main section in the index.html
//we are using que to store and accessing history data for cities
const loadMainData = async(city) => {
    //first we get the history from local storage if there's any
    let history = getHistory();

    //three ways that the data in the main section can be loaded.
    //1. when the app first load - city not passed
    //2. from the city search - city passed
    //3. from clicking on the city in the history list - city passed
    if (city) {
        //when city is passed:
        //if there is no history. we create a new city list and store the first city.
        //else we find the city in the history and move it to the top of the que.
        if (!history) {
            history = [];
            history.push(city);
        } else {
            history = history.filter(item => item !== city);
            history.unshift(city);
        }
        //when city is NOT passed:
        //if there's no city history in the local storage, we add Seattle (default city) to the que.
        //we need at least one city in the que.
        //else whichever city was on the top of the que from the last run will be loaded.
    } else {
        if (!history) {
            history = [];
            history.push('Seattle');
        };
    }

    //get the forcast data for the city from a third party API
    let cityData = await getWeatherDataForCity(history[0]);
    if (!cityData) {
        alert('Sorry, we are experiencing difficulty getting Weather data.  Please try again later.')
        return;
    }

    //saving history only after successfully get the data for the city.
    //this is to prevent accidently saving an incorrect city in the history if the user typed in the wrong city name.  
    saveHistory(history);

    generateHtml(cityData, history);

    //now that the index.html is fully loaded, we add event listeners and attach the event handlers
    const searchIconElement = document.querySelector('#search_button');
    searchIconElement.addEventListener('click', searchCityHandler);

    const historyElements = document.querySelectorAll('.history-city');
    Array.from(historyElements).forEach((element) => {
        element.addEventListener('click', loadNewCityHandler);
    });

}

loadMainData();