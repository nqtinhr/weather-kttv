import weatherApi from '@/api/weatherApi'
import { useMutation, useQuery } from '@tanstack/react-query'

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

export const useRainForm = () =>
  useMutation({
    mutationFn: async ({ region, startDateTime, endDateTime }) => {
      if (region) {
        return weatherApi.getRainByTimeRange(region, startDateTime, endDateTime)
      } else {
        return weatherApi.getRainByAllTimeRange(startDateTime, endDateTime)
      }
    }
  })
