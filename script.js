// KHAI BAO CAC BIEN DE SU DUNG
const
    userLocation = document.getElementById("userLocation"),
    converter = document.getElementById("converter"),
    weatherIcon = document.querySelector(".weatherIcon"),
    temperature = document.querySelector(".temperature"),
    feelsLike = document.querySelector(".feelsLike"),
    description = document.querySelector(".description"),
    date = document.querySelector(".date"),
    city = document.querySelector(".city");

const
    HValue = document.getElementById("HValue"),
    WValue = document.getElementById("WValue"),
    SRValue = document.getElementById("SRValue"),
    SSValue = document.getElementById("SSValue"),
    CValue = document.getElementById("CValue"),
    UVValue = document.getElementById("UVValue"),
    PValue = document.getElementById("PValue");

const
    Forecast = document.querySelector(".Forecast");

// GOI API
const
    // API LAY THONG TIN HIEN TAI VA TUAN SAU
    WEATHER_API_ENDPOINT = `https://api.weatherapi.com/v1/current.json?key=${CONFIG.API_KEY}&q=`,
    // API LAY THONG TIN DU BAO 7 NGAY
    WEATHER_FORECAST_ENDPOINT = `https://api.weatherapi.com/v1/forecast.json?key=${CONFIG.API_KEY}&q=`,
    // API LAY THONG TIN ZIP/POST CODE
    WEATHER_ZIP_ENDPOINT = `https://api.weatherapi.com/v1/current.json?key=${CONFIG.API_KEY}&q=`;

// HAM TIM VI TRI NGUOI DUNG VA TRA VE THONG TIN THHOI TIET
function findLocation() {
    Forecast.innerHTML = "";
    const location = userLocation.value;
    
    // GOI API DU BAO 7 NGAY + THONG TIN HIEN TAI
    fetch(WEATHER_FORECAST_ENDPOINT + location + "&days=7&aqi=yes").then((res) => res.json()).then(data => {
        if (!data.current) {
            alert("Location not found. Please try again.");
            return
        }

        console.log(data);
        getWeatherData(data);
    }).catch(error => {
        alert("Error fetching weather data: " + error.message);
    });
}

// HAM XU LY THONG TIN VA TRA VE KET QUA
function getWeatherData(data) {
    // THAY DOI TEN TP VA ICON NHIET DO - WeatherAPI structure
    const location = data.location;
    const current = data.current;
    const forecast = data.forecast.forecastday;
    
    city.innerHTML = location.name + ", " + location.country;
    // LAY ICON TU THU VIEN CUA WEATER API
    weatherIcon.style.background = `url(https:${current.condition.icon})`;
    
    // LAY DATA TU API VA IN RA KHUNG WEATHER CHINH
    console.log(data);
    temperature.innerHTML = TempConvert(current.temp_c);
    feelsLike.innerHTML = "Feels like " + Math.round(current.feelslike_c) + "°C";
    description.innerHTML = `<i class = "fa-brands fa-cloudversify"></i> &nbsp;` + current.condition.text;
    
    // DINH DANG KIEU DU LIEU NGAY THANG
    const localDate = new Date(current.last_updated);
    date.innerHTML = localDate.toLocaleString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });
    
    // LAY DATA TU API VA IN RA THONG TIN LIEN QUAN
    HValue.innerHTML = Math.round(current.humidity) + "<span>%</span>";
    WValue.innerHTML = Math.round(current.wind_kph / 3.6) + "<span>m/s</span>"; // Convert kph to m/s
    
    // LAY DATA THOI GIAN BINH MINH VA HOANG HON
    const forecastToday = forecast[0];
    SRValue.innerHTML = "<span>Sunrise:</span>" +forecastToday.astro.sunrise;
    SSValue.innerHTML = "<span>Sunset:</span>" + forecastToday.astro.sunset;
    
    CValue.innerHTML = current.cloud + "<span>%</span>";
    UVValue.innerHTML = Math.round(current.uv * 10) / 10;
    PValue.innerHTML = Math.round(current.pressure_mb) + "<span>hPa</span>";
    
    // LAY DATA TU API VA TAO CAC O DATA CAC NGAY TRONG TUAN
    forecast.forEach((day) => {
        let div = document.createElement("div");
        const dayDate = new Date(day.date);
        const dayName = dayDate.toLocaleString("en-US", { weekday: "long", month: "short", day: "numeric" });
        
        div.innerHTML = dayName;
        div.innerHTML += `<img src = "https:${day.day.condition.icon}"/>`;
        div.innerHTML += `<p class = "forecast-desc">${day.day.condition.text}</p>`;
        div.innerHTML += `<span>Min: <span>${TempConvert(day.day.mintemp_c)}</span>&nbsp;Max: <span>${TempConvert(day.day.maxtemp_c)}</span></span>`;
        Forecast.append(div);
    });
}

// TU DONG RELOAD THONG TIN SAU KHI THAY DOI LOAI NHIET DO
converter.addEventListener("change", () => {
    if (userLocation.value) {
        findLocation();
    }
});

// XU LY THONG TIN KHI DOI TU DO C -> F
function TempConvert(temp) {
    let tempValue = Math.round(temp);
    let message = "";
    if (converter.value == "°C") {
        message = tempValue + "<span>" + "\xB0C</span>";
    } else {
        let ctof = (tempValue * 9) / 5 + 32;
        message = ctof + "<span>" + "\xB0F</span>";
    }
    return message;
}