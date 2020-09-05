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
            <q-select v-model="filter.confidence" :options="confidenceOptions" filled label="Дефект"/>
          </div>
          <div class="col q-mr-sm">
            <q-select v-model="filter.defectType" :options="defectTypeOptions"  filled label="Тип дефекта"/>
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
import { date } from 'quasar'
export default {
  name: 'IngotsGrid',
  data () {
    return {
      filter: {
        startDate: null,
        endDate: null,
        confidence: null,
        defectType: null
      },
      confidenceOptions: ['High', 'Middle', 'Low'],
      defectTypeOptions: ['Включения', 'Трещины', 'Провалы', 'Корочка'],
      loading: false,
      pagination: {
        sortBy: 'date',
        descending: true,
        page: 1,
        rowsPerPage: 15,
        rowsNumber: 100
      },
      columns: [
        {
          name: 'id',
          field: 'id'
        },
        {
          name: 'number',
          label: 'Номер слитка',
          align: 'center',
          field: 'ingotNumber',
          sortable: false
        },
        {
          name: 'prediction',
          label: 'Оценка дефекта',
          align: 'center',
          format: val => `${val}%`,
          field: 'prediction',
          sortable: true
        },
        {
          name: 'date',
          label: 'Дата',
          align: 'center',
          field: 'captureDate',
          format: val => date.formatDate(val, 'DD.MM.YYYY HH:mm:ss'),
          sortable: true
        },
        {
          name: 'images',
          label: 'Изображение',
          align: 'center',
          sortable: false
        }
      ],
      visibleColumns: ['number', 'prediction', 'date', 'note', 'images'],
      data: []
    }
  },
  async mounted () {
    await this.onRequest({
      pagination: this.pagination,
      filter: this.filter
    })
  },
  methods: {
    async onRequest (props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      const filter = props.filter

      this.loading = true

      const fetchCount = rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage
      const startRow = (page - 1) * rowsPerPage

      const fetchParams = {
        startRow,
        fetchCount,
        filter,
        sortBy,
        descending
      }

      await this.$store.dispatch('app/getIngots', fetchParams)
      this.pagination.rowsNumber = this.$store.getters['app/rowsNumber']
      this.pagination.page = page
      this.pagination.rowsPerPage = rowsPerPage
      this.pagination.sortBy = sortBy
      this.pagination.descending = descending

      this.loading = false
    },
    onRowClick (evt, row) {
      const ingot = row
      this.$store.dispatch('app/updateIngot', ingot)
      this.$router.push('ingot')
    }
  },
  computed: {
    ingotList () {
      return this.$store.getters['app/ingotList']
    }
  }
}
</script>
