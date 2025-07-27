<template>
  <div class="cliente-view">
    <div class="container py-5 animate__animated animate__fadeIn">
      <!-- Header -->
      <ClienteHeader :usuario="usuario" />

      <!-- Navigation Tabs -->
      <ClienteNavigation 
        :active-tab="activeTab"
        @change-tab="activeTab = $event"
      />

      <!-- Content -->
      <div class="tab-content">
        <!-- Inicio Tab -->
        <ClienteInicio 
          v-if="activeTab === 'inicio'"
          :usuario="usuario"
          @update-usuario="updateUsuario"
        />

        <!-- Servicios Tab
        <ClienteServicios 
          v-if="activeTab === 'servicios'"
          :planes="planes"
          @renovar="renovarPlan"
          @cancelar="cancelarPlan"
        /> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ClienteHeader from './components/ClienteHeader.vue'
import ClienteNavigation from './components/ClienteNavigation.vue'
import ClienteInicio from './components/ClienteInicio.vue'
import ClienteServicios from './components/ClienteServicios.vue'
import { useAlert } from '../../../hooks/useAlert'
import { useAuthStore } from '../../../stores/auth.js'
const authStore = useAuthStore()


const { showSuccess, showInfo } = useAlert()

import { planesDeUsuario } from '../../../data/PlanesDeUsario'
const activeTab = ref('inicio')


// Datos del usuario, con valores por defecto si no están disponible



const usuario = ref({
  nombre: authStore.user?.name || 'Mario',
  apellido: authStore.user?.lastname || 'González',
  telefono: authStore.user?.phone || '123-456-7890',
  email: authStore.user?.email || 'mario@ejemplo.com',
  empresa: authStore.user?.company || 'Empresa S.A. de C.V.'
})

const planes = ref( planesDeUsuario )

const updateUsuario = (nuevosDatos) => {
  Object.assign(usuario.value, nuevosDatos)
  showSuccess('Datos actualizados', 'Tu información ha sido guardada exitosamente')
}

const renovarPlan = (plan) => {
  showInfo('Renovación solicitada', `Se ha solicitado la renovación del plan: ${plan.nombre}`)
  // Aquí iría la lógica para renovar el plan
}

const cancelarPlan = (plan) => {
  showInfo('Cancelación solicitada', `Se ha solicitado la cancelación del plan: ${plan.nombre}`)
  // Aquí iría la lógica para cancelar el plan
}
</script>

<style scoped>
.cliente-view {
  background-color: var(--primary-beige);
  min-height: 100vh;
}

.tab-content {
  margin-top: 2rem;
}
</style>