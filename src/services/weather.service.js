import axios from 'axios';
import { config } from '../config/index.js';
import { AppError } from '../errors/AppError.js';

export const weatherService = {
  async getForecast(lat, lon) {
    try {
      const { data } = await axios.get(config.weather.apiUrl, {
        params: {
          latitude: lat,
          longitude: lon,
          hourly: 'temperature_2m,precipitation,windspeed_10m',
        },
        timeout: config.weather.timeoutMs,
      });

      const wind = data.hourly?.windspeed_10m?.[0] ?? 0;
      const precipitation = data.hourly?.precipitation?.[0] ?? 0;

      return {
        forecast: {
          temperature: data.hourly?.temperature_2m?.[0] ?? null,
          wind,
          precipitation,
        },
        suitableForOutdoorWork:
          wind < config.weather.windThreshold && precipitation === 0,
      };
    } catch (err) {
      throw new AppError('Сервис погоды временно недоступен', {
        status: 503,
        code: 'WEATHER_UNAVAILABLE',
        cause: err,
      });
    }
  },
};