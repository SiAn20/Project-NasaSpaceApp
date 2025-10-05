import NasaService from "./nasa.service.js";

class HourlyProbabilityService {
  constructor() {
    this.nasaService = new NasaService();
  }

  /**
   * Calcula probabilidades de condiciones extremas para una fecha y HORA específica
   * basándose en datos históricos horarios
   */
  async calculateHourlyProbabilities({
    longitude,
    latitude,
    targetDate,
    targetHour,
    yearsBack = 5,
  }) {
    try {
      // Validar hora
      const hour = parseInt(targetHour);
      if (hour < 0 || hour > 23) {
        throw new Error("INVALID_HOUR");
      }

      // Extraer mes y día de la fecha objetivo
      const month = targetDate.substring(4, 6);
      const day = targetDate.substring(6, 8);
      const targetYear = parseInt(targetDate.substring(0, 4));

      // Calcular rango de años históricos
      const currentYear = new Date().getFullYear();
      const endYear = Math.min(targetYear - 1, currentYear);
      const startYear = Math.max(endYear - yearsBack + 1, 2001); // Datos horarios desde 2001

      // Obtener datos históricos horarios
      const historicalData = await this.fetchHistoricalHourlyData({
        longitude,
        latitude,
        month,
        day,
        hour,
        startYear,
        endYear,
      });

      if (historicalData.length === 0) {
        throw new Error("NO_HISTORICAL_DATA");
      }

      // Calcular probabilidades
      const probabilities =
        this.calculateHourlyExtremeProbabilities(historicalData);

      // Calcular valores esperados
      const expectedValues = this.calculateHourlyExpectedValues(historicalData);

      // Análisis de condiciones específicas de la hora
      const hourAnalysis = this.analyzeHourConditions(historicalData, hour);

      // Recomendaciones basadas en la hora
      const recommendations = this.generateHourlyRecommendations(
        probabilities,
        hourAnalysis,
        hour
      );

      return {
        success: true,
        location: { longitude, latitude },
        targetDate: this.formatDate(targetDate),
        targetHour: `${String(hour).padStart(2, "0")}:00`,
        analysis: {
          probabilities,
          expectedValues,
          hourAnalysis,
          recommendations,
          historicalSample: {
            hoursAnalyzed: historicalData.length,
            yearRange: `${startYear}-${endYear}`,
          },
        },
      };
    } catch (error) {
      console.error("Error in calculateHourlyProbabilities:", error);
      throw error;
    }
  }

