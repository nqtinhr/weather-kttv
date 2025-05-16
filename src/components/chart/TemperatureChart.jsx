import { useTimeseriesTemperature } from '@/hooks/useTemperatureQuery'
import { formatTimeseriesTemperature } from '@/utils/format'
import { getPreviousOneDayRange } from '@/utils/helper'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useMemo } from 'react'

export const TemperatureChart = ({ station }) => {
  const { startDateTime, endDateTime } = getPreviousOneDayRange(new Date())
  const { data } = useTimeseriesTemperature(station.stationId, startDateTime, endDateTime)

  const timeseriesData = useMemo(() => {
    return data ? formatTimeseriesTemperature(data) : []
  }, [data])

  const t2mObj = timeseriesData.map((sersies) => [
    Date.UTC(sersies.year, sersies.month - 1, sersies.day, sersies.hour, sersies.minute),
    sersies.value
  ])

  const options = {
    title: {
      text: `Biểu đồ nhiệt độ: ${station.stationName}`
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Thời gian'
      }
    },
    yAxis: {
      tickWidth: 1,
      title: {
        text: 'Nhiệt độ ℃'
      },
      lineWidth: 1
    },
    credits: {
      enabled: false
    },
    series: [
      {
        type: 'line',
        name: 'Nhiệt độ',
        tooltip: {
          pointFormat: '<span style="color:{point.color}">\u25cf</span> {series.name}: <b>{point.y}</b><br/>',
          valueSuffix: ' ℃'
        },
        color: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [[0, '#0033cc']]
        },
        showInLegend: true, // hien thi muc nuoc
        data: t2mObj
      }
    ]
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />
}
