<template>
  <form @submit.prevent="handleRegister">
    <div class="form-floating mb-3">
      <input v-model="form.name" type="text" class="form-control" id="name" placeholder="Nombre">
      <label for="name">Nombre</label>
    </div>

    <div class="form-floating mb-3">
      <input v-model="form.lastname" type="text" class="form-control" id="lastname" placeholder="Apellido">
      <label for="lastname">Apellido</label>
    </div>

    <div class="form-floating mb-3">
      <input v-model="form.email" type="email" class="form-control" id="email" placeholder="Correo">
      <label for="email">Correo electrónico</label>
    </div>

    <div class="form-floating mb-3">
      <input v-model="form.password" type="password" class="form-control" id="password" placeholder="Contraseña">
      <label for="password">Contraseña</label>
    </div>

    <div class="form-floating mb-3">
      <input v-model="form.phone" type="text" class="form-control" id="phone" placeholder="Teléfono">
      <label for="phone">Teléfono</label>
    </div>

    <div class="form-floating mb-3">
      <input v-model="form.company" type="text" class="form-control" id="company" placeholder="Empresa">
      <label for="company">Empresa</label>
    </div>

    <div class="form-check mb-4">
      <input class="form-check-input" type="checkbox" id="terms" v-model="acceptedTerms">
      <label class="form-check-label small" for="terms">
        Acepto los <a href="#" class="text-decoration-none">términos y condiciones</a>
      </label>
    </div>
    
    <div v-if="registerError" class="alert alert-danger">{{ registerError }}</div>
    <div v-if="authStore.registerSuccess" class="alert alert-success">
      Registro exitoso. Por favor, inicia sesión.
    </div>

    <button type="submit" class="btn btn-primary w-100 py-2 mb-3">Crear Cuenta</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

authStore.register

const form = ref({
  name: '',
  lastname: '',
  email: '',
  password: '',
  phone: '',
  company: '',
})
const acceptedTerms = ref(false)
const registerError = ref('')

const handleRegister = async () => {
  if (!acceptedTerms.value) {
    registerError.value = 'Debes aceptar los términos.'
    return
  }

  const result = await authStore.register(form.value)
 
    if (result.success) {
        authStore.registerSuccess = true
        
    } else {
        registerError.value = result.message || 'Error al registrar. Inténtalo de nuevo.'
  }
}
</script>
<style scoped>



</style>