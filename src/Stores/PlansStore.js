import { defineStore } from "pinia";
import { useAuthStore } from "../Stores/auth";
import axios from "axios";
import { ref } from "vue";

const url = "https://axoweb-digital-server-production.up.railway.app/api";

export const usePlansStore = defineStore("plans", {
  state: () => ({
    plans: ref([]), // Inicialmente, el array de planes estará vacío[],
    planByID: null
  }),
  actions: {
    async getPlans() {
      try {
        const response = await axios.get(`${url}/plans/allPlans`);
        if (response.status === 200) {
          this.plans = response.data;
          
        }
      } catch (error) {
        if (error.response) {
          console.error("Error al obtener los planes:", error.response.data);
        }
      }
    },
    async getPlansByCategory(categoria) {
      try {
        const response = await axios.get(`${url}/plans/category/${categoria}`);

        if (response.status === 200) {
          this.plans = response.data;
          console.log(this.plans);
        } else {
          console.error(
            "Error al obtener los planes por categoría:",
            response.data
          );
        }
      } catch (error) {
        if (error.response) {
          console.error(
            "Error al obtener los planes por categoría:",
            error.response.data
          );
        } else {
          console.error("Error inesperado:", error.message);
        }
      }
    },
    async getPlanById(planId) {
      try {
        const response = await axios.get(`${url}/plans/${planId}`);
        if (response.status === 200) {
          this.planByID = response.data;
        } else {
          console.error("Error al obtener el plan:", response.data);
        }
      } catch (error) {
        if (error.response) {
          console.error("Error al obtener el plan:", error.response.data);
        } else {
          console.error("Error inesperado:", error.message);
        }
      }
    },
    async createPlan(data) {
      try {
        const response = await axios.post(`${url}/plans/createPlan`, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${useAuthStore().token}`
          }
        });
        // Actualiza localmente el plan en el array `plans`
        this.plans.push(response.data);

        return response.data;
      } catch (error) {
        console.error("Error al crear el plan:", error);
        return new Promise((resolve, reject) => {
          reject(error);
        });
      }
    },
    async putPlanById(planId, data) {
      try {
        const response = await axios.put(
          `${url}/plans/updatePlan/${planId}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${useAuthStore().token}`
            }
          }
        );

        if (response.status === 200) {
          const updatedPlan = response.data.plan || response.data; // Ajusta según tu respuesta
          this.planByID = updatedPlan;

          // Actualiza localmente el plan en el array `plans`
          const index = this.plans.findIndex((p) => p._id === planId);
          if (index !== -1) {
            this.plans[index] = updatedPlan;
          }

          return updatedPlan;
        }

        console.error("Error al actualizar el plan:", response.data);
        return null;
      } catch (error) {
        if (error.response) {
          console.error("Error al actualizar el plan:", error.response.data);
        } else {
          console.error("Error inesperado:", error.message);
        }
        return null;
      }
    },
    async deletePlanById(planId) {
      try {
        const response = await axios.delete(
          `${url}/plans/deletePlan/${planId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${useAuthStore().token}`
            }
          }
        );

        // Eliminar localmente el plan del array 'plans'
        const index = this.plans.findIndex((p) => p._id === planId);
        if (index !== -1) {
          this.plans.splice(index, 1);
        }

        return response.data;
      } catch (error) {
        if (error.response) {
          console.error("Error al eliminar el plan:", error.response.data);
        } else {
          console.error("Error inesperado:", error.message);
        }
        return null;
      }
    }
  }
});
