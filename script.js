document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const path = window.location.pathname;

  // Protect home page
  if (!isLoggedIn && path.endsWith("/index.html")) {
    window.location.href = "Pages/login.html";
  }

  // Block login/signup when logged in
  if (
    isLoggedIn &&
    (path.endsWith("/login.html") || path.endsWith("/signup.html"))
  ) {
    window.location.href = "../index.html";
  }
});
/* ================= LOGIN ================= */
function login(event) {
  event.preventDefault();

  const username = document.getElementById("user").value.trim();
  const password = document.getElementById("pass").value.trim();
  const message = document.getElementById("loginMessage");
  const button = event.target.querySelector("button");

  message.textContent = "";
  message.className = "form-message";

  const savedUser = localStorage.getItem("savedUser");
  const savedPass = localStorage.getItem("savedPass");

  if (!savedUser || !savedPass) {
    message.textContent = "No account found. Please sign up first.";
    message.classList.add("error");
    return;
  }

  button.classList.add("loading");
  button.textContent = "Logging in...";

  setTimeout(() => {
    if (username === savedUser && password === savedPass) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);

      message.textContent = "Login successful!";
      message.classList.add("success");

      setTimeout(() => {
        window.location.replace("../index.html");
      }, 800);
    } else {
      message.textContent = "Invalid username or password";
      message.classList.add("error");
      button.classList.remove("loading");
      button.textContent = "Login";
    }
  }, 600);
}
/* ================= SIGNUP ================= */
function signup(event) {
  event.preventDefault();

  const username = document.getElementById("newUser").value.trim();
  const password = document.getElementById("newPass").value.trim();
  const message = document.getElementById("signupMessage");
  const button = event.target.querySelector("button");

  message.textContent = "";
  message.className = "form-message";

  if (password.length < 4) {
    message.textContent = "Password must be at least 4 characters";
    message.classList.add("error");
    return;
  }

  button.classList.add("loading");
  button.textContent = "Creating account...";

  setTimeout(() => {
    localStorage.setItem("savedUser", username);
    localStorage.setItem("savedPass", password);

    message.textContent = "Signup successful! Redirecting to login...";
    message.classList.add("success");

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1000);
  }, 600);
}

/* ================= LOGOUT ================= */
function logout() {
  localStorage.removeItem("isLoggedIn");
  window.location.replace("/pages/login.html");
}

/* ================= RESET ACCOUNT ================= */
function resetAccount() {
  localStorage.clear();
  alert("Account reset. Please sign up again.");
  window.location.href = "signup.html";
}

function isUserLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true";
}

/* ================= THEME ================= */
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
}

/* ================= SCREENS ================= */
const screens = document.querySelectorAll(".screen");

function showScreen(index) {
  if (!isUserLoggedIn()) return;
  screens.forEach((screen, i) => {
    screen.classList.toggle("active", i === index);
  });
}
function openMapPage() {
  window.location.href = "map.html";
}

/* ================= APP INIT (ONLY IF LOGGED IN) ================= */
if (isUserLoggedIn()) {
  setGreeting();
  updateProfileStats();
  loadProfile();
}

/* ================= GREETING ================= */
function setGreeting() {
  const hour = new Date().getHours();
  const greeting = document.getElementById("greeting");
  if (!greeting) return;

  if (hour < 12) greeting.innerText = "Good Morning 🌅";
  else if (hour < 18) greeting.innerText = "Good Afternoon ☀️";
  else greeting.innerText = "Good Evening 🌙";
}

/* ================= PROFILE ================= */
function saveProfile() {
  const name = document.getElementById("usernameInput").value.trim();
  if (!name) return alert("Enter name");

  localStorage.setItem("username", name);
  const homeName = document.getElementById("homeUsername");
  if (homeName) homeName.innerText = name;
}

function loadProfile() {
  const name = localStorage.getItem("username");
  const avatar = localStorage.getItem("profileAvatar");

  if (name && document.getElementById("usernameInput")) {
    document.getElementById("usernameInput").value = name;
  }
  if (avatar && document.getElementById("profileAvatar")) {
    document.getElementById("profileAvatar").src = avatar;
  }
}

