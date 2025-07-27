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
          <h5 class="modal-title">Editar Servicio</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label class="form-label">Nombre del Servicio</label>
              <input
                type="text"
                class="form-control"
                v-model="formData.title"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Descripción</label>
              <textarea
                class="form-control"
                v-model="formData.description"
                rows="3"
                required
              ></textarea>
            </div>

            <div class="row mb-3">
              <div class="col">
                <label class="form-label">Precio mínimo</label>
                <input
                  type="number"
                  class="form-control"
                  v-model.number="formData.pricemin"
                  min="0"
                  required
                />
              </div>
              <div class="col">
                <label class="form-label">Precio máximo</label>
                <input
                  type="number"
                  class="form-control"
                  v-model.number="formData.pricemax"
                  :min="formData.pricemin"
                  required
                />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Moneda</label>
              <input
                type="text"
                class="form-control"
                v-model="formData.moneda"
                placeholder="Ej: MXN"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Icono (clase de Bootstrap Icons)</label>
              <input
                type="text"
                class="form-control"
                v-model="formData.icon"
                placeholder="Ej: bi bi-envelope-heart"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Categoría</label>
              <input
                type="text"
                class="form-control"
                v-model="formData.categoria"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Tiempo estimado</label>
              <input
                type="text"
                class="form-control"
                v-model="formData.tiempo"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label">¿Qué incluye?</label>
              <div
                v-for="(item, index) in formData.incluye"
                :key="index"
                class="input-group mb-2"
              >
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.incluye[index]"
                />
                <button
                  class="btn btn-outline-danger"
                  type="button"
                  @click="removeItem(index)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
              <button
                class="btn btn-outline-primary btn-sm"
                type="button"
                @click="addItem"
              >
                <i class="bi bi-plus-circle me-1"></i> Agregar ítem
              </button>
            </div>

            <div class="text-end mt-4">
              <button
                type="button"
                class="btn btn-secondary me-2"
                @click="closeModal"
              >
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary">
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show" v-if="show"></div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useServiceStore } from "../../Stores/ServiceStore";

const props = defineProps({
  show: Boolean,
  servicio: Object
});

const serviceStore = useServiceStore();
const emit = defineEmits(["close", "save"]);

const formData = ref({
  id: null,
  title: "",
  description: "",
  pricemin: null,
  pricemax: null,
  moneda: "MXN",
  icon: "",
  categoria: "",
  tiempo: "",
  incluye: []
});

watch(
  () => props.servicio,
  (newServicio) => {
    if (newServicio) {
      formData.value = {
        id: newServicio._id || newServicio.id || null,
        title: newServicio.name || newServicio.title || "",
        description: newServicio.description || "",
        pricemin: newServicio.priceMin || newServicio.pricemin || 0,
        pricemax: newServicio.priceMax || newServicio.pricemax || 0,
        moneda: newServicio.currency || newServicio.moneda || "MXN",
        icon: newServicio.icon || "",
        categoria: newServicio.category || newServicio.categoria || "",
        tiempo: newServicio.developmentTime || newServicio.tiempo || "",
        incluye: Array.isArray(newServicio.includes || newServicio.incluye)
          ? [...(newServicio.includes || newServicio.incluye)]
          : []
      };
    }
  },
  { immediate: true }
);

const addItem = () => {
  formData.value.incluye.push("");
};

const removeItem = (index) => {
  formData.value.incluye.splice(index, 1);
};

const closeModal = () => {
  emit("close");
};

const handleSubmit = async () => {
  const formData = {
    name: this.formData.title,
    description: this.formData.description,
    priceMin: this.formData.pricemin,
    priceMax: this.formData.pricemax,
    currency: this.formData.moneda,
    icon: this.formData.icon,
    category: this.formData.categoria.toUpperCase(),
    developmentTime: this.formData.tiempo,
    includes: this.formData.incluye
  };

  if (this.formData.pricemin > this.formData.pricemax) {
    alert("El precio mínimo no puede ser mayor al precio.maxcdn.");
    return;
  }
  try {
    if (confirm("Estas seguro de guardar los cambios?")) {
      await serviceStore.updateService(formData.value);
      await serviceStore.getServices();
      closeModal();
    }
  } catch (error) {
    alert("Error al guardar el servicio: " + error.message);
  }
};
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

.form-control:focus {
  border-color: var(--primary-coral);
  box-shadow: 0 0 0 0.25rem rgba(233, 79, 55, 0.25);
}
</style>
