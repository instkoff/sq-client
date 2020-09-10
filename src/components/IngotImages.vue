<template>
  <div>
    <div v-if="!ingotImages">
      Снимок не выбран!
    </div>
    <div v-show="!isCamApplied">
            <q-img v-for="image in imagesBase64" :key="image.id" :src="image.base64String" basic>
        <div class="flex justify-between" style="position: unset">
          <div class="text-subtitle2">
            Оценка дефекта {{ image.prediction }}%
          </div>
        </div>
      </q-img>
    </div>
    <div v-show="isCamApplied">
      <q-img v-for="image in imagesBase64" :key="image.id" :src="image.camBase64String" basic>
        <div class="flex justify-between" style="position: unset">
          <div class="text-subtitle2">
            Оценка дефекта {{ image.prediction }}%
          </div>
        </div>
      </q-img>
    </div>
  </div>
</template>

<script>
import { getIngotImages } from 'src/common/utils'

export default {
  name: 'IngotImages',
  props: {
    ingotImages: {
      type: Array
    }
  },
  created () {
    this.$root.$on('showDefectsClick', this.applyCam)
  },
  async mounted () {
    if (this.ingotImages) {
      await this.updateImages()
    }
  },
  data () {
    return {
      isCamApplied: false,
      imagesBase64: []
    }
  },
  methods: {
    applyCam () {
      this.isCamApplied = !this.isCamApplied
    },
    async updateImages () {
      this.imagesBase64 = await getIngotImages(this.ingotImages)
    }
  }
}
</script>
