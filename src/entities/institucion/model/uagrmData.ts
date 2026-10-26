// Datos de referencia institucional UAGRM (TypeScript) - Entity Institución

export interface ExtensionCI {
  valor: string;
  label: string;
}

export const EXTENSIONES_CI: ExtensionCI[] = [
  { valor: 'SCZ', label: 'Santa Cruz (SCZ)' },
  { valor: 'LPZ', label: 'La Paz (LPZ)' },
  { valor: 'CBA', label: 'Cochabamba (CBA)' },
  { valor: 'ORU', label: 'Oruro (ORU)' },
  { valor: 'POT', label: 'Potosí (POT)' },
  { valor: 'TJA', label: 'Tarija (TJA)' },
  { valor: 'CHQ', label: 'Chuquisaca (CHQ)' },
  { valor: 'BEN', label: 'Beni (BEN)' },
  { valor: 'PND', label: 'Pando (PND)' },
  { valor: 'EXT', label: 'Extranjero (EXT)' },
];

export interface Facultad {
  id: string;
  nombre: string;
  carreras: string[];
}

export const FACULTADES: Facultad[] = [
  {
    id: 'ficct',
    nombre: 'Facultad de Ciencias de la Computación y Telecomunicaciones',
    carreras: [
      'Ingeniería Informática',
      'Ingeniería de Sistemas',
      'Ingeniería en Redes y Telecomunicaciones'
    ]
  },
  {
    id: 'fcet',
    nombre: 'Facultad de Ciencias Exactas y Tecnología',
    carreras: [
      'Ingeniería Civil',
      'Ingeniería Industrial',
      'Ingeniería Química',
      'Ingeniería Electromecánica',
      'Ingeniería Petrolera',
      'Ingeniería de Alimentos'
    ]
  },
  {
    id: 'fcef',
    nombre: 'Facultad de Ciencias Económicas y Financieras',
    carreras: [
      'Licenciatura en Contaduría Pública',
      'Licenciatura en Administración de Empresas',
      'Licenciatura en Ingeniería Comercial',
      'Licenciatura en Economía',
      'Licenciatura en Comercio Internacional'
    ]
  },
  {
    id: 'fcjps',
    nombre: 'Facultad de Ciencias Jurídicas, Políticas y Sociales',
    carreras: [
      'Licenciatura en Derecho',
      'Licenciatura en Relaciones Internacionales',
      'Licenciatura en Ciencia Política y Administración Pública'
    ]
  },
  {
    id: 'fcsh',
    nombre: 'Facultad de Ciencias de la Salud Humana',
    carreras: [
      'Medicina',
      'Licenciatura en Enfermería',
      'Odontología',
      'Bioquímica y Farmacia'
    ]
  }
];

export const TIPOS_CERTIFICACION = [
  {
    id: 'tpn',
    nombre: 'Certificación de Título en Provisión Nacional',
    arancel: 30,
    descripcion: 'Validación de autenticidad de habilitación profesional ante el Estado Plurinacional.'
  },
  {
    id: 'ta',
    nombre: 'Certificación de Título Académico',
    arancel: 30,
    descripcion: 'Validación de culminación de estudios universitarios de grado y defensa de tesis.'
  },
  {
    id: 'db',
    nombre: 'Certificación de Diploma de Bachiller',
    arancel: 30,
    descripcion: 'Constancia oficial de legalidad de diploma extendido por la UAGRM.'
  }
];
