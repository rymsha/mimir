import { find } from 'ramda'
import { StatRegNode } from '../statreg'
import { StatisticInListing } from '../../ssb/statreg/types'
import { ArrayUtilsLib } from '../../ssb/arrayUtils'
import { StatRegConfigLib } from '../../ssb/statreg/config'
import { StatRegCommonLib } from '../../ssb/statreg/common'
import { RepoCommonLib } from '../common'

const {
  ensureArray
}: ArrayUtilsLib = __non_webpack_require__('/lib/ssb/arrayUtils')
const {
  fetchStatRegData
}: StatRegCommonLib = __non_webpack_require__('/lib/ssb/statreg/common')
const {
  getStatRegBaseUrl,
  STATISTICS_URL,
  STATREG_BRANCH,
  STATREG_REPO
}: StatRegConfigLib = __non_webpack_require__('/lib/ssb/statreg/config')
const {
  getNode
}: RepoCommonLib = __non_webpack_require__('/lib/repo/common')

export const STATREG_REPO_STATISTICS_KEY: string = 'statistics'

export function fetchStatistics(): Array<StatisticInListing> {
  return fetchStatRegData('Statistics', getStatRegBaseUrl() + STATISTICS_URL, {}, extractStatistics)
}

function extractStatistics(payload: string): Array<StatisticInListing> {
  return JSON.parse(payload).statistics
}

export function getAllStatisticsFromRepo(): Array<StatisticInListing> | null {
  const node: StatRegNode[] = getNode(STATREG_REPO, STATREG_BRANCH, `/${STATREG_REPO_STATISTICS_KEY}`) as StatRegNode[]
  const statisticsNode: StatRegNode | null = Array.isArray(node) ? node[0] : node
  return statisticsNode ? (statisticsNode.content as Array<StatisticInListing>) : null
}

export function getStatisticByIdFromRepo(statId: string): StatisticInListing | undefined {
  if (!statId) {
    return undefined
  }
  const allStats: Array<StatisticInListing> = ensureArray(getAllStatisticsFromRepo())
  return find((stat: StatisticInListing) => `${stat.id}` === statId)(allStats)
}

export function getStatisticByShortNameFromRepo(shortName: string): StatisticInListing | undefined {
  if (!shortName) {
    return undefined
  }
  const allStats: Array<StatisticInListing> = ensureArray(getAllStatisticsFromRepo())
  return find((stat: StatisticInListing) => stat.shortName === shortName)(allStats)
}

export interface StatRegStatisticsLib {
  STATREG_REPO_STATISTICS_KEY: string;
  fetchStatistics: () => Array<StatisticInListing>;
  getAllStatisticsFromRepo: () => Array<StatisticInListing> | null;
  getStatisticByIdFromRepo: (statId: string) => StatisticInListing | undefined;
  getStatisticByShortNameFromRepo: (shortName: string) => StatisticInListing | undefined;
}
