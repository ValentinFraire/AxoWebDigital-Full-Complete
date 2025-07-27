// src/routes/public/router.js

import Home from '/src/views/Public/inicio/InicioView.vue'
import Services from '/src/views/Public/servicios/ServiciosView.vue'
import About from '/src/views/Public/sobre-nosotros/SobreNosotrosView.vue'
import Contact from '/src/views/Public/contactanos/ContactanosView.vue'
import DesarrolloWebView from '/src/views/Public/servicios/detalle/DesarrolloWebView.vue'
import EmailMarketingView from '/src/views/Public/servicios/detalle/EmailMarketingView.vue'
import DisenoUIUXView from '/src/views/Public/servicios/detalle/DisenoUIUXView.vue'
import MarketingDigitalView from '/src/views/Public/servicios/detalle/MarketingDigitalView.vue'
import AutomatizacionView from '/src/views/Public/servicios/detalle/AutomatizacionView.vue'
import Ecommerce from '/src/views/ofertas/Ecommerce.vue'
import Marketing from '/src/views/ofertas/Marketing.vue'
import PaymentSuccess from '/src/views/PaymentSuccess.vue'

export default [
  { path: '/', component: Home },
  { path: '/servicios', component: Services },
  { path: '/sobre-nosotros', component: About },
  { path: '/contactanos', component: Contact },
  { path: '/servicios/desarrollo-web', component: DesarrolloWebView },
  { path: '/servicios/email-marketing', component: EmailMarketingView },
  { path: '/servicios/diseno-ui-ux', component: DisenoUIUXView },
  { path: '/servicios/marketing-digital', component: MarketingDigitalView },
  { path: '/servicios/automatizacion', component: AutomatizacionView },
  { path: '/servicios/ecommerce', component: Ecommerce },
  { path: '/marketing-digital', component: Marketing },
  { path: '/pago-exitoso', component: PaymentSuccess },

]
