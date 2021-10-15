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

//generate the history elements
const generateHistoryItem = (city, isCurrent) => {
    return `<li class="list-group-item history-city ${isCurrent ? 'bg-primary' : 'bg-secondary'} d-flex justify-content-center text-light">${city}</li>`;
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
        <div class="container search-container p-3 " style="border-bottom: 2px solid;">
            <input type="text" class="search-input p-2" id="search_input" placeholder="Search By City">
            <button class="search-button bg-primary text-light p-2 mt-2" id="search_button">Search</button>
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

const generateHtml = (cityData, history) => {
    //the main section consists of 3 sections: CurrentInfo, HistoryItems, ForcastDays
    //first generate the CurrentInfo section
    let currentData = generateCurrentInfo(cityData)

    let historyData = [];

    //second generate the HistoryItems section
    for (let i = 0; i < history.length; i++) {
        historyData.push(generateHistoryItem(history[i], (i ? false : true)));
    }

    const forcast = cityData.forcast;
    let forcastData = [];

    //third generate the ForcastDays section
    for (let i = 0; i < forcast.length; i++) {
        forcastData.push(generateForcastDay(forcast[i]));
    }

    //finally combine the 3 sections to make the main section.
    const mainData = generateMainSection(historyData.join(''), currentData, forcastData.join(''));
    mainElement.innerHTML = mainData;
}

export default generateHtml;