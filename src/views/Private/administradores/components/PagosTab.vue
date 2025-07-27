<template>
  <!-- ===== VISTA PRINCIPAL DE GESTIÓN DE PAGOS ===== -->
  <div class="pagos-tab">
    <div class="pagos-layout">
      <!-- ===== SIDEBAR DE EMPRESAS ===== -->
      <div class="empresas-sidebar">
        <div class="sidebar-header">
          <div class="d-flex align-items-center justify-content-between">
            <h5 class="mb-0">
              <i class="bi bi-building me-2"></i>
              Empresas
            </h5>
            <span class="mx-2 badge bg-light text-dark">{{
              empresas.length
            }}</span>
          </div>
        </div>

        <div class="search-container mb-3">
          <div class="input-group">
            <span class="input-group-text">
              <i class="bi bi-search"></i>
            </span>
            <input
              type="text"
              class="form-control"
              placeholder="Buscar empresa o cliente..."
              v-model="searchEmpresa"
            />
          </div>
        </div>

        <div class="empresas-list">
          <EmpresaItem
            v-for="empresa in empresasFiltradas"
            :key="empresa._id"
            :empresa="empresa"
            :is-selected="selectedEmpresa?._id === empresa._id"
            :payments-count="getPaymentsCount(empresa._id)"
            :total-amount="getTotalAmount(empresa._id)"
            :show-actions="true"
            @select="selectEmpresa"
            @edit="editEmpresa"
            @delete="deleteEmpresa"
            @view-payments="viewEmpresaPayments"
          />
        </div>
      </div>

      <!-- ===== CONTENIDO PRINCIPAL - TABLA DE PAGOS ===== -->
      <div class="pagos-content">
        <div class="content-header">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <h4 class="mb-1">
                <i class="bi bi-clock-history me-2"></i>
                Historial de Pagos
                <span v-if="selectedEmpresa" class="text-light opacity-75"
                  >-
                  {{
                    selectedEmpresa.companyName ||
                    selectedEmpresa.name ||
                    "Empresa"
                  }}</span
                >
              </h4>
              <small class="text-light opacity-75"
                >{{ pagosFiltrados.length }} registro(s)</small
              >
            </div>
            <BotonPrimario
              variant="outline-light"
              icon="bi bi-plus-circle"
              @click="showCreateModal = true"
            >
              Crear Nuevo Pago
            </BotonPrimario>
          </div>
        </div>

        <div class="filters-section mb-4">
          <div class="row g-3">
            <div class="col-md-3">
              <select class="form-select" v-model="filterStatus">
                <option value="">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="paid">Pagado</option>
                <option value="abono">Abono</option>
                <option value="liquidado">Liquidado</option>
              </select>
            </div>
            <div class="col-md-3">
              <input type="date" class="form-control" v-model="filterDate" />
            </div>
            <div class="col-md-6">
              <input
                type="text"
                class="form-control"
                placeholder="Buscar por usuario o ID..."
                v-model="searchTerm"
              />
            </div>
          </div>
        </div>

        <div class="payments-table-container">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>Usuario</th>
                <th>Plan/Servicio</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>ID Compra</th>
                <th>Notas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <FilaPago
                v-for="pago in pagosFiltrados"
                :key="pago.id || pago._id"
                :pago="pago"
                :show-delete="true"
                @liquidar="handleLiquidar"
                @abonar="handleAbonar"
                @view="viewPago"
                @edit="editPago"
                @delete="deletePago"
              />
              <tr v-if="pagosFiltrados.length === 0">
                <td colspan="8" class="text-center py-4 text-muted">
                  <div class="empty-state">
                    <i class="bi bi-inbox fs-1 mb-2"></i>
                    <p class="mb-0">No hay pagos registrados</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- MODALES -->
    <CreatePaymentSidebar
      :show="showCreateModal"
      :selected-company="selectedEmpresa"
      :companies="empresas"
      :planes="planes"
      :servicios="servicios"
      @close="showCreateModal = false"
      @save="createPago"
    />

    <PaymentDetailModal
      v-if="showDetailModal"
      :show="showDetailModal"
      :payment="selectedPago"
      :companies="empresas"
      @close="showDetailModal = false"
      @edit="editPago"
    />

    <PaymentEditModal
      v-if="showEditModal"
      :show="showEditModal"
      :payment="editingPago"
      :companies="empresas"
      :planes="planes"
      :servicios="servicios"
      @close="showEditModal = false"
      @save="updatePago"
    />

    <CompanyEditModal
      v-if="showCompanyEditModal"
      :show="showCompanyEditModal"
      :company="editingCompany"
      @close="showCompanyEditModal = false"
      @save="updateCompany"
    />

    <PaymentActionModal
      v-if="showActionModal"
      :show="showActionModal"
      :payment="actionPayment"
      :action="currentAction"
      @close="showActionModal = false"
      @confirm="handlePaymentAction"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import BotonPrimario from "../../../../components/ui/BotonPrimario.vue";
