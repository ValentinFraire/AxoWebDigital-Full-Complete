<template>
  <div class="modal fade" :class="{ show: show }" tabindex="-1" style="display: block" v-if="show">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 shadow">
        <div class="modal-header border-0">
          <h5 class="modal-title">Editar Plan</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <!-- Nombre -->
            <div class="mb-3">
              <label class="form-label">Nombre del Plan</label>
              <input type="text" class="form-control" v-model="formData.name" required />
            </div>

            <!-- Categoría -->
            <div class="mb-3">
              <label class="form-label">Categoría</label>
              <input type="text" class="form-control" v-model="formData.category" placeholder="Ejemplo: axoPlans" required />
            </div>

            <!-- Icono -->
            <div class="mb-3">
              <label class="form-label">URL de la Imagen</label>
              <input type="url" class="form-control" v-model="formData.icon" />
              <div v-if="formData.icon" class="mt-2">
                <img :src="formData.icon" alt="Vista previa" class="img-fluid rounded shadow-sm" />
              </div>
            </div>

            <!-- Servicios -->
            <div class="mb-4">
              <label class="form-label">Servicios incluidos:</label>
              <div class="form-check mb-2" v-for="servicio in serviciosLabels" :key="servicio._id">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :id="servicio._id"
                  :value="servicio._id"
                  v-model="formData.services"
                />
                <label class="form-check-label" :for="servicio._id">
                  {{ servicio.name }}
                </label>
              </div>
            </div>

            <!-- Precios -->
            <div class="mb-3">
              <label class="form-label">Precio Mínimo</label>
              <input type="number" class="form-control" v-model.number="formData.minPrice" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Precio Máximo</label>
              <input
                type="number"
                class="form-control"
                :min="formData.minPrice || 0"
                v-model.number="formData.maxPrice"
                required
              />
            </div>

            <!-- Periodo -->
            <div class="mb-3">
              <label class="form-label">Periodo</label>
              <input type="text" class="form-control" v-model="formData.period" placeholder="Ejemplo: Pago único mensual" />
            </div>

            <!-- Moneda -->
            <div class="mb-3">
              <label class="form-label">Moneda</label>
              <input type="text" class="form-control" v-model="formData.currency" placeholder="Ejemplo: MXN" />
            </div>

            <!-- Descripción -->
            <div class="mb-3">
              <label class="form-label">Descripción</label>
              <textarea class="form-control" v-model="formData.description" rows="3"></textarea>
            </div>

            <!-- Popular -->
            <div class="form-check mb-3">
              <input class="form-check-input" type="checkbox" id="popular" v-model="formData.isPopular" />
              <label class="form-check-label" for="popular">Plan Popular</label>
            </div>

            <!-- Botones -->
            <div class="text-end">
              <button type="button" class="btn btn-secondary me-2" @click="closeModal">Cancelar</button>
              <button type="submit" class="btn btn-primary">Guardar Cambios</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show" v-if="show"></div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useServiceStore } from "../../Stores/ServiceStore";
import { usePlansStore } from "../../Stores/PlansStore";

const props = defineProps({
  show: Boolean,
  plan: Object,
});

const emit = defineEmits(["close", "updated"]);

const serviceStore = useServiceStore();
const planStore = usePlansStore();

const serviciosLabels = computed(() => serviceStore.services);

const formData = ref({
  _id: null,
  name: "",
  category: "",
  icon: "",
  services: [],
  minPrice: null,
  maxPrice: null,
  period: "",
  currency: "MXN",
  description: "",
  isPopular: false,
});

onMounted(async () => {
  await serviceStore.getServices();
});

watch(
  () => props.plan,
  (newPlan) => {
    if (newPlan) {
      formData.value = {
        _id: newPlan._id,
        name: newPlan.name || "",
        category: newPlan.category || "",
        icon: newPlan.icon || "",
        services: newPlan.services?.map((s) => s._id) || [],
        minPrice: newPlan.minPrice || 0,
        maxPrice: newPlan.maxPrice || 0,
        period: newPlan.period || "",
        currency: newPlan.currency || "MXN",
        description: newPlan.description || "",
        isPopular: newPlan.isPopular || false,
      };
    }
  },
  { immediate: true }
);

const closeModal = () => {
  emit("close");
};

const handleSubmit = async () => {
  if (formData.value.minPrice > formData.value.maxPrice) {
    alert("El precio mínimo no puede ser mayor que el precio máximo.");
    return;
  }

  try {
    const updatedPlan = await planStore.putPlanById(formData.value._id, { ...formData.value });
    emit("updated", updatedPlan); // Emitimos para que padre actualice la lista
    closeModal();
  } catch (error) {
    console.error("Error al actualizar el plan:", error);
    alert("Ocurrió un error al guardar el plan.");
  }
};
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
.form-control:focus,
.form-check-input:focus {
  border-color: var(--primary-coral);
  box-shadow: 0 0 0 0.25rem rgba(233, 79, 55, 0.25);
}
.form-check-input:checked {
  background-color: var(--primary-coral);
  border-color: var(--primary-coral);
}
</style>
