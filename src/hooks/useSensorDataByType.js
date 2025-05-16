import { HUMIDITY, PRESSURE, RAIN, TEMPERATURE, WATER_LEVEL, WIND } from '@/constants/common'
import { useAllRain } from './useRainQuery'
import { useAllTemperature } from './useTemperatureQuery'
import { useAllWaterLevel } from './useWaterLevelQuery'
import { useAllWind } from './useWindQuery'
import { useAllPressure } from './usePressureQuery'
import { useAllHumidity } from './useHumidityQuery'

export function useSensorDataByType(type, startDateTime, endDateTime) {
  const rain = useAllRain(startDateTime, endDateTime, { enabled: type === RAIN })
  const water = useAllWaterLevel(startDateTime, endDateTime, { enabled: type === WATER_LEVEL })
  const temperature = useAllTemperature(startDateTime, endDateTime, { enabled: type === TEMPERATURE })
  const wind = useAllWind(startDateTime, endDateTime, { enabled: type === WIND })
  const pressure = useAllPressure(startDateTime, endDateTime, { enabled: type === PRESSURE })
  const humidity = useAllHumidity(startDateTime, endDateTime, { enabled: type === HUMIDITY })

  if (type === RAIN) return rain
  if (type === WATER_LEVEL) return water
  if (type === TEMPERATURE) return temperature
  if (type === WIND) return wind
  if (type === PRESSURE) return pressure
  if (type === HUMIDITY) return humidity

  return { data: [], isLoading: false, error: null }
}
