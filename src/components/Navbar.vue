<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light py-3">
      <div class="container">
        <router-link to="/" class="navbar-brand d-flex align-items-center">
          <img
            src="https://i.pinimg.com/736x/88/4a/8e/884a8ed8ebfa49841a40ab82b1b70965.jpg"
            alt="AxoWeb Logo"
            class="logo rounded-logo me-2"
          />
          <span class="fw-bold">AxoWeb Digital</span>
        </router-link>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link to="/" class="nav-link" :class="{ 'fw-bold': isActive('/') }">
                Inicio
              </router-link>
            </li>

            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                Servicios
              </a>
              <ul class="dropdown-menu">
                <li>
                  <router-link to="/servicios" class="dropdown-item">
                    <i class="bi bi-grid-3x3-gap me-2"></i>Todos los Servicios
                  </router-link>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <router-link to="/servicios/ecommerce" class="dropdown-item">
                    <i class="bi bi-cart me-2"></i>E-commerce
                  </router-link>
                </li>
                <li>
                  <router-link to="/servicios/desarrollo-web" class="dropdown-item">
                    <i class="bi bi-laptop me-2"></i>Desarrollo Web
                  </router-link>
                </li>
                <li>
                  <router-link to="/servicios/diseno-ui-ux" class="dropdown-item">
                    <i class="bi bi-palette me-2"></i>Diseño UI/UX
                  </router-link>
                </li>
                <li>
                  <router-link to="/servicios/email-marketing" class="dropdown-item">
                    <i class="bi bi-envelope me-2"></i>Email Marketing
                  </router-link>
                </li>
                <li>
                  <router-link to="/servicios/automatizacion" class="dropdown-item">
                    <i class="bi bi-robot me-2"></i>Automatización
                  </router-link>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <router-link to="/servicios/marketing-digital" class="dropdown-item">
                    <i class="bi bi-megaphone me-2"></i>Marketing Digital
                  </router-link>
                </li>
              </ul>
            </li>

            <li class="nav-item">
              <router-link to="/sobre-nosotros" class="nav-link" :class="{ 'fw-bold': isActive('/sobre-nosotros') }">
                Sobre Nosotros
              </router-link>
            </li>

            <li class="nav-item">
              <router-link to="/contactanos" class="nav-link" :class="{ 'fw-bold': isActive('/contactanos') }">
                Contáctanos
              </router-link>
            </li>

            <li class="nav-item ms-lg-3">
              <button 
                v-if="!authStore.isAuthenticated" 
                class="btn btn-outline-primary rounded-pill px-4" 
                @click="showModal = true"
              >
                <i class="bi bi-person-circle me-2"></i>
                <span>Mi Cuenta</span>
              </button>

              <div v-else class="dropdown">
                <button 
                  class="btn btn-primary rounded-pill px-4 dropdown-toggle" 
                  type="button" 
                  data-bs-toggle="dropdown"
                >
                  <i class="bi bi-person-check me-2"></i>
                  {{ authStore.user.name }}
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li v-if="authStore.isClient">
                    <router-link to="/cliente" class="dropdown-item">
                      <i class="bi bi-person me-2"></i>Mi Cuenta
                    </router-link>
                  </li>
                  <li v-if="authStore.isAdmin">
                    <router-link to="/admin" class="dropdown-item">
                      <i class="bi bi-shield me-2"></i>Panel Admin
                    </router-link>
                  </li>
                  <li><hr class="dropdown-divider" /></li>
                  <li>
                    <button class="dropdown-item text-danger" @click="logout">
                      <i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Modal de Login/Register -->
    <AuthModal :show="showModal" @close="closeModal" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import AuthModal from '../components/modals/authModal.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()





const showModal = ref(false)

const isActive = (path) => route.path === path

const closeModal = () => {
  showModal.value = false
}

const logout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.navbar {
  background-color: var(--primary-beige);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.logo {
  height: 40px;
  width: 40px;
}

.rounded-logo {
  border-radius: 50%;
  object-fit: cover;
  background-color: white;
}

.nav-link {
  color: var(--primary-blue);
  margin: 0 10px;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: var(--primary-coral);
}

.dropdown-menu {
  border: none;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  padding: 0.5rem 0;
  min-width: 250px;
}

.dropdown-item {
  padding: 12px 20px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  font-weight: 500;
}

.dropdown-item:hover {
  background-color: var(--primary-beige);
  color: var(--primary-coral);
  transform: translateX(5px);
}

.dropdown-item i {
  width: 20px;
  color: var(--primary-coral);
}

.dropdown-divider {
  margin: 0.5rem 0;
  border-color: #e9ecef;
}

.dropdown-menu {
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  pointer-events: none;
}

.dropdown:hover .dropdown-menu,
.dropdown-menu.show {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

@media (max-width: 991px) {
  .dropdown-menu {
    position: static !important;
    transform: none !important;
    opacity: 1 !important;
    box-shadow: none;
    border: 1px solid #e9ecef;
    margin-top: 0.5rem;
  }

  .dropdown-item {
    padding: 10px 15px;
  }

  .dropdown-item:hover {
    transform: none;
  }
}
</style>