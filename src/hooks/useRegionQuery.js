import weatherApi from '@/api/weatherApi'
import { useQuery } from '@tanstack/react-query'

export const useAllRegion = () => {
  return useQuery({
    queryKey: ['regions'],
    queryFn: weatherApi.getAllRegion
  })
}
