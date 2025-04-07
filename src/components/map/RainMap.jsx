// import weatherApi from '@/api/weatherApi'
// import { getStartAndEndTime } from '@/utils/helper'
import RAIN_DATA from '@/data/rain.json'
import { formatRainData } from '@/utils/format'
import { control, DomUtil } from 'leaflet'
import { useEffect, useState } from 'react'
import { CircleMarker, Popup, useMap } from 'react-leaflet'
import { Slider } from '../common/Slider'

export const RainMap = () => {
  const [rainData, setRainData] = useState([])
  const map = useMap()

  useEffect(() => {
    const fetchRainData = async () => {
      try {
        // const { startDateTime, endDateTime } = getStartAndEndTime(new Date())

        // const data = await weatherApi.getRainByTimeRangeAll(startDateTime, endDateTime)

        setRainData(formatRainData(RAIN_DATA))
      } catch (error) {
        console.error('Lỗi tải dữ liệu', error)
      }
    }
    fetchRainData()
  }, [])

  const classifyRainData = (rainData) => {
    const noData = []
    const validData = []
    const lightRain = []
    const moderateRain = []
    const heavyRain = []
    const veryHeavyRain = []

    rainData.forEach((stationInfo) => {
      const amount = parseFloat(stationInfo.rainAmount)

      switch (true) {
        case amount > 100:
          veryHeavyRain.push(stationInfo)
          break
        case amount >= 51 && amount <= 100:
          heavyRain.push(stationInfo)
          break
        case amount >= 16 && amount < 51:
          moderateRain.push(stationInfo)
          break
        case amount > 0 && amount < 16:
          lightRain.push(stationInfo)
          break
        case amount === 0:
          validData.push(stationInfo)
          break
        default:
          noData.push(stationInfo)
      }
    })
  }

  const getRainColor = (rainAmount) => {
    const amount = rainAmount
      
    if (amount > 100) return { color: '#FF4500', fillOpacity: 1 }  // Mưa rất to
    if (amount >= 51 && amount <= 100) return { color: '#FFFF00', fillOpacity: 1 }  // Mưa to
    if (amount >= 16 && amount < 51) return { color: '#00CC33', fillOpacity: 1 }  // Mưa vừa
    if (amount > 0 && amount < 16) return { color: '#3399FF', fillOpacity: 1 }  // Mưa nhỏ
    if (isNaN(amount) || amount === 0) return { color: '#808080', fillOpacity: 0 } // Không mưa, độ mờ là 0
    return { color: '#D3D3D3', fillOpacity: 0 } 
  }
  
  

  console.log(rainData)
  // Add legend
  useEffect(() => {
    const legend = control({ position: 'topright' })

    legend.onAdd = function () {
      const div = DomUtil.create('div', 'legend')
      div.innerHTML += '<h4>Chú giải</h4>'

      div.innerHTML += `
        <div className="legend-gradient" style="background: linear-gradient(to right, #ff0000, #ff9900, #66cc66, #3399ff, #000000, #808080);">
          <div className="legend-item" title="Mưa rất to (mưa > 100 mm)"></div>
          <div className="legend-item" title="Mưa to (mưa từ 51 – 100 mm)"></div>
          <div className="legend-item" title="Mưa vừa (mưa từ 16 – 50 mm)"></div>
          <div className="legend-item" title="Mưa nhỏ (mưa < 16 mm)"></div>
          <div className="legend-item" title="Không mưa"></div>
          <div className="legend-item" title="Không có dữ liệu"></div>
        </div>
      `

      return div
    }

    legend.addTo(map)

    return () => {
      legend.remove()
    }
  }, [map])

  return (
    <>
      {rainData.map((data, index) => {
        const { color, fillOpacity } = getRainColor(data.rainAmount)

        return (
          <CircleMarker
            key={index}
            center={[data.lat, data.long]}
            pathOptions={{ 
              color: color, 
              fillColor: color, 
              fillOpacity: fillOpacity,
              radius: 5
             }}
          >
            <Popup>
              <table className='table table-bordered table-striped table-sm'>
                <thead>
                  <tr>
                    <th colSpan='2' className='text-center'>Thông tin dữ liệu</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Mã trạm:</strong></td>
                    <td>{data.stationId}</td>
                  </tr>
                  <tr>
                    <td><strong>Tên trạm:</strong></td>
                    <td>{data.stationName}</td>
                  </tr>
                  <tr>
                    <td><strong>Địa chỉ:</strong></td>
                    <td>{data.address}</td>
                  </tr>
                  <tr>
                    <td><strong>Dự án:</strong></td>
                    <td>{data.stationTypeId}</td>
                  </tr>
                  <tr>
                    <td><strong>Tổng lượng mưa:</strong></td>
                    <td>{data.rainAmount !== '' ? data.rainAmount + 'mm' : 'không có dữ liệu'}</td>
                  </tr>
                </tbody>
              </table>
              <a href='#'>Xem biểu đồ</a>
            </Popup>
          </CircleMarker>
        )
      })}
      <Slider />
    </>
  )
}
