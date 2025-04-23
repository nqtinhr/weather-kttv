import RainForm from '../form/RainForm'

export const ChartModal = ({ station, onClose }) => {
  return (
    <div className='modal fade show' style={{ display: 'block' }} tabIndex='-1' role='dialog'>
      <div className='modal-dialog modal-dialog-centered modal-lg'>
        <div className='modal-content'>
          <div className='modal-header'>
            <button type='button' className='btn-close' onClick={onClose}></button>
          </div>
          <div className='modal-body'>
            <RainForm station={station} />
          </div>
        </div>
      </div>
    </div>
  )
}