/* ================= STATS ================= */
function incrementStat(key) {
  const storageKey = key + "Count";   // 🔑 FIX
  let count = parseInt(localStorage.getItem(storageKey) || "0");
  count++;
  localStorage.setItem(storageKey, count);
  updateProfileStats();
}

function updateProfileStats() {
  if (!isUserLoggedIn()) return;

  ["weather", "location", "hourly", "forecast"].forEach(k => {
    const el = document.getElementById("stat" + k.charAt(0).toUpperCase() + k.slice(1));
    if (el) el.innerText = localStorage.getItem(k + "Count") || 0;
  });
}

function getAirQualityByCity(city) {
  const token = "f30ebdfbf64a20ecda55643f84e6c2c400e0c500"; // 🔥 put your real token here

  fetch(`https://api.waqi.info/feed/${city}/?token=${token}`)
    .then(res => res.json())
    .then(data => {
      if (data.status !== "ok") {
        document.getElementById("aqiValue").innerText = "--";
        document.getElementById("aqiStatus").innerText = "AQI unavailable";
        return;
      }

      const realAQI = data.data.aqi;

      document.getElementById("aqiValue").innerText = realAQI;

      let status = "";

      if (realAQI <= 50) status = "Good 😊";
      else if (realAQI <= 100) status = "Satisfactory 🙂";
      else if (realAQI <= 150) status = "Moderate 😐";
      else if (realAQI <= 200) status = "Unhealthy 😷";
      else if (realAQI <= 300) status = "Very Unhealthy 🤢";
      else status = "Hazardous ☠️";

      document.getElementById("aqiStatus").innerText = status;
    })
    .catch(() => {
      document.getElementById("aqiStatus").innerText = "AQI unavailable";
    });
}
/* ===== MISSING FUNCTIONS (REQUIRED) ===== */
function updateCurrentWeather(data) {
  document.getElementById("cityName").innerText = data.name;
  document.getElementById("temp").innerText = Math.round(data.main.temp);
  document.getElementById("humidity").innerText = data.main.humidity;
  document.getElementById("wind").innerText = data.wind.speed;
  document.getElementById("conditionText").innerText = data.weather[0].description;
  document.getElementById("weatherIcon").src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

function showWeatherAlert(data) {
  const alertBox = document.getElementById("weatherAlert");
  const temp = data.main.temp;
  const wind = data.wind.speed;
  const condition = data.weather[0].main;

  alertBox.style.display = "block";
  alertBox.className = "weather-alert";

  if (temp <= 5) {
    alertBox.classList.add("alert-cold");
    alertBox.innerText = "❄️ Cold Weather Alert! Dress warmly.";
  } 
  else if (temp >= 40) {
    alertBox.classList.add("alert-hot");
    alertBox.innerText = "🔥 Heat Alert! Stay hydrated.";
  } 
  else if (wind >= 12) {
    alertBox.classList.add("alert-wind");
    alertBox.innerText = "💨 Strong Wind Alert!";
  } 
  else if (condition === "Rain") {
    alertBox.classList.add("alert-rain");
    alertBox.innerText = "🌧️ Rain Alert! Carry umbrella.";
  } 
  else {
    alertBox.style.display = "none";
  }
}
function updateHomeCard(data) {
  // Temperature
  document.querySelector(".today-temp").innerHTML =
    `🌡️ ${Math.round(data.main.temp)} °C`;

  // City name
  document.querySelector(".today-city").innerText = data.name;
}

/* ================= WEATHER BY CITY ================= */
function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) return alert("Enter city name");

  // CLEAR OLD STATE
  document.getElementById("aqiValue").innerText = "--";
  document.getElementById("aqiStatus").innerText = "Loading...";
  // FORCE AQI VISIBILITY
      document.querySelector(".air-quality-card").style.display = "block";
  document.getElementById("forecastContainer").innerHTML = "";
  document.getElementById("hourlyContainer").innerHTML = "";
  if (tempChart) {
    tempChart.destroy();
    tempChart = null;
  }

  document.getElementById("loadingText").style.display = "block";

  const apiKey = "c55bb5e40d49ac9d1ba7d5a1ad812c31";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
  updateCurrentWeather(data);
  updateHomeCard(data); // 🔥 THIS FIXES HOME PAGE
  showWeatherAlert(data);

  fetch("http://localhost:5000/save-search", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ city: data.name })
});

  getAirQualityByCity(data.name);
  getForecast(data.name);
  incrementStat("weather");

  localStorage.setItem("mapWeatherData", JSON.stringify(data));

  document.getElementById("loadingText").style.display = "none";
})
    .catch(() => alert("City not found"));
}
function getForecast(city) {
  const apiKey = "c55bb5e40d49ac9d1ba7d5a1ad812c31";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      displayForecast(data);
      drawTemperatureChart(data);
    });
}
function displayForecast(data) {
  incrementStat("forecast");
  incrementStat("hourly");
  const forecast = document.getElementById("forecastContainer");
  const hourly = document.getElementById("hourlyContainer");

  forecast.innerHTML = "";
  hourly.innerHTML = "";

  // 5-day (one per day at noon)
  const daily = data.list.filter(item =>
    item.dt_txt.includes("12:00:00")
  );

  daily.slice(0, 5).forEach(day => {
    forecast.innerHTML += `
      <div class="forecast-card">
        <p>${new Date(day.dt_txt).toDateString().slice(0, 3)}</p>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
        <p>${Math.round(day.main.temp)}°C</p>
      </div>
    `;
  });

  // Hourly (next 8 = ~24 hrs)
  data.list.slice(0, 8).forEach(hour => {
    hourly.innerHTML += `
      <div class="hourly-card">
        <p>${hour.dt_txt.slice(11, 16)}</p>
        <img src="https://openweathermap.org/img/wn/${hour.weather[0].icon}.png">
        <p>${Math.round(hour.main.temp)}°C</p>
      </div>
    `;
  });
}
let tempChart = null;

