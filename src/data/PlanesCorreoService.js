export const correoServices = [
  {
    id: 1,
    tipo:"correoEmpresarial",
    nombre: 'Starter',
    precio: '$500 - $1,000',
    descripcion: 'Correo para pequeñas empresas',
    caracteristicas: [
      '1-5 cuentas de correo',
      '5GB de almacenamiento por cuenta',
      'Acceso web y móvil',
      'Soporte básico'
    ],
    popular: false
  },
  {
    id: 2,
    tipo:"correoEmpresarial",
    nombre: 'Profesional',
    precio: '$1,000 - $2,000',
    descripcion: 'Ideal para equipos de trabajo',
    caracteristicas: [
      'Hasta 20 cuentas',
      '10GB por cuenta',
      'Antispam y antivirus',
      'Alias y redirecciones',
      'Soporte prioritario'
    ],
    popular: true
  },
  {
    id: 3,
    tipo:"correoEmpresarial",
    nombre: 'Corporativo',
    precio: 'Cotización',
    descripcion: 'Infraestructura robusta para empresas grandes',
    caracteristicas: [
      'Cuentas ilimitadas',
      '30GB por cuenta o más',
      'Panel de administración',
      'Integración con herramientas empresariales',
      'Backups automáticos',
      'Consultor dedicado'
    ],
    popular: false
  }
]
