<template>
  <q-page>
    <q-card>
      <ingot-images :ingot="currentIngot" :key="ingotId"/>
    </q-card>
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
  name: 'Ingot',
  components: { IngotImages: IngotImages },
  data () {
    return {
      ingotId: this.$store.getters['app/currentIngot'].id
    }
  },
  computed: {
    currentIngot () {
      return this.$store.getters['app/currentIngot']
    }
  },
  methods: {
    // Спросить про быстрый клик
    nextIngot () {
      const list = this.$store.getters['app/ingotList']
      const selected = this.$store.getters['app/currentIngot']
      const index = list.findIndex(i => i.id === selected.id) + 1
      if (index + 1 === list.length) {
        const currentFetchParams = this.$store.getters['app/currentFetchParams']
        const newFetchParams = {
          startRow: currentFetchParams.startRow + currentFetchParams.fetchCount,
          fetchCount: currentFetchParams.fetchCount,
          filter: currentFetchParams.filter,
          sortBy: currentFetchParams.sortBy,
          descending: currentFetchParams.descending
        }
        this.$store.dispatch('app/getIngots', newFetchParams)
      }
      this.$store.dispatch('app/updateIngot', list[index])
      this.ingotId = list[index].id
    },
    prevIngot () {
      const list = this.$store.getters['app/ingotList']
      const selected = this.$store.getters['app/currentIngot']
      const index = list.findIndex(i => i.id === selected.id) - 1
      if (index === 0) {
        const currentFetchParams = this.$store.getters['app/currentFetchParams']
        const startRow = currentFetchParams.startRow - currentFetchParams.fetchCount
        if (startRow <= 0) {
          this.$root.$emit('blockPrevButton')
        } else {
          const newFetchParams = {
            startRow: startRow,
            fetchCount: currentFetchParams.fetchCount,
            filter: currentFetchParams.filter,
            sortBy: currentFetchParams.sortBy,
            descending: currentFetchParams.descending
          }
          this.$store.dispatch('app/getIngots', newFetchParams)
        }
      }
      this.$store.dispatch('app/updateIngot', list[index])
      this.ingotId = list[index].id
    }
  }
}
</script>