function drawTemperatureChart(data) {
  const labels = [];
  const temps = [];

  data.list.slice(0, 8).forEach(item => {
    labels.push(item.dt_txt.slice(11, 16));
    temps.push(item.main.temp);
  });

  const ctx = document.getElementById("tempChart").getContext("2d");

  if (tempChart) tempChart.destroy();

  tempChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Temperature (°C)",
        data: temps,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      }
    }
  });
}
function getLocationWeather() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  document.getElementById("loadingText").style.display = "block";

  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    const apiKey = "c55bb5e40d49ac9d1ba7d5a1ad812c31";

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    )
      .then(res => res.json())
      .then(data => {
        updateCurrentWeather(data);
        showWeatherAlert(data);
        
        // ✅ AQI WORKS HERE TOO
        getAirQualityByCity(data.name);

        getForecast(data.name);
        incrementStat("location");
        document.getElementById("loadingText").style.display = "none";
      });
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("mapWeatherData");
  if (saved) {
    updateHomeCard(JSON.parse(saved));
  }
});
function checkLocationPermission() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported in this browser");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    () => {
      alert("📍 Location access is ENABLED");
    },
    () => {
      alert("❌ Location access is BLOCKED.\nPlease allow it from browser settings.");
    }
  );
}
function toggleNotifications() {
  if (!("Notification" in window)) {
    alert("Notifications are not supported in this browser");
    return;
  }

  if (Notification.permission === "granted") {
    alert("🔔 Notifications are already enabled");
  } else if (Notification.permission === "denied") {
    alert("❌ Notifications are blocked.\nEnable them from browser settings.");
  } else {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        alert("✅ Notifications enabled!");
      } else {
        alert("❌ Notifications not enabled");
      }
    });
  }
}
function uploadAvatar(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    const imageData = e.target.result;

    // Update UI
    document.getElementById("profileAvatar").src = imageData;

    // Save image permanently
    localStorage.setItem("profileAvatar", imageData);
  };

  reader.readAsDataURL(file);
}