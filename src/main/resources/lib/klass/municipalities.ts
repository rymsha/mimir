import { SiteConfig } from '../../site/site-config'
import { ContentLibrary, Content, QueryResponse } from 'enonic-types/lib/content'
import { Dataset } from '../../site/content-types/dataset/dataset'
import { Request } from 'enonic-types/lib/controller'
import { CacheLib, Cache } from '../types/cache'
import { PortalLibrary } from 'enonic-types/lib/portal'
import { County, CountiesLib } from './counties'
import { DatasetLib } from '../ssb/dataset/dataset'
import { DatasetRepoNode } from '../repo/dataset'
import { DataSource } from '../../site/mixins/dataSource/dataSource'
import { SSBCacheLibrary } from '../ssb/cache'
const {
  sanitize
} = __non_webpack_require__( '/lib/xp/common')
const {
  getChildren,
  get: getContent
}: ContentLibrary = __non_webpack_require__( '/lib/xp/content')
const {
  getDataSetWithDataQueryId
} = __non_webpack_require__( '../ssb/dataset')
const {
  getSiteConfig
}: PortalLibrary = __non_webpack_require__( '/lib/xp/portal')
const {
  list: countyList
}: CountiesLib = __non_webpack_require__( '/lib/klass/counties')
const {
  newCache
}: CacheLib = __non_webpack_require__( '/lib/cache')
const {
  getDataset,
  extractKey
}: DatasetLib = __non_webpack_require__( '/lib/ssb/dataset/dataset')
const {
  fromDatasetRepoCache
}: SSBCacheLibrary = __non_webpack_require__( '/lib/ssb/cache')

/**
 * @return {array} Returns everything in the "code" node from ssb api
 */
export const list: () => Array<MunicipalCode> = () => getMunicipalsFromContent()

/**
 *
 * @param {string} queryString
 * @return {array} a set of municipals containing the querystring in municiaplity code or name
 */
export const query: (queryString: string) => Array<MunicipalCode> = (queryString) => getMunicipalsFromContent()
  .filter( (municipal) => RegExp(queryString.toLowerCase()).test(`${municipal.code} ${municipal.name.toLowerCase()}` ))


function getMunicipalsFromContent(): Array<MunicipalCode> {
  const siteConfig: SiteConfig = getSiteConfig()
  const key: string | undefined = siteConfig.municipalDataContentId
  if (key) {
    const dataSource: Content<DataSource> | null = getContent({
      key
    })
    if (dataSource) {
      if (dataSource.type === `${app.name}:dataquery`) {
        const children: Array<Content<Dataset>> = getChildren({
          key
        }).hits as Array<Content<Dataset>>
        if (children.length > 0) {
          const content: Content<Dataset> = children[0]
          if (content.data.json) {
            return JSON.parse(content.data.json).codes as Array<MunicipalCode>
          }
        }
      } else {
        const dataset: DatasetRepoNode<object> | undefined = fromDatasetRepoCache(extractKey(dataSource), () => {
          return getDataset(dataSource)
        })
        if (dataset && dataset.data && dataset.data) {
          const data: {codes: Array<MunicipalCode>} = dataset.data as {codes: Array<MunicipalCode>}
          return data.codes
        }
      }
    }
  }
  return []
}

/**
 *
 * @param {string} municipalName required
 * @param {string} countyName optional, if set it will be added to the path
 * @return {string} create valid municipal path
 */
export function createPath(municipalName: string, countyName?: string): string {
  const path: string = countyName !== undefined ? `${municipalName}-${countyName}` : `${municipalName}`
  return `/${sanitize(path)}`
}

const parsedMunicipalityCache: Cache = newCache({
  size: 1000,
  expire: 3600
})

export function municipalsWithCounties(): Array<MunicipalityWithCounty> {
  const counties: Array<County> = countyList()
  const municipalities: Array<MunicipalCode> = list()
  // Caching this since it is a bit heavy
  return parsedMunicipalityCache.get('parsedMunicipality', () => municipalities.map( (municipality: MunicipalCode) => {
    const getTwoFirstDigits: RegExp = /^(\d\d).*$/
    const currentCounty: County = counties.filter((county: County) => county.code === municipality.code.replace(getTwoFirstDigits, '$1'))[0]
    const numMunicipalsWithSameName: number = municipalities.filter( (mun) => mun.name === municipality.name).length

    return {
      code: municipality.code,
      displayName: numMunicipalsWithSameName === 1 ? municipality.name : `${municipality.name} i ${currentCounty.name}`,
      county: {
        name: currentCounty.name
      },
      path: numMunicipalsWithSameName === 1 ? createPath(municipality.name) : createPath(municipality.name, currentCounty.name)
    }
  }))
}

