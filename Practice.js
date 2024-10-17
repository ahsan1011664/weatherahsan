const apiKey = '182cc742be5059f3cdc602c51cccd3ec'; 
let currentPage = 1;
let rowsPerPage = 10;
let forecastData = [];

const geminiApiKey = 'AIzaSyBxYA866iFTotVpyazzdP6Cx4HEJm9zC8M'; 

async function getWeatherForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        forecastData = data.list;
        displayWeatherForecast(city); 
    } catch (error) {
        alert(`${error.message}`);
    }
}

function displayWeatherForecast(city) {
    const forecastTableBody = document.querySelector('.forecast-table tbody');
    if (!forecastTableBody) return;

    forecastTableBody.innerHTML = ''; 
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = forecastData.slice(start, end);

    paginatedData.forEach(entry => {
        const row = document.createElement('tr');

        const date = new Date(entry.dt_txt).toLocaleDateString();
        const temp = entry.main.temp;
        const humidity = entry.main.humidity;
        const wind = entry.wind.speed;

        row.innerHTML = `
            <td>${date}</td>
            <td>${temp}°C</td>
            <td>${humidity}%</td>
            <td>${wind} m/s</td>
        `;
        forecastTableBody.appendChild(row);
    });

    const cityNameElement = document.querySelector('.city-name');
    if (cityNameElement) {
        cityNameElement.textContent = `Weather Forecast for ${city}`;  
    }

    updatePagination();
}

function updatePagination() {
    const pageInfo = document.querySelector('.page-info');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');

    if (!pageInfo || !prevButton || !nextButton) return;

    pageInfo.textContent = `Page ${currentPage}`;
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = (currentPage * rowsPerPage) >= forecastData.length;
}

document.getElementById('next').addEventListener('click', () => {
    currentPage++;
    displayWeatherForecast();
});

document.getElementById('prev').addEventListener('click', () => {
    currentPage--;
    displayWeatherForecast();
});

document.getElementById('getWeatherBtn').addEventListener('click', function () {
    const city = document.querySelector('.search').value;
    if (city) {
        getWeatherForecast(city);  
    } else {
        alert('Please enter a city name');
    }
});

async function getGeminiAnswer(question) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`;

    const requestBody = {
        contents: [
            {
                parts: [
                    {
                        text: question
                    }
                ]
            }
        ]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.log(`API error details: ${errorData}`); 
            throw new Error('Error interacting with Gemini API');
        }

        const data = await response.json();
        const answer = data.candidates && data.candidates.length > 0 
            ? data.candidates[0].content.parts[0].text 
            : "Sorry, no answer available.";

        displayAnswer(answer);  
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

function displayAnswer(answer) {
    const chatbot = document.querySelector('.answercontainer');
    if (chatbot) {
        chatbot.innerHTML = answer || "Sorry, no response available.";
    }
}

function handleQuery(query) {
    const cityMatch = query.match(/weather in ([a-zA-Z\s]+)/i); 

    if (cityMatch) {
        const city = cityMatch[1].trim();  
        getWeatherForecast(city);  
    } else {
        getGeminiAnswer(query);  
    }
}

document.querySelector('.getresponse').addEventListener('click', function () {
    const question = document.querySelector('.chatbotinput').value;
    if (question) {
        handleQuery(question);  
    } else {
        alert('Please enter a question.');
    }
});
