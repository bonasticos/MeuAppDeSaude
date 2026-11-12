# Meu App de Saúde (Health Tracker — UNC)

Aplicativo móvel e web *offline-first* desenvolvido em **React Native + Expo + TypeScript** pelos alunos de **Engenharia de Software da Universidade do Contestado (UNC)** em parceria com os cursos da área da Saúde (**Psicologia, Enfermagem, Farmácia, Educação Física, Fisioterapia, Medicina e Odontologia**), para apoiar pacientes no acompanhamento diário de sinais vitais, saúde mental, medicamentos, atividade física e informações das Clínicas-Escola da UNC.

---

## 🚀 Tecnologias e Arquitetura

- **React Native (`0.81`) & Expo (SDK `54`)**: Suporte unificado para Android, iOS e Expo Web.
- **TypeScript (`strict: true`)**: Tipagem estática ponta a ponta em [`src/types/index.ts`](src/types/index.ts).
- **Zustand + AsyncStorage (`src/store/useStore.ts`)**: Estado global persistente com funcionamento imediato offline e migração segura de chaves legadas.
- **Supabase (`@supabase/supabase-js`)**: Camada cloud preparada em [`src/services/supabase.ts`](src/services/supabase.ts), [`src/services/db.ts`](src/services/db.ts) e [`supabase/schema.sql`](supabase/schema.sql) com PostgreSQL, Auth, Storage (`avatars`), Realtime e Row Level Security (RLS).
- **React Navigation (Native Stack)**: Fluxo de navegação modular em [`src/navigation/AppNavigator.tsx`](src/navigation/AppNavigator.tsx) com verificação automática de sessão (`getSession` + `onAuthStateChange`).
- **Acessibilidade & Visualização (`src/components/ClinicaCharts.tsx`)**: Gráficos clínicos leves multiplataforma e interface revisada para acessibilidade de idosos (`RNF01`: fontes ampliadas, alvos de toque `>= 44px` e alto contraste).
- **Recursos Nativos Expo**: `expo-notifications`, `expo-location` (GPS), `expo-print` & `expo-sharing` (PDF), `expo-image-picker`, `expo-auth-session` (Google OAuth) e `expo-web-browser`.

---

## ⚙️ Como Instalar e Rodar

### Pré-requisitos
- **Node.js** `>= 20` e `npm`
- Aplicativo **Expo Go** no celular (opcional, para testar em Android/iOS)

### Passo a passo
```bash
# 1. Clonar o repositório
git clone https://github.com/bonasticos/MeuAppDeSaude.git
cd MeuAppDeSaude

# 2. Instalar dependências
npm install

# 3. (Opcional) Configurar variáveis de ambiente para Supabase e Google OAuth
cp .env.example .env
# Preencha EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY e EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
```

> **Modo local / demonstração:** Mesmo sem configurar o `.env`, o app inicia normalmente no modo offline usando `admin` / `admin` ou o botão **Entrar sem Login (Acesso Rápido)**.

### Comandos úteis
```bash
# Rodar no navegador (Expo Web)
npm run web

# Iniciar servidor Expo (QR Code para Expo Go no Android/iOS)
npm start

# Validar tipagem TypeScript
npx tsc --noEmit
```

Para habilitar a persistência na nuvem, crie um projeto no painel do **Supabase** e execute o script [`supabase/schema.sql`](supabase/schema.sql) no **SQL Editor** (que também cria e configura o bucket `avatars` no Supabase Storage).

---

## 🗂️ Estrutura do Projeto