export function getMunicipality(req: RequestWithCode): MunicipalityWithCounty|undefined {
  let municipality: MunicipalityWithCounty | undefined
  if (req.params && req.params.selfRequest && req.params.municipality) {
    // TODO: Figure out why municipality is duplicated in params!
    if (Array.isArray(req.params.municipality)) municipality = JSON.parse(req.params.municipality[0]) as MunicipalityWithCounty
    else municipality = JSON.parse(req.params.municipality as string) as MunicipalityWithCounty
    if (municipality) {
      return municipality
    }
  }

  const municipalities: Array<MunicipalityWithCounty> = municipalsWithCounties()
  if (req.path) {
    const municipalityName: string = req.path.replace(/^.*\//, '').toLowerCase()
    municipality = getMunicipalityByName(municipalities, municipalityName)
  } else if (req.code) {
    municipality = getMunicipalityByCode(municipalities, req.code)
  }

  if (!municipality && (req.mode === 'edit' || req.mode === 'preview' || req.mode === 'inline')) {
    const siteConfig: SiteConfig = getSiteConfig()
    const defaultMunicipality: string = siteConfig.defaultMunicipality
    municipality = getMunicipalityByCode(municipalities, defaultMunicipality)
  }

  return municipality
}

/**
 *
 * @param {array} municipalities
 * @param {number} municipalityCode
 * @return {*}
 */

const municipalityWithCodeCache: Cache = newCache({
  size: 1000,
  expire: 3600
})
function getMunicipalityByCode(municipalities: Array<MunicipalityWithCounty>, municipalityCode: string): MunicipalityWithCounty|undefined {
  return municipalityWithCodeCache.get(`municipality_${municipalityCode}`, () => {
    const changes: Array<MunicipalityChange> | undefined = changesWithMunicipalityCode(municipalityCode)
    const municipality: Array<MunicipalityWithCounty> = municipalities.filter((municipality) => municipality.code === municipalityCode)
    return municipality.length > 0 ? {
      ...municipality[0],
      changes
    } : undefined
  })
}

/**
 *
 * @param {array} municipalities
 * @param {string} municipalityName
 * @return {*}
 */
const municipalityWithNameCache: Cache = newCache({
  size: 1000,
  expire: 3600
})
export function getMunicipalityByName(municipalities: Array<MunicipalityWithCounty>, municipalityName: string): MunicipalityWithCounty|undefined {
  return municipalityWithNameCache.get(`municipality_${municipalityName}`, () => {
    const municipality: Array<MunicipalityWithCounty> = municipalities.filter((municipality) => municipality.path === `/${municipalityName}`)

    if (municipality.length > 0) {
      const changes: Array<MunicipalityChange> | undefined = changesWithMunicipalityCode(municipality[0].code )
      return {
        ...municipality[0],
        changes
      }
    }
    return undefined
  })
}

function changesWithMunicipalityCode(municipalityCode: string): Array<MunicipalityChange>|undefined {
  const changeList: Array<MunicipalityChange> = getMunicipalityChanges().codeChanges
  const changes: Array<MunicipalityChange> = changeList.filter( (change) => {
    return (change.oldCode === municipalityCode || change.newCode === municipalityCode) &&
        removeCountyFromMunicipalityName(change.oldName) === removeCountyFromMunicipalityName(change.newName)
  })
  return changes
}

function getMunicipalityChanges(): MunicipalityChangeList {
  const changeListId: string | undefined = getSiteConfig<SiteConfig>().municipalChangeListContentId
  const datasetList: QueryResponse<Dataset> = getDataSetWithDataQueryId(changeListId)
  const changeListContent: Content<Dataset> | undefined = datasetList.count > 0 ? datasetList.hits[0] : undefined
  const body: string |undefined = changeListContent ? changeListContent.data.json : undefined
  return body ? JSON.parse(body) : {
    codes: []
  }
}

export function removeCountyFromMunicipalityName(municiaplityName: string): string {
  return municiaplityName.split('(')[0].trim()
}

export interface MunicipalityChangeList {
  codeChanges: Array<MunicipalityChange>;
}

export interface MunicipalityChange {
  oldCode: string;
  oldName: string;
  oldShortName?: string;
  newCode: string;
  newName: string;
  newShortName?: string;
  changeOccurred: string;
}

export interface MunicipalitiesLib {
  list: () => Array<MunicipalCode>;
  query: (queryString: string) => Array<MunicipalCode>;
  createPath (municipalName: string, countyName?: string): string;
  municipalsWithCounties (): Array<MunicipalityWithCounty>;
  getMunicipality (req: Request): MunicipalityWithCounty|undefined;
}

interface RequestWithCode extends Request {
  code: string;
}

export interface MunicipalCode {
  code: string;
  parentCode: string;
  level: string;
  name: string;
  shortName: string;
  presentationName: string;
}

export interface MunicipalityWithCounty {
  code: string;
  displayName: string;
  county: {
    name: string;
  };
  path: string;
  changes?: Array<MunicipalityChange>;
}

