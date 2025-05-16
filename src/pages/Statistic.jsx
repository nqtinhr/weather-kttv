import { DataTable } from '@/components/common/DataTable'
import { DefaultForm } from '@/components/form/DefaultForm'
import React from 'react'

const Statistic = () => {
  return (
    <div className='container-fluid my-3'>
      <DefaultForm layout='horizontal' />
      <DataTable/>
    </div>
  )
}

export default Statistic
