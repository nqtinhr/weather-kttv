import weatherApi from '@/api/weatherApi';
import { useQuery } from '@tanstack/react-query';

export const useRainByTimeRangeAll = (start, end, options = {}) =>
  useQuery({
    queryKey: ['rain-all-time', start, end],
    queryFn: () => weatherApi.getRainByTimeRangeAll(start, end),
    enabled: !!start && !!end,
    ...options,
  });

export const useRainByTimeRange = (regId, start, end, options = {}) =>
  useQuery({
    queryKey: ['rain-time-range', regId, start, end],
    queryFn: () => weatherApi.getRainByTimeRange(regId, start, end),
    enabled: !!regId && !!start && !!end,
    ...options,
  });

export const useRainTimeseries = (stationId, start, end, options = {}) =>
  useQuery({
    queryKey: ['rain-timeseries', stationId, start, end],
    queryFn: () => weatherApi.getTimeseriesRain1h(stationId, start, end),
    enabled: !!stationId && !!start && !!end,
    ...options,
  });
