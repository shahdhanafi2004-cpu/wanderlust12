
export class WeatherApi {

    static async getWeather(lat, lon) {

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to load weather");
        }

        return response.json();
    }
}