  /**
   * Obtiene datos históricos para la misma fecha y hora en múltiples años
   */
  async fetchHistoricalHourlyData({
    longitude,
    latitude,
    month,
    day,
    hour,
    startYear,
    endYear,
  }) {
    const historicalData = [];

    // Obtener datos año por año
    for (let year = startYear; year <= endYear; year++) {
      try {
        // Obtener el día completo para extraer la hora específica
        const dateStr = `${year}${month}${day}`;

        const result = await this.nasaService.getHourlyWeatherData({
          longitude,
          latitude,
          startDate: dateStr,
          endDate: dateStr,
        });

        if (result.success && result.data.hourly.length > 0) {
          // Filtrar solo la hora específica
          const hourData = result.data.hourly.find((h) => h.hour === hour);

          if (hourData && this.isValidHourlyData(hourData)) {
            historicalData.push({
              ...hourData,
              year,
            });
          }
        }

        // Pequeño delay para no saturar la API
        await this.sleep(200);
      } catch (error) {
        console.warn(
          `No hourly data available for year ${year}:`,
          error.message
        );
        // Continuar con los demás años
      }
    }

    return historicalData;
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Valida que los datos horarios sean utilizables
   */
  isValidHourlyData(hourData) {
    return (
      hourData.temperature !== null &&
      hourData.temperature !== -999 &&
      hourData.humidity !== null &&
      hourData.humidity !== -999 &&
      hourData.windSpeed !== null &&
      hourData.windSpeed !== -999
    );
  }

  /**
   * Calcula probabilidades de condiciones extremas para una hora específica
   */
  calculateHourlyExtremeProbabilities(historicalData) {
    const temps = historicalData.map((d) => d.temperature);
    const humidity = historicalData.map((d) => d.humidity);
    const windSpeed = historicalData.map((d) => d.windSpeed);
    const precipitation = historicalData
      .map((d) => d.precipitation)
      .filter((p) => p !== null && p !== -999);

    // Calcular percentiles
    const tempP95 = this.percentile(temps, 95);
    const tempP5 = this.percentile(temps, 5);
    const windP90 = this.percentile(windSpeed, 90);
    const humidityP90 = this.percentile(humidity, 90);

    // Contar eventos extremos
    const veryHotHours = temps.filter((t) => t > tempP95).length;
    const veryColdHours = temps.filter((t) => t < tempP5).length;
    const veryWindyHours = windSpeed.filter((w) => w > windP90).length;
    const veryHumidHours = humidity.filter((h) => h > humidityP90).length;
    const rainyHours = precipitation.filter((p) => p > 2).length; // >2mm/hora

    const total = historicalData.length;

    // Calcular sensación térmica
    const uncomfortableHours = historicalData.filter((hour) => {
      const feelsLike = this.calculateFeelsLike(
        hour.temperature,
        hour.humidity,
        hour.windSpeed
      );
      return feelsLike > 28 || feelsLike < 3 || hour.windSpeed > 8;
    }).length;

    return {
      veryHot: {
        probability: ((veryHotHours / total) * 100).toFixed(1),
        threshold: tempP95.toFixed(1),
        unit: "°C",
        description: `Temperatura superior a ${tempP95.toFixed(1)}°C`,
        occurrences: veryHotHours,
      },
      veryCold: {
        probability: ((veryColdHours / total) * 100).toFixed(1),
        threshold: tempP5.toFixed(1),
        unit: "°C",
        description: `Temperatura inferior a ${tempP5.toFixed(1)}°C`,
        occurrences: veryColdHours,
      },
      veryWindy: {
        probability: ((veryWindyHours / total) * 100).toFixed(1),
        threshold: windP90.toFixed(1),
        unit: "m/s",
        description: `Viento superior a ${windP90.toFixed(1)} m/s`,
        occurrences: veryWindyHours,
      },
      veryHumid: {
        probability: ((veryHumidHours / total) * 100).toFixed(1),
        threshold: humidityP90.toFixed(1),
        unit: "%",
        description: `Humedad superior a ${humidityP90.toFixed(1)}%`,
        occurrences: veryHumidHours,
      },
      rainy: {
        probability:
          precipitation.length > 0
            ? ((rainyHours / total) * 100).toFixed(1)
            : "0.0",
        threshold: "2.0",
        unit: "mm/hora",
        description: "Precipitación superior a 2 mm/hora",
        occurrences: rainyHours,
      },
      veryUncomfortable: {
        probability: ((uncomfortableHours / total) * 100).toFixed(1),
        description:
          "Condiciones incómodas para esta hora (sensación térmica extrema o viento fuerte)",
        occurrences: uncomfortableHours,
      },
    };
  }

  /**
   * Calcula valores esperados para la hora específica
   */
  calculateHourlyExpectedValues(historicalData) {
    const temps = historicalData.map((d) => d.temperature);
    const humidity = historicalData.map((d) => d.humidity);
    const windSpeed = historicalData.map((d) => d.windSpeed);
    const precipitation = historicalData
      .map((d) => d.precipitation)
      .filter((p) => p !== null && p !== -999);

    // Calcular sensación térmica promedio
    const feelsLike = historicalData.map((d) =>
      this.calculateFeelsLike(d.temperature, d.humidity, d.windSpeed)
    );

    return {
      temperature: {
        average: this.average(temps).toFixed(1),
        min: Math.min(...temps).toFixed(1),
        max: Math.max(...temps).toFixed(1),
        p25: this.percentile(temps, 25).toFixed(1),
        p75: this.percentile(temps, 75).toFixed(1),
        unit: "°C",
      },
      feelsLike: {
        average: this.average(feelsLike).toFixed(1),
        min: Math.min(...feelsLike).toFixed(1),
        max: Math.max(...feelsLike).toFixed(1),
        unit: "°C",
        description: "Sensación térmica considerando viento y humedad",
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
            ? this.average(precipitation).toFixed(2)
            : "0.00",
        max:
          precipitation.length > 0
            ? Math.max(...precipitation).toFixed(2)
            : "0.00",
        unit: "mm/hora",
      },
    };
  }

  /**
   * Analiza condiciones específicas según la hora del día
   */
  analyzeHourConditions(historicalData, hour) {
    const avgTemp = this.average(historicalData.map((d) => d.temperature));
    const avgHumidity = this.average(historicalData.map((d) => d.humidity));
    const avgWind = this.average(historicalData.map((d) => d.windSpeed));
    const avgPrecip = this.average(
      historicalData
        .map((d) => d.precipitation)
        .filter((p) => p !== null && p !== -999)
    );

    // Determinar período del día
    let periodOfDay, periodDescription;
    if (hour >= 0 && hour < 6) {
      periodOfDay = "dawn";
      periodDescription = "Madrugada";
    } else if (hour >= 6 && hour < 12) {
      periodOfDay = "morning";
      periodDescription = "Mañana";
    } else if (hour >= 12 && hour < 18) {
      periodOfDay = "afternoon";
      periodDescription = "Tarde";
    } else {
      periodOfDay = "night";
      periodDescription = "Noche";
    }

    // Evaluar condiciones
    const conditions = {
      period: periodOfDay,
      periodDescription,
      temperature: {
        level: this.evaluateTemperature(avgTemp),
        value: avgTemp.toFixed(1),
      },
      humidity: {
        level: this.evaluateHumidity(avgHumidity),
        value: avgHumidity.toFixed(1),
      },
      wind: {
        level: this.evaluateWind(avgWind),
        value: avgWind.toFixed(1),
      },
      precipitation: {
        level: this.evaluatePrecipitation(avgPrecip),
        value: avgPrecip.toFixed(2),
      },
    };

    // Calcular visibilidad típica (basada en humedad y precipitación)
    const visibility = this.estimateVisibility(avgHumidity, avgPrecip);

    return {
      ...conditions,
      visibility,
      overallCondition: this.determineOverallCondition(conditions),
    };
  }

  /**
   * Calcula sensación térmica (Wind Chill + Heat Index combinado)
   */
  calculateFeelsLike(temp, humidity, windSpeed) {
    // Si hace frío y hay viento, usar Wind Chill
    if (temp <= 10 && windSpeed > 1.34) {
      const windKmh = windSpeed * 3.6;
      const windChill =
        13.12 +
        0.6215 * temp -
        11.37 * Math.pow(windKmh, 0.16) +
        0.3965 * temp * Math.pow(windKmh, 0.16);
      return windChill;
    }

    // Si hace calor y hay humedad, usar Heat Index
    if (temp >= 20 && humidity > 40) {
      const T = temp;
      const RH = humidity;
      const heatIndex =
        T +
        0.5555 *
          (6.11 *
            Math.exp((5417.753 * (1 / 273.16 - 1 / (273.15 + 14))) / 1000) -
            10) *
          (RH / 100);
      return heatIndex;
    }

    // En otros casos, retornar temperatura real
    return temp;
  }

  evaluateTemperature(temp) {
    if (temp < 0) return "muy_frio";
    if (temp < 10) return "frio";
    if (temp < 20) return "templado";
    if (temp < 30) return "calido";
    return "muy_caliente";
  }

  evaluateHumidity(humidity) {
    if (humidity < 30) return "seco";
    if (humidity < 60) return "confortable";
    if (humidity < 80) return "humedo";
    return "muy_humedo";
  }

  evaluateWind(wind) {
    if (wind < 2) return "calmo";
    if (wind < 5) return "brisa_ligera";
    if (wind < 8) return "brisa_moderada";
    if (wind < 12) return "viento_fuerte";
    return "muy_ventoso";
  }

  evaluatePrecipitation(precip) {
    if (precip < 0.1) return "sin_lluvia";
    if (precip < 1) return "llovizna";
    if (precip < 4) return "lluvia_moderada";
    return "lluvia_fuerte";
  }

  estimateVisibility(humidity, precip) {
    let visibility = "excelente";
    if (humidity > 90 || precip > 2) visibility = "reducida";
    else if (humidity > 80 || precip > 0.5) visibility = "buena";
    else if (humidity > 60) visibility = "muy_buena";

    return {
      level: visibility,
      description: this.getVisibilityDescription(visibility),
    };
  }

  getVisibilityDescription(level) {
    const descriptions = {
      excelente: "Visibilidad excelente",
      muy_buena: "Visibilidad muy buena",
      buena: "Visibilidad buena, posible neblina",
      reducida: "Visibilidad reducida por humedad o precipitación",
    };
    return descriptions[level];
  }

  determineOverallCondition(conditions) {
    const { temperature, humidity, wind, precipitation } = conditions;

    // Calcular puntuación de incomodidad
    let score = 0;
    if (["muy_frio", "muy_caliente"].includes(temperature.level)) score += 3;
    if (["frio", "calido"].includes(temperature.level)) score += 1;
    if (humidity.level === "muy_humedo") score += 2;
    if (wind.level === "muy_ventoso") score += 3;
    if (wind.level === "viento_fuerte") score += 2;
    if (["lluvia_fuerte", "lluvia_moderada"].includes(precipitation.level))
      score += 3;

    if (score === 0) return { rating: "ideal", color: "green" };
    if (score <= 2) return { rating: "bueno", color: "lightgreen" };
    if (score <= 4) return { rating: "aceptable", color: "yellow" };
    if (score <= 6) return { rating: "desafiante", color: "orange" };
    return { rating: "adverso", color: "red" };
  }

  /**
   * Genera recomendaciones específicas basadas en la hora
   */
  generateHourlyRecommendations(probabilities, hourAnalysis, hour) {
    const recommendations = {
      clothing: [],
      activities: [],
      precautions: [],
    };

    const { temperature, wind, precipitation } = hourAnalysis;

    // Recomendaciones de vestimenta
    if (temperature.level === "muy_frio" || temperature.level === "frio") {
      recommendations.clothing.push("Usar ropa abrigada y capas");
      if (wind.level === "viento_fuerte" || wind.level === "muy_ventoso") {
        recommendations.clothing.push(
          "Rompevientos o cortavientos recomendado"
        );
      }
    } else if (
      temperature.level === "calido" ||
      temperature.level === "muy_caliente"
    ) {
      recommendations.clothing.push("Ropa ligera y transpirable");
      recommendations.precautions.push("Mantenerse hidratado");
    }

    // Recomendaciones de actividades
    if (hourAnalysis.overallCondition.rating === "ideal") {
      recommendations.activities.push(
        "Excelente hora para actividades al aire libre"
      );
    } else if (hourAnalysis.overallCondition.rating === "bueno") {
      recommendations.activities.push(
        "Buen momento para actividades exteriores"
      );
    }

    if (precipitation.level === "lluvia_fuerte") {
      recommendations.precautions.push("Llevar paraguas o impermeable");
      recommendations.activities.push("Considerar actividades bajo techo");
    } else if (precipitation.level === "lluvia_moderada") {
      recommendations.precautions.push("Llevar paraguas");
    }

    // Recomendaciones según hora del día
    if (hour >= 12 && hour <= 15 && temperature.level === "muy_caliente") {
      recommendations.precautions.push(
        "Evitar exposición solar prolongada en horas pico"
      );
      recommendations.clothing.push("Usar protector solar y sombrero");
    }

    if (hour >= 0 && hour < 6 && temperature.level === "muy_frio") {
      recommendations.precautions.push(
        "Temperatura más baja del día, protección extra contra el frío"
      );
    }

    // Probabilidades altas
    if (parseFloat(probabilities.veryWindy.probability) > 30) {
      recommendations.precautions.push(
        `Alta probabilidad (${probabilities.veryWindy.probability}%) de vientos fuertes`
      );
    }

    if (parseFloat(probabilities.rainy.probability) > 40) {
      recommendations.precautions.push(
        `Alta probabilidad (${probabilities.rainy.probability}%) de lluvia`
      );
    }

    return recommendations;
  }

  // Utilidades matemáticas
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
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  formatDate(dateString) {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${year}-${month}-${day}`;
  }
}

export default HourlyProbabilityService;
