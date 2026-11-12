# 📋 Documento de Requisitos do Sistema (DRS)

> [!NOTE]
> **Status:** 
> ✅ Implementado | ⚠️ Parcial / Em andamento | ❌ Pendente

---

> [!IMPORTANT]
> ## 👤 Paciente — Acesso & Cadastro (RF01–RF14)

- ⚠️ **RF01:** Tela de login e cadastro com e-mail, senha e confirmação de senha — Login com `admin/admin`, acesso rápido sem login, Supabase Auth e Google OAuth já integrados (`Login`); falta conectar `Cadastro`, recuperação de senha e listener `onAuthStateChange` ([#23](https://github.com/bonasticos/MeuAppDeSaude/issues/23)).
- ✅ **RF02:** Cadastro de perfil do paciente: idade, peso, altura, sexo (`Masculino` / `Feminino` / `Outro`), comorbidades e alergias com persistência e edição no `useStore` (`Perfil`). *(Nota: confirmação por código OTP segue pendente em fluxo de auth).*
- ✅ **RF04:** Cálculo automático de IMC com base nos dados cadastrados e exibição da classificação (Abaixo do peso, Normal, Sobrepeso, Obesidade).
- ✅ **RF05:** Coleta de informações médicas/comorbidades no `Perfil`: **Diabetes**, **Hipertensão**, **Problema Cardíaco** e **Nenhuma**, persistidas no `useStore`.
- ✅ **RF06:** Registro, histórico, edição e exclusão de BPM (batimentos por minuto) na tela `SinaisVitais`.
- ✅ **RF07:** Registro (com tipo Jejum, Pré-prandial ou Pós-prandial), histórico, edição e exclusão de glicose (`mg/dL`) na tela `SinaisVitais`.
- ⚠️ **RF08:** Lembretes de medicamentos com cadastro de nome, dose, frequência e alarme diário via `expo-notifications` (`Lembretes`); suporte avançado de periodicidades e serviço centralizado pendentes ([#16](https://github.com/bonasticos/MeuAppDeSaude/issues/16), [#25](https://github.com/bonasticos/MeuAppDeSaude/issues/25)).
- ✅ **RF09:** Aferição diária de humor (`Feliz`, `Triste`, `Nervoso`, `Ansioso`) com fatores de influência e linha do tempo cronológica na tela `Humor`.
- ✅ **RF10:** Registro de nível de atividade física (`Ativo (Pratico Exercícios)`, `De Vez em Quando`, `Não Pratico`) com persistência no `useStore` (`Perfil`).
- ⚠️ **RF12:** Lembretes de ações e exercícios físicos com horário diário em `Lembretes`; seleção de dias específicos da semana pendente ([#25](https://github.com/bonasticos/MeuAppDeSaude/issues/25)).
- ✅ **RF13:** Card automático de **Meta Diária de Água** (`35 ml × peso corporal`) com conversão em litros e copos de `250 ml` na tela `Perfil`.
- ⚠️ **RF14:** Gerenciamento de lembretes — criação, marcação como concluído e exclusão já funcionam; edição de lembretes existentes pendente ([#17](https://github.com/bonasticos/MeuAppDeSaude/issues/17)).

---

> [!TIP]
> ## 💊 Farmácia (RF15–RF21)

- ⚠️ **RF15:** Cadastro de medicamentos com nome, dosagem, forma farmacêutica e estoque (`Lembretes`); falta campo de médico prescritor ([#13](https://github.com/bonasticos/MeuAppDeSaude/issues/13)).
- ❌ **RF17:** Controle completo de estoque domiciliar: data de validade e alerta visual de estoque baixo (`<= 5`) ou medicamento próximo do vencimento ([#13](https://github.com/bonasticos/MeuAppDeSaude/issues/13)).
- ❌ **RF18:** Baixa automática de estoque (`-1` unidade) ao confirmar que o medicamento foi tomado no horário programado ([#17](https://github.com/bonasticos/MeuAppDeSaude/issues/17)).
- ❌ **RF19:** Orientações de armazenamento do medicamento (temperatura, luz, umidade) exibidas no cadastro ([#13](https://github.com/bonasticos/MeuAppDeSaude/issues/13)).
- ❌ **RF20:** Histórico de medicamentos anteriores (já descontinuados) com data de início e término ([#17](https://github.com/bonasticos/MeuAppDeSaude/issues/17)).
- ⚠️ **RF21:** Exportação do relatório de medicamentos em PDF já funciona (`expo-print` + `expo-sharing`); ampliação para prontuário resumo do paciente pendente ([#21](https://github.com/bonasticos/MeuAppDeSaude/issues/21)).

---

> [!WARNING]
> ## 🩺 Enfermagem (RF22–RF28)

- ✅ **RF22:** Registro completo de sinais vitais na tela `SinaisVitais`: **Temperatura Corporal (`°C`)**, Pressão Arterial (`sistólica/diastólica`), Saturação de Oxigênio (`SpO2`), BPM e Glicemia — com edição/exclusão e exibição integrada na linha do tempo de `Humor`.
- ✅ **RF23:** Alertas automáticos (em tempo real com debounce e ao salvar) para valores fora da faixa de referência, incluindo **Febre (`> 37.8 °C`)**, **Hipotermia (`< 35.0 °C`)**, pressão convergente/divergente e glicemia por contexto.
- ⚠️ **RF26:** Lembrete genérico com categoria *Ida a consultas* disponível em `Lembretes`; campos estruturados para local e procedimento seguem pendentes.
- ✅ **RF27:** **Checklist Diário de Cuidados Básicos e Higiene** (6 itens práticos de higiene, hidratação, mudança de decúbito, inspeção de pele, medicação e ambiente) com modal interativo e progresso diário salvo no `useStore`.
- ✅ **RF28:** Cadastro de **Alergias** (medicamentos, alimentos, látex) na tela `Perfil`, exibido em **banner vermelho de destaque clínico** no topo do perfil do paciente.

---

> [!TIP]
> ## 🏃 Educação Física (RF29–RF35)

- ✅ **RF29:** **Diário de Treinos** no `Perfil`: registro de descrição, **Duração (minutos)** e **Intensidade (`Leve`, `Moderado`, `Intenso`)** salvos no `useStore`.
- ✅ **RF30:** **Meta Semanal** de atividade física com barra de progresso visual (`X de 5 treinos`) em `Perfil`.
- ✅ **RF31:** **Cálculo estimado de gasto calórico (`kcal`)** calculado ao vivo e persistido com base no peso corporal, duração e intensidade (MET).
- ⚠️ **RF32:** Biblioteca local de exercícios com instruções em modal (`Perfil`); falta segmentação adaptada por condição de saúde (hipertenso, diabético, gestante).
- ❌ **RF33:** Registro histórico e gráfico de evolução de peso e IMC ao longo do tempo ([#20](https://github.com/bonasticos/MeuAppDeSaude/issues/20)).

---

> [!CAUTION]
> ## 🧠 Psicologia (RF36–RF42)

- ⚠️ **RF36:** Diário emocional — registro de humor com fatores de influência já funciona; campo de texto livre opcional (*Como foi seu dia?*) pendente ([#35](https://github.com/bonasticos/MeuAppDeSaude/issues/35)).
- ❌ **RF37:** Gráfico de evolução emocional ao longo das semanas para identificar padrões ([#20](https://github.com/bonasticos/MeuAppDeSaude/issues/20)).
- ❌ **RF38:** Modal interativo passo a passo com técnicas de regulação emocional (respiração guiada e grounding `5-4-3-2-1`) ([#7](https://github.com/bonasticos/MeuAppDeSaude/issues/7)).
- ❌ **RF40:** Botão de destaque **SOS / Preciso de Ajuda** na tela `Humor` com modal de contatos de crise (CVV `188`, SAMU `192`, CAPS) ([#7](https://github.com/bonasticos/MeuAppDeSaude/issues/7)). *(Obs.: resultados críticos do PHQ-9/GAD-7 já exibem alerta imediato com orientação ao CVV 188).*
- ✅ **RF41:** Questionários validados de triagem **PHQ-9 (depressão)** e **GAD-7 (ansiedade)** na tela `Humor`, com cálculo automático de escore, classificação orientativa de risco e persistência na linha do tempo (`useStore`).
- ❌ **RF42:** Registro simples de sono e lembretes configuráveis de autocuidado ([#35](https://github.com/bonasticos/MeuAppDeSaude/issues/35)).

---

> [!NOTE]
> ## 🦵 Fisioterapia (RF43–RF48)

- ⚠️ **RF43:** Escala de dor EVA (`0` a `10`) e histórico de evolução já implementados (`Fisioterapia`); seleção de região corporal e tipo de dor pendentes ([#9](https://github.com/bonasticos/MeuAppDeSaude/issues/9)).
- ❌ **RF45:** Modal de Exercícios Terapêuticos de Hoje com instruções visuais ([#8](https://github.com/bonasticos/MeuAppDeSaude/issues/8)).
- ❌ **RF46:** Gráfico de evolução da dor e amplitude funcional ao longo do tratamento ([#20](https://github.com/bonasticos/MeuAppDeSaude/issues/20)).
- ❌ **RF47:** Lembrete de sessão de fisioterapia com local, terapeuta responsável e orientações pré-sessão.
- ❌ **RF48:** Modal de Lembretes de Postura e ergonomia ([#8](https://github.com/bonasticos/MeuAppDeSaude/issues/8)).

---

> [!NOTE]
> ## 🎓 Extensão Acadêmica & Clínicas-Escola da UNC (Implementado)

- ✅ **SobreUNC:** Módulo institucional do curso de **Engenharia de Software da UNC** integrado à tela `Inicial`, `Login` e `Configuracoes`, com informações detalhadas das **Clínicas-Escola** (**Medicina, Fisioterapia, Odontologia, Psicologia e Enfermagem**) abertas em modais/janelas sem sair do app e **localização via GPS (`expo-location`)** para calcular distância e rotas até os campi da UNC.

---

## ⚙️ Requisitos Não Funcionais (RNF)

- ⚠️ **RNF01:** Usabilidade — Telas novas (`Humor`, `SinaisVitais`, `Perfil`, `SobreUNC`) seguem contraste, rótulos claros e alvos amplos; auditoria completa nos demais arquivos `styles.ts` para acessibilidade sênior (`>= 16px`, botões `>= 44px`) pendente ([#14](https://github.com/bonasticos/MeuAppDeSaude/issues/14)).
- ⚠️ **RNF02:** Desempenho Offline-First — Operações locais via `Zustand` + `AsyncStorage` funcionam offline em segundos; sincronização em segundo plano com o Supabase (`db.ts`) pendente ([#24](https://github.com/bonasticos/MeuAppDeSaude/issues/24)).
- ⚠️ **RNF03:** Segurança — Cliente Supabase preparado com HTTPS e RLS definido em `supabase/schema.sql`; fluxo completo de autenticação/sessão e revisão de tokens pendente ([#23](https://github.com/bonasticos/MeuAppDeSaude/issues/23)).
- ❌ **RNF04:** Privacidade / LGPD — Aceite explícito no cadastro e funcionalidade de exclusão definitiva da conta e dados ([#26](https://github.com/bonasticos/MeuAppDeSaude/issues/26)).
- ✅ **RNF05:** Portabilidade — Aplicativo compatível com Android, iOS (Expo SDK 54) e navegador (Expo Web).
- ❌ **RNF06:** Confiabilidade — Sincronização automática bidirecional e backup em nuvem via Supabase ([#24](https://github.com/bonasticos/MeuAppDeSaude/issues/24)).
- ⚠️ **RNF07:** Tamanho do app — Dependências enxutas compatíveis com build mobile leve (< 50 MB).
- ⚠️ **RNF15:** Refatoração de UI — Telas de `Humor`/`Psicologia`, `SinaisVitais`/`Enfermagem` e `Perfil`/`Educação Física` já consolidadas; falta unificar `Fisioterapia` em abas dentro de `Corpo & Movimento` e criar componentes base reutilizáveis em `src/components/` ([#21](https://github.com/bonasticos/MeuAppDeSaude/issues/21), [#27](https://github.com/bonasticos/MeuAppDeSaude/issues/27)).
