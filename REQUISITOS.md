# 📋 Documento de Requisitos do Sistema (DRS)

> [!NOTE]
> **Status:** 
> ✅ Implementado | ⚠️ Parcial / Mock | ❌ Pendente

---

> [!IMPORTANT]
> ## 👤 Paciente — Acesso & Cadastro (RF01–RF14)

- ✅ **RF01:** Tela de login e cadastro com e-mail ou CPF, telefone, senha e confirmação de senha
- ❌ **RF02:** Confirmação de cadastro por código enviado ao e-mail ou telefone (OTP)
- ✅ **RF03:** Cadastro de perfil do paciente: idade, peso, altura, sexo (Masculino / Feminino / Outro) com opção de edição futura
- ✅ **RF04:** Cálculo automático de IMC com base nos dados cadastrados e exibição da classificação (Abaixo do peso, Normal, Sobrepeso, Obesidade)
- ❌ **RF05:** Após IMC, coleta de informações médicas: diabetes, problema cardíaco, hipertensão, autismo, síndrome de Down, gravidez (apenas perfil feminino)
- ✅ **RF06:** Registro e histórico de BPM (batimentos por minuto) com opção de editar e salvar medições futuras
- ✅ **RF07:** Registro e histórico de glicose (mg/dL) com opção de editar e salvar medições futuras
- ⚠️ **RF08:** Lembretes de medicamentos com cadastro de nome, dose, periodicidade (diária, semanal, mensal, trimestral, semestral) e alarme em horário específico
- ⚠️ **RF09:** Aferição diária de humor: Feliz, Triste, Nervoso, Ansioso — com histórico por data
- ❌ **RF10:** Registro de nível de atividade física: Ativo, De vez em quando, Não pratico
- ⚠️ **RF11:** Lembretes de higiene básica (escovar dentes, lavar mãos) com frequência configurável
- ⚠️ **RF12:** Lembretes de exercícios físicos: alongamento, academia, pilates — com dias e horários configuráveis
- ❌ **RF13:** Lembrete de hidratação com sugestão de quantidade de água calculada com base no peso, IMC e nível de atividade
- ❌ **RF14:** Gerenciamento de lembretes: editar frequência, dias da semana e horário de qualquer lembrete ativo

---

> [!TIP]
> ## 💊 Farmácia (RF15–RF21)

- ✅ **RF15:** Cadastro de medicamentos em uso: nome, dosagem, forma farmacêutica (comprimido, xarope, injeção, etc.) e prescritor
- ✅ **RF16:** Alerta de interação medicamentosa básica: notificação ao cadastrar combinações de risco conhecidas (ex: anticoagulante + AAS)
- ✅ **RF17:** Controle de estoque domiciliar: quantidade em casa, data de vencimento, alerta quando o estoque está baixo ou o medicamento vai vencer
- ❌ **RF18:** Registro de adesão ao tratamento: o paciente confirma se tomou o medicamento no horário programado (sim / não / tomei depois)
- ❌ **RF19:** Orientações de armazenamento do medicamento (temperatura, luz, umidade) exibidas no cadastro
- ❌ **RF20:** Histórico de medicamentos anteriores (já descontinuados) com data de início e término
- ❌ **RF21:** Exportação do relatório de medicamentos em PDF para levar a consultas ou à farmácia

---

> [!WARNING]
> ## 🩺 Enfermagem (RF22–RF28)

- ✅ **RF22:** Registro de sinais vitais completos: temperatura corporal, pressão arterial (sistólica/diastólica), saturação de oxigênio (SpO2), além de BPM e glicose já existentes
- ✅ **RF23:** Alertas de valores fora do intervalo de referência para cada sinal vital, com orientação de procurar atendimento
- ❌ **RF24:** Cartão de vacinação digital: registro de vacinas tomadas, datas e doses, com alerta de próxima dose
- ❌ **RF25:** Registro de curativos e feridas: descrição, foto (opcional), evolução — útil para pacientes com diabetes ou pós-operatório
- ❌ **RF26:** Lembrete de consultas e exames agendados com data, local e tipo de procedimento
- ❌ **RF27:** Checklist diário de cuidados básicos (higiene, posicionamento, pressão para acamados) — ativável em perfis de cuidado intensivo
- ❌ **RF28:** Registro de alergias a medicamentos, látex ou alimentos com destaque visual no perfil do paciente

---

> [!TIP]
> ## 🏃 Educação Física (RF29–RF35)

- ⚠️ **RF29:** Diário de treinos: o paciente registra tipo de exercício, duração, intensidade (leve, moderado, intenso) e como se sentiu
- ⚠️ **RF30:** Meta semanal de atividade física com progresso visual (ex: 3 de 5 treinos realizados)
- ❌ **RF31:** Cálculo estimado de gasto calórico com base em peso, tipo de atividade e duração
- ❌ **RF32:** Biblioteca de exercícios adaptados por condição de saúde (hipertenso, diabético, gestante) com instruções em texto e/ou vídeo
- ❌ **RF33:** Registro de histórico de peso e IMC ao longo do tempo com gráfico de evolução
- ❌ **RF34:** Lembrete de sedentarismo: alerta ao usuário caso fique mais de X horas sem registrar atividade (configurável)
- ❌ **RF35:** Acompanhamento de ciclo menstrual integrado ao planejamento de exercícios — fases do ciclo e impacto no rendimento