```text
src/
├── components/
│   └── ClinicaCharts.tsx       # Gráfico em barras acessível para evolução clínica (RF33, RF37, RF46)
├── navigation/
│   └── AppNavigator.tsx        # Rotas + listener onAuthStateChange e persistência de sessão
├── screens/
│   ├── Login/                  # Autenticação (Supabase + Google OAuth + recuperação de senha + admin/admin + acesso rápido)
│   ├── Cadastro/               # Criação de conta (Supabase signUp + perfil inicial + modo offline)
│   ├── Inicial/                # Dashboard unificado + acesso institucional à UNC
│   ├── Perfil/                 # IMC, gráfico de Peso/IMC, comorbidades, alergias, meta de água e diário de treinos (kcal)
│   ├── SinaisVitais/           # BPM, glicemia, PA, SpO2, temperatura, gráfico de evolução, checklist e CRUD
│   ├── Humor/                  # Diário de humor, gráfico semanal, linha do tempo e questionários PHQ-9 / GAD-7
│   ├── Lembretes/              # Alarmes editáveis (useStore), estoque completo, baixa automática, histórico e PDF
│   ├── Fisioterapia/           # Registro de dor (escala EVA), gráfico de evolução e histórico
│   ├── Configuracoes/          # Edição de perfil, avatar (Storage + galeria), recuperação de senha e logout
│   └── SobreUNC/               # Informações da UNC, Clínicas-Escola e localização por GPS
├── services/
│   ├── supabase.ts             # Cliente Supabase + detecção de configuração (.env)
│   └── db.ts                   # Funções CRUD, Realtime e upload de avatar (Supabase Storage)
├── store/
│   └── useStore.ts             # Store global Zustand + AsyncStorage
└── types/
    └── index.ts                # Interfaces TypeScript do domínio clínico
supabase/
└── schema.sql                  # Schema PostgreSQL, políticas RLS e bucket Storage 'avatars'
```

---

## 🛠️ Status Atual das Telas

1. **🔑 Login (`src/screens/Login`)**
   - **Funciona:** Acesso demo (`admin` / `admin`), botão **Entrar sem Login (Acesso Rápido)**, login real com Supabase (`signInWithPassword` e Google OAuth via `signInWithIdToken` quando `.env` estiver configurado), modal de recuperação de senha (`resetPasswordForEmail`), persistência automática de sessão no `AppNavigator` (`getSession` + `onAuthStateChange`) e acesso à tela **Sobre a UNC**.

