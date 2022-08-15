import { Content } from 'enonic-types/content'
import { Request, Response } from 'enonic-types/controller'
import { fromPartCache } from '../../../lib/ssb/cache/partCache'
import { MunicipalityWithCounty } from '../../../lib/ssb/dataset/klass/municipalities'
import { KeyFigureView } from '../../../lib/ssb/parts/keyFigure'
import { React4xp, React4xpResponse } from '../../../lib/types/react4xp'
import { SiteConfig } from '../../../site/site-config'
import { KeyFigurePartConfig } from './keyFigure-part-config'

const React4xp: React4xp = __non_webpack_require__('/lib/enonic/react4xp')
const {
  get: getKeyFigures,
  parseKeyFigure
} = __non_webpack_require__('/lib/ssb/parts/keyFigure')
const {
  getMunicipality
} = __non_webpack_require__('/lib/ssb/dataset/klass/municipalities')
const {
  getContent,
  getComponent,
  getSiteConfig
} = __non_webpack_require__('/lib/xp/portal')
const {
  data: {
    forceArray
  }
} = __non_webpack_require__('/lib/util')
const {
  renderError
} = __non_webpack_require__('/lib/ssb/error/error')
const {
  DATASET_BRANCH,
  UNPUBLISHED_DATASET_BRANCH
} = __non_webpack_require__('/lib/ssb/repo/dataset')
const {
  hasWritePermissionsAndPreview
} = __non_webpack_require__('/lib/ssb/parts/permissions')

const {
  getPhrases
} = __non_webpack_require__('/lib/ssb/utils/language')

exports.get = function(req: Request): React4xpResponse | Response {
  try {
    const config: KeyFigurePartConfig = getComponent().config
    const keyFigureIds: Array<string> | [] = config.figure ? forceArray(config.figure) : []
    const municipality: MunicipalityWithCounty | undefined = getMunicipality(req)
    return renderPart(req, municipality, keyFigureIds)
  } catch (e) {
    return renderError(req, 'Error in part', e)
  }
}

exports.preview = function(req: Request, id: string): React4xpResponse | Response {
  try {
    const siteConfig: SiteConfig = getSiteConfig()
    const defaultMunicipality: SiteConfig['defaultMunicipality'] = siteConfig.defaultMunicipality
    const municipality: MunicipalityWithCounty | undefined = getMunicipality({
      code: defaultMunicipality
    } as unknown as Request)
    return renderPart(req, municipality, [id])
  } catch (e) {
    return renderError(req, 'Error in part', e)
  }
}

function renderPart(req: Request, municipality: MunicipalityWithCounty | undefined, keyFigureIds: Array<string>): React4xpResponse | Response {
  const page: Content = getContent()
  const config: KeyFigurePartConfig = getComponent() && getComponent().config
  const showPreviewDraft: boolean = hasWritePermissionsAndPreview(req, page._id)

  // get all keyFigures and filter out non-existing keyFigures
  const keyFigures: Array<KeyFigureData> = fetchKeyFigures(req, municipality, keyFigureIds, DATASET_BRANCH) as Array<KeyFigureData>
  const keyFiguresDraft: Array<KeyFigureData> | null = showPreviewDraft ? fetchKeyFigures(req, municipality, keyFigureIds, UNPUBLISHED_DATASET_BRANCH) : null

  if (req.mode === 'edit' || req.mode === 'inline' || showPreviewDraft) {
    return renderKeyFigure(page, config, keyFigures, keyFiguresDraft, showPreviewDraft, req)
  } else {
    return fromPartCache(req, `${page._id}-(${keyFigureIds.map((id) => id).join(', ')})-keyFigures`, () => {
      return renderKeyFigure(page, config, keyFigures, keyFiguresDraft, showPreviewDraft, req)
    })
  }
}

function fetchKeyFigures(
  req: Request,
  municipality: MunicipalityWithCounty | undefined,
  keyFigureIds: Array<string>,
  branch: string
): Array<KeyFigureData> | null {
  return getKeyFigures(keyFigureIds)
    .map((keyFigure) => {
      const keyFigureData: KeyFigureView = parseKeyFigure(keyFigure, municipality, branch)
      return {
        id: keyFigure._id,
        ...keyFigureData,
        source: keyFigure.data.source
      }
    })
}

function renderKeyFigure(
  page: Content,
  config: KeyFigurePartConfig,
  parsedKeyFigures: Array<KeyFigureData>,
  parsedKeyFiguresDraft: Array<KeyFigureData> | null,
  showPreviewDraft: boolean,
  req: Request
): React4xpResponse | Response {
  const draftExist: boolean = !!parsedKeyFiguresDraft
  if (parsedKeyFigures && parsedKeyFigures.length > 0 || draftExist) {
    const hiddenTitle: Array<string> = parsedKeyFigures.map((keyFigureData) => {
      return keyFigureData.title
    })

    const props: KeyFigureProps = {
      displayName: config && config.title,
      keyFigures: parsedKeyFigures.map((keyFigureData) => {
        return {
          ...keyFigureData,
          glossary: keyFigureData.glossaryText
        }
      }),
      keyFiguresDraft: parsedKeyFiguresDraft ? parsedKeyFiguresDraft.map((keyFigureDraftData) => {
        return {
          ...keyFigureDraftData,
          glossary: keyFigureDraftData.glossaryText
        }
      }) : undefined,
      sourceLabel: getPhrases(page).source,
      source: config && config.source,
      columns: config && config.columns,
      showPreviewDraft,
      paramShowDraft: req.params.showDraft,
      draftExist,
      pageTypeKeyFigure: page.type === `${app.name}:keyFigure`,
      hiddenTitle: hiddenTitle.toString().replace(/[\[\]']+/g, ''),
      isInStatisticsPage: page.type === `${app.name}:statistics`
    }

    return React4xp.render('KeyFigure', props, req, {
      body: '<section class="xp-part key-figures container"></section>'
    })
  }

  return {
    body: '',
    contentType: 'text/html'
  }
}

interface KeyFigureData {
  id: string;
  iconUrl?: KeyFigureView['iconUrl'];
  iconAltText?: KeyFigureView['iconAltText'];
  number?: KeyFigureView['number'];
  numberDescription?: KeyFigureView['numberDescription'];
  noNumberText: KeyFigureView['noNumberText'];
  size?: KeyFigureView['size'];
  title: KeyFigureView['title'];
  time?: KeyFigureView['time'];
  changes?: KeyFigureView['changes'];
  greenBox: KeyFigureView['greenBox'];
  glossaryText?: KeyFigureView['glossaryText'];
  glossary?: string;
  source: object | undefined;
}
interface KeyFigureProps {
  displayName: KeyFigurePartConfig['title'];
  keyFigures: Array<KeyFigureData> | undefined;
  keyFiguresDraft: Array<KeyFigureData> | undefined;
  sourceLabel: string;
  source: KeyFigurePartConfig['source'];
  columns: KeyFigurePartConfig['columns'];
  showPreviewDraft: boolean;
  paramShowDraft: string | undefined;
  draftExist: boolean;
  pageTypeKeyFigure: boolean;
  hiddenTitle: string;
  isInStatisticsPage: boolean;
}

