import weatherApi from '@/api/weatherApi';
import { useQuery } from '@tanstack/react-query';


export const useAllPressure = (start, end, options = {}) => {
  return useQuery({
    queryKey: ['pressure-all-time', start, end],
    queryFn: () => weatherApi.getPressureByAllTimeRange(start, end),
    enabled: !!start && !!end,
    ...options
  })
}