import Vue from 'vue'
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://localhost:5001/api'
})

Vue.prototype.$axios = axiosInstance

export { axiosInstance }

