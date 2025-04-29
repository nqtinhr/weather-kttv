export const getRainColor = (rainAmount) => {
  const amount = parseFloat(rainAmount)

  if (amount > 100) return { color: '#FF4500', fillColor: '#FF4500', fillOpacity: 1, weight: 1.2 } // mưa rất to
  if (amount >= 51 && amount <= 100) return { color: '#FFFF00', fillColor: '#FFFF00', fillOpacity: 1, weight: 1.2 } // mưa to
  if (amount >= 16 && amount < 51) return { color: '#00CC33', fillColor: '#00CC33', fillOpacity: 1, weight: 1.2 } // mưa vừa
  if (amount > 0 && amount < 16) return { color: '#3399FF', fillColor: '#3399FF', fillOpacity: 1, weight: 1.2 } // mưa nhỏ

  return { color: '#D3D3D3', fillColor: '#D3D3D3', fillOpacity: 0, weight: 0.25 }
}

