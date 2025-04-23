import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

export const RainChart = ({ station }) => {
  const dataSeries = Object.entries(station.hourlyData).map(([hour, value]) => {
    const dateStr = `2025-04-08T${hour.padStart(2, '0')}:00:00Z`
    const timestamp = new Date(dateStr).getTime() + 7 * 3600 * 1000 // UTC+7
    return [timestamp, parseFloat(value)]
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
    series: [{
      name: 'Lượng mưa',
      data: dataSeries
    }],
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
