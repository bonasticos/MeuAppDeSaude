export interface CampusUNC {
  id: string;
  nome: string;
  cidade: string;
  endereco: string;
  cep: string;
  telefone: string;
  lat: number;
  lng: number;
  destaque?: string;
}

export interface CursoClinicaInfo {
  id: string;
  titulo: string;
  subtituloCard: string;
  categoria: 'clinica' | 'curso' | 'tecnologia' | 'institucional';
  icone: string;
  corBadge: string;
  corIcone: string;
  duracao?: string;
  modalidade?: string;
  turno?: string;
  campiIds: string[];
  campiResumo: string;
  objetivos: string;
  perfilEgresso: string;
  areasAtuacao: string[];
  clinicaEscola?: {
    titulo: string;
    descricao: string;
    contato: string;
    email?: string;
    comoAgendar: string;
  };
  urlOficial: string;
}

export const UNC_SITE_URL = 'https://www.unc.br/';

export const CAMPI_UNC: CampusUNC[] = [
  {
    id: 'mafra',
    nome: 'Campus Mafra (Sede & Complexo de Saúde)',
    cidade: 'Mafra - SC',
    endereco: 'Av. Presidente Nereu Ramos, 1071 - Jardim do Moinho, Mafra - SC',
    cep: '89306-076',
    telefone: '(47) 3641-5500',
    lat: -26.13282,
    lng: -49.80953,
    destaque: 'Espaço Mais Saúde • Clínica de Odontologia, Fisioterapia, Enfermagem, Medicina e Eng. de Software',
  },
  {
    id: 'canoinhas',
    nome: 'Campus Canoinhas',
    cidade: 'Canoinhas - SC',
    endereco: 'Rua Roberto Ehlke, 86 - Centro, Canoinhas - SC',
    cep: '89460-010',
    telefone: '(47) 3622-9999',
    lat: -26.1713,
    lng: -50.3941,
    destaque: 'Clínica de Psicologia (atendimento gratuito via encaminhamento SUS)',
  },
  {
    id: 'concordia',
    nome: 'Campus Concórdia',
    cidade: 'Concórdia - SC',
    endereco: 'Rua Victor Sopelsa, 3000 - Bairro Salete, Concórdia - SC',
    cep: '89711-330',
    telefone: '(49) 3441-1000',
    lat: -27.2265,
    lng: -52.0088,
    destaque: 'Medicina, Enfermagem, Psicologia, Fisioterapia e Engenharia de Software',
  },
  {
    id: 'curitibanos',
    nome: 'Campus Curitibanos',
    cidade: 'Curitibanos - SC',
    endereco: 'Av. Leoberto Leal, 1904 - Bairro Universitário, Curitibanos - SC',
    cep: '89520-000',
    telefone: '(49) 3245-4100',
    lat: -27.3053,
    lng: -50.579,
    destaque: 'Engenharia de Software e Psicologia',
  },
  {
    id: 'porto-uniao',
    nome: 'Campus Porto União',
    cidade: 'Porto União - SC',
    endereco: 'Rua Joaquim Nabuco, 314 - Bairro Cidade Nova, Porto União - SC',
    cep: '89400-000',
    telefone: '(42) 3523-2328',
    lat: -26.2428,
    lng: -51.0745,
    destaque: 'Curso de Medicina (divisa com União da Vitória-PR)',
  },
  {
    id: 'rio-negrinho',
    nome: 'Campus Rio Negrinho',
    cidade: 'Rio Negrinho - SC',
    endereco: 'Rua Pedro Simões de Oliveira, 3103 - Centro, Rio Negrinho - SC',
    cep: '89295-095',
    telefone: '(47) 3644-1051',
    lat: -26.2477,
    lng: -49.5178,
    destaque: 'Atividades acadêmicas e projetos de extensão regional',
  },
];

