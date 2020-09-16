import { find } from 'ramda'
import { StatRegRepoLib, StatRegNode } from '../statreg'
import { SSBStatRegLib } from '../../ssb/statreg'
import { StatisticInListing as Statistic, StatisticInListing } from '../../ssb/statreg/types'
import { ArrayUtilsLib } from '../../ssb/arrayUtils'

const {
  ensureArray
}: ArrayUtilsLib = __non_webpack_require__('/lib/ssb/arrayUtils')
const {
  fetchStatistics: fetchStatisticsSvc
}: SSBStatRegLib = __non_webpack_require__('/lib/ssb/statreg')
const {
  getStatRegNode
}: StatRegRepoLib = __non_webpack_require__('/lib/repo/statreg')

export const STATREG_REPO_STATISTICS_KEY: string = 'statistics'

export function fetchStatistics(): Array<StatisticInListing> {
  return fetchStatisticsSvc({})
}

export function getAllStatisticsFromRepo(): Array<Statistic> | null {
  const node: StatRegNode | null = getStatRegNode(STATREG_REPO_STATISTICS_KEY)
  return node ? (node.content as Array<Statistic>) : null
}

export function getStatisticByIdFromRepo(statId: string): Statistic | undefined {
  if (!statId) {
    return undefined
  }
  const allStats: Array<Statistic> = ensureArray(getAllStatisticsFromRepo())
  return find((stat: Statistic) => `${stat.id}` === statId)(allStats)
}

export function getStatisticByShortNameFromRepo(shortName: string): Statistic | undefined {
  if (!shortName) {
    return undefined
  }
  const allStats: Array<Statistic> = ensureArray(getAllStatisticsFromRepo())
  return find((stat: Statistic) => stat.shortName === shortName)(allStats)
}

export interface StatRegStatisticsLib {
  STATREG_REPO_STATISTICS_KEY: string;
  fetchStatistics: () => Array<StatisticInListing>;
  getAllStatisticsFromRepo: () => Array<Statistic> | null;
  getStatisticByIdFromRepo: (statId: string) => Statistic | undefined;
  getStatisticByShortNameFromRepo: (shortName: string) => Statistic | undefined;
}
