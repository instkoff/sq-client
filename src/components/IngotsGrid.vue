<template>
  <div class="q-pa-md">
    <q-form>
      <div class="q-pa-sm">
        <div class="row">
          <div class="col q-mr-sm">
            <q-input filled v-model="filter.startDate" placeholder="Начальная дата">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="filter.startDate" mask="DD.MM.YYYY HH:mm:ss">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Закрыть" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="filter.startDate" mask="DD.MM.YYYY HH:mm:ss" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Закрыть" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col q-mr-sm">
            <q-input filled v-model="filter.endDate" placeholder="Конечная дата">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="filter.endDate" mask="DD.MM.YYYY HH:mm:ss">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Закрыть" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="filter.endDate" mask="DD.MM.YYYY HH:mm:ss" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Закрыть" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col q-mr-sm">
            <q-select v-model="filter.confidence" :options="confidenceOptions" emit-value map-options filled label="Дефект"/>
          </div>
          <div class="col q-mr-sm">
            <q-select v-model="filter.defectType" :options="defectTypeOptions" multiple filled label="Тип дефекта"/>
          </div>
          <div class="col q-mt-sm">
            <q-btn @click="resetFilter" flat color="primary">Сбросить</q-btn>
          </div>
        </div>
      </div>
    </q-form>
    <q-table
      :data="ingotList"
      :columns="columns"
      :visible-columns="visibleColumns"
      row-key="id"
      :pagination.sync="pagination"
      :filter="filter"
      :loading="loading"
      @request="onRequest"
      @row-click="onRowClick"
      binary-state-sort
    >
      <template v-slot:body-cell-images="props">
        <q-td style="width: 700px">
          <q-tr class="flex justify-center items-center">
            <q-tooltip content-style="font-size: 16px" anchor="center right" self="center right" :delay="1000">{{props.row.notes}}</q-tooltip>
              <img :src=image.thumbnailBase64 v-for="image in props.row.ingotImages" v-bind:key="image.id" class="q-mr-sm"/>
          </q-tr>
        </q-td>
      </template>

    </q-table>
  </div>
</template>

<script>
import { FetchParams, Filter, Pagination } from 'src/common/models'
import { mapGetters } from 'vuex'
import { confidenceSelectOptions, defectTypeSelectOptions, serviceLogTableColumns } from 'src/common/const'
export default {
  name: 'IngotsGrid',
  data () {
    return {
      filter: new Filter(null, null, null, null),
      confidenceOptions: confidenceSelectOptions,
      defectTypeOptions: defectTypeSelectOptions,
      loading: false,
      pagination: new Pagination('date', true, 1, 15, 100),
      columns: serviceLogTableColumns,
      visibleColumns: ['number', 'prediction', 'date', 'note', 'images']
    }
  },
  async mounted () {
    const currentFetchParams = this.$store.getters['app/currentFetchParams']
    if (currentFetchParams) {
      this.filter = currentFetchParams.filter
      this.pagination.sortBy = currentFetchParams.sortBy
      this.pagination.descending = currentFetchParams.descending
    }
    await this.onRequest({
      pagination: this.pagination,
      filter: this.filter
    })
  },
  methods: {
    async onRequest (props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      const filter = new Filter(
        props.filter.startDate,
        props.filter.endDate,
        props.filter.confidence,
        props.filter.defectType)

      this.loading = true

      const fetchCount = rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage
      const startRow = (page - 1) * rowsPerPage

      const fetchParams = new FetchParams(startRow, fetchCount, filter, sortBy, descending)

      await this.$store.dispatch('app/getIngots', fetchParams)
      this.pagination = new Pagination(sortBy, descending, page, rowsPerPage, this.$store.getters['app/rowsNumber'])

      this.loading = false
    },
    onRowClick (evt, row) {
      const ingot = row
      this.$store.dispatch('app/updateIngot', ingot)
      this.$store.dispatch('app/setDrawerState', false)
      this.$store.dispatch('app/changeIngotToolbarState', true)
      this.$router.push('ingot')
    },
    resetFilter () {
      this.filter = new Filter(null, null, null, null)
    }
  },
  computed: {
    ...mapGetters('app', ['ingotList'])
  }
}
</script>
