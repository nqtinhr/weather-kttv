import { formatDateToYAFormat } from './format'

export function getStartAndEndTime(date) {
  const now = new Date()
  const isToday =
    date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate()

  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0)
  const end = isToday
    ? new Date(date.getFullYear(), date.getMonth(), date.getDate(), now.getHours(), 0)
    : new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 0)

  return {
    startDateTime: formatDateToYAFormat(start),
    endDateTime: formatDateToYAFormat(end)
  }
}

export function roundDownToNearestTenMinutes(dateTime) {
  const minutes = Math.floor(dateTime.getUTCMinutes() / 10) * 10
  return new Date(
    Date.UTC(
      dateTime.getUTCFullYear(),
      dateTime.getUTCMonth(),
      dateTime.getUTCDate(),
      dateTime.getUTCHours(),
      minutes,
      0
    )
  )
}

export function roundDownToNearestHour(dateTime) {
  return new Date(
    Date.UTC(dateTime.getUTCFullYear(), dateTime.getUTCMonth(), dateTime.getUTCDate(), dateTime.getUTCHours(), 0, 0)
  )
}

export function getInitialHour() {
  const now = new Date()
  let hour = now.getHours() - 1
  return hour >= 0 ? hour : 23 // nếu đang là 0h thì quay về 23h
}
