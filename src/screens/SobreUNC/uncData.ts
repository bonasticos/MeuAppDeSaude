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

export interface ServicoCursoInfo {
  id: string;
  titulo: string;
  subtituloCard: string;
  icone: string;
  corBadge: string;
  corIcone: string;
  campiIds: string[];
  campiResumo: string;
  publicoAlvo: string;
  descricaoAtendimento: string;
  servicosComunidade: string[];
  clinicaEscola: {
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
    nome: 'Campus Mafra (Espaço Mais Saúde)',
    cidade: 'Mafra - SC',
    endereco: 'Av. Presidente Nereu Ramos, 1071 - Jardim do Moinho, Mafra - SC',
    cep: '89306-076',
    telefone: '(47) 3641-5500',
    lat: -26.13282,
    lng: -49.80953,
    destaque: 'Espaço Mais Saúde • Clínicas de Odontologia, Fisioterapia, Enfermagem, Psicologia e ações em Medicina',
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
    destaque: 'Clínica de Psicologia (atendimento gratuito via encaminhamento SUS) e ações comunitárias em saúde',
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
    destaque: 'Atendimentos e ações comunitárias em Medicina, Enfermagem, Psicologia e Fisioterapia',
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
    destaque: 'Acolhimento psicológico e ações educativas voltadas à comunidade',
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
    destaque: 'Ambulatórios e ações de atenção básica em parceria com a rede pública de saúde',
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
    destaque: 'Campanhas de prevenção e projetos de extensão regional em saúde',
  },
];

export const CLINICA_ESCOLA_GERAL: ServicoCursoInfo = {
  id: 'clinica-escola',
  titulo: 'Espaço Mais Saúde & Clínicas-Escola UNC',
  subtituloCard: 'Triagem centralizada e atendimentos gratuitos ou acessíveis para toda a população',
  icone: 'medkit-outline',
  corBadge: '#E6F4EA',
  corIcone: '#166534',
  campiIds: ['mafra', 'canoinhas', 'concordia', 'curitibanos', 'porto-uniao'],
  campiResumo: 'Mafra (Espaço Mais Saúde), Canoinhas, Concórdia, Curitibanos e Porto União',
  publicoAlvo: 'Crianças, jovens, adultos, idosos e pacientes encaminhados pela rede pública (SUS)',
  descricaoAtendimento:
    'As Clínicas-Escola e o Espaço Mais Saúde da UNC oferecem consultas, terapias, reabilitação e ações preventivas à comunidade. Todos os atendimentos são realizados com supervisão direta de professores e profissionais preceptores.',
  servicosComunidade: [
    'Espaço Mais Saúde (Mafra) — Triagem, acolhimento e agendamentos: (47) 3641-5519',
    'Medicina — Consultas ambulatoriais supervisionadas, atenção básica e mutirões preventivos',
    'Fisioterapia — Reabilitação física, análise da pisada (baropodometria) e alívio da dor: (47) 3441-1015',
    'Odontologia — Tratamentos clínicos gerais, restaurações e atendimento a Pacientes com Necessidades Especiais (PNE)',
    'Psicologia — Psicoterapia gratuita via encaminhamento SUS em Canoinhas e acolhimento regional',
    'Enfermagem — Aferição de pressão e glicemia, vacinação, curativos e orientação em cuidados diários',
  ],
  clinicaEscola: {
    titulo: 'Central de Triagem e Agendamentos',
    descricao:
      'As agendas seguem o calendário letivo e os horários das clínicas-escola. Faça contato prévio por telefone para verificar vagas e documentos necessários.',
    contato: '(47) 3641-5519 / (47) 3641-5500',
    comoAgendar:
      'Em Mafra, ligue diretamente para o Espaço Mais Saúde no telefone (47) 3641-5519. Em Canoinhas (Psicologia), o acesso gratuito ocorre via encaminhamento pela rede pública (SUS) ou UBS do bairro.',
  },
  urlOficial: 'https://www.unc.br/',
};

