__non_webpack_require__('/lib/polyfills/nashorn')
import { DatasetRepoNode, RepoDatasetLib } from '../../repo/dataset'
import { Content } from 'enonic-types/content'
import { DataSource } from '../../../site/mixins/dataSource/dataSource-config'
import { RepoQueryLib } from '../../repo/query'
import { TbmlDataUniform, TbmlSourceListUniform } from '../../types/xmlParser'
import { TbmlLib, TbprocessorParsedResponse } from '../../tbml/tbml'
import { mergeDeepLeft } from 'ramda'

const {
  getDataset
}: RepoDatasetLib = __non_webpack_require__('/lib/repo/dataset')
const {
  getTbmlData,
  TbProcessorTypes
}: TbmlLib = __non_webpack_require__('/lib/tbml/tbml')
const {
  logUserDataQuery,
  Events
}: RepoQueryLib = __non_webpack_require__('/lib/repo/query')
const {
  isUrl
} = __non_webpack_require__('/lib/ssb/utils')

export function getTbprocessor(content: Content<DataSource>, branch: string): DatasetRepoNode<TbmlDataUniform> | null {
  if (content.data.dataSource && content.data.dataSource._selected) {
    const dataSource: DataSource['dataSource'] = content.data.dataSource
    if (dataSource.tbprocessor && dataSource.tbprocessor.urlOrId) {
      const langauge: string = content.language || ''
      return getDataset(content.data.dataSource?._selected, branch, `${getTbprocessorKey(content)}${langauge === 'en' ? langauge : ''}`)
    }
  }
  return null
}

function hasTBProcessorDatasource(content: Content<DataSource>): string | undefined {
  return content.data.dataSource &&
    content.data.dataSource._selected &&
    content.data.dataSource.tbprocessor &&
    content.data.dataSource.tbprocessor.urlOrId
}

function tryRequestTbmlData<T extends TbmlDataUniform | TbmlSourceListUniform>(
  url: string,
  contentId?: string,
  processXml?: string,
  type?: string ): TbprocessorParsedResponse<T> | null {
  try {
    return getTbmlData(url, contentId, processXml, type)
  } catch (e) {
    const message: string = `Failed to fetch ${type ? formatTbProcessorType(type) : 'data'} from tbprocessor: ${contentId} (${e})`
    if (contentId) {
      logUserDataQuery(contentId, {
        file: '/lib/ssb/dataset/tbprocessor.ts',
        function: 'tryRequestTbmlData',
        message: Events.REQUEST_COULD_NOT_CONNECT,
        info: message,
        status: e
      })
    }
    log.error(message)
  }
  return null
}

function formatTbProcessorType(type: string): string {
  switch (type) {
  case TbProcessorTypes.SOURCE_LIST:
    return 'source list'
  case TbProcessorTypes.DATA_SET:
    return 'data set'
  default:
    return 'data'
  }
}

