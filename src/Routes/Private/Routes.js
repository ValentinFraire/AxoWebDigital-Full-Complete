// src/routes/private/router.js

import Cliente from '/src/views/Private/clientes/ClienteView.vue'
import Dashboard from '/src/views/Private/administradores/AdminView.vue'



export default [
  {
    path: '/cliente',
    component: Cliente,
    meta: { requiresAuth: true, role: 'cliente' }
  },
  {
    path: '/admin',
    component: Dashboard,
    meta: { requiresAuth: true, role: 'administrador' }
  }
]


