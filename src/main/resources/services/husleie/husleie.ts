import { Content } from 'enonic-types/content'
import { Response } from 'enonic-types/controller'
import { HttpRequestParams } from 'enonic-types/http'
import { CalculatorConfig } from '../../site/content-types/calculatorConfig/calculatorConfig'
import { Dataset } from '../../lib/types/jsonstat-toolkit'
const {
  localize
} = __non_webpack_require__('/lib/xp/i18n')
const {
  getCalculatorConfig, getKpiDatasetMonth, getChangeValue
} = __non_webpack_require__('/lib/ssb/dataset/calculator')

function get(req: HttpRequestParams): Response {
  const startValue: string | undefined = req.params?.startValue
  const startMonth: string | undefined = req.params?.startMonth
  const startYear: string | undefined = req.params?.startYear
  const endMonth: string | undefined = req.params?.endMonth
  const endYear: string | undefined = req.params?.endYear
  const language: string | undefined = req.params?.language ? req.params.language : 'nb'

  const errorValidateStartMonth: string = localize({
    key: 'husleieServiceValidateStartMonth',
    locale: language
  })
  const errorValidateEndMonth: string = localize({
    key: 'husleieServiceValidateEndMonth',
    locale: language
  })

  if (!startValue || !startMonth || !startYear || !endMonth || !endYear) {
    return {
      status: 400,
      body: {
        error: 'missing parameter'
      },
      contentType: 'application/json'
    }
  }

  const config: Content<CalculatorConfig> | undefined = getCalculatorConfig()

  if (config && config.data.kpiSourceMonth) {
    const husleieDataset: Dataset | null = getKpiDatasetMonth(config)
    const indexResult: IndexResult = getIndexes(startYear, startMonth, endYear, endMonth, husleieDataset)

    if (indexResult.startIndex !== null && indexResult.endIndex !== null) {
      const changeValue: number = getChangeValue(indexResult.startIndex, indexResult.endIndex, true)
      return {
        body: {
          endValue: parseFloat(startValue) * (indexResult.endIndex / indexResult.startIndex),
          change: changeValue
        },
        contentType: 'application/json'
      }
    } else {
      return {
        status: 500,
        body: {
          error: indexResult.startIndex === null ? errorValidateStartMonth : errorValidateEndMonth
        },
        contentType: 'application/json'
      }
    }
  }
  return {
    status: 500,
    body: {
      error: 'missing calculator config or kpi sources'
    },
    contentType: 'application/json'
  }
}
exports.get = get

function getIndexes(startYear: string, startMonth: string, endYear: string, endMonth: string, husleieData: Dataset | null): IndexResult {
  let startIndex: null | number = null
  let endIndex: null | number = null

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  startIndex = husleieData?.Data({
    Tid: startYear,
    Maaned: startMonth
  }).value

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  endIndex = husleieData?.Data({
    Tid: endYear,
    Maaned: endMonth
  }).value

  return {
    startIndex,
    endIndex
  }
}

interface IndexResult {
    startIndex: number | null;
    endIndex: number | null;
}

interface LastPeriod {
  month: string;
  year: string;
}