import EmpresaItem from "../../../../components/ui/EmpresaItem.vue";
import FilaPago from "../../../../components/ui/FilaPago.vue";
import CreatePaymentSidebar from "../../../../components/modals/CreatePaymentSidebar.vue";
import PaymentDetailModal from "../../../../components/modals/PaymentDetailModal.vue";
import PaymentEditModal from "../../../../components/modals/PaymentEditModal.vue";
import CompanyEditModal from "../../../../components/modals/CompanyEditModal.vue";
import PaymentActionModal from "../../../../components/modals/PaymentActionModal.vue";
import { useAlert } from "../../../../hooks/useAlert";

import { useServiceStore } from "../../../../Stores/ServiceStore";
import { usePlansStore } from "../../../../Stores/PlansStore";
import { useAuthStore } from "../../../../Stores/auth";
import { usePaymentsStore } from "../../../../Stores/paymentsStorte";

const serviceStore = useServiceStore();
const planStore = usePlansStore();
const authStore = useAuthStore();
const paymentStore = usePaymentsStore();

const { showSuccess, showError, showConfirm } = useAlert();

const searchEmpresa = ref("");
const searchTerm = ref("");
const filterStatus = ref("");
const filterDate = ref("");
const selectedEmpresa = ref(null);

const showCreateModal = ref(false);
const showDetailModal = ref(false);
const showEditModal = ref(false);
const showCompanyEditModal = ref(false);
const showActionModal = ref(false);

const selectedPago = ref(null);
const editingPago = ref(null);
const editingCompany = ref(null);
const actionPayment = ref(null);
const currentAction = ref("");

onMounted(async () => {
  await serviceStore.getServices();
  await planStore.getPlans();
  await authStore.getAllUsers("cliente");
  await paymentStore.getordern();
});

const empresas = computed(() => authStore.users);

const planes = computed(() => planStore.plans);
const servicios = computed(() => serviceStore.services);
const pagos = computed(() => paymentStore.order);

// Filtrado de empresas por texto
const empresasFiltradas = computed(() => {
  if (!searchEmpresa.value) return empresas.value;
  return empresas.value.filter((empresa) =>
    (empresa.companyName || empresa.name || "")
      .toLowerCase()
      .includes(searchEmpresa.value.toLowerCase())
  );
});

// Filtrado de pagos por empresa, estado, fecha y búsqueda
const pagosFiltrados = computed(() => {
  let filtered = pagos.value;

  // Filtrar por cliente seleccionado (comparando userId con _id)
  if (selectedEmpresa.value) {
    filtered = filtered.filter(
      (pago) => pago.userId === selectedEmpresa.value._id
    );
  }

  // Filtrar por término de búsqueda
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase();
    filtered = filtered.filter(
      (pago) =>
        (pago.nameUser || "").toLowerCase().includes(search) ||
        (pago.purchaseId || "").toLowerCase().includes(search) ||
        (pago.items?.some((item) =>
          item.title.toLowerCase().includes(search)
        ) ??
          false)
    );
  }

  // Filtrar por estado
  if (filterStatus.value) {
    filtered = filtered.filter(
      (pago) => pago.status.toLowerCase() === filterStatus.value.toLowerCase()
    );
  }

  // Filtrar por fecha
  if (filterDate.value) {
    filtered = filtered.filter((pago) =>
      pago.date?.startsWith(filterDate.value)
    );
  }

  return filtered;
});

const selectEmpresa = (empresa) => {
  selectedEmpresa.value = empresa;
};

const editEmpresa = (empresa) => {
  editingCompany.value = empresa;
  showCompanyEditModal.value = true;
};

const deleteEmpresa = async (empresa) => {
  const confirmed = await showConfirm(
    "Eliminar Empresa",
    `¿Estás seguro de que deseas eliminar la empresa "${
      empresa.companyName || empresa.name
    }"? Esta acción no se puede deshacer.`
  );
  if (confirmed) {
    // Aquí debes llamar a la función para eliminar empresa de tu API/store
    showSuccess(
      "Empresa eliminada",
      "La empresa ha sido eliminada exitosamente"
    );
    if (selectedEmpresa.value?._id === empresa._id) {
      selectedEmpresa.value = null;
    }
  }
};

const viewEmpresaPayments = (empresa) => {
  selectedEmpresa.value = empresa;
};

