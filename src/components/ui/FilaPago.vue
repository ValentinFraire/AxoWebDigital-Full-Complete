<template>
  <tr class="fila-pago" :class="{ highlight: isHighlighted }">
    <!-- Usuario -->
    <td>
      <div class="user-info">
        <i class="bi bi-person-circle me-2 text-coral"></i>
        <span>{{ pago.nameUser || "N/A" }}</span>
      </div>
    </td>

    <!-- Plan / Servicio -->
    <td>
      <div class="plan-info">
        <i class="bi bi-box me-2 text-coral"></i>
        <div>
          <div class="fw-bold">{{ firstItemTitle }}</div>
          <small class="text-muted" v-if="pago.items?.length > 1">
            +{{ pago.items.length - 1 }} servicio(s) más
          </small>
        </div>
      </div>
    </td>

    <!-- Monto -->
    <td>
      <span class="fw-bold text-success">
        ${{ firstItemPrice.toLocaleString() }}
      </span>
    </td>

    <!-- Estado -->
    <td>
      <PaymentStatusBadge :status="pago.status" />
    </td>

    <!-- Fecha -->
    <td>{{ formatDate(pago.date) }}</td>

    <!-- ID de compra -->
    <td>
      <code class="text-muted">{{ pago.purchaseId || 'N/A' }}</code>
    </td>

    <!-- Notas -->
    <td>
      <div class="notes-cell">
        <span v-if="pago.notes" class="text-muted" :title="pago.notes">
          {{ truncateText(pago.notes, 30) }}
        </span>
        <span v-else class="text-muted">-</span>
      </div>
    </td>

    <!-- Acciones -->
    <td>
      <PaymentActionButtons
        :payment="pago"
        :show-liquidar="showLiquidar"
        :show-abonar="showAbonar"
        :show-view="showView"
        :show-edit="showEdit"
        :show-delete="showDelete"
        @liquidar="emit('liquidar', pago)"
        @abonar="emit('abonar', pago)"
        @view="emit('view', pago)"
        @edit="emit('edit', pago)"
        @delete="emit('delete', pago)"
      />
    </td>
  </tr>
</template>

<script setup>
import PaymentStatusBadge from "./PaymentStatusBadge.vue";
import PaymentActionButtons from "./PaymentActionButtons.vue";
import { computed } from "vue";

// Props
const props = defineProps({
  pago: {
    type: Object,
    required: true
  },
  isHighlighted: {
    type: Boolean,
    default: false
  },
  showLiquidar: {
    type: Boolean,
    default: true
  },
  showAbonar: {
    type: Boolean,
    default: true
  },
  showView: {
    type: Boolean,
    default: true
  },
  showEdit: {
    type: Boolean,
    default: true
  },
  showDelete: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["liquidar", "abonar", "view", "edit", "delete"]);

// Computed: título y precio del primer item
const firstItemTitle = computed(() => props.pago.items?.[0]?.title || "Sin título");
const firstItemPrice = computed(() => props.pago.items?.[0]?.unit_price || 0);

// Funciones utilitarias
function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}



 
  
</script>

<style scoped>
.fila-pago {
  transition: all 0.3s ease;
}

.fila-pago:hover {
  background-color: #f8f9fa;
  transform: scale(1.01);
}

.fila-pago.highlight {
  background-color: rgba(233, 79, 55, 0.1);
  border-left: 4px solid var(--primary-coral);
}

.user-info,
.plan-info {
  display: flex;
  align-items: center;
}

.notes-cell {
  max-width: 150px;
  overflow: hidden;
}

.text-coral {
  color: var(--primary-coral) !important;
}
</style>
