import NasaService from "./nasa.service.js";

class WeatherProbabilityService {
  constructor() {
    this.nasaService = new NasaService();
  }

  async calculateProbabilities({
    longitude,
    latitude,
    targetDate,
    yearsBack = 10,
  }) {
    try {
      const month = targetDate.substring(4, 6);
      const day = targetDate.substring(6, 8);
      const targetYear = parseInt(targetDate.substring(0, 4));

      const currentYear = new Date().getFullYear();
      const endYear = Math.min(targetYear - 1, currentYear);
      const startYear = Math.max(endYear - yearsBack + 1, 1981);

      const historicalData = await this.fetchHistoricalDataForDate({
        longitude,
        latitude,
        month,
        day,
        startYear,
        endYear,
      });

      if (historicalData.length === 0) {
        throw new Error("NO_HISTORICAL_DATA");
      }

      const probabilities = this.calculateExtremeProbabilities(historicalData);
      const expectedValues = this.calculateExpectedValues(historicalData);
      const discomfortAnalysis = this.analyzeDiscomfort(historicalData);

      return {
        success: true,
        location: { longitude, latitude },
        targetDate: this.formatDate(targetDate),
        analysis: {
          probabilities,
          expectedValues,
          discomfortAnalysis,
          historicalSample: {
            yearsAnalyzed: historicalData.length,
            yearRange: `${startYear}-${endYear}`,
          },
        },
      };
    } catch (error) {
      console.error("Error in calculateProbabilities:", error);
      throw error;
    }
  }

  async fetchHistoricalDataForDate({
    longitude,
    latitude,
    month,
    day,
    startYear,
    endYear,
  }) {
    const historicalData = [];

    for (let year = startYear; year <= endYear; year++) {
      try {
        const dates = this.getDateWindow(year, month, day, 1);

        const result = await this.nasaService.getWeatherData({
          longitude,
          latitude,
          startDate: dates.start,
          endDate: dates.end,
        });

        if (result.success && result.data.daily.length > 0) {
          result.data.daily.forEach((dayData) => {
            if (this.isValidData(dayData)) {
              historicalData.push({
                ...dayData,
                year,
              });
            }
          });
        }
      } catch (error) {
        console.warn(`No data available for year ${year}:`, error.message);
      }
    }

    return historicalData;
  }

  getDateWindow(year, month, day, windowDays = 1) {
    const centerDate = new Date(year, parseInt(month) - 1, parseInt(day));

    const startDate = new Date(centerDate);
    startDate.setDate(startDate.getDate() - windowDays);

    const endDate = new Date(centerDate);
    endDate.setDate(endDate.getDate() + windowDays);

    return {
      start: this.toYYYYMMDD(startDate),
      end: this.toYYYYMMDD(endDate),
    };
  }

  toYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  }

  isValidData(dayData) {
    return (
      dayData.temperature !== null &&
      dayData.temperature !== -999 &&
      dayData.humidity !== null &&
      dayData.humidity !== -999 &&
      dayData.windSpeed !== null &&
      dayData.windSpeed !== -999
    );
  }

  calculateExtremeProbabilities(historicalData) {
    const temps = historicalData.map((d) => d.temperature);
    const humidity = historicalData.map((d) => d.humidity);
    const windSpeed = historicalData.map((d) => d.windSpeed);
    const precipitation = historicalData
      .map((d) => d.precipitation)
      .filter((p) => p !== null && p !== -999);

    const tempP95 = this.percentile(temps, 95);
    const tempP5 = this.percentile(temps, 5);
    const windP90 = this.percentile(windSpeed, 90);
    const humidityP90 = this.percentile(humidity, 90);

    const veryHotDays = temps.filter((t) => t > tempP95).length;
    const veryColdDays = temps.filter((t) => t < tempP5).length;
    const veryWindyDays = windSpeed.filter((w) => w > windP90).length;
    const veryHumidDays = humidity.filter((h) => h > humidityP90).length;
    const rainyDays = precipitation.filter((p) => p > 5).length;

    const total = historicalData.length;

    const uncomfortableDays = historicalData.filter((day) => {
      const heatIndex = this.calculateHeatIndex(day.temperature, day.humidity);
      return heatIndex > 27 || day.temperature < 5 || day.windSpeed > 10;
    }).length;

    return {
      veryHot: {
        probability: ((veryHotDays / total) * 100).toFixed(1),
        threshold: tempP95.toFixed(1),
        unit: "°C",
        description: `Temperatura superior a ${tempP95.toFixed(1)}°C`,
        occurrences: veryHotDays,
      },
      veryCold: {
        probability: ((veryColdDays / total) * 100).toFixed(1),
        threshold: tempP5.toFixed(1),
        unit: "°C",
        description: `Temperatura inferior a ${tempP5.toFixed(1)}°C`,
        occurrences: veryColdDays,
      },
      veryWindy: {
        probability: ((veryWindyDays / total) * 100).toFixed(1),
        threshold: windP90.toFixed(1),
        unit: "m/s",
        description: `Viento superior a ${windP90.toFixed(1)} m/s`,
        occurrences: veryWindyDays,
      },
      veryHumid: {
        probability: ((veryHumidDays / total) * 100).toFixed(1),
        threshold: humidityP90.toFixed(1),
        unit: "%",
        description: `Humedad superior a ${humidityP90.toFixed(1)}%`,
        occurrences: veryHumidDays,
      },
      rainy: {
        probability:
          precipitation.length > 0
            ? ((rainyDays / total) * 100).toFixed(1)
            : "0.0",
        threshold: "5.0",
        unit: "mm",
        description: "Precipitación superior a 5 mm/día",
        occurrences: rainyDays,
      },
      veryUncomfortable: {
        probability: ((uncomfortableDays / total) * 100).toFixed(1),
        description:
          "Condiciones generales incómodas (calor extremo, frío, o viento fuerte)",
        occurrences: uncomfortableDays,
      },
    };
  }

  calculateExpectedValues(historicalData) {
    const temps = historicalData.map((d) => d.temperature);
    const humidity = historicalData.map((d) => d.humidity);
    const windSpeed = historicalData.map((d) => d.windSpeed);
    const precipitation = historicalData
      .map((d) => d.precipitation)
      .filter((p) => p !== null && p !== -999);

    return {
      temperature: {
        average: this.average(temps).toFixed(1),
        min: Math.min(...temps).toFixed(1),
        max: Math.max(...temps).toFixed(1),
        p25: this.percentile(temps, 25).toFixed(1),
        p75: this.percentile(temps, 75).toFixed(1),
        unit: "°C",
      },
      humidity: {
        average: this.average(humidity).toFixed(1),
        min: Math.min(...humidity).toFixed(1),
        max: Math.max(...humidity).toFixed(1),
        unit: "%",
      },
      windSpeed: {
        average: this.average(windSpeed).toFixed(1),
        min: Math.min(...windSpeed).toFixed(1),
        max: Math.max(...windSpeed).toFixed(1),
        unit: "m/s",
      },
      precipitation: {
        average:
          precipitation.length > 0
            ? this.average(precipitation).toFixed(1)
            : "0.0",
        max:
          precipitation.length > 0
            ? Math.max(...precipitation).toFixed(1)
            : "0.0",
        unit: "mm",
      },
    };
  }

  analyzeDiscomfort(historicalData) {
    const discomfortScores = historicalData.map((day) => {
      let score = 0;
      const heatIndex = this.calculateHeatIndex(day.temperature, day.humidity);

      if (day.temperature > 35) score += 3;
      else if (day.temperature > 30) score += 2;
      else if (day.temperature < 0) score += 3;
      else if (day.temperature < 5) score += 2;

      if (day.humidity > 85) score += 2;
      else if (day.humidity > 75) score += 1;

      if (day.windSpeed > 15) score += 3;
      else if (day.windSpeed > 10) score += 2;
      else if (day.windSpeed > 7) score += 1;

      if (heatIndex > 32) score += 2;
      else if (heatIndex > 27) score += 1;

      return { date: day.date, score, heatIndex };
    });

    const avgScore = this.average(discomfortScores.map((d) => d.score));
    const comfortableDays = discomfortScores.filter((d) => d.score <= 2).length;
    const uncomfortableDays = discomfortScores.filter(
      (d) => d.score > 2
    ).length;

    let rating;
    if (avgScore < 2) rating = "comfortable";
    else if (avgScore < 4) rating = "moderate";
    else if (avgScore < 6) rating = "uncomfortable";
    else rating = "very_uncomfortable";

    return {
      rating,
      averageScore: avgScore.toFixed(2),
      comfortableDaysPercentage: (
        (comfortableDays / discomfortScores.length) *
        100
      ).toFixed(1),
      uncomfortableDaysPercentage: (
        (uncomfortableDays / discomfortScores.length) *
        100
      ).toFixed(1),
      description: this.getDiscomfortDescription(rating),
    };
  }

  calculateHeatIndex(tempC, humidity) {
    const T = tempC;
    const RH = humidity;
    const HI =
      T +
      0.5555 *
        (6.11 * Math.exp((5417.753 * (1 / 273.16 - 1 / (273.15 + 14))) / 1000) -
          10) *
        (RH / 100);

    return HI;
  }

  getDiscomfortDescription(rating) {
    const descriptions = {
      comfortable:
        "Condiciones generalmente cómodas para actividades al aire libre",
      moderate: "Condiciones moderadas, pueden requerir precauciones menores",
      uncomfortable:
        "Condiciones incómodas, se recomienda planificación cuidadosa",
      very_uncomfortable:
        "Condiciones muy incómodas, considere reprogramar actividades",
    };
    return descriptions[rating] || "";
  }

  percentile(arr, p) {
    const sorted = [...arr].sort((a, b) => a - b);
    const index = (p / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;

    if (lower === upper) return sorted[lower];
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  }

  average(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  formatDate(dateString) {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${year}-${month}-${day}`;
  }
}

export default WeatherProbabilityService;
