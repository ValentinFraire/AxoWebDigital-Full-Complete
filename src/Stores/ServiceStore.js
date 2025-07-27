import { defineStore } from "pinia";
import { useAuthStore } from "../Stores/auth";
import axios from "axios";

const url = "https://axoweb-digital-server-production.up.railway.app/api";
const token = localStorage.getItem("token");

export const useServiceStore = defineStore("service", {
  state: () => ({
    services: [],
    service: null
  }),
  actions: {
    async getServices() {
      try {
        const response = await axios.get(`${url}/services/allServices`);
        if (response.status === 200) {
          this.services = response.data.data; // asegúrate que la respuesta tenga ese campo
        }
      } catch (error) {
        if (error.response) {
          console.error("Error al obtener los servicios:", error.response.data);
        } else {
          console.error("Error desconocido al obtener los servicios:", error);
        }
      }
    },
    async getService(id) {
      try {
        const response = await axios.get(`${url}/services/${id}`);
        if (response.status === 200) {
          this.service = response.data.data; // asegúrate que la respuesta tenga ese campo
        }
      } catch (error) {
        if (error.response) {
          console.error("Error al obtener el servicio:", error.response.data);
        } else {
          console.error("Error desconocido al obtener el servicio:", error);
        }
      }
    },
    async getServicesByCategory(categoria) {
      try {
        const response = await axios.get(
          `${url}/services/category/${categoria}`
        );
        if (response.status === 200) {
          this.services = response.data.data; // asegúrate que la respuesta tenga ese campo
        }
      } catch (error) {
        if (error.response) {
          console.error(
            "Error al obtener los servicios por categoría:",
            error.response.data
          );
        } else {
          console.error(
            "Error desconocido al obtener los servicios por categoría:",
            error
          );
        }
      }
    },
    async deleteService(id) {
      try {
        const response = await axios.delete(
          `${url}/services/deleteService/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${useAuthStore().token}`
            }
          }
        );
        return response.data;
      } catch (error) {
        if (error.response) {
          console.error("Error al eliminar el servicio:", error.response.data);
        } else {
          console.error("Error desconocido al eliminar el servicio:", error);
        }
        return null;
      }
    },
    async createService(data) {
      try {
        const response = await axios.post(
          `${url}/services/createService`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${useAuthStore().token}`
            }
          }
        );
        return response.data;
      } catch (error) {
        if (error.response) {
          console.error("Error al crear el servicio:", error.response.data);
        } else {
          console.error("Error desconocido al crear el servicio:", error);
        }
        return null;
      }
    },
    async updateService(id, data) {
      try {
        const response = await axios.put(
          `${url}/services/updateService/${id}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${useAuthStore().token}`
            }
          }
        );
        return response.data;
      } catch (error) {
        if (error.response) {
          console.error(
            "Error al actualizar el servicio:",
            error.response.data
          );
        } else {
          console.error("Error desconocido al actualizar el servicio:", error);
        }
        return null;
      }
    }
  }
});
