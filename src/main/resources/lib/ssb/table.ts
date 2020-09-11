/* eslint-disable new-cap */
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import JSONstat from 'jsonstat-toolkit/import.mjs'
import { Content } from 'enonic-types/lib/content'
import { Table } from '../../site/content-types/table/table'
import { TbmlData, TableRow, Note, Notes, PreliminaryData, Title } from '../types/xmlParser'
import { Dataset as JSDataset } from '../types/jsonstat-toolkit'
import { Request } from 'enonic-types/lib/controller'
import { DatasetRepoNode } from '../repo/dataset'
import { DataSource as DataSourceType } from '../repo/dataset'
import { UtilLibrary } from '../types/util'
const {
  getDataset
} = __non_webpack_require__( '/lib/ssb/dataset/dataset')
const util: UtilLibrary = __non_webpack_require__( '/lib/util')


export function parseTable(req: Request, table: Content<Table>): TableView {
  const tableViewData: TableView = {
    caption: undefined,
    thead: [],
    tbody: [],
    tfoot: {
      footnotes: [],
      correctionNotice: ''
    },
    tableClass: '',
    noteRefs: []
  }

  const datasetRepo: DatasetRepoNode<JSONstat> | null = getDataset(table)

  if (datasetRepo) {
    const dataSource: Table['dataSource'] | undefined = table.data.dataSource
    const data: JSDataset | Array<JSDataset> | null | TbmlData = datasetRepo.data

    if (dataSource && dataSource._selected === DataSourceType.TBPROCESSOR) {
      const tbmlData: TbmlData = data as TbmlData
      const title: Title = tbmlData.tbml.metadata.title
      const headRows: Array<TableRow> = util.data.forceArray(tbmlData.tbml.presentation.table.thead.tr) as Array<TableRow>
      const bodyRows: Array<TableRow> = util.data.forceArray(tbmlData.tbml.presentation.table.tbody.tr) as Array<TableRow>

      const noteRefs: Array<string> = title.noterefs ? [title.noterefs] : []
      headRows.forEach((row) => {
        util.data.forceArray(row.th).forEach((th: PreliminaryData) => th.noterefs ? noteRefs.push(th.noterefs) : null)
      })
      bodyRows.forEach((row) => {
        util.data.forceArray(row.th).forEach((th: PreliminaryData) => th.noterefs ? noteRefs.push(th.noterefs) : null)
      })

      tableViewData.caption = title
      tableViewData.thead = headRows
      tableViewData.tbody = bodyRows
      tableViewData.tableClass = tbmlData.tbml.presentation.table.class
      tableViewData.tfoot.correctionNotice = table.data.correctionNotice || ''
      tableViewData.noteRefs = noteRefs

      const notes: Notes | undefined = tbmlData.tbml.metadata.notes
      if (notes) {
        const notesList: Array<Note> = util.data.forceArray(notes.note) as Array<Note>
        tableViewData.tfoot.footnotes = notesList
      }
    }
    return tableViewData
  }

  return tableViewData
}

interface TableView {
  caption?: Title;
  thead: Array<TableRow>;
  tbody: Array<TableRow>;
  tfoot: {
    footnotes: Array<Note>;
    correctionNotice: string;
  };
  tableClass: string;
  noteRefs: Array<string>;
}
