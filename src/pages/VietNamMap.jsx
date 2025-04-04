import { FormFilter } from '@/components/common/FormFilter'
import { GeoJsonLoader } from '@/components/common/GeoJsonLoader'
import { MapMenu } from '@/components/common/MapMenu'
import { Slider } from '@/components/common/Slider'
import COUNTRIES from '@/data/countries.json'
import PROVINCE from '@/data/province.json'
import L from 'leaflet'
import { useEffect } from 'react'
import { CircleMarker, MapContainer, TileLayer, Tooltip, useMap } from 'react-leaflet'
import './VietNamMap.css'
import { RainMap } from '@/components/map/RainMap'

const MapSetup = () => {
  const map = useMap()

  useEffect(() => {
    const southWest = L.latLng(2.024354, 100.069445)
    const northEast = L.latLng(27.146849, 117.249689)
    L.latLngBounds(southWest, northEast)

    map.setView([16.0476, 108.2069], 6)
  }, [map])

  return null
}

export const VietNamMap = () => {
  const mbUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'

  return (
    <div className='content'>
      <MapContainer center={[17.083098, 104.171154]} zoom={10}>
        <TileLayer url={mbUrl} />

        <GeoJsonLoader json={COUNTRIES} color='#ffffff' />
        <GeoJsonLoader json={PROVINCE} color='#ffffff' />

        <RainMap/>

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
