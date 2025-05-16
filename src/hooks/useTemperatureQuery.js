import weatherApi from '@/api/weatherApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useAllTemperature = (start, end, options = {}) => {
  return useQuery({
    queryKey: ['temperature-all-time', start, end],
    queryFn: () => weatherApi.getTemperatureByAllTimeRange(start, end),
    enabled: !!start && !!end,
    ...options
  })
}

export const useTimeseriesTemperature = (stationId, startDateTime, endDateTime, options = {}) => {
  return useQuery({
    queryKey: ['timeseries-temperature', stationId, startDateTime, endDateTime],
    queryFn: () => weatherApi.getTimeseriesTemperature(stationId, startDateTime, endDateTime),
    enabled: !!stationId && !!startDateTime && !!endDateTime,
    ...options
  })
}
export const useTemperatureForm = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ startDateTime, endDateTime }) => {
      const queryKey = ['temperature-all-time', startDateTime, endDateTime]
      
      const cachedData = queryClient.getQueryData(queryKey)
      if (cachedData) {
        return cachedData
      }

      const data = await weatherApi.getTemperatureByAllTimeRange(startDateTime, endDateTime)
      
      // Lưu vào cache để dùng lại
      queryClient.setQueryData(queryKey, data)

      return data
    }
  })
}