export const CLINICA_ESCOLA_GERAL: CursoClinicaInfo = {
  id: 'clinica-escola',
  titulo: 'Clínica Escola & Espaço Mais Saúde UNC',
  subtituloCard: 'Atendimentos em Medicina, Fisio, Odonto, Psico e Enfermagem para a comunidade',
  categoria: 'clinica',
  icone: 'medkit-outline',
  corBadge: '#E6F4EA',
  corIcone: '#166534',
  campiIds: ['mafra', 'canoinhas', 'concordia', 'porto-uniao'],
  campiResumo: 'Mafra (Espaço Mais Saúde), Canoinhas, Concórdia e Porto União',
  objetivos:
    'As Clínicas-Escola e o Espaço Mais Saúde da Universidade do Contestado (UNC) integram a formação prática dos acadêmicos da saúde com atendimento humanizado gratuito ou acessível à população da região.',
  perfilEgresso:
    'Todos os atendimentos são realizados por acadêmicos sob supervisão direta de professores e preceptores especialistas, unindo rigor científico e acolhimento comunitário.',
  areasAtuacao: [
    'Espaço Mais Saúde (Mafra) — Central de triagens e agendamentos: (47) 3641-5519',
    'Clínica Escola de Fisioterapia (Mafra) — Reabilitação, baropodometria e eletroterapia: (47) 3441-1015',
    'Clínica de Odontologia (Mafra) — Clínica integrada, dentística e atendimento a Pacientes com Necessidades Especiais (PNE)',
    'Clínica de Psicologia (Canoinhas) — Psicoterapia para crianças, adolescentes e idosos via encaminhamento SUS: (47) 3622-9999',
    'Enfermagem & Medicina — Práticas em atenção primária, saúde da família, vacinação e ambulatórios supervisionados',
  ],
  clinicaEscola: {
    titulo: 'Central de Agendamentos — Espaço Mais Saúde',
    descricao:
      'Como os atendimentos seguem o calendário letivo e os estágios práticos dos cursos, as vagas e horários de triagem são confirmados diretamente pelos telefones oficiais.',
    contato: '(47) 3641-5519 / (47) 3641-5500',
    comoAgendar:
      'Ligue para o Espaço Mais Saúde (47) 3641-5519 (Mafra) ou para a central do campus da sua cidade. Na Clínica de Psicologia de Canoinhas, os atendimentos ocorrem via encaminhamento pela rede pública (SUS).',
  },
  urlOficial: 'https://www.unc.br/',
};

