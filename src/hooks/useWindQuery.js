import weatherApi from '@/api/weatherApi';
import { useQuery } from '@tanstack/react-query';


export const useAllWind = (start, end, options = {}) => {
  return useQuery({
    queryKey: ['wind', start, end],
    queryFn: () => weatherApi.getWindByAllTimeRange(start, end),
    enabled: !!start && !!end,
    ...options
  })
}