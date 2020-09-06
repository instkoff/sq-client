<template>
  <q-page>
    <q-card>
      <ingot-images :ingot="currentIngot" :key="ingotId"/>
    </q-card>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
import IngotImages from 'components/IngotImages'

export default {
  created () {
    this.$root.$on('nextBtnClick', this.nextIngot)
    this.$root.$on('prevBtnClick', this.prevIngot)
    this.$store.dispatch('app/setDrawerStateFalse')
    this.$store.dispatch('app/changeIngotToolbarState')
  },
  destroyed () {
    this.$root.$off('nextBtnClick', this.nextIngot)
    this.$root.$off('prevBtnClick', this.prevIngot)
    this.$store.dispatch('app/updateIngot', {})
    this.$store.dispatch('app/changeIngotToolbarState')
  },
  async mounted () {
    const ingotList = this.$store.getters['app/ingotList']
    const selectedIngot = this.$store.getters['app/currentIngot']
    const currentIngotIndex = ingotList.findIndex(i => i.id === selectedIngot.id)
    if (currentIngotIndex + 1 === ingotList.length) {
      const currentFetchParams = this.$store.getters['app/currentFetchParams']
      const startRow = currentFetchParams.startRow + currentFetchParams.fetchCount
      await this.fetchNewList(startRow)
    }
  },
  name: 'Ingot',
  components: { IngotImages: IngotImages },
  data () {
    return {
      ingotId: this.$store.getters['app/currentIngot'].id,
      loading: false
    }
  },
  computed: {
    currentIngot () {
      return this.$store.getters['app/currentIngot']
    }
  },
  watch: {
    async ingotId () {
      const ingotList = this.$store.getters['app/ingotList']
      const currentIngot = this.$store.getters['app/currentIngot']
      const nextIngotIndex = ingotList.findIndex(i => i.id === currentIngot.id) + 1
      const nextIngot = ingotList[nextIngotIndex]
      console.log(nextIngotIndex)
      await this.$store.dispatch('app/updateIngot', nextIngot)
    }
  },
  methods: {
    async fetchNewList (startRow) {
      const currentFetchParams = this.$store.getters['app/currentFetchParams']
      const newFetchParams = {
        startRow: startRow,
        fetchCount: currentFetchParams.fetchCount,
        filter: currentFetchParams.filter,
        sortBy: currentFetchParams.sortBy,
        descending: currentFetchParams.descending
      }
      await this.$store.dispatch('app/getIngots', newFetchParams)
    },
    // Спросить про быстрый клик
    async nextIngot () {

      this.ingotId = nextIngot.id
      if (nextIngotIndex + 1 === ingotList.length) {
        const currentFetchParams = this.$store.getters['app/currentFetchParams']
        const startRow = currentFetchParams.startRow + currentFetchParams.fetchCount
        this.loading = true
        await this.fetchNewList(startRow)
        this.loading = false
      }
    },
    async prevIngot () {
      const ingotList = this.$store.getters['app/ingotList']
      const currentIngot = this.$store.getters['app/currentIngot']
      const prevIngotIndex = ingotList.findIndex(i => i.id === currentIngot.id) - 1
      const prevIngot = ingotList[prevIngotIndex]
      console.log(prevIngotIndex)
      await this.$store.dispatch('app/updateIngot', prevIngot)
      this.ingotId = prevIngot.id
      if (prevIngotIndex === 0) {
        const currentFetchParams = this.$store.getters['app/currentFetchParams']
        const startRow = currentFetchParams.startRow - currentFetchParams.fetchCount
        this.loading = true
        await this.fetchNewList(startRow)
        this.loading = false
      }
    }
  }
}
</script>
