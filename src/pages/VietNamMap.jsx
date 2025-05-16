import { GeoJsonLoader } from '@/components/common/GeoJsonLoader'
import { MapMenu } from '@/components/common/MapMenu'
import { Slider } from '@/components/common/Slider'
import { FormFilter } from '@/components/form/FormFilter'
import { RainMap } from '@/components/map/RainMap'
import { TemperatureMap } from '@/components/map/TemperatureMap'
import { WaterLevelMap } from '@/components/map/WaterLevelMap'
import { WindMap } from '@/components/map/WindMap'
import COUNTRIES from '@/data/countries.json'
import PROVINCE from '@/data/province.json'
import { latLng, latLngBounds } from 'leaflet'
import { memo, useEffect } from 'react'
import { CircleMarker, MapContainer, TileLayer, Tooltip, useMap } from 'react-leaflet'
import { useSearchParams } from 'react-router-dom'
import './VietNamMap.css'
import { RAIN, TEMPERATURE, WATER_LEVEL, WIND } from '@/constants/common'

const MapSetup = () => {
  const map = useMap()

  useEffect(() => {
    const southWest = latLng(2.024354, 100.069445)
    const northEast = latLng(27.146849, 117.249689)
    latLngBounds(southWest, northEast)

    map.setView([16.0476, 108.2069], 6)
  }, [map])

  return null
}

export const VietNamMap = () => {
  console.log('VietNamMap rendered...')
  const mbUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'

  return (
    <div className='content'>
      <MapContainer center={[17.083098, 104.171154]} zoom={10}>
        <TileLayer url={mbUrl} />

        <GeoJsonLoader json={COUNTRIES} color='#ffffff' />
        <GeoJsonLoader json={PROVINCE} color='#ffffff' />

        <LayerSwitcher />

        <CircleMarker center={[10.335675, 112.740167]} pathOptions={{ fillColor: '#A3CCFF', radius: 0.01 }}>
          <Tooltip direction='bottom' permanent>
            QĐ Trường Sa
          </Tooltip>
        </CircleMarker>

        <CircleMarker center={[16.535675, 111.340167]} pathOptions={{ fillColor: '#A3CCFF', radius: 0.01 }}>
          <Tooltip direction='bottom' permanent>
            QĐ Hoàng Sa
          </Tooltip>
        </CircleMarker>
        <MapSetup />
      </MapContainer>
      <FormFilter />
      <MapMenu />
      <Slider />
    </div>
  )
}

const LayerSwitcher = memo(() => {
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type')

  switch (type) {
    case RAIN:
      return <RainMap />
    case WATER_LEVEL:
      return <WaterLevelMap />
    case TEMPERATURE:
      return <TemperatureMap />
    case WIND:
      return <WindMap />
    default:
      return null
  }
})