function getDataAndMetaData(content: Content<DataSource>, processXml?: string ): TbprocessorParsedResponse<TbmlDataUniform> | null {
  const baseUrl: string = app.config && app.config['ssb.tbprocessor.baseUrl'] ?
    app.config['ssb.tbprocessor.baseUrl'] : 'https://i.ssb.no/tbprocessor'
  const dataPath: string = `/process/tbmldata/`
  const sourceListPath: string = `/document/sourceList/`
  const language: string = content.language || ''

  const tbmlKey: string = getTbprocessorKey(content)
  let tbmlDataUrl: string = `${baseUrl}${dataPath}${tbmlKey}${language === 'en' ? `?lang=${language}` : ''}`
  let sourceListUrl: string = `${baseUrl}${sourceListPath}${tbmlKey}`

  const dataSource: DataSource['dataSource'] = content.data.dataSource
  if (dataSource && dataSource.tbprocessor && isUrl(dataSource.tbprocessor.urlOrId)) {
    tbmlDataUrl = `${dataSource.tbprocessor.urlOrId as string}${language === 'en' ? `?lang=${language}` : ''}`
    sourceListUrl = `${dataSource.tbprocessor.urlOrId as string}`.replace(dataPath, sourceListPath)
  }

  const tbmlParsedResponse: TbprocessorParsedResponse<TbmlDataUniform> | null =
      tryRequestTbmlData<TbmlDataUniform>(tbmlDataUrl, content._id, processXml, TbProcessorTypes.DATA_SET)
  // If this is true, it's most likely an internal table (unpublised data only)
  // We pass this as a status 200, add an empty table to presentation,
  // and fetch source list, so it's possible to import unpublished data from dashboard
  const isInternal: boolean = !!(
    tbmlParsedResponse &&
    tbmlParsedResponse.status === 500 &&
    tbmlParsedResponse.body &&
    tbmlParsedResponse.body.includes('code: 401') &&
    tbmlParsedResponse.body.includes('StatbankService.svc')
  )
  const isNewPublic: boolean = !!(
    tbmlParsedResponse &&
    tbmlParsedResponse.status === 400 &&
    tbmlParsedResponse.body &&
    tbmlParsedResponse.body.includes('<error>') &&
    tbmlParsedResponse.body.includes('inneholder ikke data')
  )
  if (tbmlParsedResponse && (tbmlParsedResponse.status === 200 || isInternal || isNewPublic)) {
    if (isInternal || isNewPublic) {
      tbmlParsedResponse.status = 200
      tbmlParsedResponse.parsedBody = {
        tbml: {
          presentation: {
            table: {
              thead: [],
              tbody: [],
              class: 'statistics'
            }
          },
          metadata: {
            instance: {
              publicRelatedTableIds: [],
              language: 'no',
              relatedTableIds: [],
              definitionId: parseInt(tbmlKey)
            },
            tablesource: '',
            title: {
              noterefs: '',
              content: ''
            },
            category: '',
            shortnameweb: '',
            tags: '',
            notes: {
              note: []
            }
          }
        }
      }
    }
    const tbmlDataAndSourceList: TbmlDataUniform | null = addSourceList(sourceListUrl, tbmlParsedResponse, content._id)
    return {
      ...tbmlParsedResponse,
      parsedBody: tbmlDataAndSourceList ? tbmlDataAndSourceList : tbmlParsedResponse.parsedBody
    }
  } else {
    return tbmlParsedResponse
  }
}

function addSourceList(sourceListUrl: string, tbmlParsedResponse: TbprocessorParsedResponse<TbmlDataUniform>, contentId: string): TbmlDataUniform | null {
  const sourceListParsedResponse: TbprocessorParsedResponse<TbmlSourceListUniform> | null =
      tryRequestTbmlData<TbmlSourceListUniform>(sourceListUrl, contentId, undefined, TbProcessorTypes.SOURCE_LIST)

  const sourceListObject: object | undefined = sourceListParsedResponse && sourceListParsedResponse.parsedBody ? {
    tbml: {
      metadata: {
        sourceList: sourceListParsedResponse.parsedBody.sourceList.tbml.source,
        sourceListStatus: sourceListParsedResponse.status
      }
    }
  } : {
    tbml: {
      metadata: {
        sourceListStatus: sourceListParsedResponse?.status
      }
    }
  }

  return tbmlParsedResponse && tbmlParsedResponse.parsedBody && sourceListObject ?
    mergeDeepLeft(tbmlParsedResponse.parsedBody, sourceListObject) : null
}

export function fetchTbprocessorData(content: Content<DataSource>, processXml?: string): TbprocessorParsedResponse<TbmlDataUniform> | null {
  const urlOrId: string | undefined = hasTBProcessorDatasource(content)
  return urlOrId ? getDataAndMetaData(content, processXml) : null
}

export function getTbprocessorKey(content: Content<DataSource>): string {
  if (content.data.dataSource && content.data.dataSource.tbprocessor && content.data.dataSource.tbprocessor.urlOrId) {
    let key: string = content.data.dataSource.tbprocessor.urlOrId
    if (isUrl(key)) {
      key = key.replace(/\/$/, '')
      const split: Array<string> = key.split('/')
      key = split[split.length - 1]
    }
    return key
  }
  return content._id // fallback, should never find anything
}

export function getTableIdFromTbprocessor(data: TbmlDataUniform): Array<string> {
  if (data && data.tbml && data.tbml.metadata && data.tbml.metadata.instance && data.tbml.metadata.instance.publicRelatedTableIds) {
    return data.tbml.metadata.instance.publicRelatedTableIds
  }
  return []
}

export interface TbprocessorLib {
  getTbprocessor: (content: Content<DataSource>, branch: string) => DatasetRepoNode<TbmlDataUniform> | null;
  fetchTbprocessorData: (content: Content<DataSource>, processXml?: string) => TbprocessorParsedResponse<TbmlDataUniform> | null;
  getTbprocessorKey: (content: Content<DataSource>) => string;
  getTableIdFromTbprocessor: (dataset: TbmlDataUniform) => Array<string>;
}

export interface FetchTbProcessorData {
  status: number;
  body: string;
}
