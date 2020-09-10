import { axiosInstance } from 'boot/axios'

export async function getIngotImages (ingotImages) {
  const imagesBase64 = []
  for (const image of ingotImages) {
    const response = await axiosInstance.get('/IngotImage/get-base64-images/id', { params: { imageId: image.id } })
    const ingotImage = {
      id: image.id,
      base64String: 'data:image/jpg;base64,' + response.data.originalImage,
      camBase64String: 'data:image/jpg;base64,' + response.data.camActivatedImage,
      prediction: image.prediction
    }
    imagesBase64.push(ingotImage)
  }
  return imagesBase64
}

export async function sendNote (note) {
  await axiosInstance.post('/IngotApi/add-note', note)
}
