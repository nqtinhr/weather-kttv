import weatherApi from '@/api/weatherApi'
import { useQuery } from '@tanstack/react-query'

export const useProvincesById = (provinceId, options = {}) => {
  return useQuery({
    queryKey: ['provinces', provinceId],
    queryFn: () => weatherApi.getProvincesById(provinceId),
    enabled: !!provinceId,
    ...options
  })
}
