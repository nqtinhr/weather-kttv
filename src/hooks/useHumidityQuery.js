import weatherApi from '@/api/weatherApi';
import { useQuery } from '@tanstack/react-query';


export const useAllHumidity = (start, end, options = {}) => {
  return useQuery({
    queryKey: ['humidity', start, end],
    queryFn: () => weatherApi.getHumidityByAllTimeRange(start, end),
    enabled: !!start && !!end,
    ...options
  })
}