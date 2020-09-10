<template>
  <q-layout view="hHh Lpr lFf">
    <q-header>
      <div class="row no-wrap shadow-1">
        <q-toolbar class="bg-grey-3">
          <q-btn color="white" text-color="black"
                 flat
                 dense
                 round
                 icon="menu"
                 aria-label="Menu"
                 @click="changeDrawerState"
          />
          <q-toolbar-title class="text-black flex items-center">
            <q-icon name="img:icons/rusal_on_white_32.png" class="q-mr-md"/>
            Surface Quality
            <q-separator vertical class="q-ml-md"></q-separator>
            <q-breadcrumbs class="q-ml-md">
              <q-breadcrumbs-el class="text-black" :label="getCurrentPage" />
              <q-breadcrumbs-el v-if="currentIngot" :label="'Cлиток № ' + currentIngot.ingotNumber" />
            </q-breadcrumbs>
          </q-toolbar-title>
        </q-toolbar>
        <q-toolbar v-show="ingotToolbarOpen" class="bg-grey-3 text-black">
          <q-space />
          <q-btn @click="prevBtnClick" :disable="prevBtnState" flat dense>Предыдущий</q-btn>
          <q-separator vertical class="q-mr-sm q-ml-sm"></q-separator>
          <q-btn @click="nextBtnClick" :disable="nextBtnState" flat dense>Следующий</q-btn>
          <q-separator vertical class="q-mr-sm q-ml-sm"></q-separator>
          <q-btn @click="showDefectsClick" flat dense>Показать дефекты</q-btn>
          <q-separator vertical class="q-mr-sm q-ml-sm"></q-separator>
          <q-btn @click="showNotesClick" flat dense>Показать заметки</q-btn>
        </q-toolbar>
      </div>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :width = "200"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Menu
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'
import { mapGetters } from 'vuex'
import { menuLinks } from 'src/common/const'

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data () {
    return {
      essentialLinks: menuLinks,
      currentPage: this.$route.meta.name
    }
  },
  computed: {
    ...mapGetters('app', ['currentIngot']),
    getCurrentPage: {
      get () {
        if (this.$store.state.app.currentPage) {
          return this.$store.state.app.currentPage
        }
        return this.currentPage
      }
    },
    leftDrawerOpen: {
      get () {
        return this.$store.state.app.leftDrawerOpen
      },
      set (val) {
        this.$store.dispatch('app/setDrawerState', val)
      }
    },
    ingotToolbarOpen () {
      return this.$store.state.app.ingotDetailsToolbarOpen
    },
    nextBtnState () {
      return this.$store.state.app.nextBtnDisabled
    },
    prevBtnState () {
      return this.$store.state.app.prevBtnDisabled
    }
  },
  methods: {
    changeDrawerState () {
      this.$store.dispatch('app/changeDrawerState')
    },
    nextBtnClick () {
      this.$root.$emit('nextBtnClick')
    },
    prevBtnClick () {
      this.$root.$emit('prevBtnClick')
    },
    showDefectsClick () {
      this.$root.$emit('showDefectsClick')
    },
    showNotesClick () {
      this.$root.$emit('showNotesClick')
    }
  }
}
</script>
