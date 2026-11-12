export type TipoQuestionario = 'PHQ-9' | 'GAD-7';

export interface OpcaoResposta {
  valor: number;
  label: string;
}

export interface ResultadoClassificacao {
  classificacao: string;
  cor: string;
  corFundo: string;
  orientacao: string;
  alertaCritico?: boolean;
}

export const OPCOES_TRIAGEM: OpcaoResposta[] = [
  { valor: 0, label: 'Nenhuma vez (0)' },
  { valor: 1, label: 'Vários dias (1)' },
  { valor: 2, label: 'Mais da metade dos dias (2)' },
  { valor: 3, label: 'Quase todos os dias (3)' },
];

export const PHQ9_PERGUNTAS: string[] = [
  'Pouco interesse ou pouco prazer em fazer as coisas.',
  'Se sentir para baixo, deprimido(a) ou sem perspectiva.',
  'Dificuldade para pegar no sono ou permanecer dormindo, ou dormir mais do que de costume.',
  'Se sentir cansado(a) ou com pouca energia.',
  'Falta de apetite ou comendo demais.',
  'Se sentir mal consigo mesmo(a) — ou achar que é um fracasso ou que decepcionou sua família ou a você mesmo(a).',
  'Dificuldade para se concentrar nas coisas, como ler o jornal ou ver televisão.',
  'Lentidão para se movimentar ou falar (a ponto de outras pessoas perceberem), ou o oposto — estar tão agitado(a) ou irrequieto(a) que fica andando de um lado para o outro muito mais que de costume.',
  'Pensamentos de que seria melhor estar morto(a) ou de se ferir de alguma forma.',
];

export const GAD7_PERGUNTAS: string[] = [
  'Sentir-se nervoso(a), ansioso(a) ou muito tenso(a).',
  'Não ser capaz de impedir ou de controlar as preocupações.',
  'Preocupar-se muito com diversas coisas.',
  'Dificuldade para relaxar.',
  'Ficar tão agitado(a) que se torna difícil permanecer sentado(a).',
  'Ficar facilmente aborrecido(a) ou irritado(a).',
  'Sentir medo como se algo horrível fosse acontecer.',
];

export function classificarPHQ9(pontuacao: number, respostaItem9: number): ResultadoClassificacao {
  const alertaCritico = respostaItem9 > 0;

  if (pontuacao <= 4) {
    return {
      classificacao: 'Sintomas Mínimos',
      cor: '#065F46',
      corFundo: '#D1FAE5',
      alertaCritico,
      orientacao: alertaCritico
        ? 'Apesar da pontuação baixa, você marcou pensamentos de sofrimento no último item. Procure conversar com um profissional de saúde ou ligue para o CVV (188) gratuitamente.'
        : 'Seus sintomas estão em nível mínimo. Continue acompanhando seu bem-estar e mantendo hábitos saudáveis.',
    };
  }
  if (pontuacao <= 9) {
    return {
      classificacao: 'Sintomas Leves',
      cor: '#92400E',
      corFundo: '#FEF3C7',
      alertaCritico,
      orientacao:
        'Há sinais leves de sobrecarga emocional. Observe sua evolução nas próximas semanas e considere conversar com um psicólogo ou médico da UBS.',
    };
  }
  if (pontuacao <= 14) {
    return {
      classificacao: 'Depressão Moderada (Orientativo)',
      cor: '#9A3412',
      corFundo: '#FFEDD5',
      alertaCritico,
      orientacao:
        'Pontuação sugestiva de sintomas moderados. Recomendamos buscar avaliação com psicólogo ou médico (Clínica de Psicologia da UNC ou UBS).',
    };
  }
  if (pontuacao <= 19) {
    return {
      classificacao: 'Depressão Moderadamente Grave (Orientativo)',
      cor: '#991B1B',
      corFundo: '#FEE2E2',
      alertaCritico,
      orientacao:
        'É muito importante procurar acompanhamento profissional em saúde mental (Psicologia / Psiquiatria / CAPS) o quanto antes.',
    };
  }
  return {
    classificacao: 'Depressão Grave (Orientativo)',
    cor: '#7F1D1D',
    corFundo: '#FECACA',
    alertaCritico: true,
    orientacao:
      'Pontuação elevada indicando sofrimento intenso. Procure atendimento médico/psicológico prioritário, o CAPS da sua cidade ou ligue gratuitamente para o CVV (188).',
  };
}

export function classificarGAD7(pontuacao: number): ResultadoClassificacao {
  if (pontuacao <= 4) {
    return {
      classificacao: 'Ansiedade Mínima',
      cor: '#065F46',
      corFundo: '#D1FAE5',
      orientacao: 'Nível mínimo de ansiedade nas últimas duas semanas. Mantenha sua rotina de autocuidado e sono.',
    };
  }
  if (pontuacao <= 9) {
    return {
      classificacao: 'Ansiedade Leve',
      cor: '#92400E',
      corFundo: '#FEF3C7',
      orientacao:
        'Sinais leves de ansiedade. Técnicas de respiração, atividade física e acompanhamento no diário emocional podem ajudar bastante.',
    };
  }
  if (pontuacao <= 14) {
    return {
      classificacao: 'Ansiedade Moderada (Orientativo)',
      cor: '#9A3412',
      corFundo: '#FFEDD5',
      orientacao:
        'Pontuação em nível moderado. Recomendamos agendar avaliação com um psicólogo ou médico na rede pública ou Clínica Escola da UNC.',
    };
  }
  return {
    classificacao: 'Ansiedade Grave (Orientativo)',
    cor: '#991B1B',
    corFundo: '#FEE2E2',
    alertaCritico: true,
    orientacao:
      'Pontuação sugestiva de ansiedade acentuada. Procure um profissional de saúde mental ou unidade de acolhimento (CAPS / UBS). Em crise, ligue 188 (CVV).',
  };
}

