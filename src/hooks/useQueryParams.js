import { RAIN } from '@/constants/common'
import { getStartAndEndTime } from '@/utils/helper'
import React from 'react'
import { useSearchParams } from 'react-router-dom'

export const useQueryParams = () => {
    const [searchParams] = useSearchParams()
    const { startDateTime, endDateTime } = getStartAndEndTime(new Date())
  
    const type = searchParams.get('type') || RAIN
    const startDate = searchParams.get('start') || startDateTime
    const endDate = searchParams.get('end') || endDateTime
  
    return { type, startDate, endDate }
}
