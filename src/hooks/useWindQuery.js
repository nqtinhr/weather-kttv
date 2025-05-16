import weatherApi from '@/api/weatherApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useAllWind = (start, end, options = {}) => {
  return useQuery({
    queryKey: ['wind-all-time', start, end],
    queryFn: () => weatherApi.getWindByAllTimeRange(start, end),
    enabled: !!start && !!end,
    ...options
  })
}

export const useTimeseriesWind10m = (stationId, startDateTime, endDateTime, options = {}) => {
  return useQuery({
    queryKey: ['timeseries-wind', stationId, startDateTime, endDateTime],
    queryFn: () => weatherApi.getTimeseriesWind10m(stationId, startDateTime, endDateTime),
    enabled: !!stationId && !!startDateTime && !!endDateTime,
    ...options
  })
}

export const useWindForm = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ startDateTime, endDateTime }) => {
      const queryKey = ['wind-all-time', startDateTime, endDateTime]

      const cachedData = queryClient.getQueryData(queryKey)
      if (cachedData) {
        return cachedData
      }

      const data = await weatherApi.getWindByAllTimeRange(startDateTime, endDateTime)

      // Lưu vào cache để dùng lại
      queryClient.setQueryData(queryKey, data)

      return data
    }
  })
}
