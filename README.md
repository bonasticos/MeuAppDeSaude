# Meu App de Saúde (Health Tracker — UNC)

Aplicativo móvel e web *offline-first* desenvolvido em **React Native + Expo + TypeScript** pelos alunos de **Engenharia de Software da Universidade do Contestado (UNC)** em parceria com os cursos da área da Saúde (**Psicologia, Enfermagem, Farmácia, Educação Física, Fisioterapia, Medicina e Odontologia**), para apoiar pacientes no acompanhamento diário de sinais vitais, saúde mental, medicamentos, atividade física e informações das Clínicas-Escola da UNC.

---

## 🚀 Tecnologias e Arquitetura

- **React Native (`0.81`) & Expo (SDK `54`)**: Suporte unificado para Android, iOS e Expo Web.
- **TypeScript (`strict: true`)**: Tipagem estática ponta a ponta em [`src/types/index.ts`](src/types/index.ts).
- **Zustand + AsyncStorage (`src/store/useStore.ts`)**: Estado global persistente com funcionamento imediato offline.
- **Supabase (`@supabase/supabase-js`)**: Camada cloud preparada em [`src/services/supabase.ts`](src/services/supabase.ts), [`src/services/db.ts`](src/services/db.ts) e [`supabase/schema.sql`](supabase/schema.sql) com PostgreSQL, Auth, Realtime e Row Level Security (RLS).
- **React Navigation (Native Stack)**: Fluxo de navegação modular em [`src/navigation/AppNavigator.tsx`](src/navigation/AppNavigator.tsx).
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

Para habilitar a persistência na nuvem, execute o script [`supabase/schema.sql`](supabase/schema.sql) no **SQL Editor** do painel do seu projeto Supabase.

---

## 🗂️ Estrutura do Projeto

```text
src/
├── navigation/
│   └── AppNavigator.tsx        # Rotas (Login, Cadastro, Perfil, Inicial, SinaisVitais, Humor, Lembretes, Fisioterapia, Configuracoes, SobreUNC)
├── screens/
│   ├── Login/                  # Autenticação (Supabase + Google OAuth + admin/admin + acesso rápido)
│   ├── Cadastro/               # Criação de conta
│   ├── Inicial/                # Dashboard unificado + acesso institucional à UNC
│   ├── Perfil/                 # IMC, comorbidades, alergias, meta de água e diário de treinos (kcal)
│   ├── SinaisVitais/           # BPM, glicemia, PA, SpO2, temperatura, checklist de cuidados e CRUD
│   ├── Humor/                  # Diário de humor, linha do tempo e questionários PHQ-9 / GAD-7
│   ├── Lembretes/              # Alarmes locais, estoque da farmácia e geração de PDF
│   ├── Fisioterapia/           # Registro de dor (escala EVA) e histórico
│   ├── Configuracoes/          # Edição de perfil, avatar da galeria e logout
│   └── SobreUNC/               # Informações da UNC, Clínicas-Escola e localização por GPS
├── services/
│   ├── supabase.ts             # Cliente Supabase + detecção de configuração (.env)
│   └── db.ts                   # Funções CRUD e Realtime para tabelas no PostgreSQL
├── store/
│   └── useStore.ts             # Store global Zustand + AsyncStorage
└── types/
    └── index.ts                # Interfaces TypeScript do domínio clínico
supabase/
└── schema.sql                  # Schema PostgreSQL e políticas RLS
```

---

## 🛠️ Status Atual das Telas

