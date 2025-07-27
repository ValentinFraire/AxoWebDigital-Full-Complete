import { defineStore } from "pinia";

import axios from "axios";

const url = "https://api-mercadopago-production-6ead.up.railway.app/api";

export const usePaymentsStore = defineStore("payments", {
  state: () => ({
    orderDetails: null,
    order: []
  }),
  actions: {
    async creatrOrder(data) {
      try {
        const response = await axios.post(`${url}/payments/create-order`, data);
        this.orderDetails = response.data;
        console.log(this.orderDetails);
        return response.data;
      } catch (error) {
        if (error.response) {
          console.error("Error al crear la orden:", error.response.data);
        }
      }
    },
    async getpayedOrderByclienteId(id) {
      try {
        const response = await axios.get(`${url}/payments/pagos/${id}`);
        return response.data;
      } catch (error) {
        if (error.response) {
          console.error("Error al obtener la orden:", error.response.data);
        }
      }
    },
    async getordern() {
      try {
        const response = await axios.get(`${url}/payments/pagos`);
        this.order = response.data;
        return response.data;
      } catch (error) {
        if (error.response) {
          console.error("Error al obtener la orden:", error.response.data);
        }
      }
    }
  }
});
