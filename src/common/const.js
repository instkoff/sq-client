import { date } from 'quasar'

export const AXIOS_URLS = {
  devBaseUrl: 'http://localhost:8000/api',
  prodBaseUrl: 'http://10.3.189.50:8000/api'
}
export const menuLinks = [
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

export const confidenceSelectOptions = [
  {
    label: 'Выше среднего',
    value: 'High'
  },
  {
    label: 'Средняя',
    value: 'Middle'
  },
  {
    label: 'Низкая',
    value: 'Low'
  }
]

export const defectTypeSelectOptions = [
  {
    label: 'Включения',
    value: 'inclusion'
  },
  {
    label: 'Трещины',
    value: 'fissure'
  },
  {
    label: 'Провал',
    value: 'laydown'
  },
  {
    label: 'Кратер',
    value: 'crater'
  },
  {
    label: 'Мусор',
    value: 'garbage'
  },
  {
    label: 'Пузыри',
    value: 'bubble'
  }
]
export const serviceLogTableColumns = [
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
]