1. **🔑 Login (`src/screens/Login`)**
   - **Funciona:** Acesso demo (`admin` / `admin`), botão **Entrar sem Login (Acesso Rápido)**, login real com Supabase (`signInWithPassword` / Google OAuth quando `.env` estiver configurado) e rodapé de acesso à tela **Sobre a UNC**.
   - **Pendente:** Persistência automática de sessão via `onAuthStateChange` no `AppNavigator` ([#23](https://github.com/bonasticos/MeuAppDeSaude/issues/23)).

2. **📝 Cadastro (`src/screens/Cadastro`)**
   - **Funciona:** Validação de campos obrigatórios e confirmação de senha no fluxo local, salvando telefone no `useStore` e direcionando para `Perfil`.
   - **Pendente:** Integração com `supabase.auth.signUp` ([#23](https://github.com/bonasticos/MeuAppDeSaude/issues/23)) e aceite obrigatório dos Termos / Política LGPD ([#26](https://github.com/bonasticos/MeuAppDeSaude/issues/26)).

3. **🏠 Inicial (`src/screens/Inicial`)**
   - **Funciona:** Exibe saudação e avatar do usuário no `useStore`, os **4 cartões principais por curso** (**Saúde Mental / Psicologia**, **Sinais Vitais / Enfermagem**, **Lembretes / Farmácia** e **Corpo & Movimento / Ed. Física & Fisioterapia**), além do **cartão promocional institucional da UNC** (`Explorar a UNC & Sobre Nós`) e acesso às `Configurações`.
   - **Observação:** A tela `Fisioterapia` já existe nas rotas, mas sua unificação por abas dentro de `Corpo & Movimento` está planejada na issue [#21](https://github.com/bonasticos/MeuAppDeSaude/issues/21).

4. **⚙️ Configurações (`src/screens/Configuracoes`)**
   - **Funciona:** Atualiza nome, telefone e foto de perfil via `expo-image-picker`, dá acesso à tela `SobreUNC` e limpa os dados locais ao sair (`logout`).
   - **Pendente:** Recuperação de senha real via Supabase ([#23](https://github.com/bonasticos/MeuAppDeSaude/issues/23)) e botão definitivo de exclusão de conta/dados LGPD ([#26](https://github.com/bonasticos/MeuAppDeSaude/issues/26)).

5. **🧠 Saúde Mental — Psicologia & Humor (`src/screens/Humor`)**
   - **Funciona:** Seleção de humor (Feliz, Triste, Nervoso, Ansioso) com fator de influência, **questionários validados PHQ-9 (depressão) e GAD-7 (ansiedade)** com cálculo automático de escore, faixa de risco, aviso de acolhimento CVV (`188`) em casos críticos e linha do tempo integrada com Sinais Vitais (`useStore`).
   - **Pendente:** Botão SOS Crise + modal de respiração guiada/grounding ([#7](https://github.com/bonasticos/MeuAppDeSaude/issues/7)), campo de texto livre + registro de sono ([#35](https://github.com/bonasticos/MeuAppDeSaude/issues/35)) e gráfico semanal de humor ([#20](https://github.com/bonasticos/MeuAppDeSaude/issues/20)).

6. **🩺 Sinais Vitais — Enfermagem (`src/screens/SinaisVitais`)**
   - **Funciona:** Seletor vertical (`VerticalWheelPicker`) para BPM, Glicemia (com tipo obrigatório: Jejum, Pré-prandial ou Pós-prandial), Pressão Sistólica/Diastólica (com verificação de PA convergente/divergente) e SpO2; campo de **Temperatura Corporal (°C)** com alertas automáticos de **Febre (`> 37.8 °C`)** e **Hipotermia (`< 35.0 °C`)**; **Checklist Diário de Cuidados Básicos e Higiene** persistido por data; alertas via `expo-notifications`; e **edição e exclusão** completas dos registros salvos no `useStore`.
   - **Pendente:** Gráficos de evolução clínica ([#20](https://github.com/bonasticos/MeuAppDeSaude/issues/20)).

7. **⏰ Lembretes & Farmácia (`src/screens/Lembretes`)**
   - **Funciona:** Cadastro e exclusão de lembretes diários (Remédios e Ações) agendados via `expo-notifications`, estoque de medicamentos com alerta de interação básica (`AAS` / `Aspirina`) e exportação do estoque em PDF via `expo-print` + `expo-sharing`.
   - **Pendente:** Campos de validade, prescritor, armazenamento e alerta de estoque baixo ([#13](https://github.com/bonasticos/MeuAppDeSaude/issues/13)); migração do AsyncStorage local para o `useStore` ([#16](https://github.com/bonasticos/MeuAppDeSaude/issues/16)); edição de lembretes e baixa automática no estoque ([#17](https://github.com/bonasticos/MeuAppDeSaude/issues/17)); e ampliação do PDF para prontuário completo ([#21](https://github.com/bonasticos/MeuAppDeSaude/issues/21)).

8. **🏃 Corpo & Movimento — IMC, Perfil & Educação Física (`src/screens/Perfil`)**
   - **Funciona:** Persistência completa no `useStore` (`idade`, `peso`, `altura`, `sexo`, `imc`, **`comorbidades`**, **`alergias`**); destaque visual em alerta vermelho no topo do perfil quando há alergias registradas; cálculo automático da **Meta Diária de Água (`35 ml × peso`)**; frequência de atividades e meta semanal; biblioteca de exercícios em modal; e **Diário de Treinos** com **duração (min)**, **intensidade** (`Leve`, `Moderado`, `Intenso`) e **cálculo estimado de gasto calórico (`kcal`)**.
   - **Pendente:** Unificação em abas com `Fisioterapia` ([#21](https://github.com/bonasticos/MeuAppDeSaude/issues/21)) e gráfico de evolução de peso/IMC ([#20](https://github.com/bonasticos/MeuAppDeSaude/issues/20)).

9. **🦵 Fisioterapia (`src/screens/Fisioterapia`)**
   - **Funciona:** Registro diário do nível de dor na escala EVA (`0` a `10`) e histórico salvo no `useStore`.
   - **⚠️ Mocks / Pendentes:** Os botões "Exercícios de Hoje" e "Lembretes de Postura" ainda estão sem ação ([#8](https://github.com/bonasticos/MeuAppDeSaude/issues/8)), além da seleção de região corporal/tipo de dor ([#9](https://github.com/bonasticos/MeuAppDeSaude/issues/9)) e gráfico de evolução da dor ([#20](https://github.com/bonasticos/MeuAppDeSaude/issues/20)).

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
docs: atualiza README e REQUISITOS com entregas do Ciclo 2
```

### Pull Requests & Issues
- Vincule sempre a issue relacionada na descrição do PR usando `Closes #X`.
- Rode `npx tsc --noEmit` antes de abrir o PR.
- **Nunca** commitar credenciais reais ou o arquivo `.env` (mantenha apenas o `.env.example` versionado).

---

## 🚧 Próximos Passos (Backlog Aberto por Fase)

### 2ª Fase (UI, Modais e Acessibilidade)
- [ ] **Psicologia**: Botão SOS Crise e modal de respiração guiada / grounding ([#7](https://github.com/bonasticos/MeuAppDeSaude/issues/7)) + Diário de texto livre e registro de sono ([#35](https://github.com/bonasticos/MeuAppDeSaude/issues/35)).
- [ ] **Fisioterapia**: Modais de Exercícios de Hoje e Lembretes de Postura ([#8](https://github.com/bonasticos/MeuAppDeSaude/issues/8)) + Seleção de região corporal e tipo de dor ([#9](https://github.com/bonasticos/MeuAppDeSaude/issues/9)).
- [ ] **Farmácia**: Validade, médico prescritor, armazenamento e alerta de estoque baixo ([#13](https://github.com/bonasticos/MeuAppDeSaude/issues/13)).
- [ ] **UX / Acessibilidade**: Auditoria completa de `RNF01` (fontes mínimas, alvos de toque `>= 44px` e alto contraste em todas as telas antigas) ([#14](https://github.com/bonasticos/MeuAppDeSaude/issues/14)).

### 4ª Fase (Estado Global, CRUD, Gráficos e Abas)
- [ ] **Lembretes & Farmácia**: Migrar `TelaLembretes` do AsyncStorage isolado para o `useStore` ([#16](https://github.com/bonasticos/MeuAppDeSaude/issues/16)), permitir edição de lembretes e baixa automática no estoque ao confirmar dose ([#17](https://github.com/bonasticos/MeuAppDeSaude/issues/17)).
- [ ] **Visualização & Refatoração UI**: Gráficos de evolução clínica ([#20](https://github.com/bonasticos/MeuAppDeSaude/issues/20)), unificação por abas de `Perfil` + `Fisioterapia` e prontuário resumido em PDF ([#21](https://github.com/bonasticos/MeuAppDeSaude/issues/21)).

### 6ª Fase (Supabase Cloud, Segurança LGPD e DevOps)
- [ ] **Supabase Cloud & Auth**: Provisionar projeto no painel do Supabase + bucket `avatars` ([#22](https://github.com/bonasticos/MeuAppDeSaude/issues/22)), finalizar `Cadastro`, recuperação de senha e listener `onAuthStateChange` ([#23](https://github.com/bonasticos/MeuAppDeSaude/issues/23)), e sincronizar actions do `useStore` com [`src/services/db.ts`](src/services/db.ts) ([#24](https://github.com/bonasticos/MeuAppDeSaude/issues/24)).
- [ ] **Arquitetura, LGPD & CI**: Serviço centralizado de notificações `src/services/notifications.ts` ([#25](https://github.com/bonasticos/MeuAppDeSaude/issues/25)), aceite LGPD + exclusão definitiva de conta e dados ([#26](https://github.com/bonasticos/MeuAppDeSaude/issues/26)), CI de TypeScript via GitHub Actions e componentes base em `src/components/` ([#27](https://github.com/bonasticos/MeuAppDeSaude/issues/27)).
