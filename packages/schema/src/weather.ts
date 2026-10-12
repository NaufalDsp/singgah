import { z } from 'zod';

export const WeatherDailyForecastSchema = z.object({
  date: z.string(),
  day_label: z.string(), // "Sen", "Sel", etc.
  tmax_c: z.number(),
  tmin_c: z.number(),
  precipitation_probability: z.number().min(0).max(100),
  condition: z.string(),
});
export type WeatherDailyForecast = z.infer<typeof WeatherDailyForecastSchema>;

export const WeatherResponseSchema = z.object({
  destination_slug: z.string(),
  temperature_c: z.number(),
  feels_like_c: z.number(),
  condition: z.string(), // Bahasa Indonesia (e.g., "Cerah berawan")
  wind_kmh: z.number(),
  rain_probability: z.number().min(0).max(100),
  forecast_7d: z.array(WeatherDailyForecastSchema),
  attribution: z.literal('Open-Meteo (CC BY 4.0)'),
  updated_at: z.string(),
});
export type WeatherResponse = z.infer<typeof WeatherResponseSchema>;