---

> [!CAUTION]
> ## 🧠 Psicologia (RF36–RF42)

- ⚠️ **RF36:** Diário emocional: registro diário de humor expandido (escalas de ansiedade, estresse, bem-estar) com campo de texto livre opcional
- ❌ **RF37:** Gráfico de evolução emocional ao longo das semanas para identificar padrões (ex: sempre ansioso às segundas)
- ❌ **RF38:** Técnicas de regulação emocional acessíveis no app: respiração guiada, grounding 5-4-3-2-1, relaxamento muscular progressivo
- ❌ **RF39:** Registro de qualidade do sono: hora de dormir, hora de acordar, qualidade percebida (1–5) e fatores que afetaram o sono
- ✅ **RF40:** Área de crise: botão de acesso rápido a recursos de saúde mental (CVV, CAPS) e contato de emergência cadastrado pelo paciente
- ⚠️ **RF41:** Questionários validados de triagem: PHQ-9 (depressão), GAD-7 (ansiedade) — com resultado orientativo e recomendação de buscar profissional
- ❌ **RF42:** Lembrete de autocuidado: meditação, hobbies, tempo de descanso — configurável pelo usuário

---

> [!NOTE]
> ## 🦵 Fisioterapia (RF43–RF48)

- ✅ **RF43:** Registro de dor: localização no corpo (mapa corporal), intensidade (escala 0–10 - EVA), frequência e fatores de piora/melhora
- ❌ **RF44:** Plano de exercícios terapêuticos: séries, repetições, frequência semanal — com confirmação de realização pelo paciente
- ❌ **RF45:** Vídeo ou imagem ilustrativa de cada exercício terapêutico para execução correta em casa
- ❌ **RF46:** Registro de mobilidade e amplitude de movimento ao longo do tratamento com evolução gráfica
- ❌ **RF47:** Lembrete de sessão de fisioterapia com local, terapeuta responsável e orientações pré-sessão
- ❌ **RF48:** Registro de postura e ergonomia: alertas de postura para quem trabalha sentado, com intervalos de descanso configuráveis

---

## ⚙️ Requisitos Não Funcionais (RNF01–RNF14)

Todos estes ainda demandam uma infraestrutura mais profunda e não estão totalmente contemplados no MVP atual:

- ⚠️ **RNF01:** Usabilidade — Interface acessível para idosos e pessoas com baixo letramento digital: fontes mínimas de 16px, botões grandes (mín. 44px), linguagem simples e ícones representativos
- ❌ **RNF02:** Desempenho — Telas devem carregar em até 2 segundos em conexão 4G; operações locais (lembretes, registros) devem funcionar offline
- ❌ **RNF03:** Segurança — Dados de saúde armazenados com criptografia AES-256; comunicação via HTTPS/TLS 1.2+; autenticação com token JWT com expiração configurável
- ❌ **RNF04:** Privacidade — Conformidade com a LGPD: consentimento explícito do usuário, política de privacidade acessível, opção de excluir conta e todos os dados
- ⚠️ **RNF05:** Portabilidade — App disponível para Android (mín. versão 8.0) e iOS (mín. versão 13); responsivo para diferentes tamanhos de tela
- ❌ **RNF06:** Confiabilidade — Disponibilidade mínima do servidor de 99,5% (downtime máximo ~44h/ano); backup automático dos dados a cada 24h
- ❌ **RNF07:** Manutenibilidade — Código organizado em arquitetura modular (ex: MVC ou Clean Architecture) com documentação básica e cobertura mínima de 70% de testes unitários
- ❌ **RNF08:** Notificações — Sistema de push notifications confiável para lembretes; notificação deve disparar mesmo com o app fechado
- ⚠️ **RNF09:** Internacionalização — Sistema preparado para suportar ao menos português do Brasil; estrutura de strings externalizadas para facilitar tradução futura
- ❌ **RNF10:** Acessibilidade — Suporte a leitores de tela (TalkBack/VoiceOver), contraste mínimo WCAG AA (4.5:1 para textos) e modo de alto contraste
- ❌ **RNF11:** Escalabilidade — Arquitetura de backend capaz de suportar crescimento de usuários sem reescrita; uso de banco de dados relacional com índices otimizados
- ❌ **RNF12:** Termos de aceite — Exibição obrigatória dos termos de uso e política de privacidade no primeiro acesso, com registro de data/hora da aceitação
- ❌ **RNF13:** Auditoria — Log de alterações em dados sensíveis (medicamentos, sinais vitais) com data, hora e identificador do usuário
- ⚠️ **RNF14:** Tamanho do app — Pacote de instalação inicial máximo de 50MB para facilitar download em conexões limitadas
