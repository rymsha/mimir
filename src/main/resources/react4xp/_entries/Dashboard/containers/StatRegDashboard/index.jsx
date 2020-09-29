import React from 'react'
import PropTypes from 'prop-types'
import { Button, Table, Row, Col } from 'react-bootstrap'
import { RefreshCw } from 'react-feather'
import moment from 'moment'
import { Accordion } from '@statisticsnorway/ssb-component-library'
import { connect } from 'react-redux'
// import { getStatusesSaga } from './saga'
import { requestStatuses } from './selectors'

const SIMPLE_DATE_FORMAT = 'DD.MM.YYYY HH:mm'

class StatRegDashboard extends React.Component {
  componentDidMount() {
    this.props.requestStatuses()
  }
  // constructor(props) {
  //   super(props)

  // this.props.io.listenToConnectionEvent('open', (e) => this.onConnectionOpen(e))

  // if (this.props.io.isConnected) {
  //   this.onConnectionOpen()
  // }
  // }

  onConnectionOpen() {
    // this.setupListeners()
    // this.props.io.emit('statreg-dashboard-status')
  }

  //   setupListeners() {
  //     // get initial statreg statuses
  //     this.props.io.on('statreg-dashboard-status-result', (statRegStatuses) => {
  //       this.setState({
  //         loadingJobs: false,
  //         statRegStatuses
  //       })
  //     })

  //     // turn on spinner and block double refresh
  //     this.props.io.on('statreg-dashboard-refresh-start', (statRegKey) => {
  //       const {
  //         statRegStatuses
  //       } = this.props
  //       const status = statRegStatuses.find((s) => s.key === statRegKey)
  //       if (status) {
  //         status.loading = true
  //         this.setState({
  //           statRegStatuses
  //         })
  //       }
  //     })

  //     // update result
  //     this.props.io.on('statreg-dashboard-refresh-result', (newStatus) => {
  //       const {
  //         statRegStatuses
  //       } = this.props
  //       const oldStatus = statRegStatuses.find((s) => s.key === newStatus.key)
  //       if (oldStatus) {
  //         oldStatus.displayName = newStatus.displayName
  //         oldStatus.status = newStatus.status
  //         oldStatus.message = newStatus.message
  //         oldStatus.completionTime = newStatus.completionTime
  //         oldStatus.loading = false
  //       } else {
  //         statRegStatuses.push(newStatus)
  //       }
  //       this.setState({
  //         loadingJobs: false,
  //         statRegStatuses
  //       })
  //     })
  //   }

  statusIcon(status) {
    return status === 'Success' ? 'ok' : 'error'
  }

  formatDate(dateStr) {
    if (dateStr) {
      return moment(dateStr).format(SIMPLE_DATE_FORMAT)
    }
    return '-'
  }

  refreshStatReg(key) {
    const status = this.props.statuses.find((s) => s.key === key && !s.loading)
    if (status) {
      status.loading = true
      this.setState({
        statuses: this.props.statuses
      })
    //   this.props.io.emit('statreg-dashboard-refresh', [key])
    }
  }

  refreshAll() {
    const statRegStatusesNotLoading = this.props.statuses.filter((status) => !status.loading)
    statRegStatusesNotLoading.forEach((status) => {
      status.loading = true
    })
    // this.props.io.emit('statreg-dashboard-refresh', statRegStatusesNotLoading.map((status) => status.key))
    this.setState({
      statuses: this.props.statuses
    })
  }

  makeRefreshButton(statRegStatus) {
    return (
      <Button
        variant="primary"
        size="sm"
        className="mx-1"
        onClick={() => this.refreshStatReg(statRegStatus.key)}
        disabled={statRegStatus.loading}
      >
        { statRegStatus.loading ? <span className="spinner-border spinner-border-sm" /> : <RefreshCw size={16}/> }
      </Button>
    )
  }

  renderTable() {
    if (this.props.loading) {
      return (<span className="spinner-border spinner-border" />)
    }

    return (
      <Table bordered striped>
        <thead>
          <tr>
            <th className="roboto-bold">Spørring</th>
            <th className="roboto-bold">Sist oppdatert</th>
            <th className="roboto-bold">Siste aktivitet</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {this.props.statuses.map((statRegStatus, index) => {
            const {
              displayName,
              status,
              completionTime,
              message
            } = statRegStatus
            return (
              <tr key={index}>
                <td className={`${this.statusIcon(status)} dataset`}>
                  <a className="ssb-link my-0 text-capitalize" href="#">{displayName}</a>
                </td>
                <td>{this.formatDate(completionTime)}</td>
                <td>{message}</td>
                <td className="text-center">{this.makeRefreshButton(statRegStatus)}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    )
  }

  render() {
    return (
      <section className="xp-part part-dashboard container my-5">
        <Row>
          <Col>
            <div className="p-4 tables-wrapper">
              <h2 className="d-inline-block w-75">Data fra Statistikkregisteret</h2>
              <div className="d-inline-block float-right">
                <Button
                  onClick={() => this.refreshAll()}
                  disabled={this.props.statuses.filter((s) => s.loading).length === this.props.statuses.length}
                >
                  Oppdater data
                </Button>
              </div>
              <Accordion header="Status" className="mx-0" openByDefault={true}>
                {this.renderTable()}
              </Accordion>
            </div>
          </Col>
        </Row>
      </section>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    statuses: state.statReg.statuses,
    loading: state.statReg.loading
  }
}

function mapDispatchToProps(dispatch) {
  return {
    requestStatuses: () => requestStatuses()(dispatch)
  }
}

StatRegDashboard.propTypes = {
  statuses: PropTypes.arrayOf(PropTypes.shape({
    status: PropTypes.string,
    message: PropTypes.string,
    startTime: PropTypes.string,
    completionTime: PropTypes.string
  })),
  loading: PropTypes.bool,
  requestStatuses: PropTypes.func
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StatRegDashboard)
