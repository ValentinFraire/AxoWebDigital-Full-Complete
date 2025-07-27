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
          <h5 class="modal-title">Crear Nuevo Servicio</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="title" class="form-label">Nombre del Servicio</label>
              <input
                type="text"
                class="form-control"
                id="title"
                v-model="formData.title"
                required
              />
            </div>

            <div class="mb-3">
              <label for="description" class="form-label">Descripción</label>
              <textarea
                class="form-control"
                id="description"
                v-model="formData.description"
                rows="3"
                required
              ></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">Incluye</label>
              <div
                class="d-flex mb-2"
                v-for="(item, index) in formData.incluye"
                :key="index"
              >
                <input
                  type="text"
                  class="form-control me-2"
                  v-model="formData.incluye[index]"
                  placeholder="Ej. Estrategia"
                />
                <button
                  type="button"
                  class="btn btn-danger btn-sm"
                  @click="removeIncluye(index)"
                >
                  <i class="bi bi-x"></i>
                </button>
              </div>
              <button
                type="button"
                class="btn btn-outline-primary btn-sm"
                @click="addIncluye"
              >
                <i class="bi bi-plus"></i> Agregar ítem
              </button>
            </div>

            <div class="mb-3">
              <label class="form-label">Precio Mínimo (MXN)</label>
              <input
                type="number"
                class="form-control"
                v-model.number="formData.pricemin"
                min="0"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Precio Máximo (MXN)</label>
              <input
                type="number"
                class="form-control"
                v-model.number="formData.pricemax"
                :min="formData.pricemin || 0"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Moneda</label>
              <input
                type="text"
                class="form-control"
                v-model="formData.moneda"
                placeholder="Ej. MXN"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Icono (clase Bootstrap Icons)</label>
              <input
                type="text"
                class="form-control"
                v-model="formData.icon"
                placeholder="Ej. bi bi-envelope-heart"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Categoría</label>
              <input
                type="text"
                class="form-control"
                v-model="formData.categoria"
                placeholder="Ej. Marketing, Diseño, etc."
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Tiempo estimado</label>
              <input
                type="text"
                class="form-control"
                v-model="formData.tiempo"
                placeholder="Ej. 1-2 semanas"
              />
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
import { ref } from "vue";
import { useServiceStore } from "../../Stores/ServiceStore";

const serviceStore = useServiceStore();

const emit = defineEmits(["close", "save"]);
const show = ref(true);

const formData = ref({
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

const addIncluye = () => {
  formData.value.incluye.push("");
};

const removeIncluye = (index) => {
  formData.value.incluye.splice(index, 1);
};

const closeModal = () => {
  show.value = false;
  emit("close");
};

const handleSubmit = async () => {
  if (formData.value.pricemin > formData.value.pricemax) {
    alert("El precio mínimo no puede ser mayor al precio máximo.");
    return;
  }

  const serviceData = {
    name: formData.value.title,
    description: formData.value.description,
    priceMin: formData.value.pricemin,
    priceMax: formData.value.pricemax,
    currency: formData.value.moneda,
    icon: formData.value.icon,
    category: formData.value.categoria.toUpperCase(),
    developmentTime: formData.value.tiempo,
    includes: formData.value.incluye.filter((i) => i.trim() !== "")
  };
  try {
    await serviceStore.createService(serviceData);
    await serviceStore.getServices();
    closeModal();
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
