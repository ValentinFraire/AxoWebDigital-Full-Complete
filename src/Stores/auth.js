import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

const url = "https://axoweb-digital-server-production.up.railway.app/api";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    isAdmin: localStorage.getItem("isAdmin") === "true",
    isClient: localStorage.getItem("isClient") === "true",
    isAuthenticated: !!localStorage.getItem("token"),
    users: ref([]),
    id_user: null
  }),

  actions: {
    // Función para iniciar sesión y registrar e obtener el token
    async login(email, password) {
      try {
        const response = await axios.post(`${url}/users/login`, {
          email,
          password
        });

        if (response.data.token) {
          this.token = response.data.token;
          localStorage.setItem("token", this.token);

          await this.getUser();

          localStorage.setItem("user", JSON.stringify(this.user));
          localStorage.setItem("isAdmin", this.isAdmin);
          localStorage.setItem("isClient", this.isClient);

          this.isAuthenticated = true;

          return { success: true, user: this.user };
        } else {
          return { success: false, message: "Token no recibido" };
        }
      } catch (error) {
        if (error.response) {
          switch (error.response.status) {
            case 400:
              return { success: false, message: "Datos Erroneos" };
            case 401:
              return { success: false, message: "Credenciales incorrectas" };
            case 500:
              return { success: false, message: "Error del servidor" };
            default:
              return {
                success: false,
                message:
                  error.response.data.message || "Error al iniciar sesión"
              };
          }
        }
        return { success: false, message: "Error al iniciar sesión" };
      }
    },
    async register({
      name,
      lastname,
      email,
      password,
      company,
      phone,
      typeUser = "cliente"
    }) {
      try {
        const response = await fetch(`${url}/users/registerPublic`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            lastname,
            email,
            password,
            company,
            phone,
            typeUser
          })
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Error al registrar usuario");
        }

        return { success: true };
      } catch (err) {
        return { success: false, message: err.message };
      }
    },
    // Función para crear un administrador
    async createAdmin({
      name,
      lastname,
      email,
      password,
      company = "Axoweb Digital",
      phone,
      typeUser = "administrador"
    }) {
      try {
        const response = await axios.post(
          `${url}/users/registerAdmin`,
          {
            name,
            lastname,
            email,
            password,
            company,
            phone,
            typeUser
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.token}`
            }
          }
        );

        return response.data;
      } catch (err) {
        throw new Error("Error al crear el admin: " + err.message);
      }
    },
    // Función para obtener todos los usuarios
    async getAllUsers(typeUser) {
      try {
        const response = await axios.get(`${url}/users/allUsers`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        this.users = response.data.data.filter(
          (user) => user.typeUser === typeUser
        );
        return this.users;
      } catch (err) {
        console.error("Error al obtener usuarios:", err);
        return [];
      }
    },
    // Función para obtener el perfil del usuario
    async getUser() {
      try {
        const response = await axios.get(`${url}/users/profile`);
        if (!response.data) {
          throw new Error("No se pudo obtener el perfil del usuario");
        }

        this.user = response.data;
        this.isAdmin = this.user?.typeUser === "administrador";
        this.isClient = this.user?.typeUser === "cliente";
        this.isAuthenticated = true;

        console.log(this.user._id);
        this.id_user = this.user._id;

        // Actualizar localStorage
        localStorage.setItem("user", JSON.stringify(this.user));
        localStorage.setItem("isAdmin", this.isAdmin);
        localStorage.setItem("isClient", this.isClient);

        console.log("Usuario obtenido:", this.user);
        return this.user;
      } catch (error) {
        console.error("Error al obtener usuario:", error);
        this.logout(); // Opcional: limpiar si hay error
        throw error;
      }
    },
    // Función para eliminar un usuario
    async deleteUser(userId) {
      const userFromStorage = JSON.parse(localStorage.getItem("user"));
      const currentUserId = userFromStorage?._id;

      if (userId === currentUserId) {
        alert("No puedes eliminar a ti mismo");
        return;
      }

      try {
        const response = await axios.delete(
          `${url}/users/deleteByAdmin/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        return response.data;
      } catch (err) {
        throw new Error("Error al eliminar el usuario: " + err.message);
      }
    },
    // Función para actualizar un usuario
    async updateUser(id, updatedUser) {
      try {
        const response = await axios.put(
          `${url}/users/update/${id}`,
          updatedUser,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.token}`
            }
          }
        );
        console.log(response.data);
        return response.data;
      } catch (err) {
        throw new Error("Error al actualizar el usuario: " + err.message);
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      this.isAdmin = false;
      this.isClient = false;
      this.isAuthenticated = false;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("isClient");
    }
  }
});
