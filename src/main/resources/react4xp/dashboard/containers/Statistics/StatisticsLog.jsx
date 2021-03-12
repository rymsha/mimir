import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { WebSocketContext } from '../../utils/websocket/WebsocketProvider'
import { Button, Modal } from 'react-bootstrap'
import { requestStatisticsJobLog } from './actions'
import moment from 'moment/min/moment-with-locales'
import { groupBy } from 'ramda'
import { StatisticsLogJob } from './StatisticsLogJob'
import { selectStatisticsLogDataLoaded, selectStatistic } from './selectors'
import { AlertTriangle } from 'react-feather'
export function StatisticsLog(props) {
  const {
    statisticId
  } = props

  const io = useContext(WebSocketContext)
  const dispatch = useDispatch()
  const [show, setShow] = useState(false)
  const [firstOpen, setFirstOpen] = useState(true)
  const [accordionOpenStatus, setAccordionOpenStatus] = useState([])
  const [nestedAccordionStatus, setNestedAccordionStatus] = useState([])
  const statistic = useSelector(selectStatistic(statisticId))
  const logsLoaded = useSelector(selectStatisticsLogDataLoaded(statistic.id))
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const openEventlog = () => {
    if (firstOpen) {
      requestStatisticsJobLog(dispatch, io, statistic.id)
      setFirstOpen(false)
    }
    setShow(handleShow)
  }

  function setAccordionStatusOnIndex(index, status) {
    const tmp = accordionOpenStatus
    tmp[index] = status
    setAccordionOpenStatus(tmp)
  }

  function setNestedAccordionWithIndexes(logIndex, detailIndex, status) {
    const logs = nestedAccordionStatus
    const details = logs[logIndex] ? logs[logIndex] : []
    details[detailIndex] = status
    logs[logIndex] = details
    setNestedAccordionStatus(logs)
  }

  function renderLogData() {
    if (statistic && statistic.logData && statistic.logData.length > 0) {
      const log = statistic.logData[0]
      console.log(log)
      const groupedDataSourceLogs = groupBy((log) => {
        return log.status
      })(log.result)
      return (
        <React.Fragment>
          <span className="d-sm-block text-center small haveList" onClick={() => openEventlog()}>
            {log.message} - {moment(log.completionTime ? log.completionTime : log.startTime).locale('nb').format('DD.MM.YYYY HH.mm')}
            <br/>
            {log.user ? log.user.displayName : ''}
            <br/>
            {Object.entries(groupedDataSourceLogs).map(([status, dataSourceLogGroup]) => renderDataSourceLogGroup(log, status, dataSourceLogGroup))}
          </span>
          {show ? <ModalContent/> : null}
        </React.Fragment>
      )
    }
    return <span className="d-sm-block text-center small">Ingen logger</span>
  }

  function renderDataSourceLogGroup(log, status, dataSourceLogGroup) {
    const tbmls = dataSourceLogGroup.map((datasource) => {
      const relatedTable = statistic.relatedTables.find((r) => r.queryId === datasource.id)
      return relatedTable ? relatedTable.tbmlId : ''
    }).join(', ')

    // TODO: status will never go to error.
    // possible solution: check against response code status. changes need to be made in statistics.ts in getStatisticsJobLogInfo?
    return (
      <React.Fragment key={`${log.id}_${status}`}>
        {/* {status === 'ERROR' && <AlertTriangle size="12" color="#FF4500" className="mr-1" />} */}
        {status} - {tbmls} <br/>
      </React.Fragment>
    )
  }

  function renderModalBody() {
    if (logsLoaded) {
      return (
        statistic.logData.map((log, index) => {
          return (
            <StatisticsLogJob
              key={index}
              index={index}
              statisticId={statistic.id}
              jobId={statistic.logData[index].id}
              accordionOpenStatus={!!accordionOpenStatus[index]}
              setAccordionStatusOnIndex={setAccordionStatusOnIndex}
              nestedAccordionStatus={nestedAccordionStatus[index]}
              setNestedAccordionWithIndexes={setNestedAccordionWithIndexes}
            />
          )
        })
      )
    }

    return (
      <span className="spinner-border spinner-border" />
    )
  }


  const ModalContent = () => {
    return (
      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {statistic.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3>Logg detaljer</h3>
          {renderModalBody()}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Lukk</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  return (
    renderLogData()
  )
}

StatisticsLog.propTypes = {
  statisticId: PropTypes.string
}
