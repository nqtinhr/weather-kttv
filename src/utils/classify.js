import { WATER_LEVEL_URL } from '@/constants/image'

export const classifyRainColor = (rainAmount) => {
  const amount = parseFloat(rainAmount)

  if (amount > 100) return { color: '#FF4500', fillColor: '#FF4500', fillOpacity: 1, weight: 1.2 } // mưa rất to
  if (amount >= 51 && amount <= 100) return { color: '#FFFF00', fillColor: '#FFFF00', fillOpacity: 1, weight: 1.2 } // mưa to
  if (amount >= 16 && amount < 51) return { color: '#00CC33', fillColor: '#00CC33', fillOpacity: 1, weight: 1.2 } // mưa vừa
  if (amount > 0 && amount < 16) return { color: '#3399FF', fillColor: '#3399FF', fillOpacity: 1, weight: 1.2 } // mưa nhỏ

  return { color: '#D3D3D3', fillColor: '#D3D3D3', fillOpacity: 0, weight: 0.25 }
}

export const classifyWaterLevelWarning = (value, warnings) => {
  const v = parseFloat(value)
  const w1 = parseFloat(warnings.level1)
  const w2 = parseFloat(warnings.level2)
  const w3 = parseFloat(warnings.level3)

  if (isNaN(w1)) {
    return { iconUrl: WATER_LEVEL_URL.IMG_BLUEFLAG, iconSize: [20, 20] }
  }

  switch (true) {
    case v < w1:
      return { iconUrl: WATER_LEVEL_URL.IMG_BLUEFLAG, iconSize: [20, 20] } // Dưới báo động 1
    case v < w2 || isNaN(w2):
      return { iconUrl: WATER_LEVEL_URL.IMG_BD1, iconSize: [20, 20] } // Đạt BĐ1
    case v < w3 || isNaN(w3):
      return { iconUrl: WATER_LEVEL_URL.IMG_BD2, iconSize: [20, 20] } // Đạt BĐ2
    default:
      return { iconUrl: WATER_LEVEL_URL.IMG_BD3, iconSize: [30, 30] } // Đạt BĐ3
  }
}

export const classifyTemperature = (value) => {
  const iconFile = `${Math.round(parseFloat(value))}.png`
  const iconUrl = new URL(`/src/assets/images/numbers-icon/${iconFile}`, import.meta.url).href
  return { iconUrl, iconSize: [25, 25] }
}


export const classifyPressureColor = (value) => {
  const amount = parseFloat(value)

  if (amount > 100) return { color: '#6B8EFA', fillColor: '#6B8EFA' } 
  else return { color: '#F4A261', fillColor: '#F4A261' }
}