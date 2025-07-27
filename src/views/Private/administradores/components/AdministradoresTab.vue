<template>
  <div class="administradores-tab">
    <div class="admin-card">
      <div class="admin-card-header">
        <h4 class="mb-0">
          <i class="bi bi-shield me-2"></i>
          Gestión de Administradores
        </h4>
      </div>
      <div class="admin-card-body">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div class="search-container flex-grow-1 me-3">
            <input
              type="text"
              class="form-control search-input"
              placeholder="Buscar administradores..."
              v-model="searchTerm"
            />
          </div>
          <button
            class="admin-btn admin-btn-primary"
            @click="showAddModal = true"
          >
            <i class="bi bi-plus-circle me-2"></i>
            Agregar Administrador
          </button>
        </div>

        <div class="admin-table">
          <table class="table">
            <thead>
              <tr>
                <th>Administrador</th>
                <th>Email</th>

                <th>Último Acceso</th>

                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="admin in filteredAdmins" :key="admin.id">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="admin-avatar me-3">
                      <i class="bi bi-shield-check"></i>
                    </div>
                    <div>
                      <div class="fw-bold">
                        {{ admin.name }} {{ admin.lastname }}
                      </div>
                      <small class="text-muted">ID: {{ admin._id }}</small>
                    </div>
                  </div>
                </td>
                <td>{{ admin.email }}</td>

                <td>{{ admin.typeUser }}</td>

                <td>
                  <div class="d-flex flex-column gap-2 btn-group-sm">
                    <button
                      class="admin-btn admin-btn-outline btn-sm w-100"
                      @click="editAdmin(admin)"
                    >
                      <i class="bi bi-pencil"></i>
                      Editar
                    </button>
                    <button
                      class="admin-btn admin-btn-danger btn-sm w-100"
                      @click="deleteAdmin(admin)"
                      :disabled="admin._id === '1'"
                    >
                      <i class="bi bi-trash"></i>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal para agregar/editar administrador -->
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
              {{ editingAdmin ? "Editar" : "Agregar" }} Administrador
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveAdmin">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Nombre</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="adminForm.name"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Apellido</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="adminForm.lastname"
                    required
                  />
                </div>
                <div class="col-12">
                  <label class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    v-model="adminForm.email"
                    required
                  />
                </div>
                <div class="col-12">
                  <label class="form-label">Telefono</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="adminForm.phone"
                    required
                  />
                </div>
                <div class="" v-if="!editingAdmin">
                  <label class="form-label">Contraseña</label>
                  <input
                    type="password"
                    class="form-control"
                    v-model="adminForm.password"
                    :required="!editingAdmin"
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
                  {{ editingAdmin ? "Actualizar" : "Guardar" }}
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
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "../../../../Stores/auth";

const authStore = useAuthStore();
const searchTerm = ref("");
const showAddModal = ref(false);
const editingAdmin = ref(null);

const adminForm = ref({
  name: "",
  lastname: "",
  email: "",
  password: "",
  phone: "",
});
const ediAdminForm = ref({
  name: adminForm.value.name,
  lastname: adminForm.value.lastname,
  email: adminForm.value.email,
  phone: adminForm.value.phone
});


const administradores = computed(() => authStore.users);

onMounted(async () => {
  await authStore.getAllUsers("administrador");
});

const filteredAdmins = computed(() => {
  if (!searchTerm.value) return administradores.value;
  return administradores.value.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      admin.lastname.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});



const editAdmin = (admin) => {
  editingAdmin.value = admin;
  adminForm.value = { ...admin, password: "" };
  showAddModal.value = true;
};

const deleteAdmin = async (admin) => {
  if (window.confirm("¿Estás seguro de eliminar este administrador?")) {
    await authStore.deleteUser(admin._id);
    await authStore.getAllUsers("administrador");
  }
};

async function saveAdmin() {
  if (editingAdmin.value) {
    try {
      await authStore.updateUser(editingAdmin.value._id, adminForm.value);
      await authStore.getAllUsers("administrador");

      if (editingAdmin.value._id === authStore.id_user) {
        await authStore.getUser(authStore.id_user);
      }
      closeModal();
    } catch (error) {
      console.log("Error al actualizar el admin:", error);
    }
  } else {
    const newAdmin = {
      ...adminForm.value,
      id: Date.now(),
      ultimoAcceso: new Date().toISOString().split("T")[0],
      estado: "Activo"
    };

    try {
      const res = await authStore.createAdmin({
        name: newAdmin.name,
        lastname: newAdmin.lastname,
        email: newAdmin.email,
        password: newAdmin.password,
        phone: newAdmin.phone,
        company: "Axoweb Digital", // fijo por ahora
        typeUser: "administrador"
      });

      console.log(res);
      administradores.value.push(newAdmin);
      await authStore.getAllUsers("administrador");
      closeModal();
    } catch (err) {
      console.error("Error al registrar admin:", err.message);
      alert("No se pudo registrar el administrador: " + err.message);
    }
  }
   
}


const closeModal = () => {
  showAddModal.value = false;
  editingAdmin.value = null;
  adminForm.value = {
  name: "",
  lastname: "",
  email: "",
  phone: "",
  password: ""
};

};
</script>

<style scoped>
.admin-avatar {
  font-size: 2rem;
  color: var(--primary-blue);
}

.modal {
  background: rgba(0, 0, 0, 0.5);
}

.form-control:focus,
.form-select:focus {
  border-color: var(--primary-coral);
  box-shadow: 0 0 0 0.25rem rgba(233, 79, 55, 0.25);
}
</style>