2. **📝 Cadastro (`src/screens/Cadastro`)**
   - **Funciona:** Cadastro integrado ao `supabase.auth.signUp` (criando registro inicial na tabela `perfis` quando a sessão é autenticada) com fallback local offline (`useStore`), nome completo, validação de senha e confirmação.
   - **Pendente:** Aceite obrigatório dos Termos de Uso e Política de Privacidade LGPD ([#26](https://github.com/bonasticos/MeuAppDeSaude/issues/26)).

3. **🏠 Inicial (`src/screens/Inicial`)**
   - **Funciona:** Exibe saudação e avatar do usuário no `useStore`, os **4 cartões principais por curso** (**Saúde Mental / Psicologia**, **Sinais Vitais / Enfermagem**, **Lembretes / Farmácia** e **Corpo & Movimento / Ed. Física & Fisioterapia**) padronizados com acessibilidade `RNF01`, além do **cartão promocional institucional da UNC** (`Explorar a UNC & Sobre Nós`) e acesso às `Configurações`.
   - **Observação:** A tela `Fisioterapia` já existe nas rotas, mas sua unificação por abas dentro de `Corpo & Movimento` está planejada na issue [#21](https://github.com/bonasticos/MeuAppDeSaude/issues/21).

4. **⚙️ Configurações (`src/screens/Configuracoes`)**
   - **Funciona:** Atualiza nome, telefone e foto de perfil via `expo-image-picker` (com upload automático para o bucket `avatars` no Supabase Storage e sync em `perfis`), recuperação de senha real via modal (`supabase.auth.resetPasswordForEmail`), `signOut` real no Supabase + limpeza do `useStore` ao sair e acesso à tela `SobreUNC`.
   - **Pendente:** Botão definitivo de exclusão de conta e dados LGPD ([#26](https://github.com/bonasticos/MeuAppDeSaude/issues/26)).

5. **🧠 Saúde Mental — Psicologia & Humor (`src/screens/Humor`)**
   - **Funciona:** Seleção de humor (Feliz, Triste, Nervoso, Ansioso) com fator de influência, **gráfico semanal de frequência de humores (`RF37`)**, **questionários validados PHQ-9 (depressão) e GAD-7 (ansiedade)** com cálculo automático de escore, faixa de risco, aviso de acolhimento CVV (`188`) em casos críticos e linha do tempo integrada com Sinais Vitais (`useStore`).
   - **Pendente:** Botão SOS Crise + modal de respiração guiada/grounding ([#7](https://github.com/bonasticos/MeuAppDeSaude/issues/7)) e campo de texto livre + registro de sono ([#35](https://github.com/bonasticos/MeuAppDeSaude/issues/35)).

6. **🩺 Sinais Vitais — Enfermagem (`src/screens/SinaisVitais`)**
   - **Funciona:** Seletor vertical (`VerticalWheelPicker`) para BPM, Glicemia (com tipo obrigatório: Jejum, Pré-prandial ou Pós-prandial), Pressão Sistólica/Diastólica (com verificação de PA convergente/divergente) e SpO2; campo de **Temperatura Corporal (°C)** com alertas automáticos de **Febre (`> 37.8 °C`)** e **Hipotermia (`< 35.0 °C`)**; **gráfico interativo de evolução clínica** (BPM, Glicemia, Pressão, SpO2 e Temperatura); **Checklist Diário de Cuidados Básicos e Higiene** persistido por data; alertas via `expo-notifications`; e **edição e exclusão** completas dos registros salvos no `useStore`.

7. **⏰ Lembretes & Farmácia (`src/screens/Lembretes`)**
   - **Funciona:** Estado unificado no `useStore` com migração automática das chaves legadas (`#16`); **edição completa de lembretes** com reagendamento de alarme (`RF14`); **baixa automática de `-1` unidade no estoque** ao marcar um lembrete de remédio como tomado (`RF18`); cadastro e edição de medicamentos com **médico prescritor (`RF15`)**, **validade (`RF17`)** e **orientação de armazenamento (`RF19`)**; **alerta visual vermelho de Estoque Baixo (`<= 5`)** e de vencimento; **Histórico de Medicamentos Descontinuados (`RF20`)** com opção de reativação; alerta de interação básica (`AAS` / `Aspirina`); e exportação do estoque completo em PDF/impressão (`expo-print` + `expo-sharing` com suporte a Web).
   - **Pendente:** Ampliação do PDF para prontuário resumo do paciente ([#21](https://github.com/bonasticos/MeuAppDeSaude/issues/21)) e serviço centralizado de notificações com dias da semana ([#25](https://github.com/bonasticos/MeuAppDeSaude/issues/25)).

8. **🏃 Corpo & Movimento — IMC, Perfil & Educação Física (`src/screens/Perfil`)**
   - **Funciona:** Persistência completa no `useStore` (`idade`, `peso`, `altura`, `sexo`, `imc`, **`comorbidades`**, **`alergias`**); **gráfico de evolução de Peso e IMC (`RF33`)**; destaque visual em alerta vermelho no topo do perfil quando há alergias registradas; cálculo automático da **Meta Diária de Água (`35 ml × peso`)**; frequência de atividades e meta semanal; biblioteca de exercícios em modal; e **Diário de Treinos** com **duração (min)**, **intensidade** (`Leve`, `Moderado`, `Intenso`) e **cálculo estimado de gasto calórico (`kcal`)**.
   - **Pendente:** Unificação em abas com `Fisioterapia` ([#21](https://github.com/bonasticos/MeuAppDeSaude/issues/21)).

9. **🦵 Fisioterapia (`src/screens/Fisioterapia`)**
   - **Funciona:** Registro diário do nível de dor na escala EVA (`0` a `10`), **gráfico de evolução da dor com classificação de gravidade (`RF46`)** e histórico salvo no `useStore`, já padronizados para alto contraste e acessibilidade (`RNF01`).
   - **⚠️ Mocks / Pendentes:** Os botões "Exercícios de Hoje" e "Lembretes de Postura" ainda estão sem ação ([#8](https://github.com/bonasticos/MeuAppDeSaude/issues/8)), além da seleção de região corporal/tipo de dor ([#9](https://github.com/bonasticos/MeuAppDeSaude/issues/9)).

10. **🎓 Sobre a UNC & Clínicas-Escola (`src/screens/SobreUNC`)**
    - **Funciona:** Vitrine institucional da **Engenharia de Software da UNC** e das **Clínicas-Escola** dos cursos de **Medicina, Fisioterapia, Odontologia, Psicologia e Enfermagem**, abertura dos detalhes de cada curso em janela/modal sem sair do aplicativo e cálculo de distância/rotas via **GPS (`expo-location`)** para os campi da UNC.

---

<details>
<summary>📋 Ver visão geral dos Requisitos do Sistema</summary>

Consulte o documento completo com o status atualizado de cada requisito em [`REQUISITOS.md`](REQUISITOS.md).

</details>

---

## 🤝 Guia de Contribuição

Este repositório segue fluxo colaborativo por branches e Pull Requests entre as turmas das fases do curso de Engenharia de Software.

### Branches
> **Evite commits diretos na `master` em tarefas em equipe.** Crie uma branch dedicada por issue e abra um Pull Request.

| Prefixo | Uso | Exemplo |
|---|---|---|
| `feature/` | nova funcionalidade | `feature/modais-fisio` |
| `fix/` | correção de bug | `fix/alerta-estoque` |
| `docs/` | documentação | `docs/atualiza-readme` |
| `refactor/` | refatoração sem mudar comportamento | `refactor/tabs-perfil-fisio` |
| `chore/` | manutenção, dependências, CI | `chore/github-actions-ci` |

### Padrão de Commits (Conventional Commits)
```text
tipo(escopo opcional): descrição curta no imperativo
```
Tipos recomendados: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`.  
Exemplos:
```text
feat(psico): adiciona botao SOS crise e respiracao guiada
fix(farmacia): valida estoque negativo ao confirmar dose
docs: atualiza README e REQUISITOS com entregas do Ciclo 3
```

### Pull Requests & Issues
- Vincule sempre a issue relacionada na descrição do PR usando `Closes #X`.
- Rode `npx tsc --noEmit` antes de abrir o PR.
- **Nunca** commitar credenciais reais ou o arquivo `.env` (mantenha apenas o `.env.example` versionado).

---

## 🚧 Próximos Passos (Backlog Aberto por Fase)

### 2ª Fase (UI, Modais e Recursos Específicos)
- [ ] **Psicologia**: Botão SOS Crise e modal de respiração guiada / grounding ([#7](https://github.com/bonasticos/MeuAppDeSaude/issues/7)) + Diário de texto livre e registro de sono ([#35](https://github.com/bonasticos/MeuAppDeSaude/issues/35)).
- [ ] **Fisioterapia**: Modais de Exercícios de Hoje e Lembretes de Postura ([#8](https://github.com/bonasticos/MeuAppDeSaude/issues/8)) + Seleção de região corporal e tipo de dor ([#9](https://github.com/bonasticos/MeuAppDeSaude/issues/9)).

### 4ª Fase (Refatoração UI & Prontuário)
- [ ] **Refatoração UI & PDF**: Unificação por abas de `Perfil` + `Fisioterapia` em `Corpo & Movimento` e ampliação do relatório PDF para prontuário resumido do paciente ([#21](https://github.com/bonasticos/MeuAppDeSaude/issues/21)).

### 6ª Fase (Supabase Provisioning, Offline-First Sync, LGPD e DevOps)
- [ ] **Supabase Cloud**: Provisionar o projeto no painel do Supabase, executar [`supabase/schema.sql`](supabase/schema.sql) (incluindo bucket `avatars`) e preencher `.env` ([#22](https://github.com/bonasticos/MeuAppDeSaude/issues/22)).
- [ ] **Offline-First Sync**: Sincronizar automaticamente todas as actions do `useStore` com [`src/services/db.ts`](src/services/db.ts) ([#24](https://github.com/bonasticos/MeuAppDeSaude/issues/24)).
- [ ] **Arquitetura, LGPD & CI**: Serviço centralizado de notificações `src/services/notifications.ts` ([#25](https://github.com/bonasticos/MeuAppDeSaude/issues/25)), aceite LGPD + exclusão definitiva de conta e dados ([#26](https://github.com/bonasticos/MeuAppDeSaude/issues/26)), CI de TypeScript via GitHub Actions e revisão de componentes base ([#27](https://github.com/bonasticos/MeuAppDeSaude/issues/27)).
