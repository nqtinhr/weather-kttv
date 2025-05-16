import { useTimeseriesWaterLevel } from '@/hooks/useWaterLevelQuery'
import { formatTimeseriesWaterLevel } from '@/utils/format'
import { getPreviousOneDayRange } from '@/utils/helper'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useMemo } from 'react'

export const WatterLevelChart = ({ station }) => {
  const { startDateTime, endDateTime } = getPreviousOneDayRange(new Date())
  const { data } = useTimeseriesWaterLevel(station.stationId, startDateTime, endDateTime)

  const timeseriesData = useMemo(() => {
    return data ? formatTimeseriesWaterLevel(data) : []
  }, [data])

  const waterLevelObjs = useMemo(() => {
    const level0 = []
    const level1 = []
    const level2 = []
    const level3 = []

    for (const marker of timeseriesData) {
      const time = Date.UTC(marker.year, marker.month - 1, marker.day, marker.hour, marker.minute)
      level0.push([time, marker.value])
      level1.push([time, marker.warnings.level1])
      level2.push([time, marker.warnings.level2])
      level3.push([time, marker.warnings.level3])
    }

    return [level0, level1, level2, level3]
  }, [timeseriesData])

  const options = {
    title: {
      text: `Biểu đồ mực nước Trạm: ${station.stationName}`
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Thời gian'
      }
    },
    yAxis: {
      title: {
        text: 'Mực nước (cm)'
      }
    },
    credits: {
      enabled: false
    },
    series: [
      {
        type: 'line',
        name: 'Mực nước',
        tooltip: {
          pointFormat: '<span style="color:{point.color}">\u25cf</span> {series.name}: <b>{point.y}</b><br/>',
          valueSuffix: ' cm'
        },
        color: Highcharts.getOptions().colors[0],
        showInLegend: true, // muc nuoc
        data: waterLevelObjs[0]
      },
      {
        type: 'line',
        name: 'Mức báo động cấp độ 1',
        tooltip: {
          pointFormat: '<span style="color:{point.color}">\u25cf</span> {series.name}: <b>{point.y}</b><br/>',
          valueSuffix: ' cm'
        },
        color: Highcharts.getOptions().colors[6],
        showInLegend: true, // muc bao dong c1
        data: waterLevelObjs[1]
      },
      {
        type: 'line',
        name: 'Mức báo động cấp độ 2',
        tooltip: {
          pointFormat: '<span style="color:{point.color}">\u25cf</span> {series.name}: <b>{point.y}</b><br/>',
          valueSuffix: ' cm'
        },
        color: Highcharts.getOptions().colors[3],
        showInLegend: true, // muc bao dong c2
        data: waterLevelObjs[2]
      },
      {
        type: 'line',
        name: 'Mức báo động cấp độ 3',
        tooltip: {
          pointFormat: '<span style="color:{point.color}">\u25cf</span> {series.name}: <b>{point.y}</b><br/>',
          valueSuffix: ' cm'
        },
        color: Highcharts.getOptions().colors[5],
        showInLegend: true, // muc bao dong c3
        data: waterLevelObjs[3]
      }
    ]
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />
}
