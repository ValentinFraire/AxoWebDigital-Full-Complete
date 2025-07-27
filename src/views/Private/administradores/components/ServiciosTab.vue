<template>
  <div class="servicios-tab">
    <div class="admin-card">
      <div class="admin-card-header">
        <h4 class="mb-0">
          <i class="bi bi-gear me-2"></i>
          Gestión de Servicios y Planes
        </h4>
      </div>
      <div class="admin-card-body">
        <!-- Navigation Tabs -->
        <div class="nav-pills-container mb-4">
          <ul class="nav nav-pills">
            <li class="nav-item">
              <button
                class="nav-link"
                :class="{ active: activeTab === 'planes' }"
                @click="activeTab = 'planes'"
              >
                <i class="bi bi-box-seam me-2"></i>
                Planes
              </button>
            </li>
            <li class="nav-item">
              <button
                class="nav-link"
                :class="{ active: activeTab === 'servicios' }"
                @click="activeTab = 'servicios'"
              >
                <i class="bi bi-tools me-2"></i>
                Servicios
              </button>
            </li>
          </ul>
        </div>

        <!-- Planes Tab -->
        <div v-if="activeTab === 'planes'">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="mb-0">Planes Disponibles</h5>
            <button
              class="admin-btn admin-btn-primary"
              @click="showPlanModal = true"
            >
              <i class="bi bi-plus-circle me-2"></i>
              Agregar Plan
            </button>
          </div>

          <div class="row g-4">
            <div
              class="col-lg-4 col-md-6"
              v-for="plan in planes"
              :key="plan._id"
            >
              <div class="service-admin-card">
                <div
                  v-if="plan.icon"
                  class="service-image d-flex justify-content-center mb-3"
                >
                  <img
                    :src="plan.icon"
                    alt="Imagen del plan"
                    class="img-fluid rounded w-50"
                  />
                </div>

                <div class="service-header">
                  <h5>{{ plan.name }}</h5>
                  <small class="text-muted">{{ plan.tipo }}</small>
                  <div class="service-price mt-1">
                    {{
                      plan.priceMax ||
                      (plan.minPrice && plan.maxPrice
                        ? `$${plan.minPrice.toLocaleString()} - $${plan.maxPrice.toLocaleString()}`
                        : "")
                    }}
                    {{ plan.currency || "" }}
                  </div>
                </div>

                <ul>
                  <li v-for="detalle in plan.allIncludes" :key="detalle">
                    {{ detalle }}
                  </li>
                </ul>

                <p class="mb-1"><strong>Periodo:</strong> {{ plan.period }}</p>

                <p v-if="plan.isPopular" class="badge bg-success mb-2">
                  Popular
                </p>

                <p class="service-description">{{ plan.description }}</p>

                <div class="service-actions mt-auto">
                  <button
                    class="admin-btn admin-btn-outline"
                    @click="editPlan(plan)"
                  >
                    <i class="bi bi-pencil"></i> Editar
                  </button>
                  <button
                    class="admin-btn admin-btn-danger"
                    @click="deletePlan(plan)"
                  >
                    <i class="bi bi-trash"></i> Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Servicios Tab -->
        <div v-if="activeTab === 'servicios'">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="mb-0">Servicios Individuales</h5>
            <button
              class="admin-btn admin-btn-primary"
              @click="showServiceModal = true"
            >
              <i class="bi bi-plus-circle me-2"></i>
              Agregar Servicio
            </button>
          </div>

          <div class="row g-4">
            <div
              class="col-lg-4 col-md-6"
              v-for="servicio in servicios"
              :key="servicio.id"
            >
              <div class="service-admin-card">
                <div class="service-header">
                  <h5>{{ servicio.name }}</h5>
                  <small class="text-muted">{{ servicio.category }}</small>
                  <div class="service-price">
                    {{
                      servicio.priceMin !== undefined &&
                      servicio.priceMax !== undefined
                        ? `$${servicio.priceMin.toLocaleString()} - $${servicio.priceMax.toLocaleString()}`
                        : ""
                    }}
                    {{ servicio.currency }}
                  </div>
                </div>

                <div class="service-image mb-2" v-if="servicio.icon">
                  <i :class="servicio.icon" class="fs-2 text-primary"></i>
                </div>

                <p class="mb-1">
                  <strong>Tiempo estimado:</strong>
                  {{ servicio.developmentTime }}
                </p>

                <ul class="mb-2">
                  <li v-for="item in servicio.includes" :key="item">
                    <i class="bi bi-check-circle-fill text-success me-1"></i>
                    {{ item }}
                  </li>
                </ul>

                <p class="service-description">{{ servicio.description }}</p>

                <div class="service-actions mt-auto">
                  <button
                    class="admin-btn admin-btn-outline"
                    @click="editService(servicio)"
                  >
                    <i class="bi bi-pencil"></i> Editar
                  </button>
                  <button
                    class="admin-btn admin-btn-danger"
                    @click="deleteService(servicio)"
                  >
                    <i class="bi bi-trash"></i> Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modales -->
    <PlanModal
      v-if="showPlanModal"
      @close="showPlanModal = false"
      @save="savePlan"
    />
    <EditPlanModal
      v-if="showEditPlanModal"
      :show="showEditPlanModal"
      :plan="editingPlan"
      @close="showEditPlanModal = false"
      @save="updatePlan"
    />
    <ServiceModal
      v-if="showServiceModal"
      @close="showServiceModal = false"
      @save="saveService"
    />
    <EditServiceModal
      v-if="showEditServiceModal"
      :show="showEditServiceModal"
      :servicio="editingService"
      @close="showEditServiceModal = false"
      @save="updateService"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