export const CURSOS_SAUDE_UNC: CursoClinicaInfo[] = [
  {
    id: 'medicina',
    titulo: 'Medicina',
    subtituloCard: '6 anos • Integral • Mafra, Concórdia e Porto União',
    categoria: 'curso',
    icone: 'pulse-outline',
    corBadge: '#FEE2E2',
    corIcone: '#B91C1C',
    duracao: '6 anos (12 semestres)',
    modalidade: 'Presencial',
    turno: 'Integral (com internato médico)',
    campiIds: ['mafra', 'concordia', 'porto-uniao'],
    campiResumo: 'Mafra, Concórdia e Porto União',
    objetivos:
      'Formar médicos humanistas, críticos e reflexivos, capacitados para atuar de forma preventiva e curativa em todos os níveis de atenção à saúde, com compromisso social e respeito às políticas públicas.',
    perfilEgresso:
      'Profissional com formação geral, ética e técnica sólida, apto a atuar no cuidado individual e coletivo compreendendo os determinantes sociais do processo saúde-doença.',
    areasAtuacao: [
      'Atenção Primária (Unidades Básicas de Saúde e Saúde da Família)',
      'Pronto-socorros, Urgência e Emergência',
      'Hospitais gerais e ambulatórios de especialidades',
      'Consultórios, clínicas médicas e pesquisa clínica',
    ],
    clinicaEscola: {
      titulo: 'Complexo do Curso de Medicina & Cenários de Prática',
      descricao:
        'A formação prática ocorre no Complexo de Medicina da UNC, laboratórios de simulação realística, ambulatórios integrados e hospitais conveniados da região.',
      contato: '(47) 3641-5500',
      comoAgendar:
        'Os atendimentos comunitários vinculados às disciplinas médicas ocorrem nos ambulatórios-escola e unidades parceiras do SUS conforme escala semestral.',
    },
    urlOficial: 'https://www.unc.br/',
  },
  {
    id: 'fisioterapia',
    titulo: 'Fisioterapia',
    subtituloCard: '5 anos • Clínica Escola & Reabilitação',
    categoria: 'curso',
    icone: 'body-outline',
    corBadge: '#FEF3C7',
    corIcone: '#B45309',
    duracao: '5 anos (10 semestres)',
    modalidade: 'Presencial',
    turno: 'Noturno / Estágios clínicos diurnos',
    campiIds: ['mafra', 'concordia'],
    campiResumo: 'Mafra e Concórdia',
    objetivos:
      'Capacitar o acadêmico para a prevenção, diagnóstico cinético-funcional e reabilitação de distúrbios do movimento humano e de órgãos/sistemas, com base em evidências científicas e atuação interdisciplinar.',
    perfilEgresso:
      'Profissional crítico, humanista e resolutivo, preparado para avaliar, prescrever e conduzir terapias motoras, respiratórias e funcionais para promover qualidade de vida.',
    areasAtuacao: [
      'Fisioterapia Ortopédica, Traumatológica e Desportiva',
      'Fisioterapia Neurológica e Geriátrica',
      'Fisioterapia Respiratória e Terapia Intensiva (UTI)',
      'Saúde da Mulher, Home Care e Ergonomia preventiva',
    ],
    clinicaEscola: {
      titulo: 'Clínica Escola de Fisioterapia UNC',
      descricao:
        'Estrutura equipada com recursos modernos como baropodometria (análise computadorizada da pisada) e eletroterapia para atendimento de reabilitação à comunidade.',
      contato: '(47) 3441-1015 / (47) 3641-5519',
      email: 'fisioterapia.mafra@unc.br',
      comoAgendar:
        'Entre em contato pelo telefone (47) 3441-1015, pelo Espaço Mais Saúde (47) 3641-5519 ou pelo e-mail fisioterapia.mafra@unc.br para triagem.',
    },
    urlOficial: 'https://www.unc.br/',
  },
  {
    id: 'odontologia',
    titulo: 'Odontologia',
    subtituloCard: '5 anos • Clínica Integrada & PNE • Mafra',
    categoria: 'curso',
    icone: 'happy-outline',
    corBadge: '#E0F2FE',
    corIcone: '#0369A1',
    duracao: '5 anos (10 semestres)',
    modalidade: 'Presencial',
    turno: 'Integral / Clínicas em horários acadêmicos',
    campiIds: ['mafra'],
    campiResumo: 'Mafra',
    objetivos:
      'Formar cirurgiões-dentistas qualificados para prevenção, diagnóstico e tratamento das condições de saúde bucal, aliando novas tecnologias à responsabilidade social.',
    perfilEgresso:
      'Profissional generalista com sólida formação científica, ética e clínica, preparado para utilizar técnicas modernas tanto em consultórios particulares quanto na rede pública.',
    areasAtuacao: [
      'Clínica Integrada, Dentística e Endodontia',
      'Odontopediatria, Ortodontia e Periodontia',
      'Cirurgia Bucomaxilofacial e Implantodontia',
      'Atendimento especializado a Pacientes com Necessidades Especiais (PNE)',
    ],
    clinicaEscola: {
      titulo: 'Clínica de Odontologia UNC (Campus Mafra)',
      descricao:
        'Realiza atendimentos odontológicos para a comunidade em clínica integrada, projetos de Dentística e projeto dedicado a Pacientes com Necessidades Especiais.',
      contato: '(47) 3641-5519',
      comoAgendar:
        'Agendamentos e triagens são centralizados pelo Espaço Mais Saúde no telefone (47) 3641-5519 (períodos vespertino e noturno conforme calendário letivo).',
    },
    urlOficial: 'https://www.unc.br/',
  },
  {
    id: 'psicologia',
    titulo: 'Psicologia',
    subtituloCard: '5 anos • Saúde Mental & Clínica Escola',
    categoria: 'curso',
    icone: 'chatbubbles-outline',
    corBadge: '#EDE9FE',
    corIcone: '#6D28D9',
    duracao: '5 anos (10 semestres)',
    modalidade: 'Presencial',
    turno: 'Noturno / Estágios supervisionados',
    campiIds: ['mafra', 'canoinhas', 'concordia', 'curitibanos'],
    campiResumo: 'Mafra, Canoinhas, Concórdia e Curitibanos',
    objetivos:
      'Oferecer formação sólida fundamentada na pluralidade teórica da Psicologia, desenvolvendo competências éticas, investigativas e clínicas voltadas à saúde mental e às demandas sociais.',
    perfilEgresso:
      'Psicólogo crítico e reflexivo, preparado para atuar em contextos clínicos, hospitalares, escolares, organizacionais e políticas públicas de saúde mental.',
    areasAtuacao: [
      'Psicologia Clínica (psicoterapia individual e em grupo)',
      'Saúde Mental, CAPS e Psicologia Hospitalar',
      'Psicologia Escolar, Educacional e Social/Comunitária',
      'Psicologia Organizacional e do Trabalho',
    ],
    clinicaEscola: {
      titulo: 'Clínica de Psicologia UNC',
      descricao:
        'Em Canoinhas, a Clínica de Psicologia oferece atendimento psicológico gratuito para crianças, adolescentes e idosos por acadêmicos da 9ª fase supervisionados. Mafra e Concórdia também realizam acolhimentos e projetos em saúde mental.',
      contato: '(47) 3622-9999 (Canoinhas) / (47) 3641-5500 (Mafra)',
      comoAgendar:
        'Em Canoinhas, o acesso gratuito ocorre via encaminhamento pela rede pública municipal (SUS). Nos demais campi, consulte a coordenação pelos telefones centrais.',
    },
    urlOficial: 'https://www.unc.br/',
  },
  {
    id: 'enfermagem',
    titulo: 'Enfermagem',
    subtituloCard: '5 anos • Cuidado Integral & Urgências',
    categoria: 'curso',
    icone: 'heart-outline',
    corBadge: '#FCE7F3',
    corIcone: '#BE185D',
    duracao: '5 anos (10 semestres)',
    modalidade: 'Presencial',
    turno: 'Noturno / Estágios em turnos variados',
    campiIds: ['mafra', 'concordia'],
    campiResumo: 'Mafra e Concórdia',
    objetivos:
      'Proporcionar formação voltada ao cuidado integral à saúde, gestão de equipes, tomada de decisão segura em urgências e emergências e articulação direta entre teoria, prática e realidade regional.',
    perfilEgresso:
      'Enfermeiro generalista, humanista e líder de equipe, capacitado para atuar na promoção, prevenção, recuperação e reabilitação em todos os ciclos de vida.',
    areasAtuacao: [
      'Hospitais gerais, UTIs e Urgência/Emergência',
      'Unidades Básicas de Saúde (UBS) e Estratégia Saúde da Família',
      'Saúde Mental, Instituições de Longa Permanência e Auditoria',
      'Gestão em saúde, docência e pesquisa científica',
    ],
    clinicaEscola: {
      titulo: 'Núcleo de Práticas & Enfermagem UNC',
      descricao:
        'Conta com laboratórios de práticas clínicas, ações comunitárias de aferição de sinais vitais, vacinação e acompanhamento preventivo junto ao Espaço Mais Saúde.',
      contato: '(47) 3441-1021 / (47) 3641-5519',
      comoAgendar:
        'Informações sobre ações comunitárias e atendimentos pelo ramal (47) 3441-1021 ou pelo Espaço Mais Saúde (47) 3641-5519.',
    },
    urlOficial: 'https://www.unc.br/',
  },
  {
    id: 'engenharia-software',
    titulo: 'Engenharia de Software',
    subtituloCard: '4 anos • Nota 5 • Idealizadora deste App',
    categoria: 'tecnologia',
    icone: 'code-slash-outline',
    corBadge: '#EAF2FA',
    corIcone: '#103457',
    duracao: '4 anos (8 fases)',
    modalidade: 'Presencial',
    turno: 'Noturno (seg. a sex., com atividades aos sábados)',
    campiIds: ['mafra', 'concordia', 'curitibanos'],
    campiResumo: 'Mafra, Concórdia e Curitibanos',
    objetivos:
      'Formar engenheiros de software com excelência máxima (conceito 5) capazes de projetar, construir, testar e manter aplicativos mobile, sistemas web, bancos em nuvem e soluções de impacto real.',
    perfilEgresso:
      'Profissional preparado para atuar com arquitetura de software, desenvolvimento full-stack, mobile (React Native), qualidade, DevOps e liderança técnica.',
    areasAtuacao: [
      'Desenvolvimento Mobile, Web e Sistemas em Nuvem',
      'Arquitetura de Software, Banco de Dados e Segurança',
      'Qualidade de Software (QA), DevOps e Gestão Ágil',
      'Empreendedorismo digital e projetos integradores com a comunidade (como este app!)',
    ],
    urlOficial: 'https://www.unc.br/',
  },
];

