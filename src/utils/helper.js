export function formatDateToYAFormat(date) {
  const pad = (n) => n.toString().padStart(2, '0')
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}00Z`
}

export function getStartAndEndTime(startDateTime) {
  const now = new Date()
  const localNow = new Date(now.getTime() + 7 * 60 * 60 * 1000) // UTC+7
const startOfDay = new Date(localNow);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(localNow)
  endOfDay.setHours(localNow.getHours() - 1, 0, 0, 0)

  const timeRange = { startDateTime: '', endDateTime: '' }

  if (startDateTime.toDateString() === localNow.toDateString()) {
    timeRange.startDateTime = formatDateToYAFormat(startOfDay)
    timeRange.endDateTime = formatDateToYAFormat(endOfDay)
  } else {
    const inputDate = new Date(startDateTime.getTime() + 7 * 60 * 60 * 1000)
    const startOfInputDay = new Date(inputDate.setHours(0, 0, 0, 0))
    const endOfInputDay = new Date(inputDate.setHours(23, 0, 0, 0))

    timeRange.startDateTime = formatDateToYAFormat(startOfInputDay)
    timeRange.endDateTime = formatDateToYAFormat(endOfInputDay)
  }

  return timeRange
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
