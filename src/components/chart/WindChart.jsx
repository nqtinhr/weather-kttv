import { useTimeseriesWind10m } from '@/hooks/useWindQuery'
import { formatTimeseriesWind } from '@/utils/format'
import { getPreviousOneDayRange } from '@/utils/helper'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
// import HighchartsMore from 'highcharts/highcharts-more'
// import Windbarb from 'highcharts/modules/windbarb'
import { useMemo } from 'react'

// HighchartsMore(Highcharts); 
// Windbarb(Highcharts);
export const WindChart = ({ station }) => {
  const { startDateTime, endDateTime } = getPreviousOneDayRange(new Date( ))
  const { data } = useTimeseriesWind10m(station.stationId, startDateTime, endDateTime)

  const timeseriesData = useMemo(() => {
    return data ? formatTimeseriesWind(data) : []
  }, [data])
  console.log("🚀 ~ timeseriesData ~ timeseriesData:", timeseriesData)

  const windBards = [];
  const windBardMarkers = [];
  const windBardLines = [];
  
  timeseriesData.forEach(({ year, month, day, hour, minute, ff10m, dd10m, fxfx }) => {
    const timestamp = Date.UTC(year, month - 1, day, hour, minute);
    const speed = parseFloat(ff10m);
    const direction = parseFloat(dd10m);
    const gust = parseFloat(fxfx);
  
    const point = [timestamp, speed, direction];
    const gustPoint = [timestamp, gust];
  
    windBardMarkers.push(point);
    windBards.push(point);
    windBardLines.push(gustPoint);
  });
  

  const options = {
    title: {
        text: `Biểu đồ tốc độ gió Trạm: ${station.stationName}`,
    },
    xAxis: {
        type: 'datetime',
        offset: 40
    },
    yAxis: {
        title: {
            text: null
        }
    },
    credits: {
        enabled: false
    },
    series: [
        // {
        //     type: 'windbarb',
        //     keys: ['x', 'value', 'direction'], // Thứ tự: timestamp, tốc độ gió, hướng gió
        //     data: windBardMarkers,
        //     name: 'Cờ gió',
        //     color: Highcharts.getOptions().colors[1],
        //     tooltip: {
        //         pointFormat: '<span style="color:{point.color}">\u25cf</span> Tốc độ gió: <b>{point.value} m/s</b>, Hướng gió: <b>{point.direction}</b><br/>',
        //         valueSuffix: ' m/s'
        //     }
        // },
        {
            type: 'area',
            keys: ['x', 'y', 'rotation'],
            data: windBards,
            name: 'Tốc độ gió',
            color: Highcharts.getOptions().colors[0],
            tooltip: {
                pointFormat: '<span style="color:{point.color}">\u25cf</span> {series.name}: <b>{point.y}</b>, Hướng gió: <b>{point.rotation} </b><br/>',
                valueSuffix: ' m/s'
            }
        },
        {
            type: 'line',
            keys: ['x', 'y', 'rotation'],
            data: windBardLines,
            name: 'Tốc độ gió giật',
            color: Highcharts.getOptions().colors[8],
            tooltip: {
                valueSuffix: ' m/s'
            }
        }
    ]
}

  return <HighchartsReact highcharts={Highcharts} options={options} />
}
