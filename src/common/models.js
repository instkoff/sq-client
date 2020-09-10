export class FetchParams {
  constructor (startRow, fetchCount, filter, sortBy, descending) {
    this.startRow = startRow
    this.fetchCount = fetchCount
    this.filter = filter
    this.sortBy = sortBy
    this.descending = descending
  }
}
export class Filter {
  constructor (startDate, endDate, confidence, defectType) {
    this.startDate = startDate
    this.endDate = endDate
    this.confidence = confidence
    this.defectType = defectType
  }
}
export class Pagination {
  constructor (sortBy, descending, page, rowsPerPage, rowsNumber) {
    this.sortBy = sortBy
    this.descending = descending
    this.page = page
    this.rowsPerPage = rowsPerPage
    this.rowsNumber = rowsNumber
  }
}
