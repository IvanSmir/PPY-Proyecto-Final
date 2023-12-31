const APIURL = "https://restcountries.com/v3.1/name/";
const APIURLID = "https://restcountries.com/v3.1/alpha/";


let isZoomed = false;
let originalTransform = '';

const mapSvg = document.getElementById('mapsvg');
mapSvg.addEventListener('click', handleMapClick);
mapSvg.addEventListener('dblclick', handleMapDoubleClick);
const mapb = document.getElementById('amap')
mapb.addEventListener('click', handleMapDoubleClick)

function handleMapClick(event) {
    if (!isZoomed) {
        zoomIn(event);
    } else {
        displayModal(event);
    }
}

function handleMapDoubleClick() {
    if (isZoomed) {
        zoomOut();
    }
}

function zoomIn(event) {
    const clickedPath = event.target;
    if (clickedPath.tagName === 'path') {
        const svgRect = mapSvg.getBoundingClientRect();
        const pathRect = clickedPath.getBoundingClientRect();
        
        const x = pathRect.left - svgRect.left + pathRect.width / 2;
        const y = pathRect.top - svgRect.top + pathRect.height / 2;

        const scale = 3;
        const translateX = window.innerWidth / 2 - x * scale;
        const translateY = window.innerHeight / 2 - y * scale;

        originalTransform = mapSvg.style.transform;
        mapSvg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        isZoomed = true;
    }
}

function zoomOut() {
    mapSvg.style.transform = originalTransform;
    isZoomed = false;
    updateDisplayStyle('infoModal', "none");
}

function displayModal(event) {
    const name = getTargetName(event.target);
    if (event.target.tagName === 'path') {
        getCountry(name);
        positionModal(event);
    }
}

function getTargetName(target) {
    return target.id === "" ? target.className.baseVal : target.id;
}

function positionModal(event) {
    const modal = document.getElementById('infoModal');
    const modalWidth = modal.offsetWidth;
    const modalHeight = modal.offsetHeight;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const x = event.clientX;
    const y = event.clientY;
    modal.style.left = x + modalWidth > windowWidth ? (x - modalWidth - 20) + 'px' : (x + 20) + 'px';
    modal.style.top = y + modalHeight > windowHeight ? (y - modalHeight - 20) + 'px' : (y + 20) + 'px';
    updateDisplayStyle('infoModal', 'block');
}

function updateDisplayStyle(elementId, displayStyle) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = displayStyle;
    }
}

function getCountry(name) {
    let api = APIURL
    if(name.length == 2){
        api = APIURLID
    }
    fetch(api + encodeURIComponent(name))
    .then(response => response.json())
    .then(data => {
        if(data.length==1){
            updateCountryInfo(data[0]);
        }else{
            const exactMatch = data.find(country => country.name.common.toLowerCase() === name.toLowerCase());
            if (exactMatch) {
                updateCountryInfo(exactMatch);
            } else {
                console.log("País no encontrado o múltiples coincidencias.");
            }
        }
        
    })
    .catch(error => {
        console.error("Error al obtener datos del país:", error);
    });
}

function updateCountryInfo(countryData) {
    updateElementText('countryName', countryData.name.common);
    updateElementSrc('countryFlag', countryData.flags.png);
    updateElementText('countryCapital', 'Capital: ' + countryData.capital);
    updateElementText('countryLanguage', 'Lenguaje: ' + Object.values(countryData.languages).join(', '));
    updateElementText('countryCurrency', 'Moneda: ' + Object.values(countryData.currencies).map(c => c.name).join(', '));
    fetchWeatherForCapital(countryData.capital);
}

function fetchWeatherForCapital(capital) {
    if (!capital) {
        updateElementText('countryTemperature', 'Capital desconocida');
        return;
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=9e11fddeffb1b0c8dedb61e475477272&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Problema al obtener datos del clima: ' + response.statusText);
            }
            return response.json();
        })
        .then(weatherData => {
            const temperature = weatherData.main?.temp;
            updateElementText('countryTemperature', 'Temperatura de la Capital: ' + (temperature ? `${temperature} °C` : 'Desconocida'));
        })
        .catch(error => {
            console.error(error);
            updateElementText('countryTemperature', 'Error al obtener datos del clima');
        });
}

function updateElementText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
    }
}

function updateElementSrc(elementId, src) {
    const element = document.getElementById(elementId);
    if (element) {
        element.src = src;
    }
}
