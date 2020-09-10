import { date } from 'quasar'
import { axiosInstance } from 'boot/axios'

export function setCurrentPage (context, pageName) {
  context.commit('setCurrentPage', pageName)
}
export function updateIngot (context, ingot) {
  context.commit('updateIngot', ingot)
}
export function updateIngotNotes (context, notes) {
  context.commit('updateIngotNote', notes)
}
export function changeDrawerState (context) {
  context.commit('changeDrawerState')
}
export function setDrawerState (context, opened) {
  context.commit('setDrawerState', opened)
}
export function changeIngotToolbarState (context, opened) {
  context.commit('changeIngotToolbarState', opened)
}
export function nextBtnDisabled (context, flag) {
  context.commit('setNextBtnState', flag)
}
export function prevBtnDisabled (context, flag) {
  context.commit('setPrevBtnState', flag)
}
export async function getIngots (context, fetchParams) {
  try {
    const response = await axiosInstance.get('/IngotApi/get-filtered', {
      params: {
        StartRow: fetchParams.startRow,
        FetchCount: fetchParams.fetchCount,
        SortBy: fetchParams.sortBy,
        Descending: fetchParams.descending,
        StartDate: !fetchParams.filter.startDate ? null : date.extractDate(fetchParams.filter.startDate, 'DD.MM.YYYY HH:mm:ss').toISOString(),
        EndDate: !fetchParams.filter.endDate ? null : date.extractDate(fetchParams.filter.endDate, 'DD.MM.YYYY HH:mm:ss').toISOString(),
        Confidence: fetchParams.filter.confidence
      }
    })
    context.commit('updateCurrentFetchParams', fetchParams)
    context.commit('setTotalRowsNumber', response.data.totalRecords)
    context.commit('setIngotList', response.data.data)
  } catch (err) {
    alert(err)
  }
}
