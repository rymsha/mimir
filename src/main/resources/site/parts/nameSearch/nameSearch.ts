import { Request } from 'enonic-types/controller'
import { PortalLibrary } from 'enonic-types/portal'
import { React4xp, React4xpResponse } from '../../../lib/types/react4xp'

const {
  serviceUrl
}: PortalLibrary = __non_webpack_require__('/lib/xp/portal')
const React4xp: React4xp = __non_webpack_require__('/lib/enonic/react4xp')


exports.get = (req: Request): React4xpResponse => {
  return renderPart(req)
}

exports.preview = (req: Request): React4xpResponse => renderPart(req)

function renderPart(req: Request): React4xpResponse {
  const urlToService: string = serviceUrl({
    service: 'nameSearch'
  })

  const props: PartProperties = {
    urlToService: urlToService
  }

  return React4xp.render('site/parts/nameSearch/nameSearch', props, req)
}


interface PartProperties {
  urlToService: string;
}
