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
              <q-breadcrumbs-el v-if="currentIngot.ingotNumber" :label="'Cлиток № ' + currentIngot.ingotNumber" />
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
          <q-btn flat dense>Показать заметки</q-btn>
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

const linksData = [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    link: 'dashboard'
  },
  {
    title: 'Лог работы',
    icon: 'subject',
    link: 'service-log'
  },
  {
    title: 'Настройки',
    icon: 'settings',
    link: 'settings'
  }
]

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data () {
    return {
      essentialLinks: linksData,
      currentPage: this.$route.meta.name
    }
  },
  computed: {
    currentIngot: {
      get () {
        return this.$store.getters['app/currentIngot']
      }
    },
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
      set () {
        this.$store.dispatch('app/setDrawerState')
      }
    },
    ingotButtonsOpen: {
      get () {
        return this.$store.state.app.ingotButtonsOpen
      }
    },
    ingotToolbarOpen: {
      get () {
        return this.$store.state.app.ingotDetailsToolbarOpen
      }
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
      this.$store.dispatch('app/setDrawerState')
    },
    nextBtnClick () {
      this.$root.$emit('nextBtnClick')
    },
    prevBtnClick () {
      this.$root.$emit('prevBtnClick')
    },
    showDefectsClick () {
      this.$root.$emit('showDefectsClick')
    }
  }
}
</script>
