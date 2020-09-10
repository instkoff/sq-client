export function setCurrentPage (state, pageName) {
  state.currentPage = pageName
}
export const updateIngot = (state, ingot) => {
  state.currentIngot = ingot
}
export const updateIngotNote = (state, notes) => {
  state.currentIngot.notes = notes
}
export function changeDrawerState (state) {
  state.leftDrawerOpen = !state.leftDrawerOpen
}
export function setDrawerState (state, opened) {
  state.leftDrawerOpen = opened
}
export function setIngotList (state, ingots) {
  state.ingotList.splice(0, state.ingotList.length, ...ingots)
}
export function setTotalRowsNumber (state, number) {
  state.totalRowsNumber = number
}
export function changeIngotToolbarState (state, open) {
  state.ingotDetailsToolbarOpen = open
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
