# 📋 Documento de Requisitos do Sistema (DRS)

> [!NOTE]
> **Status:** 
> ✅ Implementado | ⚠️ Parcial / Mock | ❌ Pendente

---

> [!IMPORTANT]
> ## 👤 Paciente — Acesso & Cadastro (RF01–RF14)

- ⚠️ **RF01:** Tela de login e cadastro com e-mail, senha e confirmação de senha (Login Automatico com o GOOGLE)
- ✅ **RF02:** Cadastro de perfil do paciente: idade, peso, altura, sexo (Masculino / Feminino / Outro) com opção de edição futura
- ✅ **RF04:** Cálculo automático de IMC com base nos dados cadastrados e exibição da classificação (Abaixo do peso, Normal, Sobrepeso, Obesidade)
- ❌ **RF05:** Após IMC, coleta de informações médicas: diabetes, problema cardíaco, hipertensão
- ✅ **RF06:** Registro e histórico de BPM (batimentos por minuto) com opção de editar e salvar medições futuras
- ✅ **RF07:** Registro e histórico de glicose (mg/dL) com opção de editar e salvar medições futuras
- ⚠️ **RF08:** Lembretes de medicamentos com cadastro de nome, dose, periodicidade (diária, semanal, mensal, trimestral, semestral) e alarme em horário específico
- ⚠️ **RF09:** Aferição diária de humor: Feliz, Triste, Nervoso, Ansioso — com histórico por data
- ❌ **RF10:** Registro de nível de atividade física: Ativo, De vez em quando, Não pratico
- ✅ **RF12:** Lembretes de exercícios físicos: alongamento, academia, pilates — com dias e horários configuráveis
- ❌ **RF13:** Lembrete de hidratação com sugestão de quantidade de água calculada com base no peso, IMC e nível de atividade
- ⚠️ **RF14:** Gerenciamento de lembretes: editar frequência, dias da semana e horário de qualquer lembrete ativo

---

> [!TIP]
> ## 💊 Farmácia (RF15–RF21)

- ❌ **RF15:** Cadastro de medicamentos em uso: nome, dosagem, forma farmacêutica (comprimido, xarope, injeção, etc.) e prescritor
- ❌ **RF17:** Controle de estoque domiciliar: quantidade em casa, data de vencimento, alerta quando o estoque está baixo ou o medicamento vai vencer
- ❌ **RF18:** Registro de adesão ao tratamento: o paciente confirma se tomou o medicamento no horário programado (sim / não / tomei depois)
- ❌ **RF19:** Orientações de armazenamento do medicamento (temperatura, luz, umidade) exibidas no cadastro
- ❌ **RF20:** Histórico de medicamentos anteriores (já descontinuados) com data de início e término
- ❌ **RF21:** Exportação do relatório de medicamentos em PDF para levar a consultas ou à farmácia

---

> [!WARNING]
> ## 🩺 Enfermagem (RF22–RF28)

- ✅ **RF22:** Registro de sinais vitais completos: temperatura corporal, pressão arterial (sistólica/diastólica), saturação de oxigênio (SpO2), além de BPM e glicose já existentes. Ao salvar, exibir também no histórico da tela de humor.
- ✅ **RF23:** Alertas de valores fora do intervalo de referência para cada sinal vital, com orientação de procurar atendimento
- ❌ **RF26:** Lembrete de consultas e exames agendados com data, local e tipo de procedimento
- ❌ **RF27:** Checklist diário de cuidados básicos (higiene, posicionamento, pressão para acamados)
- ❌ **RF28:** Registro de alergias a medicamentos, látex ou alimentos com destaque visual no perfil do paciente

---

> [!TIP]
> ## 🏃 Educação Física (RF29–RF35)

- ❌ **RF29:** Diário de treinos: o paciente registra tipo de exercício, duração, intensidade (leve, moderado, intenso) e como se sentiu
- ❌ **RF30:** Meta semanal de atividade física com progresso visual (ex: 3 de 5 treinos realizados)
- ❌ **RF31:** Cálculo estimado de gasto calórico com base em peso, tipo de atividade e duração
- ❌ **RF32:** Biblioteca de exercícios adaptados por condição de saúde (hipertenso, diabético, gestante) com instruções em texto e/ou vídeo
- ❌ **RF33:** Registro de histórico de peso e IMC ao longo do tempo com gráfico de evolução

---

> [!CAUTION]
> ## 🧠 Psicologia (RF36–RF42)

- ✅ **RF36:** Diário emocional: registro diário de humor expandido (escalas de ansiedade, estresse, bem-estar) com campo de texto livre opcional
- ❌ **RF37:** Gráfico de evolução emocional ao longo das semanas para identificar padrões (ex: sempre ansioso às segundas)
- ❌ **RF38:** Técnicas de regulação emocional acessíveis no app: respiração guiada, grounding 5-4-3-2-1, relaxamento muscular progressivo
- ❌ **RF40:** Área de crise: botão de acesso rápido a recursos de saúde mental (CVV, CAPS) e contato de emergência cadastrado pelo paciente
- ❌ **RF41:** Questionários validados de triagem: PHQ-9 (depressão), GAD-7 (ansiedade) — com resultado orientativo e recomendação de buscar profissional
- ❌ **RF42:** Lembrete de autocuidado: meditação, hobbies, tempo de descanso — configurável pelo usuário

---

> [!NOTE]
> ## 🦵 Fisioterapia (RF43–RF48)

- ❌ **RF45:** Vídeo ou imagem ilustrativa de cada exercício terapêutico para execução correta em casa
- ❌ **RF46:** Registro de mobilidade e amplitude de movimento ao longo do tratamento com evolução gráfica
- ❌ **RF47:** Lembrete de sessão de fisioterapia com local, terapeuta responsável e orientações pré-sessão
- ❌ **RF48:** Registro de postura e ergonomia: alertas de postura para quem trabalha sentado, com intervalos de descanso configuráveis

---

## ⚙️ Requisitos Não Funcionais (RNF)

- ⚠️ **RNF01:** Usabilidade — Interface acessível para idosos e pessoas com baixo letramento digital: fontes mínimas de 16px, botões grandes (mín. 44px), linguagem simples e ícones representativos
- ❌ **RNF02:** Desempenho — Telas devem carregar em até 2 segundos em conexão 4G; operações locais (lembretes, registros) devem funcionar offline
- ❌ **RNF03:** Segurança — Dados de saúde armazenados com criptografia AES-256; comunicação via HTTPS/TLS 1.2+; autenticação com token JWT com expiração configurável
- ❌ **RNF04:** Privacidade — Conformidade com a LGPD: consentimento explícito do usuário, política de privacidade acessível, opção de excluir conta e todos os dados
- ⚠️ **RNF05:** Portabilidade — App disponível para Android (mín. versão 8.0) e iOS (mín. versão 13); responsivo para diferentes tamanhos de tela
- ❌ **RNF06:** Confiabilidade — Disponibilidade mínima do servidor de 99,5% (downtime máximo ~44h/ano); backup automático dos dados a cada 24h
- ⚠️ **RNF07:** Tamanho do app — Pacote de instalação inicial máximo de 50MB para facilitar download em conexões limitadas
- ❌ **RNF15:** Refatoração de UI — Mesclar telas do aplicativo que possuem comportamentos e componentes repetitivos para otimizar a manutenção e o reuso