export const ACESSO_RAPIDO_UNC: CursoClinicaInfo[] = [
  {
    id: 'cursos',
    titulo: 'Cursos e inscrições',
    subtituloCard: 'Graduação, pós-graduação e extensão na UNC',
    categoria: 'institucional',
    icone: 'book-outline',
    corBadge: '#EAF2FA',
    corIcone: '#194B7D',
    campiIds: ['mafra', 'canoinhas', 'concordia', 'curitibanos', 'porto-uniao', 'rio-negrinho'],
    campiResumo: 'Todos os 6 campi da UNC em Santa Catarina',
    objetivos:
      'Conheça todos os cursos de graduação, pós-graduação, ensino a distância e processos seletivos abertos na Universidade do Contestado.',
    perfilEgresso:
      'Editais de ingresso por histórico escolar, nota do ENEM, vestibular de Medicina e transferências.',
    areasAtuacao: [
      'Saúde: Medicina, Odontologia, Fisioterapia, Psicologia e Enfermagem',
      'Tecnologia: Engenharia de Software (Nota 5)',
      'Pós-graduação, MBA e cursos de extensão universitária',
    ],
    urlOficial: 'https://www.unc.br/',
  },
  {
    id: 'extensao',
    titulo: 'Projetos de extensão',
    subtituloCard: 'Universidade conectada à região',
    categoria: 'institucional',
    icone: 'flask-outline',
    corBadge: '#EAF2FA',
    corIcone: '#194B7D',
    campiIds: ['mafra', 'canoinhas', 'concordia', 'curitibanos', 'porto-uniao', 'rio-negrinho'],
    campiResumo: 'Atuação em toda a região do Contestado',
    objetivos:
      'Os projetos de extensão levam conhecimento acadêmico diretamente à comunidade por meio de mutirões de saúde, tecnologia social e oficinas.',
    perfilEgresso:
      'Este aplicativo (MeuAppDeSaúde) é fruto da integração prática entre Engenharia de Software e os cursos de Saúde da UNC.',
    areasAtuacao: [
      'Mutirões comunitários de prevenção em saúde',
      'Aplicativos acessíveis para idosos e pacientes crônicos',
      'Atendimentos multidisciplinares nos bairros e municípios vizinhos',
    ],
    urlOficial: 'https://www.unc.br/',
  },
  {
    id: 'bolsas',
    titulo: 'Bolsas e oportunidades',
    subtituloCard: 'Editais, estágios e pesquisa',
    categoria: 'institucional',
    icone: 'briefcase-outline',
    corBadge: '#EAF2FA',
    corIcone: '#194B7D',
    campiIds: ['mafra', 'canoinhas', 'concordia', 'curitibanos', 'porto-uniao', 'rio-negrinho'],
    campiResumo: 'Programas estaduais, institucionais e iniciação científica',
    objetivos:
      'Acompanhe editais de bolsas de estudo (como Universidade Gratuita / UNIEDU / FUMDES), estágios remunerados e bolsas de pesquisa científica.',
    perfilEgresso:
      'Incentivo à permanência estudantil e à pesquisa aplicada desde as fases iniciais da graduação.',
    areasAtuacao: [
      'Bolsas de estudo e financiamentos estudantis',
      'Iniciação científica e extensão universitária',
      'Central de estágios e vagas em empresas parceiras',
    ],
    urlOficial: 'https://www.unc.br/',
  },
  {
    id: 'portal',
    titulo: 'Portal Acadêmico',
    subtituloCard: 'Serviços digitais e vida acadêmica',
    categoria: 'institucional',
    icone: 'school-outline',
    corBadge: '#EAF2FA',
    corIcone: '#194B7D',
    campiIds: ['mafra', 'canoinhas', 'concordia', 'curitibanos', 'porto-uniao', 'rio-negrinho'],
    campiResumo: 'Ambiente digital UNC',
    objetivos:
      'Acesso rápido ao ecossistema digital da Universidade do Contestado: notas, frequência, biblioteca virtual e secretaria acadêmica.',
    perfilEgresso:
      'Centraliza a vida acadêmica dos estudantes de todos os campi da UNC.',
    areasAtuacao: [
      'Consulta de notas, horários e documentos acadêmicos',
      'Biblioteca UNC e bases científicas digitais',
      'Atendimento ao acadêmico e protocolos online',
    ],
    urlOficial: 'https://www.unc.br/',
  },
];

