import { Content } from 'enonic-types/content'
import { Response } from 'enonic-types/controller'
import { HttpRequestParams } from 'enonic-types/http'
import { CalculatorConfig } from '../../site/content-types/calculatorConfig/calculatorConfig'
import { Dataset } from '../../lib/types/jsonstat-toolkit'
import { CalculatorLib } from '../../lib/ssb/dataset/calculator'
import { I18nLibrary } from 'enonic-types/i18n'
const i18nLib: I18nLibrary = __non_webpack_require__('/lib/xp/i18n')
const {
  getCalculatorConfig, getBkibolDatasetEnebolig, getBkibolDatasetBoligblokk, isChronological, getChangeValue
}: CalculatorLib = __non_webpack_require__('/lib/ssb/dataset/calculator')

function get(req: HttpRequestParams): Response {
  const domene: string | undefined = req.params?.domene || 'ENEBOLIG'
  const scope: string | undefined = req.params?.scope || 'IALT'
  const serie: string | undefined = req.params?.serie || '04'
  const startValue: string | undefined = req.params?.startValue
  const startMonth: string | undefined = req.params?.startMonth || ''
  const startYear: string | undefined = req.params?.startYear
  const endMonth: string | undefined = req.params?.endMonth || ''
  const endYear: string | undefined = req.params?.endYear
  const language: string | undefined = req.params?.language ? req.params.language : 'nb'
  const errorValidateStartMonth: string = i18nLib.localize({
    key: 'bkibolServiceValidateStartMonth',
    locale: language
  })
  const errorValidateEndMonth: string = i18nLib.localize({
    key: 'bkibolServiceValidateEndMonth',
    locale: language
  })

  if (!domene || !serie || !serie || !startValue || !startYear || !startMonth || !endYear || !endMonth) {
    return {
      status: 400,
      body: {
        error: 'missing parameter'
      },
      contentType: 'application/json'
    }
  }

  const config: Content<CalculatorConfig> | undefined = getCalculatorConfig()

  if (config && config.data.bkibolSourceEnebolig && config.data.bkibolSourceBoligblokk) {
    const datasetEnebolig: Dataset | null = getBkibolDatasetEnebolig(config)
    const datasetBoligblokk: Dataset | null = getBkibolDatasetBoligblokk(config)
    const indexResult: IndexResult = getIndexes(domene, scope, serie, startMonth, startYear, endMonth, endYear, datasetEnebolig, datasetBoligblokk)
    const chronological: boolean = isChronological(startYear, startMonth, endYear, endMonth)
    if (indexResult.startIndex !== null && indexResult.endIndex !== null) {
      const changeValue: number = getChangeValue(indexResult.startIndex, indexResult.endIndex, chronological)
      return {
        body: {
          startIndex: indexResult.startIndex,
          endIndex: indexResult.endIndex,
          change: changeValue,
          endValue: parseFloat(startValue) * (indexResult.endIndex / indexResult.startIndex)
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
      error: 'missing calculator config or bkibol sources'
    },
    contentType: 'application/json'
  }
}
exports.get = get

function getIndexes(domene: string,
  scope: string,
  serie: string,
  startMonth: string,
  startYear: string,
  endMonth: string,
  endYear: string,
  eneboligData: Dataset | null,
  boligblokkData: Dataset | null
): IndexResult {
  const start: string = startMonth !== '' ? startYear + 'M' + startMonth : startYear
  const end: string = endMonth !== '' ? endYear + 'M' + endMonth : endYear

  const workTypeCode: string = domene === 'ENEBOLIG' ? getEneboligWorkType(scope, serie) : getBoligblokkWorkType(scope, serie)

  const startIndex: null | number = domene === 'ENEBOLIG' ? getIndexTime(eneboligData, start, workTypeCode) :
    getIndexTime(boligblokkData, start, workTypeCode)

  const endIndex: null | number = domene === 'ENEBOLIG' ? getIndexTime(eneboligData, end, workTypeCode) :
    getIndexTime(boligblokkData, end, workTypeCode)

  return {
    startIndex,
    endIndex
  }
}

interface IndexResult {
    startIndex: number | null;
    endIndex: number | null;
}

function getIndexTime(bkibolData: Dataset | null, time: string, workTypeCode: string): number | null {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const index: null | number = bkibolData?.Data({
    Tid: time,
    Arbeidstype: workTypeCode
  }).value

  return index
}

function getEneboligWorkType(scope: string, serie: string): string {
  switch (scope) {
  case 'MATERIALER':
    switch (serie) {
    case 'STEIN':
      return '07'
    case 'GRUNNARBEID':
      return '09'
    case 'BYGGEARBEIDER':
      return '11'
    case 'TOMRING':
      return '13'
    case 'MALING':
      return '15'
    case 'RORLEGGERARBEID':
      return '17'
    case 'ELEKTRIKERARBEID':
      return '19'
    default:
      return '05'
    }
  default:
    switch (serie) {
    case 'STEIN':
      return '06'
    case 'GRUNNARBEID':
      return '08'
    case 'BYGGEARBEIDER':
      return '10'
    case 'TOMRING':
      return '12'
    case 'MALING':
      return '14'
    case 'RORLEGGERARBEID':
      return '16'
    case 'ELEKTRIKERARBEID':
      return '18'
    default:
      return '04'
    }
  }
}

function getBoligblokkWorkType(scope: string, serie: string): string {
  switch (scope) {
  case 'MATERIALER':
    switch (serie) {
    case 'GRUNNARBEID':
      return '23'
    case 'TOMRING':
      return '25'
    case 'MALING':
      return '27'
    case 'RORLEGGERARBEID':
      return '29'
    case 'ELEKTRIKERARBEID':
      return '31'
    default:
      return '21'
    }
  default:
    switch (serie) {
    case 'GRUNNARBEID':
      return '22'
    case 'TOMRING':
      return '24'
    case 'MALING':
      return '26'
    case 'RORLEGGERARBEID':
      return '28'
    case 'ELEKTRIKERARBEID':
      return '30'
    default:
      return '20'
    }
  }
}
