const apiKey = '182cc742be5059f3cdc602c51cccd3ec';  

async function getCurrentWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        displayWeather(data); 
        console.log(data); 
    } catch (error) {
        alert(`${error.message}`); 
    }
}

function displayWeather(data) {
    const { name, main, weather, wind } = data;
    const description = weather[0].description;
    const temperature = main.temp;
    const humidity = main.humidity;  
    const windSpeed = wind.speed;  
    const iconCode = weather[0].icon;  
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;  

    document.querySelector('.city').innerHTML = name;
    document.querySelector('.temp').innerHTML = `${temperature}°C`;
    document.querySelector('.texthumidity').innerHTML = `${humidity}%`;
    document.querySelector('.textwind').innerHTML = `${windSpeed} m/s`;
    document.querySelector('.weatherimg').src = iconUrl;  
}

document.getElementById('getWeatherBtn').addEventListener('click', function () {
    const city = document.querySelector('.search').value; 
    if (city) {
        getCurrentWeather(city);  
        get5DayWeatherForecast(city);
    } else {
        alert('Please enter a city name');
    }
});

async function get5DayWeatherForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        console.log(data);
        const dailyTemperatures = getDailyAverages(data);
        displayLineChart(dailyTemperatures);
        displaydoughnutChart(dailyTemperatures);
        displayverticalChart(dailyTemperatures);
    } catch (error) {
        console.error(error.message);
    }
}

function getDailyAverages(data) {
    const forecastList = data.list;
    const dailyTemps = {};
    
    forecastList.forEach(forecast => {
        const date = forecast.dt_txt.split(' ')[0];
        const temp = forecast.main.temp;

        if (!dailyTemps[date]) {
            dailyTemps[date] = { tempSum: 0, count: 0 };
        }

        dailyTemps[date].tempSum += temp;
        dailyTemps[date].count++;
    });

    const dailyAverages = Object.keys(dailyTemps).map(date => {
        return {
            date,
            avgTemp: (dailyTemps[date].tempSum / dailyTemps[date].count).toFixed(2)
        };
    });

    return dailyAverages.slice(0, 5);
}

let lineChart, doughnutChart, verticalBarChart;

function displayLineChart(dailyTemperatures) {
    const ctx = document.getElementById('lineChartCanvas').getContext('2d');
    
    if (lineChart) {
        lineChart.destroy();
    }
    
    const labels = dailyTemperatures.map(tempData => tempData.date);
    const temperatures = dailyTemperatures.map(tempData => tempData.avgTemp);

    lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,  
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function displaydoughnutChart(dailyTemperatures) {
    const ctx = document.getElementById('doughnutchartcanvas').getContext('2d');
    
    if (doughnutChart) {
        doughnutChart.destroy();
    }
    
    const labels = dailyTemperatures.map(tempData => tempData.date);
    const temperatures = dailyTemperatures.map(tempData => tempData.avgTemp); 

    doughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels, 
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,  
            maintainAspectRatio: false,
        }
    });
}

function displayverticalChart(dailyTemperatures) {
    const ctx = document.getElementById('verticalbarcanvas').getContext('2d');
    
    if (verticalBarChart) {
        verticalBarChart.destroy();
    }
    
    const labels = dailyTemperatures.map(tempData => tempData.date); 
    const temperatures = dailyTemperatures.map(tempData => tempData.avgTemp); 

    verticalBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures, 
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true, 
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
