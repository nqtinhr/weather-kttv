import { useSearchParams } from 'react-router-dom'
import { RainChart } from './RainChart'
import { TemperatureChart } from './TemperatureChart'
import { WatterLevelChart } from './WatterLevelChart'
import { WindChart } from './WindChart'
import { RAIN, TEMPERATURE, WATER_LEVEL, WIND } from '@/constants/common'

export const ChartModal = ({ station, onClose }) => {
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type')

  const renderChartByType = () => {
    switch (type) {
      case RAIN:
        return <RainChart station={station} />
      case WATER_LEVEL:
        return <WatterLevelChart station={station} />
      case TEMPERATURE:
        return <TemperatureChart station={station} />
      case WIND:
        return <WindChart station={station} />
      default:
        return <div>Không có biểu đồ phù hợp</div>
    }
  }

  return (
    <div className='modal fade show' style={{ display: 'block' }} tabIndex='-1' role='dialog'>
      <div className='modal-dialog modal-dialog-centered modal-xl'>
        <div className='modal-content'>
          <div className='modal-header'>
            <button type='button' className='btn-close' onClick={onClose}></button>
          </div>
          <div className='modal-body'>{renderChartByType()}</div>
        </div>
      </div>
    </div>
  )
}
