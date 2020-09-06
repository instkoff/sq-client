<template>
  <q-page>
    <q-card>
      <ingot-images :ingot="currentIngot"/>
    </q-card>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
import IngotImages from 'components/IngotImages'
import { mapState } from 'vuex'
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
    ...mapGetters('app', ['currentIngot', 'ingotList'])
  },
  watch: {
    async currentIngot (value) {
      this.ingotId = value.id
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
      const currentIngot = this.$store.getters['app/currentIngot']
      const nextIngotIndex = this.ingotList.findIndex(i => i.id === currentIngot.id) + 1
      const nextIngot = this.ingotList[nextIngotIndex]
      await this.$store.dispatch('app/updateIngot', nextIngot)
      if (nextIngotIndex + 1 === this.ingotList.length) {
        await this.fetchAnotherIngot(true)
      }
    },
    async prevIngot () {
      const currentIngot = this.$store.getters['app/currentIngot']
      const prevIngotIndex = this.ingotList.findIndex(i => i.id === currentIngot.id) - 1
      const prevIngot = this.ingotList[prevIngotIndex]
      await this.$store.dispatch('app/updateIngot', prevIngot)
      if (prevIngotIndex === 0) {
        await this.fetchAnotherIngot(false)
      }
    },
    async fetchAnotherIngot (isNext) {
      const currentFetchParams = this.$store.getters['app/currentFetchParams']
      const startRow = isNext ? currentFetchParams.startRow + currentFetchParams.fetchCount : currentFetchParams.startRow - currentFetchParams.fetchCount
      this.loading = true
      await this.fetchNewList(startRow)
      this.loading = false
    }
  }
}
</script>
