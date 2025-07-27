<template>
  <div>
    <!-- Payment Sidebar -->
    <div class="payment-sidebar" :class="{ active: show }">
      <div class="sidebar-content">
        <div class="sidebar-header">
          <h5 class="mb-0">
            <i class="bi bi-plus-circle me-2"></i>
            Crear Nuevo Pago
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            @click="$emit('close')"
          ></button>
        </div>

        <div class="sidebar-body">
          <!-- Información del Usuario -->
          <div class="info-section mb-4">
            <h6 class="section-title">
              <i class="bi bi-person me-2"></i>
              Información del Usuario
            </h6>
            <div class="info-card">
              <div class="mb-3">
                <label class="form-label">Nombre del Usuario</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="paymentForm.userName"
                  placeholder="Nombre del usuario"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Fecha de contratación</label>
                <input
                  type="date"
                  class="form-control"
                  v-model="paymentForm.contractDate"
                />
              </div>
            </div>
          </div>

          <!-- Información de la Empresa -->
          <div class="info-section mb-4">
            <h6 class="section-title">
              <i class="bi bi-building me-2"></i>
              Información de la Empresa
            </h6>
            <div class="info-card">
              <div class="mb-3">
                <label class="form-label">Nombre de la empresa</label>
                <select
                  class="form-select"
                  v-model="paymentForm.companyId"
                  @change="updateCompanyInfo"
                >
                  <option value="">Seleccionar empresa</option>
                  <option
                    v-for="company in companies"
                    :key="company._id"
                    :value="company._id"
                  >
                    {{ company.company }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Folio</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="paymentForm.folio"
                  placeholder="Folio"
                />
              </div>
            </div>
          </div>

          <!-- Plan/Service Selection -->
          <div class="info-section mb-4">
            <h6 class="section-title">
              <i class="bi bi-box me-2"></i>
              Plan / Servicio
            </h6>
            <div class="service-card">
              <!-- Service Type Selection -->
              <div class="mb-3">
                <label class="form-label">Tipo de Servicio</label>
                <div class="btn-group w-100" role="group">
                  <input
                    type="radio"
                    class="btn-check"
                    name="serviceType"
                    id="predefined"
                    value="predefined"
                    v-model="serviceType"
                  />
                  <label class="btn btn-outline-primary" for="predefined">
                    <i class="bi bi-list-ul me-1"></i>
                    Predefinido
                  </label>

                  <input
                    type="radio"
                    class="btn-check"
                    name="serviceType"
                    id="custom"
                    value="custom"
                    v-model="serviceType"
                  />
                  <label class="btn btn-outline-primary" for="custom">
                    <i class="bi bi-gear me-1"></i>
                    Personalizado
                  </label>
                </div>
              </div>

              <!-- Servicios Predefinidos -->
              <div v-if="serviceType === 'predefined'" class="mb-3">
                <label class="form-label">Plan o Servicio</label>
                <select
                  class="form-select"
                  v-model="paymentForm.planService"
                  @change="updatePredefinedPrice"
                >
                  <option value="">Seleccionar plan o servicio</option>
                  <optgroup label="Planes">
                    <option
                      v-for="plan in availablePlanes"
                      :key="'plan-' + plan._id"
                      :value="plan"
                    >
                      {{ plan.name }} - ${{ plan.maxPrice.toLocaleString() }}
                    </option>
                  </optgroup>
                  <optgroup label="Servicios">
                    <option
                      v-for="servicio in availableServices"
                      :key="'service-' + servicio._id"
                      :value="servicio"
                    >
                      {{ servicio.name }} - ${{ servicio.priceMax.toLocaleString() }}
                    </option>
                  </optgroup>
                </select>
                <small class="text-muted mt-1 d-block">
                  Precio sugerido:
                  <strong>
                    {{
                      paymentForm.planService?.maxPrice !== undefined
                        ? "$" + paymentForm.planService.maxPrice.toLocaleString()
                        : paymentForm.planService?.priceMax !== undefined
                        ? "$" + paymentForm.planService.priceMax.toLocaleString()
                        : "-"
                    }}
                  </strong>
                </small>
              </div>

              <!-- Servicios Personalizados -->
              <div v-if="serviceType === 'custom'" class="mb-3">
                <label class="form-label">Servicios Personalizados</label>
                <div class="custom-services-container">
                  <div class="services-grid">
                    <div
                      v-for="service in availableServices"
                      :key="service._id"
                      class="service-option"
                      :class="{ selected: selectedServices.includes(service._id) }"
                      @click="toggleService(service._id)"
                      role="button"
                      tabindex="0"
                      @keyup.enter="toggleService(service._id)"
                    >
                      <div class="service-checkbox">
                        <i
                          class="bi bi-check"
                          v-if="selectedServices.includes(service._id)"
                        ></i>
                      </div>
                      <div class="service-details">
                        <div class="service-name">{{ service.name }}</div>
                        <div class="service-price">
                          ${{ (service.priceMax || 0).toLocaleString() }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Listado de servicios seleccionados -->
                  <div v-if="selectedServices.length > 0" class="selected-summary mt-3">
                    <h6 class="mb-2">Servicios Seleccionados:</h6>
                    <div class="selected-list">
                      <div
                        v-for="serviceId in selectedServices"
                        :key="serviceId"
                        class="selected-item"
                      >
                        <span>{{ getServiceById(serviceId).name }}</span>
                        <span class="price">
                          ${{ (getServiceById(serviceId).priceMax || 0).toLocaleString() }}
                        </span>
                        <button
                          type="button"
                          class="btn-remove"
                          @click="toggleService(serviceId)"
                          aria-label="Quitar servicio"
                        >
                          <i class="bi bi-x"></i>
                        </button>
                      </div>
                    </div>
                    <div class="total-price">
                      <strong>
                        Total: ${{ calculateTotal().toLocaleString() }} MXN
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Cliente</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="paymentForm.client"
                  placeholder="Nombre del cliente"
                />
              </div>
            </div>
          </div>

          <!-- Asignar Pago -->
          <div class="info-section mb-4">
            <h6 class="section-title">
              <i class="bi bi-currency-dollar me-2"></i>
              Asignar Pago
            </h6>
            <div class="payment-card">
              <div class="mb-3">
                <label class="form-label">Monto Total</label>
                <div class="input-group">
                  <span class="input-group-text">$</span>
                  <input
                    type="number"
                    class="form-control"
                    v-model.number="paymentForm.totalAmount"
                    placeholder="0.00"
                    min="0"
                  />
                  <span class="input-group-text">MXN</span>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Abonado</label>
                <div class="input-group">
                  <span class="input-group-text">$</span>
                  <input
                    type="number"
                    class="form-control"
                    v-model.number="paymentForm.paidAmount"
                    placeholder="0.00"
                    @input="updatePaymentStatus"
                    min="0"
                    :max="paymentForm.totalAmount"
                  />
                  <span class="input-group-text">MXN</span>
                </div>
              </div>
              <div
                class="payment-summary"
                v-if="paymentForm.totalAmount && paymentForm.paidAmount"
              >
                <div class="d-flex justify-content-between">
                  <span>Restante:</span>
                  <span class="fw-bold text-warning">
                    {{
                      (paymentForm.totalAmount - paymentForm.paidAmount).toLocaleString()
                    }}
                    MXN
                  </span>
                </div>
              </div>

              <!-- Botones de Pago -->
              <div class="payment-buttons mt-4">
                <div class="row g-2">
                  <div class="col-6">
                    <button
                      type="button"
                      class="btn btn-success w-100"
                      @click="setPaymentType('Completo')"
                      :class="{ active: paymentForm.paymentType === 'Completo' }"
                    >
                      <i class="bi bi-check-circle me-1"></i>
                      Liquidar
                    </button>
                  </div>
                  <div class="col-6">
                    <button
                      type="button"
                      class="btn btn-warning w-100"
                      @click="setPaymentType('Abono')"
                      :class="{ active: paymentForm.paymentType === 'Abono' }"
                    >
                      <i class="bi bi-cash me-1"></i>
                      Abono
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Notas -->
          <div class="info-section mb-4">
            <h6 class="section-title">
              <i class="bi bi-chat-text me-2"></i>
              Notas
            </h6>
            <div class="info-card">
              <textarea
                class="form-control"
                rows="3"
                v-model="paymentForm.notes"
                placeholder="Agregar notas o comentarios sobre este pago..."
              ></textarea>
            </div>
          </div>
        </div>

        <div class="sidebar-footer">
          <button class="btn btn-outline-secondary me-2" @click="$emit('close')">
            <i class="bi bi-x-circle me-1"></i>
            Cancelar
          </button>
          <button class="btn btn-primary" @click="createPayment">
            <i class="bi bi-plus-circle me-2"></i>
            Crear Pago
          </button>
        </div>
      </div>
    </div>

    <!-- Overlay -->
    <div
      class="sidebar-overlay"
      :class="{ active: show }"
      @click="$emit('close')"
    ></div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import "./CreatePaymentSidebar.css";
import { useAlert } from "../../hooks/useAlert";
import { useServiceStore } from "../../Stores/ServiceStore";
import { usePlansStore } from "../../Stores/PlansStore";
import { usePaymentsStore } from "../../Stores/paymentsStorte";

const serviceStore = useServiceStore();
const planStore = usePlansStore();
const paymentStore = usePaymentsStore();

const availableServices = computed(() => serviceStore.services);
const availablePlanes = computed(() => planStore.plans);

onMounted(async () => {
  await serviceStore.getServices();
  await planStore.getPlans();
});

const props = defineProps({
  show: Boolean,
  selectedCompany: Object,
  companies: Array,
});
console.log("Empresa seleccionada:", props.selectedCompany);

const emit = defineEmits(["close", "save"]);
const { showSuccess, showError } = useAlert();

const serviceType = ref("predefined");
const selectedServices = ref([]);

const paymentForm = ref({
  userName: "",
  contractDate: "",
  companyId: null,
  companyName: "",
  folio: "",
  planService: null,
  clientPhone: "",
  client: "",
  totalAmount: 0,
  paidAmount: 0,
  paymentType: "",
  notes: "",
});

watch(
  () => props.show,
  (isOpen) => {
    if (isOpen && props.selectedCompany) {
      console.log("✅ Modal abierto con empresa:", props.selectedCompany);
      paymentForm.value.companyId = props.selectedCompany._id || null;
      paymentForm.value.companyName = props.selectedCompany.company || "";
      paymentForm.value.client = props.selectedCompany.name || "";
      paymentForm.value.clientPhone = props.selectedCompany.phone || "";
    }
  }
);

watch(serviceType, (newType) => {
  if (newType === "predefined") {
    selectedServices.value = [];
    paymentForm.value.planService = null;
  } else {
    paymentForm.value.planService = null;
    paymentForm.value.totalAmount = calculateTotal();
  }
});

watch(
  selectedServices,
  () => {
    if (serviceType.value === "custom") {
      paymentForm.value.totalAmount = calculateTotal();
    }
  },
  { deep: true }
);

const updateCompanyInfo = () => {
  const company = props.companies.find(
    (c) => c._id === paymentForm.value.companyId
  );
  if (company) {
    paymentForm.value.companyName = company.company;
    paymentForm.value.client = company.name;
    paymentForm.value.clientPhone = company.phone || "";
  } else {
    // Si no se encuentra la empresa, limpiar campos relacionados
    paymentForm.value.companyName = "";
    paymentForm.value.client = "";
    paymentForm.value.clientPhone = "";
  }
};

const updatePredefinedPrice = () => {
  if (!paymentForm.value.planService) {
    paymentForm.value.totalAmount = 0;
  }
};

const toggleService = (serviceId) => {
  const index = selectedServices.value.indexOf(serviceId);
  if (index > -1) {
    selectedServices.value.splice(index, 1);
  } else {
    selectedServices.value.push(serviceId);
  }
};

const getServiceById = (serviceId) => {
  return availableServices.value.find((service) => service._id === serviceId) || {};
};

const calculateTotal = () => {
  return selectedServices.value.reduce((total, id) => {
    const svc = getServiceById(id);
    return total + (svc.priceMax || 0);
  }, 0);
};

const setPaymentType = (type) => {
  paymentForm.value.paymentType = type;
  if (type === "Completo") {
    paymentForm.value.paidAmount = paymentForm.value.totalAmount;
  }
};

const updatePaymentStatus = () => {
  const { totalAmount, paidAmount } = paymentForm.value;
  if (paidAmount >= totalAmount && totalAmount > 0) {
    paymentForm.value.paymentType = "Completo";
  } else if (paidAmount > 0) {
    paymentForm.value.paymentType = "Abono";
  } else {
    paymentForm.value.paymentType = "";
  }
};

const createPayment = async () => {
  const form = paymentForm.value;
  if (
    !form.userName ||
    !form.client ||
    !form.companyId ||
    (serviceType.value === "predefined" && !form.planService) ||
    (serviceType.value === "custom" && selectedServices.value.length === 0) ||
    !form.totalAmount ||
    form.totalAmount <= 0 ||
    !form.paymentType
  ) {
    return showError("Error", "Todos los campos requeridos deben estar completos");
  }

  const phonenumber = form.clientPhone;

  const newPayment = {
    userId: form.companyId,
    nameUser: form.userName,
    companyName: form.companyName,
    folio: form.folio,
    date: form.contractDate,
    totalAmount: form.totalAmount,
    paidAmount: form.paidAmount,
    status: form.paymentType === "Completo" ? "pagado" : "pendiente",
    notes: form.notes || "",
    services: [],
    plans: [],
    items: [],
  };

  if (serviceType.value === "predefined") {
    if (form.planService?.maxPrice !== undefined) {
      newPayment.plans = [form.planService._id];
      newPayment.items.push({
        title: form.planService.name,
        unit_price: form.totalAmount,
        quantity: 1,
        description: form.planService.description || "",
      });
    } else if (form.planService?.priceMax !== undefined) {
      newPayment.services = [form.planService._id];
      newPayment.items.push({
        title: form.planService.name,
        unit_price: form.totalAmount,
        quantity: 1,
        description: form.planService.description || "",
      });
    }
  } else {
    newPayment.services = [...selectedServices.value];
    newPayment.items = selectedServices.value.map((id) => {
      const svc = getServiceById(id);
      return {
        title: svc.name,
        unit_price: form.totalAmount || 0,
        quantity: 1,
        description: svc.description || "",
      };
    });
  }

  const response = await paymentStore.creatrOrder(newPayment);
  if (!response || !response.init_point) {
    showError("Error", "No se pudo obtener el link de pago.");
    return;
  }
  const phone = phonenumber;
  const message = `Hola ${paymentForm.value.userName}, aquí está tu link para completar el pago: ${response.init_point}`;
  const whatsappUrl = `https://wa.me/+52${phone}?text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, "_blank");

  console.log(newPayment);
  showSuccess("Pago creado", "El pago se creó exitosamente");
  resetForm();
};

const resetForm = () => {
  paymentForm.value = {
    userName: "",
    contractDate: "",
    companyId: null,
    companyName: "",
    folio: "",
    planService: null,
    clientPhone: "",
    client: "",
    totalAmount: 0,
    paidAmount: 0,
    paymentType: "",
    notes: "",
  };
  selectedServices.value = [];
  serviceType.value = "predefined";
};
</script>