const updateCompany = (companyData) => {
  // Actualizar la empresa en tu store
  showSuccess(
    "Empresa actualizada",
    "Los datos de la empresa han sido actualizados"
  );
  showCompanyEditModal.value = false;
  editingCompany.value = null;
};

const getPaymentsCount = (companyName) => {
  return pagos.value.filter((pago) => pago.companyName === companyName).length;
};

const getTotalAmount = (companyName) => {
  return pagos.value
    .filter((pago) => pago.companyName === companyName)
    .reduce((total, pago) => total + (pago.totalAmount || pago.amount || 0), 0);
};

const viewPago = (pago) => {
  selectedPago.value = pago;
  showDetailModal.value = true;
};

const editPago = (pago) => {
  editingPago.value = pago;
  showEditModal.value = true;
  showDetailModal.value = false;
};

const deletePago = async (pago) => {
  const confirmed = await showConfirm(
    "Eliminar Pago",
    `¿Estás seguro de que deseas eliminar el pago de ${pago.nameUser}?`
  );
  if (confirmed) {
    // Lógica para eliminar pago de tu store o API
    showSuccess("Pago eliminado", "El pago ha sido eliminado exitosamente");
  }
};

const handleLiquidar = (pago) => {
  actionPayment.value = pago;
  currentAction.value = "liquidar";
  showActionModal.value = true;
};

const handleAbonar = (pago) => {
  actionPayment.value = pago;
  currentAction.value = "abonar";
  showActionModal.value = true;
};

const handlePaymentAction = (actionData) => {
  const { action, payment, notes, abonoAmount } = actionData;
  // Actualiza pago según acción (liquidar o abonar) en tu store o API
  showSuccess(
    action === "liquidar" ? "Pago liquidado" : "Abono registrado",
    action === "liquidar"
      ? "El pago ha sido marcado como liquidado"
      : `Se ha registrado un abono de $${abonoAmount.toLocaleString()}`
  );
  showActionModal.value = false;
  actionPayment.value = null;
  currentAction.value = "";
};

const createPago = (pagoData) => {
  // Agrega pago a tu store o API, por ahora sólo simulado
  showCreateModal.value = false;
  showSuccess("Pago creado", "El nuevo pago ha sido registrado exitosamente");
};

const updatePago = (pagoData) => {
  // Actualiza pago en store o API
  showEditModal.value = false;
  editingPago.value = null;
  showSuccess("Pago actualizado", "Los datos del pago han sido actualizados");
};
</script>
<!-- ===== ESTILOS ESPECÍFICOS DEL COMPONENTE ===== -->
<style scoped>
/* Layout principal con sidebar y contenido */
.pagos-tab {
  height: calc(100vh - 200px); /* Altura dinámica */
}

.pagos-layout {
  display: flex;
  height: 100%;
  gap: 1rem;
}

/* Sidebar de empresas */
.empresas-sidebar {
  width: 350px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--primary-coral) 0%, #d73c26 100%);
  color: white;
}

.search-container {
  padding: 1rem;
}

.empresas-list {
  flex: 1;
  overflow-y: auto; /* Scroll cuando hay muchas empresas */
}

/* Contenido principal */
.pagos-content {
  flex: 1;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--primary-coral) 0%, #d73c26 100%);
  color: white;
}

.filters-section {
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.payments-table-container {
  flex: 1;
  overflow-y: auto; /* Scroll para la tabla */
  padding: 0 1.5rem 1.5rem;
}

/* Estilos de tabla */
.table thead th {
  background: #f8f9fa;
  color: var(--primary-blue);
  border: none;
  padding: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
  position: sticky; /* Header fijo al hacer scroll */
  top: 0;
  z-index: 10;
}

.table tbody td {
  padding: 1rem;
  border-color: #f1f3f4;
  vertical-align: middle;
}

.empty-state {
  padding: 2rem;
}

/* Estilos de formularios */
.form-control:focus,
.form-select:focus {
  border-color: var(--primary-coral);
  box-shadow: 0 0 0 0.25rem rgba(233, 79, 55, 0.25);
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 1200px) {
  .pagos-layout {
    flex-direction: column; /* Stack vertical en pantallas pequeñas */
    height: auto;
  }

  .empresas-sidebar {
    width: 100%;
    height: 300px;
  }

  .pagos-content {
    height: 600px;
  }
}

@media (max-width: 768px) {
  .empresas-sidebar {
    height: 250px;
  }

  .pagos-content {
    height: 500px;
  }

  .content-header {
    padding: 1rem;
  }

  .filters-section {
    padding: 1rem;
  }

  .payments-table-container {
    padding: 0 1rem 1rem;
  }
}
</style>
