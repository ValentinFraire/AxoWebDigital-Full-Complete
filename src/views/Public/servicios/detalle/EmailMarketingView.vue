<template>
  <div class="servicio-detalle-view">
    <!-- Hero Section -->
    <section class="hero-detalle">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <div class="hero-content animate__animated animate__fadeInLeft">
              <div class="breadcrumb-nav mb-3">
                <router-link to="/servicios" class="breadcrumb-link">
                  <i class="bi bi-arrow-left me-2"></i>Volver a Servicios
                </router-link>
              </div>
              <h1 class="hero-title">Correos Empresariales</h1>
              <p class="hero-subtitle">
                Domina la comunicación profesional con correos personalizados
                con tu dominio.
              </p>
              <div class="price-range">
                <span class="price-label">Precio desde:</span>
                <span class="price-amount">$500 - $3,000 MXN</span>
              </div>
              <BotonPrimario
                variant="primary"
                size="lg"
                icon="bi bi-whatsapp"
                @click="solicitarServicio"
              >
                Solicitar Cotización
              </BotonPrimario>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="hero-visual animate__animated animate__fadeInRight">
              <img
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
                alt="Correos Empresariales"
                class="img-fluid rounded-4 shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="benefits-section">
      <div class="container">
        <SectionHeader
          title="¿Por Qué Correos Empresariales?"
          subtitle="La mejor forma de proyectar profesionalismo"
          color="purple"
        />

        <div class="row g-4">
          <div
            class="col-md-6 col-lg-3"
            v-for="(benefit, index) in benefits"
            :key="index"
          >
            <div
              class="benefit-card animate__animated animate__fadeInUp"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <div class="benefit-icon">
                <i :class="benefit.icon"></i>
              </div>
              <h4>{{ benefit.title }}</h4>
              <p>{{ benefit.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="services-section">
      <div class="container">
        <SectionHeader
          title="Nuestros Planes de Correos Empresariales"
          subtitle="Elige el plan que se adapta a tu empresa"
          color="coral"
        />
        <div class="row g-4">
          <div
            class="col-lg-4"
            v-for="(servicio, index) in servicios"
            :key="index"
          >
            <ServicioEmailCard
              :servicio="servicio"
              @solicitar="solicitarServicioEspecifico"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Process Section -->
    <section class="process-section">
      <div class="container">
        <SectionHeader
          title="Nuestro Proceso"
          subtitle="Configuración profesional en pocos pasos"
          color="blue"
        />

        <div class="process-timeline">
          <div class="row">
            <div
              class="col-md-6 col-lg-3"
              v-for="(step, index) in processSteps"
              :key="index"
            >
              <div
                class="process-step animate__animated animate__fadeInUp"
                :style="{ animationDelay: `${index * 0.2}s` }"
              >
                <div class="step-number">{{ index + 1 }}</div>
                <div class="step-icon">
                  <i :class="step.icon"></i>
                </div>
                <h5>{{ step.title }}</h5>
                <p>{{ step.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8 text-center">
            <h2 class="cta-title">
              ¿Listo para Profesionalizar tu Comunicación?
            </h2>
            <p class="cta-subtitle">
              Obtén tu correo empresarial con dominio propio hoy mismo
            </p>
            <div class="cta-buttons">
              <BotonPrimario
                variant="primary"
                size="lg"
                icon="bi bi-whatsapp"
                @click="contactarWhatsApp('Correos-Empresariales')"
              >
                Contactar por WhatsApp
              </BotonPrimario>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal de Solicitud -->
    <SolicitudModal
      v-if="showSolicitudModal"
      :show="showSolicitudModal"
      :item="selectedItem"
      type="servicio"
      @close="showSolicitudModal = false"
      @submit="handleSolicitudSubmit"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import SectionHeader from "../../../../components/ui/SectionHeader.vue";
import BotonPrimario from "../../../../components/ui/BotonPrimario.vue";
import ServicioEmailCard from "../components/ServicioEmailCard.vue";
import SolicitudModal from "../../../../components/modals/SolicitudModal.vue";
import { useAlert } from "../../../../hooks/useAlert";
//hooks
import {
  useWhatsAppSolicitud,
  useWhatsApp
} from "../../../../hooks/useWhatsApp";
import { usePlansStore } from "../../../../Stores/PlansStore";
import { correoServices } from "../../../../data/PlanesCorreoService.js";

//Datos de Servicios

const { showSuccess } = useAlert();
const showSolicitudModal = ref(false);
const selectedItem = ref(null);
const { crearMensaje, enviarMensaje } = useWhatsAppSolicitud();
const { contactarWhatsApp } = useWhatsApp();

const planStore = usePlansStore();
const servicios = computed (() => {
  return planStore.plans
})
onMounted(async () => {
  
  await planStore.getPlansByCategory("CorreosEmpresariales");
})

const benefits = ref([
  {
    icon: "bi bi-shield-check",
    title: "Credibilidad",
    description: "Proyecta profesionalismo con tu dominio empresarial"
  },
  {
    icon: "bi bi-lock",
    title: "Seguridad",
    description: "Protección contra spam, suplantación y phishing"
  },
  {
    icon: "bi bi-globe",
    title: "Presencia Online",
    description: "Impulsa tu imagen digital con correos corporativos"
  },
  {
    icon: "bi bi-inbox",
    title: "Gestión Eficiente",
    description: "Accede desde cualquier dispositivo con total control"
  }
]);
const processSteps = ref([
  {
    icon: "bi bi-search",
    title: "Análisis",
    description: "Identificamos la necesidad de comunicación de tu empresa"
  },
  {
    icon: "bi bi-server",
    title: "Configuración",
    description: "Instalamos y configuramos correos en servidores seguros"
  },
  {
    icon: "bi bi-person-check",
    title: "Activación",
    description: "Creamos cuentas y las conectamos con tus dispositivos"
  },
  {
    icon: "bi bi-wrench",
    title: "Soporte",
    description: "Mantenimiento, monitoreo y ayuda técnica continua"
  }
]);

const solicitarServicioEspecifico = (servicio) => {
  selectedItem.value = {
    title: `Correo Empresarial ${servicio.name}`,
    price: servicio.priceMax + " MXN",
    description: servicio.description
  };
  showSolicitudModal.value = true;
};

const handleSolicitudSubmit = (solicitudData) => {
  const mensaje = crearMensaje(solicitudData);
  enviarMensaje(mensaje);
  showSuccess(
    "Solicitud enviada",
    "Tu solicitud ha sido enviada. Te contactaremos pronto."
  );
  showSolicitudModal.value = false;
};
</script>

<style scoped>
.servicio-detalle-view {
  background-color: var(--primary-beige);
}

.hero-detalle {
  padding: 100px 0;
  background: linear-gradient(135deg, var(--primary-purple) 0%, #7c4dff 100%);
  color: white;
}

.breadcrumb-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.breadcrumb-link:hover {
  color: white;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.price-range {
  margin-bottom: 2rem;
}

.price-label {
  display: block;
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 0.5rem;
}

.price-amount {
  font-size: 2rem;
  font-weight: 700;
  color: #ffd700;
}

.benefits-section {
  padding: 80px 0;
  background: white;
}

.benefit-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
  height: 100%;
}

.benefit-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.benefit-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--primary-purple) 0%, #7c4dff 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 2rem;
}

.benefit-card h4 {
  color: var(--primary-blue);
  font-weight: 600;
  margin-bottom: 1rem;
}

.benefit-card p {
  color: #666;
  line-height: 1.6;
}

.services-section {
  padding: 80px 0;
  background: #f8f9fa;
}

.process-section {
  padding: 80px 0;
  background: white;
}

.process-step {
  text-align: center;
  position: relative;
  padding: 2rem 1rem;
}

.step-number {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background: var(--primary-purple);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.step-icon {
  margin: 2rem 0 1rem;
}

.step-icon i {
  font-size: 3rem;
  color: var(--primary-blue);
}

.process-step h5 {
  color: var(--primary-purple);
  margin-bottom: 1rem;
  font-weight: 600;
}

.process-step p {
  color: #666;
}

.cta-section {
  padding: 100px 0;
  background: linear-gradient(135deg, var(--primary-blue) 0%, #2a4a6b 100%);
  color: white;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.cta-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 992px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .price-amount {
    font-size: 1.5rem;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 768px) {
  .hero-detalle {
    padding: 60px 0;
  }

  .hero-title {
    font-size: 2rem;
  }

  .benefits-section,
  .services-section,
  .process-section {
    padding: 60px 0;
  }

  .cta-section {
    padding: 60px 0;
  }

  .cta-title {
    font-size: 2rem;
  }
}
</style>
