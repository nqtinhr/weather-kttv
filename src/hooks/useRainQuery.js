import weatherApi from '@/api/weatherApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useAllRain = (startDateTime, endDateTime, options = {}) =>
  useQuery({
    queryKey: ['rain-all-time', startDateTime, endDateTime],
    queryFn: () => weatherApi.getRainByAllTimeRange(startDateTime, endDateTime),
    enabled: !!startDateTime && !!endDateTime,
    ...options
  })

export const useRainByTimeRange = (regId, startDateTime, endDateTime, options = {}) =>
  useQuery({
    queryKey: ['rain-time-range', regId, startDateTime, endDateTime],
    queryFn: () => weatherApi.getRainByTimeRange(regId, startDateTime, endDateTime),
    enabled: !!regId && !!startDateTime && !!endDateTime,
    ...options
  })

export const useRainForm = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ region, startDateTime, endDateTime }) => {
      const queryKey = region
        ? ['rain-time-range', region, startDateTime, endDateTime]
        : ['rain-all-time', startDateTime, endDateTime]

      const cachedData = queryClient.getQueryData(queryKey)
      if (cachedData) return cachedData

      const data = region
        ? await weatherApi.getRainByTimeRange(region, startDateTime, endDateTime)
        : await weatherApi.getRainByAllTimeRange(startDateTime, endDateTime)

      queryClient.setQueryData(queryKey, data)
      return data
    }
  })
}

export const useTimeseriesRain1h = (stationId, startDateTime, endDateTime, options = {}) =>
  useQuery({
    queryKey: ['timeseries-rain-1h', stationId, startDateTime, endDateTime],
    queryFn: () => weatherApi.getTimeseriesRain1h(stationId, startDateTime, endDateTime),
    enabled: !!stationId && !!startDateTime && !!endDateTime,
    ...options
  })
