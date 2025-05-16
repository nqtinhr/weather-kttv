import { useTimeseriesRain1h } from '@/hooks/useRainQuery'
import { formatTimeseriesRain } from '@/utils/format'
import { useFilterStore } from '@/zustand/store'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useMemo } from 'react'

export const RainChart = ({ station }) => {
  const { startDateTime, endDateTime } = useFilterStore()
  const { data } = useTimeseriesRain1h(station.stationId, startDateTime, endDateTime)

  const timeseriesData = useMemo(() => {
    return data ? formatTimeseriesRain(data) : []
  }, [data])

  const dataSeries = timeseriesData.map(({ datetime, value }) => {
    const timestamp = new Date(datetime).getTime() + 7 * 60 * 60 * 1000
    return [timestamp, value]
  })

  const options = {
    chart: {
      type: 'column'
    },
    title: {
      text: `Biểu đồ chi tiết lượng mưa - ${station.stationName}`
    },
    xAxis: {
      type: 'datetime',
      title: { text: 'Thời gian' },
      labels: {
        format: '{value:%H:%M}',
        rotation: -45
      }
    },
    yAxis: {
      title: {
        text: 'Lượng mưa (mm)'
      }
    },
    series: [
      {
        name: 'Lượng mưa',
        data: dataSeries
      }
    ],
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    credits: {
      enabled: false
    }
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />
}
