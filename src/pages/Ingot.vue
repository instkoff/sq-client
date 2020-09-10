<template>
  <q-page v-if="currentIngot">
    <q-dialog v-model="notesDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">Заметки</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="min-width: 70vh" class="scroll">
          <p>{{currentIngot.notes}}</p>
        </q-card-section>

        <q-separator />
        <q-form  @submit="sendNote" @reset="resetNoteForm">
          <q-input
            v-model="noteText"
            filled
            type="textarea"
          />
          <q-card-actions align="right">
            <q-btn label="Сохранить" type="submit" color="primary" v-close-popup/>
            <q-btn label="Сброс" type="reset" color="primary" flat class="q-ml-sm" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <div class="q-mt-md q-mb-md flex justify-end">
      <div class="q-mr-sm">
        <strong>ТС</strong>
        <span class="q-ml-sm">449-02-0216</span>
      </div>
      <div class="q-mr-sm">
        <strong>Сплав</strong>
        <span class="q-ml-sm">6061</span>
      </div>
      <div class="q-mr-sm">
        <strong>Плавка</strong>
        <span class="q-ml-sm">41-4088</span>
      </div>
      <div class="q-mr-sm">
        <strong>Номер слитка</strong>
        <span class="q-ml-sm">{{ currentIngot.ingotNumber }}</span>
      </div>
      <div class="q-mr-sm">
        <strong>Дата</strong>
        <span class="q-ml-sm">{{ captureDateFormatted }}</span>
      </div>
    </div>
    <q-card>
      <ingot-images :ingot-images="currentIngot.ingotImages" :key="ingotId"/>
    </q-card>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
  <div v-else>
    Слиток не выбран!
  </div>
</template>

<script>
import IngotImages from 'components/IngotImages'
import { mapGetters } from 'vuex'
import { FetchParams } from 'src/common/models'
import { date } from 'quasar'
import { sendNote } from 'src/common/utils'

export default {
  created () {
    this.$root.$on('nextBtnClick', this.nextIngot)
    this.$root.$on('prevBtnClick', this.prevIngot)
    this.$root.$on('showNotesClick', this.showNotesDialog)
  },
  destroyed () {
    this.$root.$off('nextBtnClick', this.nextIngot)
    this.$root.$off('prevBtnClick', this.prevIngot)
    this.$root.$off('showNotesClick', this.showNotesDialog)
    this.$store.dispatch('app/changeIngotToolbarState', false)
    this.$store.dispatch('app/updateIngot', undefined)
    this.$store.dispatch('app/setDrawerState', true)
  },
  async mounted () {
    if (this.currentIngot) {
      const currentIngotIndex = this.ingotList.findIndex(i => i.id === this.currentIngot.id)
      await this.$store.dispatch('app/prevBtnDisabled', false)
      await this.$store.dispatch('app/nextBtnDisabled', false)
      if (currentIngotIndex + 1 === this.ingotList.length) {
        await this.fetchIngots(true)
      }
      if (currentIngotIndex === 0) {
        await this.fetchIngots(false)
      }
      this.noteText = this.currentIngot.notes
    }
  },
  name: 'Ingot',
  components: { IngotImages: IngotImages },
  data () {
    return {
      loading: false,
      ingotId: null,
      notesDialogOpen: false,
      noteText: ''
    }
  },
  computed: {
    ...mapGetters('app', ['currentIngot', 'ingotList']),
    captureDateFormatted () {
      return date.formatDate(this.currentIngot.captureDate, 'DD.MM.YYYY HH:mm:ss')
    }
  },
  watch: {
    currentIngot: {
      async handler (value) {
        this.ingotId = value.id
        this.noteText = value.notes
      }
    }
  },
  methods: {
    async fetchNewList (startRow, currentFetchParams) {
      const newFetchParams = new FetchParams(startRow, currentFetchParams.fetchCount, currentFetchParams.filter, currentFetchParams.sortBy, currentFetchParams.descending)
      await this.$store.dispatch('app/getIngots', newFetchParams)
    },

    async nextIngot () {
      await this.$store.dispatch('app/prevBtnDisabled', false)
      const nextIngotIndex = this.ingotList.findIndex(i => i.id === this.currentIngot.id) + 1
      const nextIngot = this.ingotList[nextIngotIndex]
      await this.$store.dispatch('app/updateIngot', nextIngot)
      if (nextIngotIndex + 1 === this.ingotList.length) {
        await this.fetchIngots(true)
      }
    },
    async prevIngot () {
      await this.$store.dispatch('app/nextBtnDisabled', false)
      const prevIngotIndex = this.ingotList.findIndex(i => i.id === this.currentIngot.id) - 1
      const prevIngot = this.ingotList[prevIngotIndex]
      await this.$store.dispatch('app/updateIngot', prevIngot)
      if (prevIngotIndex === 0) {
        await this.fetchIngots(false)
      }
    },
    async fetchIngots (isNext) {
      const currentFetchParams = this.$store.getters['app/currentFetchParams']
      const startRow = isNext ? currentFetchParams.startRow - 5 + currentFetchParams.fetchCount : currentFetchParams.startRow + 5 - currentFetchParams.fetchCount
      if (startRow + 5 <= 0) {
        await this.$store.dispatch('app/prevBtnDisabled', true)
        return
      }
      if (startRow - 5 >= this.$store.state.app.totalRowsNumber) {
        await this.$store.dispatch('app/nextBtnDisabled', true)
        return
      }
      this.loading = true
      await this.fetchNewList(startRow, currentFetchParams)
      this.loading = false
    },
    async sendNote () {
      const noteModel = {
        ingotId: this.currentIngot.id,
        text: this.noteText
      }
      await this.$store.dispatch('app/updateIngotNotes', noteModel.text)
      await sendNote(noteModel)
    },
    resetNoteForm () {
      this.noteText = ''
    },
    showNotesDialog () {
      this.notesDialogOpen = true
    }
  }
}
</script>
