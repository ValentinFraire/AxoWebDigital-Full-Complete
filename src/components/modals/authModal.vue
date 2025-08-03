<template>
  <div
    class="modal fade animate__animated animate__fadeIn"
    tabindex="-1"
    :class="{ show: show }"
    style="display: block"
    v-if="show"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 shadow">
        <div class="modal-header border-0 pb-0">
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
          ></button>
        </div>
        <div class="modal-body pt-0">
          <div class="text-center mb-4">
            <img
              src="https://i.pinimg.com/736x/88/4a/8e/884a8ed8ebfa49841a40ab82b1b70965.jpg"
              class="modal-logo mb-3"
            />
            <h5 class="modal-title fw-bold">
              {{ isLogin ? "Bienvenido de vuelta" : "Únete a nosotros" }}
            </h5>
            <p class="text-muted">
              {{
                isLogin
                  ? "Inicia sesión para continuar"
                  : "Crea tu cuenta en segundos"
              }}
            </p>
          </div>

          <button @click="authStore.loginWithGoogle" class="btn btn-google w-100 mb-4 position-relative">
            <i class="bi bi-google position-absolute start-4"></i>
            Continuar con Google
          </button>

          <div class="divider-text mb-4">o</div>

          <LoginForm v-if="isLogin" />
          <RegisterForm v-else />

          <p class="text-center mb-0 mt-3">
            {{ isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?" }}
            <a
              href="#"
              @click.prevent="isLogin = !isLogin"
              class="text-decoration-none"
            >
              {{ isLogin ? "Regístrate" : "Inicia sesión" }}
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import LoginForm from "../LoginForm.vue";
import RegisterForm from "../RegisterForm.vue";
import { useAuthStore } from "@/Stores/auth.js";

const authStore = useAuthStore();




defineProps(["show"]);
const isLogin = ref(true);
</script>

<style scoped>
.modal-logo {
  width: 100px;
  height: 100px;
}

.modal-header {
  border-bottom: none;
}

.modal-body {
  padding: 2rem;
}

.modal-title {
  font-size: 1.5rem;
}

.modal-content {
  border-radius: 1rem;
}

.divider-text {
  position: relative;
  text-align: center;
  margin-top: 15px;
  margin-bottom: 15px;
}

.divider-text::before,
.divider-text::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background-color: #dee2e6;
}

.divider-text::before {
  left: 0;
}
.divider-text::after {
  right: 0;
}

.divider-text {
  color: #6c757d;
  font-weight: 500;
}

.btn-google {
  color: #fff;
  background-color: #f25d50;
  border-color: #fff;
}

.btn-google:hover {
  color: #fff;
  background-color: #c23321;
  border-color: #fff;
}

.btn-google i {
  color: #fff;
  font-size: 1.2rem;
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
}

.modal-body p {
  font-size: 0.9rem;
  color: #6c757d;
}

.modal-body h5 {
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-body .text-muted {
  font-size: 0.9rem;
}

.modal-body .text-decoration-none {
  color: #007bff;
}

.modal-body .text-decoration-none:hover {
  text-decoration: underline;
}

.modal-body .bg-light {
  background-color: #f8f9fa !important;
}

.modal-body .bg-light h6 {
  font-size: 1rem;
  font-weight: 600;
}

.modal-body .bg-light small {
  font-size: 0.9rem;
}

.modal-body .bg-light small strong {
  font-weight: 600;
}

.modal-body .bg-light small {
  display: block;
  margin-bottom: 0.5rem;
}

.modal-body .bg-light small:last-child {
  margin-bottom: 0;
}

.modal-body .bg-light {
  padding: 1rem;
  border-radius: 0.5rem;
}

.modal-body .bg-light h6 {
  margin-bottom: 0.5rem;
}

.modal-body .bg-light small {
  margin-bottom: 0.25rem;
}

.modal-body .bg-light small:last-child {
  margin-bottom: 0;
}

.modal-body .bg-light small strong {
  font-weight: 600;
}
</style>
