<template>
  <div
    class="modal fade"
    :class="{ show: show }"
    tabindex="-1"
    style="display: block"
    v-if="show"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 shadow">
        <div class="modal-header border-0">
          <h5 class="modal-title">Crear Nuevo Plan</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="nombre" class="form-label">Nombre del Plan</label>
              <input
                type="text"
                class="form-control"
                id="nombre"
                v-model="formData.nombre"
                required
              />
            </div>

            <div class="mb-3">
              <label for="tipo" class="form-label">Tipo de Plan</label>
              <input
                type="text"
                class="form-control"
                id="tipo"
                v-model="formData.tipo"
                placeholder="Ejemplo: planAxo"
                required
              />
            </div>

            <div class="mb-3">
              <label for="img" class="form-label">URL de la Imagen</label>
              <input
                type="text"
                class="form-control"
                id="img"
                v-model="formData.img"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              <div v-if="formData.img" class="mt-2">
                <img
                  :src="formData.img"
                  alt="Vista previa"
                  class="img-fluid rounded shadow-sm"
                />
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label">Servicios incluidos en este plan:</label>
              <div
                class="form-check mb-2"
                v-for="servicio in servicios"
                :key="servicio._id"
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  :id="'servicio-' + servicio._id"
                  v-model="formData.servicios"
                  :value="servicio._id"
                />
                <label
                  class="form-check-label"
                  :for="'servicio-' + servicio._id"
                >
                  {{ servicio.name }}
                </label>
              </div>
            </div>

            <!-- INCLUDES: Beneficios personalizados -->
            <div class="mb-3">
              <label class="form-label">Incluye (beneficios del plan)</label>
              <div
                v-for="(item, index) in formData.includes"
                :key="index"
                class="d-flex mb-2"
              >
                <input
                  type="text"
                  class="form-control me-2"
                  v-model="formData.includes[index]"
                  placeholder="Ejemplo: Soporte 24/7"
                />
                <button
                  type="button"
                  class="btn btn-danger"
                  @click="formData.includes.splice(index, 1)"
                >
                  &times;
                </button>
              </div>
              <button
                type="button"
                class="btn btn-outline-primary btn-sm"
                @click="formData.includes.push('')"
              >
                Agregar Ítem
              </button>
            </div>

            <div class="mb-3">
              <label class="form-label">Precio Mínimo (MXN)</label>
              <input
                type="number"
                class="form-control"
                v-model.number="formData.preciomin"
                min="0"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Precio Máximo (MXN)</label>
              <input
                type="number"
                class="form-control"
                v-model.number="formData.preciomax"
                :min="formData.preciomin || 0"
                required
              />
            </div>

            <div class="mb-3">
              <label for="periodo" class="form-label">Periodo de pago</label>
              <input
                type="text"
                class="form-control"
                id="periodo"
                v-model="formData.periodo"
                placeholder="Ejemplo: Pago único mensual"
              />
            </div>

            <div class="mb-3">
              <label for="moneda" class="form-label">Moneda</label>
              <input
                type="text"
                class="form-control"
                id="moneda"
                v-model="formData.moneda"
                placeholder="Ejemplo: MXN"
              />
            </div>

            <div class="mb-3">
              <label for="descripcion" class="form-label">Descripción</label>
              <textarea
                class="form-control"
                id="descripcion"
                v-model="formData.descripcion"
                rows="3"
                placeholder="Descripción del plan"
              ></textarea>
            </div>

            <div class="text-end">
              <button
                type="button"
                class="btn btn-secondary me-2"
                @click="closeModal"
              >
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show" v-if="show"></div>
</template>

<script setup>
import { ref, reactive, defineEmits, onMounted, computed } from "vue";
import { useServiceStore } from "../../Stores/ServiceStore";
import { usePlansStore } from "../../Stores/PlansStore";

const serviceStore = useServiceStore();
const servicios = computed(() => serviceStore.services);
const planStore = usePlansStore();

onMounted(async () => {
  await serviceStore.getServices();
});

const emit = defineEmits(["close", "save"]);
const show = ref(true);

const formData = reactive({
  nombre: "",
  tipo: "",
  img: "",
  servicios: [],
  includes: [], // <- NUEVO CAMPO
  preciomin: null,
  preciomax: null,
  periodo: "",
  moneda: "",
  descripcion: ""
});

const closeModal = () => {
  show.value = false;
  emit("close");
};

const handleSubmit = async () => {
  if (formData.preciomin > formData.preciomax) {
    alert("El precio mínimo no puede ser mayor al precio máximo.");
    return;
  }

  const planData = {
    name: formData.nombre,
    category: formData.tipo,
    icon: formData.img,
    services: [...formData.servicios],
    includes: [...formData.includes],
    minPrice: formData.preciomin,
    maxPrice: formData.preciomax,
    currency: formData.moneda || "MXN",
    period: formData.periodo || "Pago único mensual",
    isPopular: false,
    description: formData.descripcion || ""
  };

  try {
    await planStore.createPlan(planData);
    await planStore.getPlans();
    closeModal();
  } catch (error) {
    alert("Error al guardar el plan: " + error.message);
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
