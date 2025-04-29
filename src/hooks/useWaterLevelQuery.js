import weatherApi from "@/api/weatherApi"
import { useQuery } from "@tanstack/react-query"

export const useAllWaterLevel = (start, end, options = {}) => {
    return useQuery({
      queryKey: ['water-level', start, end],
      queryFn: () => weatherApi.getWaterLevelByAllTimeRange(start, end),
      enabled: !!start && !!end,
      ...options
    })
  }
  