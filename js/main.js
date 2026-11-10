
import { NagerApi } from "./api/NagerApi.js";

async function loadCountries() {
    try {
        const countries = await NagerApi.countries();

        const countrySelect = document.getElementById("global-country");
        const flag = document.getElementById("selected-country-flag");
        const countryName = document.getElementById("selected-country-name");

        // Add countries to dropdown
        countrySelect.innerHTML = '<option value="">Select Country</option>';

        countries.forEach(country => {
            const option = document.createElement("option");

            option.value = country.countryCode;
            option.textContent = `${country.name} (${country.countryCode})`;

            countrySelect.appendChild(option);
        });

        // Update selected country information
        function updateSelectedCountry() {
            const code = countrySelect.value;

            const selectedCountry = countries.find(
                country => country.countryCode === code
            );

            if (!selectedCountry) return;

            // Update flag
            flag.src = `https://flagcdn.com/w80/${code.toLowerCase()}.png`;
            flag.alt = selectedCountry.name;

            // Update country name
            countryName.textContent = selectedCountry.name;
            
        }

        // Listen for country changes
        countrySelect.addEventListener("change", updateSelectedCountry);
        const exploreBtn = document.getElementById("global-search-btn");
       

                exploreBtn.addEventListener("click", (event) => {
                event.preventDefault();

                const code = countrySelect.value;

                if (!code) {
                    alert("Please select a country first!");
                    return;
                }

                loadCountryInfo(code);
            });

        // Set Egypt as default
        countrySelect.value = "EG";
        updateSelectedCountry();

        console.log("Countries loaded successfully!");

    } catch (error) {
        console.log("Error:", error);
    }
}
async function loadCountryInfo(code) {
    const infoContainer = document.getElementById("dashboard-country-info");

    try {
        infoContainer.innerHTML = "<p>Loading country information...</p>";

        const response = await fetch(
            `https://countries.dev/alpha/${code}?full=true`
        );

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        // Countries.dev returns an object directly
        const country = await response.json();

        console.log("Country Information:", country);

        const currencies = (country.currencies || [])
            .map(currency =>
                `${currency.name} (${currency.symbol || currency.code})`
            )
            .join(", ");

        const languages = (country.languages || [])
            .map(language => language.name)
            .join(", ");

        const borders = country.borders?.join(", ")
            || "No neighboring countries";

        const flag = country.flags?.png || country.flags?.svg || "";

        infoContainer.innerHTML = `
            <div class="dashboard-country-header">
                <img src="${flag}"
                     alt="${country.name}"
                     class="dashboard-country-flag">

                <div class="dashboard-country-title">
                    <h3>${country.name}</h3>
                    <p class="official-name">
                        ${country.nativeName || country.name}
                    </p>
                    <span class="region">
                        ${country.region || "N/A"} •
                        ${country.subregion || ""}
                    </span>
                </div>
            </div>

            <div class="dashboard-country-grid">

                <div class="dashboard-country-detail">
                    <span class="label">Capital</span>
                    <span class="value">${country.capital || "N/A"}</span>
                </div>

                <div class="dashboard-country-detail">
                    <span class="label">Population</span>
                    <span class="value">
                        ${country.population?.toLocaleString() || "N/A"}
                    </span>
                </div>

                <div class="dashboard-country-detail">
                    <span class="label">Area</span>
                    <span class="value">
                        ${country.area?.toLocaleString() || "N/A"} km²
                    </span>
                </div>

                <div class="dashboard-country-detail">
                    <span class="label">Region</span>
                    <span class="value">${country.region || "N/A"}</span>
                </div>

                <div class="dashboard-country-detail">
                    <span class="label">Calling Code</span>
                    <span class="value">
                        ${country.callingCodes?.join(", ") || "N/A"}
                    </span>
                </div>

                <div class="dashboard-country-detail">
                    <span class="label">Time Zones</span>
                    <span class="value">
                        ${country.timezones?.join(", ") || "N/A"}
                    </span>
                </div>

                <div class="dashboard-country-detail">
                    <span class="label">Country Code</span>
                    <span class="value">${country.alpha2Code || code}</span>
                </div>

            </div>

            <div class="dashboard-country-extras">

                <div class="dashboard-country-extra">
                    <h4>Currency</h4>
                    <div class="extra-tags">
                        <span class="extra-tag">
                            ${currencies || "N/A"}
                        </span>
                    </div>
                </div>

                <div class="dashboard-country-extra">
                    <h4>Languages</h4>
                    <div class="extra-tags">
                        <span class="extra-tag">
                            ${languages || "N/A"}
                        </span>
                    </div>
                </div>

                <div class="dashboard-country-extra">
                    <h4>Neighbors</h4>
                    <div class="extra-tags">
                        <span class="extra-tag">
                            ${borders}
                        </span>
                    </div>
                </div>

            </div>

            <div class="dashboard-country-actions">
                <a href="${country.maps?.googleMaps || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(country.name)}`}"
                   target="_blank"
                   class="btn-map-link">
                    View on Google Maps
                </a>
            </div>
        `;

    } catch (error) {
        console.error("Country Info Error:", error);

        infoContainer.innerHTML =
            "<p>Unable to load country information.</p>";
    }
}

async function loadHolidays(year, code) {
    const holidaysContent = document.getElementById("holidays-content");

    try {
        holidaysContent.innerHTML = "<p>Loading holidays...</p>";

        const holidays = await NagerApi.holidays(year, code);

        if (!holidays.length) {
            holidaysContent.innerHTML =
                "<p>No holidays found for this country and year.</p>";
            return;
        }

        holidaysContent.innerHTML = holidays.map(holiday => {
            const date = new Date(holiday.date + "T00:00:00");

            const day = date.getDate();
            const month = date.toLocaleString("en-US", {
                month: "short"
            });

            const weekday = date.toLocaleString("en-US", {
                weekday: "long"
            });

            return `
                <div class="holiday-card">

                    <div class="holiday-card-header">
                        <div class="holiday-date-box">
                            <span class="day">${day}</span>
                            <span class="month">${month}</span>
                        </div>

                        <button class="holiday-action-btn">
                            <i class="fa-regular fa-heart"></i>
                        </button>
                    </div>

                    <h3>${holiday.localName}</h3>

                    <p class="holiday-name">${holiday.name}</p>

                    <div class="holiday-card-footer">
                        <span class="holiday-day-badge">
                            <i class="fa-regular fa-calendar"></i>
                            ${weekday}
                        </span>

                        <span class="holiday-type-badge">
                            ${holiday.types?.join(", ") || "Public"}
                        </span>
                    </div>

                </div>
            `;
        }).join("");

    } catch (error) {
        console.error("Holidays Error:", error);

        holidaysContent.innerHTML =
            "<p>Unable to load holidays. Please try again.</p>";
    }
}
function updateHolidaysHeader(code, year) {
    const countrySelect = document.getElementById("global-country");

    const selectedOption = countrySelect.options[countrySelect.selectedIndex];

    const countryName = selectedOption.textContent.split(" (")[0];

    document.getElementById("holidays-flag").src =
        `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

    document.getElementById("holidays-flag").alt = countryName;

    document.getElementById("holidays-country-name").textContent = countryName;

    document.getElementById("holidays-year").textContent = year;
}
function updateLongWeekendsHeader(code, year) {
    const countrySelect = document.getElementById("global-country");
    const selectedOption = countrySelect.options[countrySelect.selectedIndex];
    const countryName = selectedOption.textContent.split(" (")[0];

    const flag = document.getElementById("lw-flag");

    flag.src = `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
    flag.alt = countryName;

    document.getElementById("lw-country-name").textContent = countryName;
    document.getElementById("lw-year").textContent = year;
}
async function loadLongWeekends(year, code) {
const content = document.getElementById("lw-content");
    try {
        content.innerHTML = "<p>Loading long weekends...</p>";

        const weekends = await NagerApi.longWeekends(year, code);

        if (!weekends.length) {
            content.innerHTML = "<p>No long weekends found.</p>";
            return;
        }

        content.innerHTML = weekends.map(weekend => {
            const start = new Date(weekend.startDate + "T00:00:00");
            const end = new Date(weekend.endDate + "T00:00:00");

            const startDate = start.toLocaleDateString("en-US", {
                day: "numeric",
                month: "short"
            });

            const endDate = end.toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric"
            });

            return `
                <div class="long-weekend-card">
                    <h3>${startDate} - ${endDate}</h3>

                    <p>${weekend.dayCount} Days Weekend</p>

                    <span>
                        ${weekend.needBridgeDay
                            ? "Extra day off needed"
                            : "No extra day off needed"}
                    </span>
                </div>
            `;
        }).join("");

    } catch (error) {
        console.error("Long Weekends Error:", error);

        content.innerHTML =
            "<p>Unable to load long weekends. Please try again.</p>";
    }
}

const EXCHANGE_API_KEY = "805842951e5953ad31497176";

const popularCurrencyInfo = {
    EUR: { name: "Euro", flag: "eu" },
    GBP: { name: "British Pound", flag: "gb" },
    EGP: { name: "Egyptian Pound", flag: "eg" },
    AED: { name: "UAE Dirham", flag: "ae" },
    SAR: { name: "Saudi Riyal", flag: "sa" },
    JPY: { name: "Japanese Yen", flag: "jp" },
    CAD: { name: "Canadian Dollar", flag: "ca" },
    INR: { name: "Indian Rupee", flag: "in" }
};


// Get exchange rates
async function getExchangeRates(baseCurrency) {
    const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/${baseCurrency}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch exchange rates");
    }

    const data = await response.json();

    if (data.result !== "success") {
        throw new Error(data["error-type"] || "Exchange API error");
    }

    return data;
}


// Convert currency
async function convertCurrency() {
    const amount = Number(document.getElementById("currency-amount").value);
    const from = document.getElementById("currency-from").value;
    const to = document.getElementById("currency-to").value;
    const resultContainer = document.getElementById("currency-result");

    try {
        if (!Number.isFinite(amount) || amount < 0) {
            alert("Please enter a valid amount!");
            return;
        }

        resultContainer.innerHTML = "<p>Loading exchange rate...</p>";

        const data = await getExchangeRates(from);

        const rate = data.conversion_rates[to];
        const convertedAmount = amount * rate;

        resultContainer.innerHTML = `
            <div class="conversion-display">

                <div class="conversion-from">
                    <span class="amount">
                        ${amount.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </span>
                    <span class="currency-code">${from}</span>
                </div>

                <div class="conversion-equals">
                    <i class="fa-solid fa-equals"></i>
                </div>

                <div class="conversion-to">
                    <span class="amount">
                        ${convertedAmount.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </span>
                    <span class="currency-code">${to}</span>
                </div>

            </div>

            <div class="exchange-rate-info">
                <p>1 ${from} = ${rate} ${to}</p>
                <small>Last updated: ${data.time_last_update_utc}</small>
            </div>
        `;

    } catch (error) {
        console.error("Currency Error:", error);

        resultContainer.innerHTML =
            "<p>Unable to load exchange rates. Please try again.</p>";
    }
}


// Display popular currencies
async function loadPopularCurrencies() {
    const from = document.getElementById("currency-from").value;
    const popularContainer = document.getElementById("popular-currencies");

    try {
        popularContainer.innerHTML = "<p>Loading exchange rates...</p>";

        const data = await getExchangeRates(from);

        popularContainer.innerHTML = Object.entries(popularCurrencyInfo)
            .map(([code, currency]) => `
                <div class="popular-currency-card">

                    <img
                        src="https://flagcdn.com/w40/${currency.flag}.png"
                        alt="${code}"
                        class="flag"
                    >

                    <div class="info">
                        <div class="code">${code}</div>
                        <div class="name">${currency.name}</div>
                    </div>

                    <div class="rate">
                        ${data.conversion_rates[code]?.toFixed(4) ?? "N/A"}
                    </div>

                </div>
            `).join("");

    } catch (error) {
        console.error("Popular Currency Error:", error);

        popularContainer.innerHTML =
            "<p>Unable to load popular currencies.</p>";
    }
}


// Currency Converter Events
document.getElementById("convert-btn").addEventListener("click", () => {
    convertCurrency();
});

document.getElementById("swap-currencies-btn").addEventListener("click", () => {
    const from = document.getElementById("currency-from");
    const to = document.getElementById("currency-to");

    const oldFrom = from.value;

    from.value = to.value;
    to.value = oldFrom;

    convertCurrency();
    loadPopularCurrencies();
});


async function loadWeather() {
    const city = document.getElementById("global-city").value;
    const countryCode = document.getElementById("global-country").value;
    const weatherContent = document.getElementById("weather-content");

    try {
        weatherContent.innerHTML = "<p>Loading weather...</p>";

        // Step 1: Get city coordinates
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!geoResponse.ok) {
            throw new Error("Failed to find city");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found");
        }

        const { latitude, longitude, name } = geoData.results[0];

        // Step 2: Get weather information
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
        );

        if (!weatherResponse.ok) {
            throw new Error("Failed to load weather");
        }

        const weatherData = await weatherResponse.json();

        console.log("Weather Data:", weatherData);

        // Step 3: Display weather
        const current = weatherData.current;
        const daily = weatherData.daily;

        weatherContent.innerHTML = `
            <div class="weather-hero-card weather-sunny">
                <div class="weather-location">${name}</div>

                <div class="weather-hero-temp">
                    <span class="temp-value">${Math.round(current.temperature_2m)}</span>
                    <span class="temp-unit">°C</span>
                </div>

                <div class="weather-condition">
                    ${getWeatherDescription(current.weather_code)}
                </div>

                <div class="weather-feels">
                    Feels like ${Math.round(current.apparent_temperature)}°C
                </div>

                <div class="weather-high-low">
                    <span class="high">
                        H: ${Math.round(daily.temperature_2m_max[0])}°
                    </span>
                    <span class="low">
                        L: ${Math.round(daily.temperature_2m_min[0])}°
                    </span>
                </div>
            </div>

            <div class="weather-details-grid">
                <div class="weather-detail-card">
                    <h4>Humidity</h4>
                    <span class="detail-value">
                        ${current.relative_humidity_2m}%
                    </span>
                </div>

                <div class="weather-detail-card">
                    <h4>Wind Speed</h4>
                    <span class="detail-value">
                        ${current.wind_speed_10m} km/h
                    </span>
                </div>

                <div class="weather-detail-card">
                    <h4>UV Index</h4>
                    <span class="detail-value">
                        ${current.uv_index}
                    </span>
                </div>
            </div>

            <div class="forecast-list">
                ${daily.time.map((date, index) => `
                    <div class="forecast-day">
                        <span>${new Date(date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long" })}</span>
                        <span>${getWeatherDescription(daily.weather_code[index])}</span>
                        <span>
                            ${Math.round(daily.temperature_2m_max[index])}° /
                            ${Math.round(daily.temperature_2m_min[index])}°
                        </span>
                    </div>
                `).join("")}
            </div>
        `;

    } catch (error) {
        console.error("Weather Error:", error);
        weatherContent.innerHTML =
            "<p>Unable to load weather. Please try again.</p>";
    }
}
document.getElementById("global-city").addEventListener("change", () => {
    const weatherView = document.getElementById("weather-view");

    if (weatherView.classList.contains("active")) {
        loadWeather();
    }
});

// Convert weather code to readable description
function getWeatherDescription(code) {
    if (code === 0) return "Clear Sky";
    if ([1, 2, 3].includes(code)) return "Partly Cloudy";
    if ([45, 48].includes(code)) return "Foggy";
    if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
    if ([61, 63, 65, 66, 67].includes(code)) return "Rain";
    if ([71, 73, 75, 77].includes(code)) return "Snow";
    if ([80, 81, 82].includes(code)) return "Rain Showers";
    if ([85, 86].includes(code)) return "Snow Showers";
    if ([95, 96, 99].includes(code)) return "Thunderstorm";

    return "Unknown";
}

// Sidebar Navigation
const navItems = document.querySelectorAll(".nav-item");
const views = document.querySelectorAll(".view");

navItems.forEach(item => {
    item.addEventListener("click", (event) => {
        event.preventDefault();

        // Get selected view name
        const viewName = item.dataset.view;

        // Remove active class from all nav items
        navItems.forEach(nav => nav.classList.remove("active"));

        // Activate clicked nav item
        item.classList.add("active");

        // Hide all pages
        views.forEach(view => view.classList.remove("active"));

        // Show selected page
        const selectedView = document.getElementById(`${viewName}-view`);

        if (selectedView) {
            selectedView.classList.add("active");
        }

        // Load holidays when Holidays is clicked
        if (viewName === "holidays") {
            const code = document.getElementById("global-country").value;
            const year = document.getElementById("global-year").value;

            if (!code || !year) {
                alert("Please select a country and year first!");
                return;
            }

            updateHolidaysHeader(code, year);
            loadHolidays(year, code);
        }
       if (viewName === "long-weekends") {
    const code = document.getElementById("global-country").value;
    const year = document.getElementById("global-year").value;

    if (!code || !year) {
        alert("Please select a country and year first!");
        return;
    }

    updateLongWeekendsHeader(code, year);
    loadLongWeekends(year, code);
}
        if (viewName === "weather") {
        loadWeather();
        }
        if (viewName === "currency") {
    convertCurrency();
    loadPopularCurrencies();
}
    });
});


loadCountries();