//components Modals
import PlanModal from "../../../../components/modals/PlanModal.vue";
import EditPlanModal from "../../../../components/modals/EditPlanModal.vue";
import ServiceModal from "../../../../components/modals/ServiceModal.vue";
import EditServiceModal from "../../../../components/modals/EditServiceModal.vue";

// Store
import { useServiceStore } from "../../../../Stores/ServiceStore";
import { usePlansStore } from "../../../../Stores/PlansStore";

const planStore = usePlansStore();
const planes = computed(() => planStore.plans);

onMounted(async () => {
  await planStore.getPlans();
});

const servicios = computed(() => {
  return serviceStore.services;
});

onMounted(async () => {
  await serviceStore.getServices();
});

const activeTab = ref("planes");

const showPlanModal = ref(false);
const showEditPlanModal = ref(false);
const showServiceModal = ref(false);
const showEditServiceModal = ref(false);

const editingPlan = ref(null);
const editingService = ref(null);

const serviceStore = useServiceStore();

// Planes
const editPlan = (plan) => {
  editingPlan.value = plan;
  showEditPlanModal.value = true;
};

const deletePlan = async (plan) => {
  if (
    confirm(`¿Estás seguro de eliminar el plan "${plan.name || plan.nombre}"?`)
  ) {
    const resultado = await planStore.deletePlanById(plan._id);
    if (!resultado) {
      alert("Error al eliminar el plan");
    }
  }
};

const savePlan = (planData) => {
  planes.value.push({ ...planData, id: Date.now() });
};

const updatePlan = (planData) => {
  const index = planes.value.findIndex((p) => p.id === planData.id);
  if (index > -1) planes.value[index] = planData;
  showEditPlanModal.value = false;
  editingPlan.value = null;
};

// Servicios
const editService = (servicio) => {
  editingService.value = servicio;
  showEditServiceModal.value = true;
};

const deleteService = async (servicio) => {
  if (confirm(`¿Estás seguro de eliminar el servicio "${servicio.title}"?`)) {
    const resultado = await serviceStore.deleteService(servicio._id);
    await serviceStore.getServices();
    if (!resultado) {
      alert("Error al eliminar el servicio");
    }
  }
};

const saveService = (serviceData) => {
  servicios.value.push({ ...serviceData, id: Date.now() });
};

const updateService = (serviceData) => {
  const index = servicios.value.findIndex((s) => s.id === serviceData.id);
  if (index > -1) servicios.value[index] = serviceData;
  showEditServiceModal.value = false;
  editingService.value = null;
};
</script>

<style scoped>
.nav-pills-container {
  border-bottom: 2px solid #e9ecef;
}
.nav-pills .nav-link {
  color: var(--primary-blue);
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
}
.nav-pills .nav-link.active {
  background-color: var(--primary-coral);
  color: white;
}

.service-admin-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.service-admin-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border-color: var(--primary-coral);
}
.service-header h5 {
  color: var(--primary-blue);
  margin-bottom: 0.5rem;
}
.service-price {
  color: var(--primary-coral);
  font-weight: 600;
  font-size: 1.1rem;
}
.service-image {
  margin-bottom: 1rem;
}
.service-description {
  color: #666;
  margin-bottom: 1rem;
  flex: 1;
}
.service-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
}
.service-actions .admin-btn {
  flex: 1;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
}
</style>
