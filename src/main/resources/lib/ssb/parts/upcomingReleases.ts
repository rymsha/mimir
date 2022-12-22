import { type Content, query } from '/lib/xp/content'
import { connect, multiRepoConnect, type MultiRepoConnection, type MultiRepoNodeQueryResponse } from '/lib/xp/node'
import { type Context, type ContextAttributes, get as getContext, type PrincipalKey } from '/lib/xp/context'
import { pageUrl } from '/lib/xp/portal'
import { getMainSubjectById, getMainSubjects, SubjectItem } from '../utils/subjectUtils'
import { type UpcomingRelease } from '/site/content-types'
import { ContentLight, Release } from '../repo/statisticVariant'
import { localize } from '/lib/xp/i18n'
import { addDays, getDate, getMonth, getYear, isWithinInterval } from 'date-fns'
import { getMainSubject } from '../utils/parentUtils'
import { forceArray } from '../utils/arrayUtils'
import { PreparedStatistics } from '../utils/variantUtils'

export function getUpcomingReleasesResults(req: XP.Request, numberOfDays: number | undefined, language: string) {
  const allMainSubjects: Array<SubjectItem> = getMainSubjects(req, language)
  const context: Context<ContextAttributes> = getContext()

  const connection: MultiRepoConnection = multiRepoConnect({
    sources: [
      {
        repoId: context.repository,
        branch: context.branch,
        principals: context.authInfo.principals as Array<PrincipalKey>,
      },
      {
        repoId: 'no.ssb.statreg.statistics.variants',
        branch: 'master',
        principals: context.authInfo.principals as Array<PrincipalKey>,
      },
    ],
  })

  const serverOffsetInMs: number =
    app.config && app.config['serverOffsetInMs'] ? parseInt(app.config['serverOffsetInMs']) : 0
  const serverTime: Date = new Date(new Date().getTime() + serverOffsetInMs)
  const endDate: Date | undefined = numberOfDays ? addDays(serverTime, numberOfDays) : undefined

  const results: MultiRepoNodeQueryResponse = connection.query({
    count: 1000,
    sort: [
      {
        field: 'data.nextRelease',
        direction: 'ASC',
      },
    ] as unknown as string,
    query: {
      range: {
        field: 'data.nextRelease',
        from: 'dateTime',
        gte: serverTime,
        lte: endDate,
      },
    } as unknown as string,
    filters: {
      boolean: {
        must: [
          {
            hasValue: {
              field: 'language',
              values: language === 'nb' ? ['nb', 'nn'] : ['en'],
            },
          },
        ],
        should: [
          {
            boolean: {
              must: [
                {
                  hasValue: {
                    field: 'data.articleType',
                    values: ['statistics'],
                  },
                },
                {
                  hasValue: {
                    field: 'data.status',
                    values: ['A'],
                  },
                },
                {
                  exists: {
                    field: 'data.statisticContentId',
                  },
                },
              ],
            },
          },
          // contentReleases
          {
            boolean: {
              must: [
                {
                  hasValue: {
                    field: 'type',
                    values: [`${app.name}:upcomingRelease`],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  })

  const contents: (Content<UpcomingRelease, object> | ContentLight<Release>)[] = results.hits.map((hit) =>
    connect(hit).get<Content<UpcomingRelease, object> | ContentLight<Release>>(hit.id)
  )

  const upcomingReleases: Array<PreparedStatistics> = contents.map((content) =>
    isContentUpcomingRelease(content)
      ? prepContentUpcomingRelease(content as Content<UpcomingRelease, object>, language, allMainSubjects)
      : prepStatisticUpcomingRelease(content as ContentLight<Release>, language)
  )

  const filteredUpcomingReleasesStatistics = contents
    .map((content) => filterUpcomingReleasesStatistics(content as ContentLight<Release>, language, serverTime, endDate))
    .reduce((acc, curr) => {
      if (curr.length) return acc.concat(curr)
      else return acc
    }, [])

  const mergedStatisticsAndUpcomingStatisticsReleases = [
    ...upcomingReleases,
    ...(filteredUpcomingReleasesStatistics as Array<PreparedStatistics>),
    ...prepOldContentUpcomingReleases(serverTime, endDate, allMainSubjects, language),
  ].sort((a, b) => {
    return new Date(a.date as string).getTime() - new Date(b.date as string).getTime()
  })

  return {
    total: mergedStatisticsAndUpcomingStatisticsReleases.length,
    upcomingReleases: mergedStatisticsAndUpcomingStatisticsReleases,
  }
}

function isContentUpcomingRelease(content: unknown) {
  return (content as Content).type === `${app.name}:upcomingRelease`
}

// TODO: Delete after all content has been updated
function prepOldContentUpcomingReleases(
  serverTime: Date,
  endDate: Date | undefined,
  allMainSubjects: Array<SubjectItem>,
  language: string
): Array<PreparedStatistics> | [] {
  const oldContentUpcomingReleases: Array<PreparedStatistics> = query<UpcomingRelease, object>({
    count: 500,
    query: {
      range: {
        field: 'data.date',
        from: 'dateTime',
        gte: serverTime,
        lte: endDate,
      },
    } as unknown as string,
    filters: {
      boolean: {
        must: [
          {
            hasValue: {
              field: 'language',
              values: language === 'nb' ? ['nb', 'nn'] : ['en'],
            },
          },
        ],
        should: [
          {
            boolean: {
              must: [
                {
                  hasValue: {
                    field: 'type',
                    values: [`${app.name}:upcomingRelease`],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  }).hits.map((r: Content<UpcomingRelease, object>) => {
    const date: string = r.data.date ? r.data.date : new Date().toISOString()
    const mainSubjectItem: SubjectItem | null = getMainSubjectById(allMainSubjects, r.data.mainSubject)
    const mainSubject: string = mainSubjectItem ? mainSubjectItem.title : ''
    const contentType: string = r.data.contentType
      ? localize({
          key: `contentType.${r.data.contentType}`,
          locale: language,
        })
      : ''

    return {
      id: r._id,
      name: r.displayName,
      type: contentType,
      date,
      mainSubject: mainSubject,
      variant: {
        day: getDate(new Date(date)),
        monthNumber: getMonth(new Date(date)),
        year: getYear(new Date(date)),
      },
      statisticsPageUrl: r.data.href ? r.data.href : '',
    }
  })

  return oldContentUpcomingReleases.length ? oldContentUpcomingReleases : []
}

function prepContentUpcomingRelease(
  content: Content<UpcomingRelease, object>,
  language: string,
  allMainSubjects: Array<SubjectItem>
): PreparedStatistics {
  const date: string = content.data.nextRelease
  const mainSubjectItem: SubjectItem | null = getMainSubjectById(allMainSubjects, content.data.mainSubject)
  const mainSubject: string = mainSubjectItem ? mainSubjectItem.title : ''
  const contentType: string = content.data.contentType
    ? localize({
        key: `contentType.${content.data.contentType}`,
        locale: language,
      })
    : ''

  return {
    id: content._id,
    name: content.displayName,
    type: contentType,
    date,
    mainSubject: mainSubject,
    variant: {
      day: getDate(new Date(date)),
      monthNumber: getMonth(new Date(date)),
      year: getYear(new Date(date)),
    },
    statisticsPageUrl: content.data.href ? content.data.href : '',
  }
}

function parseUpcomingStatistics(
  statisticData: ContentLight<Release>['data'],
  language: string,
  date: string,
  period: string
): PreparedStatistics {
  return {
    id: Number(statisticData.statisticId),
    name: statisticData.name,
    type: localize({
      key: `contentType.${statisticData.articleType}`,
      locale: language,
    }),
    date,
    mainSubject: getMainSubject(statisticData.shortName, language),
    variant: {
      id: statisticData.statisticId,
      day: getDate(new Date(date)),
      monthNumber: getMonth(new Date(date)),
      year: getYear(new Date(date)),
      period: period,
      frequency: statisticData.frequency,
    },
    statisticsPageUrl: pageUrl({
      id: statisticData.statisticContentId as string,
    }),
  }
}

function filterUpcomingReleasesStatistics(
  content: ContentLight<Release>,
  language: string,
  startDate: Date,
  endDate: Date | undefined
): Array<PreparedStatistics | []> {
  const filteredPreparedStatistics = content.data.upcomingReleases
    ? endDate
      ? forceArray(content.data.upcomingReleases).filter((release) =>
          isWithinInterval(new Date(release.publishTime), { start: startDate, end: endDate })
        )
      : forceArray(content.data.upcomingReleases)
    : []
  if (filteredPreparedStatistics && filteredPreparedStatistics.length > 1) {
    // remove the first upcoming release as it will have the same publishTime as the statistics' nextPeriod
    filteredPreparedStatistics.shift()
    return filteredPreparedStatistics.map((release) => {
      const date = release.publishTime
      return parseUpcomingStatistics(content.data, language, date, release.period)
    })
  }
  return []
}

function prepStatisticUpcomingRelease(content: ContentLight<Release>, language: string): PreparedStatistics {
  const date: string = content.data.nextRelease
  return parseUpcomingStatistics(content.data, language, date, content.data.nextPeriod)
}
export interface PreparedStatisticsResults {
  total: number
  upcomingReleases: Array<PreparedStatistics>
}
