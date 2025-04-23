import weatherApi from '@/api/weatherApi'
import { useQuery } from '@tanstack/react-query'

export const useAllTemperature = (start, end, options = {}) => {
  return useQuery({
    queryKey: ['temperature', start, end],
    queryFn: () => weatherApi.getTemperatureByAllTimeRange(start, end),
    enabled: !!start && !!end,
    ...options
  })
}
