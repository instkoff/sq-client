<template>
  <div @click="applyCam">
    <div v-show="!isCamApplied">
      <q-img v-for="image in ingotImages" :key="image.id" :src="image.base64String" basic>
        <div class="flex justify-between" style="position: unset">
          <div class="text-subtitle2">
            Оценка дефекта {{ image.prediction }}%
          </div>
          <div class="text-subtitle2">
            Дата {{ image.captureDate }}
          </div>
        </div>
      </q-img>
    </div>
    <div v-show="isCamApplied">
      <q-img v-for="image in ingotImages" :key="image.id" :src="image.camBase64String" basic>
        <div class="flex justify-between" style="position: unset">
          <div class="text-subtitle2">
            Оценка дефекта {{ image.prediction }}%
          </div>
          <div class="text-subtitle2">
            Дата {{ image.captureDate }}
          </div>
        </div>
      </q-img>
    </div>
  </div>
</template>

<script>
import { date } from 'quasar'
export default {
  name: 'IngotImages',
  props: {
    ingot: {
      type: Object,
      required: true
    }
  },
  created () {
    this.$root.$on('showDefectsClick', this.applyCam)
  },
  async mounted () {
    for (const image of this.ingot.ingotImages) {
      const response = await this.$axios.get('/IngotImage/get-image-base64/id', { params: { imageId: image.id } })
      const responseCam = await this.$axios.get('/IngotImage/cam-apply/id', { params: { imageId: image.id } })
      const ingotImage = {
        id: image.id,
        base64String: 'data:image/jpg;base64,' + response.data,
        camBase64String: 'data:image/jpg;base64,' + responseCam.data,
        prediction: image.prediction,
        captureDate: date.formatDate(this.ingot.captureDate, 'DD.MM.YYYY HH:mm:ss')
      }
      this.ingotImages.push(ingotImage)
    }
  },
  data () {
    return {
      ingotImages: [],
      isCamApplied: false
    }
  },
  methods: {
    applyCam () {
      this.isCamApplied = !this.isCamApplied
    }
  }
}
</script>
