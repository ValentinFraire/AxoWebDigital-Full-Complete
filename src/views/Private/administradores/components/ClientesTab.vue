<template>
  <div class="clientes-tab">
    <div class="admin-card">
      <div class="admin-card-header">
        <h4 class="mb-0">
          <i class="bi bi-people me-2"></i>
          Gestión de Clientes
        </h4>
      </div>
      <div class="admin-card-body">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div class="search-container flex-grow-1 me-3">
            <input
              type="text"
              class="form-control search-input"
              placeholder="Buscar clientes..."
              v-model="searchTerm"
            />
          </div>
        </div>

        <div class="admin-table">
          <table class="table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Empresa</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cliente in filteredClientes" :key="cliente._id">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="user-avatar me-3">
                      <i class="bi bi-person-circle"></i>
                    </div>
                    <div>
                      <div class="fw-bold">
                        {{ cliente.name }} {{ cliente.lastname }}
                      </div>
                      <small class="text-muted">ID: {{ cliente._id }}</small>
                    </div>
                  </div>
                </td>
                <td>{{ cliente.email }}</td>
                <td>{{ cliente.phone }}</td>
                <td>{{ cliente.company }}</td>
                <td>
                  <span :class="getStatusClass(cliente.estado || 'Activo')">
                    {{ cliente.estado || "Activo" }}
                  </span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button
                      class="admin-btn admin-btn-outline"
                      @click="editCliente(cliente)"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button
                      class="btn-disabled admin-btn admin-btn-danger"
                      @click="deleteCliente(cliente)"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal para agregar/editar cliente -->
    <div
      class="modal fade"
      :class="{ show: showAddModal }"
      style="display: block"
      v-if="showAddModal"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ editingCliente ? "Editar" : "Agregar" }} Cliente
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveCliente">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Nombre</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="clienteForm.name"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Apellido</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="clienteForm.lastname"
                    required
                  />
                </div>

                <div class="col-md-12">
                  <label class="form-label">Teléfono</label>
                  <input
                    type="tel"
                    class="form-control"
                    v-model="clienteForm.phone"
                    required
                  />
                </div>
                <div class="col-12">
                  <label class="form-label">Empresa</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="clienteForm.company"
                  />
                </div>
              </div>
              <div class="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  class="admin-btn admin-btn-outline"
                  @click="closeModal"
                >
                  Cancelar
                </button>
                <button type="submit" class="admin-btn admin-btn-primary">
                  {{ editingCliente ? "Actualizar" : "Guardar" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="showAddModal"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useAuthStore } from "../../../../Stores/auth";

const authStore = useAuthStore();
const searchTerm = ref("");
const showAddModal = ref(false);
const editingCliente = ref(null);

const clienteForm = ref({
  name: "",
  lastname: "",
  email: "",
  phone: "",
  company: ""
});

onMounted(async () => {
  await authStore.getAllUsers("cliente");
});

const clientes = computed(() => authStore.users);

const filteredClientes = computed(() => {
  if (!searchTerm.value) return clientes.value;
  return clientes.value.filter((cliente) =>
    [cliente.name, cliente.lastname, cliente.email, cliente.company]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.value.toLowerCase())
  );
});

const getStatusClass = (estado) => {
  return estado === "Activo"
    ? "status-badge status-active"
    : "status-badge status-inactive";
};

const editCliente = (cliente) => {
  editingCliente.value = cliente;
  clienteForm.value = { ...cliente };
  showAddModal.value = true;
};

const deleteCliente = async (cliente) => {
  console.log(cliente);
  if (cliente._id === authStore.id_user) {
    alert("No puedes eliminar a ti mismo");
    return;
  }

  try {
    if (
      confirm(
        `¿Estás seguro de eliminar a ${cliente.name} ${cliente.lastname}?`
      )
    ) {
      await authStore.deleteUser(cliente._id);
      await authStore.getAllUsers("cliente");
    }
  } catch (error) {
    console.log(error);
  }
};

const saveCliente = async () => {
  if (editingCliente.value) {
    try {
      await authStore.updateUser(editingCliente.value._id, clienteForm.value);
      await authStore.getAllUsers("cliente");
    } catch (error) {
      console.log("Error al actualizar el cliente:", error);
    }
  } else {
    const newCliente = {
      ...clienteForm.value,
      _id: Date.now().toString(),
      estado: "Activo"
    };
    authStore.users.push(newCliente); // agregar simulado al store
  }
  closeModal();
};

const closeModal = () => {
  showAddModal.value = false;
  editingCliente.value = null;
  clienteForm.value = {
    name: "",
    lastname: "",

    phone: "",
    company: ""
  };
};
</script>

<style scoped>
.user-avatar {
  font-size: 2rem;
  color: var(--primary-coral);
}

.modal {
  background: rgba(0, 0, 0, 0.5);
}

.form-control:focus {
  border-color: var(--primary-coral);
  box-shadow: 0 0 0 0.25rem rgba(233, 79, 55, 0.25);
}
</style>