export const SERVICOS_CURSOS_UNC: ServicoCursoInfo[] = [
  {
    id: 'medicina',
    titulo: 'Medicina',
    subtituloCard: 'Consultas ambulatoriais, prevenção e apoio às UBS da região',
    icone: 'pulse-outline',
    corBadge: '#FEE2E2',
    corIcone: '#B91C1C',
    campiIds: ['mafra', 'concordia', 'porto-uniao'],
    campiResumo: 'Mafra, Concórdia e Porto União',
    publicoAlvo: 'Pacientes da atenção primária, famílias e comunidade atendida pela rede conveniada',
    descricaoAtendimento:
      'A comunidade conta com atendimentos médicos integrados às Unidades Básicas de Saúde (UBS), ambulatórios-escola e campanhas educativas de prevenção e acompanhamento de doenças crônicas.',
    servicosComunidade: [
      'Consultas clínicas e acompanhamento preventivo em Unidades Básicas de Saúde parceiras',
      'Atendimento ambulatorial integrado nas áreas de saúde da família, adulto e idoso',
      'Ações de rastreamento de hipertensão, diabetes e saúde preventiva em mutirões regionais',
      'Orientações sobre hábitos saudáveis, uso correto de medicações e encaminhamentos médicos',
    ],
    clinicaEscola: {
      titulo: 'Ambulatórios & Rede Conveniada (Medicina)',
      descricao:
        'Os atendimentos à população acontecem no Complexo de Medicina, Espaço Mais Saúde e unidades do SUS conveniadas aos campi.',
      contato: '(47) 3641-5500 / (47) 3641-5519',
      comoAgendar:
        'Procure a Unidade Básica de Saúde (UBS) da sua região ou entre em contato com o Espaço Mais Saúde em Mafra pelo (47) 3641-5519 para consultar os ambulatórios disponíveis.',
    },
    urlOficial: 'https://www.unc.br/',
  },
  {
    id: 'fisioterapia',
    titulo: 'Fisioterapia',
    subtituloCard: 'Reabilitação física, alívio da dor, postura e baropodometria',
    icone: 'body-outline',
    corBadge: '#FEF3C7',
    corIcone: '#B45309',
    campiIds: ['mafra', 'concordia'],
    campiResumo: 'Mafra e Concórdia',
    publicoAlvo: 'Pessoas com dores musculoesqueléticas, pós-operatório, lesões, sequelas neurológicas e idosos',
    descricaoAtendimento:
      'A Clínica Escola de Fisioterapia presta serviços completos de reabilitação motora e funcional à comunidade, utilizando equipamentos modernos como eletroterapia e avaliação computadorizada da pisada (baropodometria).',
    servicosComunidade: [
      'Reabilitação ortopédica e traumatológica para dores na coluna, joelho, ombro e articulações',
      'Fisioterapia neurológica e geriátrica voltada à autonomia, equilíbrio e mobilidade de idosos',
      'Avaliação biomecânica e baropodometria (análise computadorizada da pisada e postura)',
      'Eletroterapia, exercícios terapêuticos e fisioterapia respiratória supervisionada',
    ],
    clinicaEscola: {
      titulo: 'Clínica Escola de Fisioterapia UNC',
      descricao:
        'Atendimentos presenciais com avaliação individualizada para montar o plano terapêutico de acordo com a necessidade de cada paciente.',
      contato: '(47) 3441-1015 / (47) 3641-5519',
      email: 'fisioterapia.mafra@unc.br',
      comoAgendar:
        'Ligue para (47) 3441-1015 ou para o Espaço Mais Saúde (47) 3641-5519, ou envie e-mail para fisioterapia.mafra@unc.br para agendar sua triagem.',
    },
    urlOficial: 'https://www.unc.br/',
  },
  {
    id: 'odontologia',
    titulo: 'Odontologia',
    subtituloCard: 'Clínica geral, restaurações e atendimento especializado a PNE',
    icone: 'happy-outline',
    corBadge: '#E0F2FE',
    corIcone: '#0369A1',
    campiIds: ['mafra'],
    campiResumo: 'Mafra (Campus Sede)',
    publicoAlvo: 'Crianças, adultos, idosos e Pacientes com Necessidades Especiais (PNE)',
    descricaoAtendimento:
      'A Clínica de Odontologia da UNC realiza tratamentos odontológicos preventivos e curativos para a população em consultórios equipados, incluindo projeto dedicado a Pacientes com Necessidades Especiais (PNE).',
    servicosComunidade: [
      'Avaliação bucal, limpeza (profilaxia), orientação de higiene e prevenção odontológica',
      'Dentística (restaurações estéticas e funcionais) e tratamentos de canal (endodontia)',
      'Extrações e procedimentos cirúrgicos odontológicos ambulatoriais supervisionados',
      'Atendimento especializado para Pacientes com Necessidades Especiais (PNE) e odontopediatria',
    ],
    clinicaEscola: {
      titulo: 'Clínica de Odontologia UNC (Mafra)',
      descricao:
        'Atendimentos realizados nos períodos vespertino e noturno seguindo o calendário das clínicas integradas.',
      contato: '(47) 3641-5519',
      comoAgendar:
        'Entre em contato pelo telefone do Espaço Mais Saúde (47) 3641-5519 para inscrição na fila de triagem e confirmação de horário.',
    },
    urlOficial: 'https://www.unc.br/',
  },
  {
    id: 'psicologia',
    titulo: 'Psicologia',
    subtituloCard: 'Psicoterapia individual e apoio gratuito em saúde mental',
    icone: 'chatbubbles-outline',
    corBadge: '#EDE9FE',
    corIcone: '#6D28D9',
    campiIds: ['mafra', 'canoinhas', 'concordia', 'curitibanos'],
    campiResumo: 'Canoinhas, Mafra, Concórdia e Curitibanos',
    publicoAlvo: 'Crianças, adolescentes, adultos e idosos da comunidade e rede escolar/SUS',
    descricaoAtendimento:
      'As Clínicas e Núcleos de Psicologia oferecem escuta acolhedora, avaliação psicológica e psicoterapia supervisionada para apoiar a saúde emocional da população e de famílias da região.',
    servicosComunidade: [
      'Psicoterapia clínica gratuita para crianças, adolescentes e idosos (com destaque em Canoinhas via SUS)',
      'Acolhimento emocional para quadros de ansiedade, estresse, luto e depressão',
      'Orientação e suporte psicológico a famílias, escolas e instituições comunitárias',
      'Rodas de conversa, oficinas preventivas e ações de promoção da saúde mental',
    ],
    clinicaEscola: {
      titulo: 'Clínica de Psicologia UNC',
      descricao:
        'Os atendimentos são realizados por acadêmicos das fases finais sob supervisão rigorosa de psicólogos docentes.',
      contato: '(47) 3622-9999 (Canoinhas) / (47) 3641-5500 (Mafra)',
      comoAgendar:
        'Em Canoinhas, o acesso gratuito acontece mediante encaminhamento pela rede pública (UBS/SUS) ou rede escolar. Para os demais campi, ligue para a central da unidade.',
    },
    urlOficial: 'https://www.unc.br/',
  },
  {
    id: 'enfermagem',
    titulo: 'Enfermagem',
    subtituloCard: 'Sinais vitais, vacinação, curativos e cuidado preventivo',
    icone: 'heart-outline',
    corBadge: '#FCE7F3',
    corIcone: '#BE185D',
    campiIds: ['mafra', 'concordia'],
    campiResumo: 'Mafra e Concórdia',
    publicoAlvo: 'Idosos, gestantes, hipertensos, diabéticos e moradores atendidos em campanhas e UBS',
    descricaoAtendimento:
      'A equipe e os núcleos práticos de Enfermagem atuam diretamente na prevenção de agravos, campanhas de vacinação, acompanhamento de sinais vitais e orientações de cuidado domiciliar à população.',
    servicosComunidade: [
      'Aferição de pressão arterial, glicemia capilar, temperatura e oxigenação em ações comunitárias',
      'Campanhas de vacinação, testes rápidos e educação em saúde nos bairros e praças',
      'Orientação sobre curativos, prevenção de lesões, higiene e cuidados diários com idosos',
      'Acompanhamento de grupos de hipertensos, diabéticos e gestantes junto à rede de atenção básica',
    ],
    clinicaEscola: {
      titulo: 'Ações Comunitárias & Espaço Mais Saúde (Enfermagem)',
      descricao:
        'Serviços integrados ao Espaço Mais Saúde, campanhas itinerantes e unidades parceiras de atenção básica.',
      contato: '(47) 3441-1021 / (47) 3641-5519',
      comoAgendar:
        'Para saber datas de mutirões e atendimentos de enfermagem, ligue para (47) 3441-1021 ou (47) 3641-5519.',
    },
    urlOficial: 'https://www.unc.br/',
  },
];
