import weatherApi from '@/api/weatherApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useAllWaterLevel = (start, end, options = {}) => {
  return useQuery({
    queryKey: ['water-level-all-time', start, end],
    queryFn: () => weatherApi.getWaterLevelByAllTimeRange(start, end),
    enabled: !!start && !!end,
    ...options
  })
}

export const useTimeseriesWaterLevel = (stationId, startDateTime, endDateTime, options = {}) => {
  return useQuery({
    queryKey: ['timeseries-water-level', stationId, startDateTime, endDateTime],
    queryFn: () => weatherApi.getTimeseriesWaterLevel(stationId, startDateTime, endDateTime),
    enabled: !!stationId && !!startDateTime && !!endDateTime,
    ...options
  })
}

export const useWaterLevelForm = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ startDateTime, endDateTime }) => {
      const queryKey = ['water-level-all-time', startDateTime, endDateTime]

      const cachedData = queryClient.getQueryData(queryKey)
      if (cachedData) {
        return cachedData
      }

      const data = await weatherApi.getWaterLevelByAllTimeRange(startDateTime, endDateTime)

      // Lưu vào cache để dùng lại
      queryClient.setQueryData(queryKey, data)

      return data
    }
  })
}
