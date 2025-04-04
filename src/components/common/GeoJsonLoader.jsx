import L from 'leaflet'
import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'

export const GeoJsonLoader = ({ json, color }) => {
  const map = useMap()
  const geoJsonLayerRef = useRef(null)

  useEffect(() => {
    const loadGeoJson = async () => {
      try {
        const data = await json

        if (geoJsonLayerRef.current) {
          map.removeLayer(geoJsonLayerRef.current)
        }

        geoJsonLayerRef.current = L.geoJSON(data, {
          weight: 1.2,
          opacity: 0.9,
          fillOpacity: 0,
          color: color
        }).addTo(map)
      } catch (error) {
        console.error('Error loading GeoJSON:', error)
      }
    }
    loadGeoJson()
    return () => {
      if (geoJsonLayerRef.current) {
        map.removeLayer(geoJsonLayerRef.current)
      }
    }
  }, [map, json, color])

  return null
}
