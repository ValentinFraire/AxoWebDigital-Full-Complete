<template>
  <form @submit.prevent="handleLogin">
    <div class="form-floating mb-3">
      <input
        type="email"
        class="form-control"
        id="email"
        placeholder="nombre@ejemplo.com"
        v-model="loginForm.email"
        required
      />
      <label for="email">Correo electrónico</label>
    </div>

    <div class="form-floating mb-3">
      <input
        type="password"
        class="form-control"
        id="password"
        placeholder="Contraseña"
        v-model="loginForm.password"
        required
      />
      <label for="password">Contraseña</label>
    </div>

    <div v-if="loginError" class="alert alert-danger">{{ loginError }}</div>

    <button type="submit" class="btn btn-primary w-100 py-2 mb-3">
      Iniciar Sesión
    </button>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const loginForm = ref({ email: "", password: "" });
const loginError = ref("");

const handleLogin = async () => {
  loginError.value = "";

  const result = await authStore.login(
    loginForm.value.email,
    loginForm.value.password
  );

  if (result.success) {
    // Según el backend usas 'typeUser' para el rol
    if (result.user.typeUser === "administrador") {
      router.push("/admin");
    } else if (result.user.typeUser === "cliente") {
      router.push("/cliente");
    } else {
      // En caso de otros roles o no definido
      router.push("/");
    }
  } else {
    loginError.value = result.message || "Error en el login";
  }
};
</script>

