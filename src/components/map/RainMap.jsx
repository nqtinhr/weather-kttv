// import weatherApi from '@/api/weatherApi'
// import { getStartAndEndTime } from '@/utils/helper'
import { useEffect, useState } from 'react'
import { CircleMarker, Popup } from 'react-leaflet'
import RAIN_DATA from '@/data/rain.json'

export const RainMap = () => {
  const [rainData, setRainData] = useState([])

  useEffect(() => {
    const fetchRainData = async () => {
      try {
        // const { startDateTime, endDateTime } = getStartAndEndTime(new Date())

        // const data = await weatherApi.getRainByTimeRangeAll(startDateTime, endDateTime)

        const normalizedData = RAIN_DATA.map(d => ({
          ...d,
          lat: d.Latitude, 
          lng: d.Longitude
        }))

        setRainData(normalizedData)
      } catch (error) {
        console.error('Lỗi tải dữ liệu', error)
      }
    }

    fetchRainData()
  }, [])

  return (
    <>
      {rainData.map((data, index) => (
        <CircleMarker
          key={index}
          center={[data.lat, data.lng]}
          pathOptions={{ fillColor: '#FF0000', radius: 6 }}>
          <Popup>
            <div>
              <p><strong>Trạm:</strong> {data.stationName}</p> {/* Tên trạm giả sử có */}
              <p><strong>Tổng lượng mưa:</strong> {data.rainAmount ? `${data.rainAmount} mm` : 'Không có dữ liệu'}</p>
              <p><strong>Địa chỉ:</strong> {data.address}</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </>
  )
}
