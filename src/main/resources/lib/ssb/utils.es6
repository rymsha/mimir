import {Image} from 'enonic-types/lib/content';

const {
  getPhrases
} = __non_webpack_require__( '/lib/language')
const {
  list: listOperationsAlerts
} = __non_webpack_require__( '/lib/ssb/operationsAlert')
const {
  list: listMunicipalityAlerts
} = __non_webpack_require__( '/lib/ssb/municipalityAlert')
const {
  processHtml,
  pageUrl
} = __non_webpack_require__( '/lib/xp/portal')
const content = __non_webpack_require__( '/lib/xp/content')
const {
  render
} = __non_webpack_require__( '/lib/thymeleaf')
const errorView = resolve('../error/error.html')

const numberWithSpaces = (x) => {
  const parts = x.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0')
  return parts.join('.')
}

export const createHumanReadableFormat = (value) => {
  return value > 999 ? numberWithSpaces(value) : value.toString().replace(/\./, ',')
}


export const alertsForContext = (municipality) => {
  const currentMunicipalityAlerts = municipality ? listMunicipalityAlerts( municipality.code ) : {
    hits: []
  }
  const alerts = [...listOperationsAlerts().hits, ...currentMunicipalityAlerts.hits]
  return alerts.map( (alert) => ({
    title: alert.displayName,
    messageType: alert.type === `${app.name}:operationsAlert` ? 'warning' : 'info',
    municipalCodes: alert.data.municipalCodes,
    message: processHtml({
      value: alert.data.message
    })
  }))
}

// Returns page mode for Kommunefakta page based on request mode or request path
export const pageMode = (req) => {
  return req.params.municipality ? 'municipality' : 'map'
}

const addBreadcrumbs = (page, visitedPage, breadcrumbs = []) => {
  if (page.type === 'portal:site') {
    breadcrumbs.unshift({
      text: getPhrases(visitedPage).home,
      link: '/'
    })
  } else {
    breadcrumbs.unshift({
      text: page.displayName,
      link: pageUrl({
        path: page._path
      })
    })
    const parent = content.get({
      key: page._path.substring(0, page._path.lastIndexOf('/'))
    })

    if (parent) {
      return addBreadcrumbs(parent, visitedPage, breadcrumbs)
    }
  }
  return breadcrumbs
}

export const getBreadcrumbs = (page, municipality) => {
  const breadcrumbs = addBreadcrumbs(page, page)
  if (municipality) {
    breadcrumbs.pop()
    breadcrumbs.push({
      text: municipality.displayName
    })
  } else if (breadcrumbs.length > 0) {
    // remove link of last element in the breadcrumbs list, because its the page we're on
    delete breadcrumbs[breadcrumbs.length - 1].link
  }
  return breadcrumbs
}

export function safeRender(view, model) {
  let response
  try {
    response = {
      body: render(view, model),
      status: 200,
      contentType: 'text/html'
    }
  } catch (e) {
    const errorModel = {
      errorTitle: 'Noe gikk galt',
      errorBody: e
    }
    response = {
      body: render(errorView, errorModel),
      status: 400,
      contentType: 'text/html'
    }
  }

  return response
}


export function getImageCaption(keyFigureId) {
  const imageContent = content.get({key: keyFigureId})
  return imageContent !== undefined ? imageContent.data.caption : ''
}
