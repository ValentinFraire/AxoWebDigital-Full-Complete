// src/routes/router.js

import { createRouter, createWebHistory } from "vue-router";
import publicRoutes from "./public/Routes";
import privateRoutes from "./Private/Routes";
import Error404 from "../views/Error404.vue";
import { useAuthStore } from "../stores/auth";

const routes = [
  ...publicRoutes,
  ...privateRoutes,
  { path: "/404", component: Error404 },
  { path: "/:pathMatch(.*)*", redirect: "/404" }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
});

// Guardias de ruta
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAdminb = authStore.isAdmin;
  const isClient = authStore.isClient;

  if (requiresAuth && !authStore.isAuthenticated) {
    return next({ path: "/login" });
  }
  // Verificar roles
  if (requiresAuth && to.meta.role) {
    if (to.meta.role === "administrador" && !isAdminb) {
      return next({ path: "/admin" });
    }
    if (to.meta.role === "cliente" && !isClient) {
      return next({ path: "/cliente" });
    }
  }

  // Si no se requiere autenticación o el usuario está autenticado, continuar
  if (!requiresAuth || authStore.isAuthenticated) {
    return next();
  }
  
  next();
});

export default router;
