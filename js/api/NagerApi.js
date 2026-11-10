
export class NagerApi {

    static BASE = "https://date.nager.at/api/v3";

    static async countries() {
        const response = await fetch(
            `${this.BASE}/AvailableCountries`
        );

        if (!response.ok) {
            throw new Error("Failed to load countries");
        }

        return response.json();
    }

    static async holidays(year, code) {
        const response = await fetch(
            `${this.BASE}/PublicHolidays/${year}/${code}`
        );

        if (!response.ok) {
            throw new Error("Failed to load holidays");
        }

        return response.json();
    }

    static async longWeekends(year, code) {
        const response = await fetch(
            `${this.BASE}/LongWeekend/${year}/${code}`
        );

        if (!response.ok) {
            throw new Error("Failed to load long weekends");
        }

        return response.json();
    }
}
