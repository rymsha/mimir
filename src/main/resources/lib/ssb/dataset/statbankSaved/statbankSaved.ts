import { DatasetRepoNode, DataSource as DataSourceType } from '../../repo/dataset'
import { Content } from 'enonic-types/content'
import { DataSource } from '../../../../site/mixins/dataSource/dataSource'
import { JSONstat } from '../../../types/jsonstat-toolkit'
import { StatbankSavedRaw } from '../../../types/xmlParser'

const {
  getDataset
} = __non_webpack_require__('/lib/ssb/repo/dataset')
const {
  get: fetchData
} = __non_webpack_require__('/lib/ssb/dataset/statbankSaved/statbankSavedRequest')
const {
  logUserDataQuery,
  Events
} = __non_webpack_require__('/lib/ssb/repo/query')
const {
  isUrl
} = __non_webpack_require__('/lib/ssb/utils/utils')

export function getStatbankApi(content: Content<DataSource>, branch: string): DatasetRepoNode<JSONstat> | null {
  if (content.data.dataSource && content.data.dataSource._selected === DataSourceType.STATBANK_API) {
    const dataSource: DataSource['dataSource'] = content.data.dataSource
    if (dataSource.statbankApi && dataSource.statbankApi.json && dataSource.statbankApi.urlOrId) {
      return getDataset(content.data.dataSource?._selected, branch, content._id)
    }
  }
  return null
}

export function fetchStatbankSavedData(content: Content<DataSource>): object | null {
  if (content.data.dataSource) {
    const format: string = '.html5_table'
    const basePath: string = '/sq/'
    const baseUrl: string = app.config && app.config['ssb.statbankweb.baseUrl'] ? app.config['ssb.statbankweb.baseUrl'] : 'https://www.ssb.no/statbank'
    try {
      const dataSource: DataSource['dataSource'] = content.data.dataSource
      if (dataSource._selected === DataSourceType.STATBANK_SAVED && dataSource.statbankSaved && dataSource.statbankSaved.urlOrId) {
        const url: string = isUrl(dataSource.statbankSaved.urlOrId) ?
          `${dataSource.statbankSaved.urlOrId}${format}` :
          `${baseUrl}${basePath}${dataSource.statbankSaved.urlOrId}${format}`
        return fetchData(url)
      }
    } catch (e) {
      log.error(`Failed to fetch data from statbankweb: ${content._id} (${e})`)
      logUserDataQuery(content._id, {
        file: '/lib/ssb/dataset/statbankSaved.ts',
        function: 'fetchStatbankSavedData',
        message: Events.REQUEST_COULD_NOT_CONNECT,
        status: e
      })
    }
    return null
  } else {
    return null
  }
}

export interface StatbankSavedLib {
  getStatbankApi(content: Content<DataSource>, branch: string): DatasetRepoNode<JSONstat> | null;
  fetchStatbankSavedData: (content: Content<DataSource>) => StatbankSavedRaw | null;
}
