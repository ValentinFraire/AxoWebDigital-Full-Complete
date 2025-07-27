<template>
  <div class="servicios-view">
    <!-- Hero Section -->
    <HeroServicios />

    <!-- Planes Section -->
    <PlanesSection :planes="planes" @solicitar="handleSolicitarPlan" />

    <!-- Servicios Individuales Section -->
    <ServiciosIndividualesSection
      :servicios="servicios"
      @solicitar="handleSolicitarServicio"
    />

    <!-- CTA Section -->
    <CTASection />

    <!-- Modal de Solicitud -->
    <SolicitudModal
      v-if="showSolicitudModal"
      :show="showSolicitudModal"
      :item="selectedItem"
      :type="selectedType"
      @close="showSolicitudModal = false"
      @submit="handleSolicitudSubmit"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import HeroServicios from "./components/HeroServicios.vue";
import PlanesSection from "./components/PlanesSection.vue";
import ServiciosIndividualesSection from "./components/ServiciosIndividualesSection.vue";
import CTASection from "./components/CTASection.vue";
import SolicitudModal from "../../../components/modals/SolicitudModal.vue";
import { useAlert } from "../../../hooks/useAlert";

import { useWhatsAppSolicitud } from "../../../hooks/useWhatsApp";
import  {usePlansStore} from "../../../Stores/PlansStore";

import { useServiceStore } from "../../../Stores/ServiceStore"; // Asegúrate que la ruta esté bien

const serviceStore = useServiceStore();
const planStore = usePlansStore();

const servicios = computed(() => serviceStore.services);
const planes = computed(() => planStore.plans);




onMounted(async () => {
  const category = "axoPlans";
  await serviceStore.getServices();
  await planStore.getPlansByCategory(category);
});



const { crearMensaje, enviarMensaje } = useWhatsAppSolicitud()

const { showSuccess } = useAlert();



const showSolicitudModal = ref(false);
const selectedItem = ref(null);
const selectedType = ref("");




const handleSolicitarPlan = (plan) => {
  selectedItem.value = plan;
  selectedType.value = "plan";
  showSolicitudModal.value = true;
};

const handleSolicitarServicio = (servicio) => {
  selectedItem.value = servicio;
  selectedType.value = "servicio";
  showSolicitudModal.value = true;
};

const handleSolicitudSubmit = (solicitudData) => {
  // Crear mensaje para WhatsApp
  const mensaje = crearMensaje(solicitudData);

  // Enviar a WhatsApp
  enviarMensaje(mensaje);

  showSuccess(
    "Solicitud enviada",
    `Tu solicitud para ${solicitudData.itemName} ha sido enviada. Te contactaremos pronto.`
  );
  showSolicitudModal.value = false;
};
</script>

<style scoped>
.servicios-view {
  background-color: var(--primary-beige);
}
</style>
