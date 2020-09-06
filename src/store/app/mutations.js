export function setCurrentPage (state, pageName) {
  state.currentPage = pageName
}
export const updateIngot = (state, ingot) => {
  state.currentIngot = ingot
}
export function setDrawerState (state) {
  state.leftDrawerOpen = !state.leftDrawerOpen
}
export function setDrawerStateFalse (state) {
  state.leftDrawerOpen = false
}
export function setIngotList (state, ingots) {
  state.ingotList.splice(0, state.ingotList.length, ...ingots)
}
export function setRowsNumber (state, number) {
  state.tableRowsNumber = number
}
export function changeIngotToolbarState (state) {
  state.ingotDetailsToolbarOpen = !state.ingotDetailsToolbarOpen
}
export function updateCurrentFetchParams (state, params) {
  state.currentFetchParams = params
}
export function setNextBtnState (state, flag) {
  state.nextBtnDisabled = flag
}
export function setPrevBtnState (state, flag) {
  state.prevBtnDisabled = flag
}
