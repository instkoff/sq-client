const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue'), meta: { name: 'Главная' } },
      { path: 'dashboard', component: () => import('pages/Dashboard.vue'), meta: { name: 'Dashboard' } },
      { path: 'service-log', component: () => import('pages/ServiceLog.vue'), meta: { name: 'Лог работы' } },
      { path: 'settings', component: () => import('pages/Settings.vue'), meta: { name: 'Настройки' } },
      { path: 'ingot', component: () => import('pages/Ingot.vue'), meta: { name: 'Детали' } }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
