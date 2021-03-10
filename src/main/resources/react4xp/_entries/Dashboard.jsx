/**
*
* App
*
* This component is the skeleton around the actual pages, and should only
* contain code that should be seen on all pages. (e.g. navigation bar)
*/

import * as React from 'react'
import { Provider, useDispatch } from 'react-redux'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Switch, Route, BrowserRouter } from 'react-router-dom'

import { HomePage } from '../dashboard/containers/HomePage/index'
import WebsocketProvider, { WebSocketContext } from '../dashboard/utils/websocket/WebsocketProvider'
import { configureAppStore } from '../dashboard/store/configureStore'
import { requestStatuses } from '../dashboard/containers/StatRegDashboard/actions'
import { requestStatistics, requestStatisticsSearchList } from '../dashboard/containers/Statistics/actions'
import { actions as commonActions } from '../dashboard/containers/HomePage/slice'
import PropTypes from 'prop-types'
import { setUserServerSide, requestServerTime } from '../dashboard/containers/HomePage/actions'
import { requestJobs } from '../dashboard/containers/Jobs/actions'

function Dashboard(props) {
  return (
    <Provider store={configureAppStore()}>
      <WebsocketProvider>
        <HelmetProvider>
          <DashboardRouter
            user={props.user}
            dashboardOptionsForUser={props.dashboardOptionsForUser}
            contentStudioBaseUrl={props.contentStudioBaseUrl}
            dataToolBoxBaseUrl={props.dataToolBoxBaseUrl}
            internalBaseUrl={props.internalBaseUrl}
            internalStatbankUrl={props.internalStatbankUrl} />
        </HelmetProvider>
      </WebsocketProvider>
    </Provider>
  )
}

Dashboard.propTypes = {
  user: PropTypes.object,
  dashboardOptionsForUser: PropTypes.shape({
    dashboardTools: PropTypes.bool,
    statistics: PropTypes.bool,
    jobLogs: PropTypes.bool,
    dataSources: PropTypes.bool,
    statisticRegister: PropTypes.bool
  }),
  contentStudioBaseUrl: PropTypes.string,
  dataToolBoxBaseUrl: PropTypes.string,
  internalBaseUrl: PropTypes.string,
  internalStatbankUrl: PropTypes.string
}

function DashboardRouter(props) {
  // all initial fetches
  const dispatch = useDispatch()
  const io = React.useContext(WebSocketContext)
  io.setup(dispatch)
  dispatch({
    type: commonActions.setUser.type,
    user: props.user
  })
  dispatch({
    type: commonActions.setDashboardOptions.type,
    dashboardOptions: props.dashboardOptionsForUser
  })
  dispatch({
    type: commonActions.setContentStudioBaseUrl.type,
    contentStudioBaseUrl: props.contentStudioBaseUrl
  })
  dispatch({
    type: commonActions.setDataToolBoxBaseUrl.type,
    dataToolBoxBaseUrl: props.dataToolBoxBaseUrl
  })
  dispatch({
    type: commonActions.setInternalBaseUrl.type,
    internalBaseUrl: props.internalBaseUrl
  })
  dispatch({
    type: commonActions.setInternalStatbankUrl.type,
    internalStatbankUrl: props.internalStatbankUrl
  })
  setUserServerSide(dispatch, io, props.user)
  if (props.dashboardOptionsForUser.statistics) requestStatistics(dispatch, io)
  if (props.dashboardOptionsForUser.dashboardTools) requestStatisticsSearchList(dispatch, io)
  if (props.dashboardOptionsForUser.statisticRegister) requestStatuses(dispatch, io)
  if (props.dashboardOptionsForUser.jobLogs) requestJobs(dispatch, io)
  requestServerTime(dispatch, io)
  return (
    <BrowserRouter>
      <Helmet
        titleTemplate="SSB Dashboard"
        defaultTitle="SSB Dashboard"
      >
      </Helmet>

      <Switch>
        <Route path="/" component={HomePage} />
      </Switch>
    </BrowserRouter>
  )
}

DashboardRouter.propTypes = {
  user: PropTypes.object,
  dashboardOptionsForUser: PropTypes.shape({
    dashboardTools: PropTypes.bool,
    statistics: PropTypes.bool,
    jobLogs: PropTypes.bool,
    dataSources: PropTypes.bool,
    statisticRegister: PropTypes.bool
  }),
  contentStudioBaseUrl: PropTypes.string,
  dataToolBoxBaseUrl: PropTypes.string,
  internalBaseUrl: PropTypes.string,
  internalStatbankUrl: PropTypes.string
}

export default (props) => <Dashboard {...props} />
