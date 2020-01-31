const {
  getContent,
  getComponent,
  getSiteConfig
} = __non_webpack_require__( '/lib/xp/portal')

const thymeleaf = __non_webpack_require__( '/lib/thymeleaf')
const React4xp = __non_webpack_require__('/lib/enonic/react4xp')

const { getMunicipality } = __non_webpack_require__( '/lib/klass/municipalities')
const { pageMode } = __non_webpack_require__( '/lib/ssb/utils')
const { renderError } = __non_webpack_require__('/lib/error/error')

const view = resolve('./relatedKostra.html')

exports.get = function(req) {
  let municipality = getMunicipality(req)
  const page = getContent()
  const mode = pageMode(req, page)
  if (!municipality && mode === 'edit') {
    const defaultMunicipality = getSiteConfig().defaultMunicipality
    municipality = getMunicipality({ code: defaultMunicipality })
  }

  try {
    return renderPart(req, municipality)
  } catch (e) {
    return renderError('Error in part: ', e)
  }
}

exports.preview = function(req) {
  const defaultMunicipality = getSiteConfig().defaultMunicipality
  const municipality = getMunicipality({ code: defaultMunicipality })
  return renderPart(req, municipality)
}

function renderPart(req, municipality) {
  const part = getComponent()
  const kostraLink = new React4xp('Link')
    .setProps({
      href: getHref(municipality, part.config.kostraLink),
      children: part.config.kostraLinkText
    })
    .setId('kostraLink')
    .uniqueId()

  const model = {
    kostraLinkId: kostraLink.react4xpId,
    title: part.config.title,
    description: part.config.description,
  }

  const preRenderedBody = thymeleaf.render(view, model)

  return municipality !== undefined ? { body: kostraLink.renderBody({ body: preRenderedBody }), contentType: 'text/html' } : ''
}

function getHref(municipality, kostraLink) {
  if(municipality !== undefined) {
    return kostraLink + (municipality.path == null ? '' : municipality.path)
  }
  return kostraLink
}

