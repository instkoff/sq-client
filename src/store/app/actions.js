import { date } from 'quasar'
import { axiosInstance } from 'boot/axios'

export function setCurrentPage (context, pageName) {
  context.commit('setCurrentPage', pageName)
}
export function updateIngot (context, ingot) {
  context.commit('updateIngot', ingot)
}
export function setDrawerState (context) {
  context.commit('setDrawerState')
}
export function setDrawerStateFalse (context) {
  context.commit('setDrawerStateFalse')
}
export function changeIngotToolbarState (context) {
  context.commit('changeIngotToolbarState')
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
    context.commit('setRowsNumber', response.data.totalRecords)
    context.commit('setIngotList', response.data.data)
  } catch (err) {
    alert(err)
  }
}
