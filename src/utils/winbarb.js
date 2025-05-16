import { icon } from 'leaflet'

export function createWindBarbIcon({ speed, deg }) {
  const size = 40
  const stroke = 'rgb(0, 255, 102)'

  const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <g transform="translate(${size / 2}, ${size / 2}) rotate(${deg})">
          <line x1="0" y1="0" x2="0" y2="-15" stroke="${stroke}" stroke-width="2"/>
          ${
            speed >= 25
              ? `<polygon points="0,-15 10,-10 0,-5" fill="${stroke}"/>`
              : speed >= 15
              ? `<line x1="0" y1="-15" x2="10" y2="-10" stroke="${stroke}" stroke-width="2"/>`
              : `<line x1="0" y1="-10" x2="5" y2="-5" stroke="${stroke}" stroke-width="2"/>`
          }
        </g>
      </svg>
    `

  const iconUrl = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg)

  return icon({
    iconUrl,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  })
}
