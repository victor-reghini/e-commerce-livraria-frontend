# Ecossistema Livraria Multi-Tenant (Frontend)

Camada cliente completa da plataforma de e-commerce, PDV móvel offline-first e painel de gestão administrativa para livrarias e redes varejistas.

Integrado ao backend em **Java 21 LTS (Spring Boot 3.3.5 / Loom Virtual Threads / PostgreSQL RLS)** rodando em `http://localhost:8080`.

---

## 🚀 Stack Tecnológica

| Camada | Tecnologia | Propósito |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) + React 19 | SSR, Streaming, Server Components e SPAs modulares |
| **Linguagem** | TypeScript 5 (Strict Mode) | Tipagem estática espelhando os DTOs do backend |
| **Estilização** | Tailwind CSS + Radix UI + Lucide Icons | Design system responsivo com CSS Variables dinâmicas |
| **Estado de Servidor** | TanStack Query v5 | Cache inteligente, revalidação em background |
| **Estado Global de UI** | Zustand (com persistência) | Sessão de usuário, tenant ativo e carrinho de compras |
| **Banco Offline (PDV)** | Dexie.js (IndexedDB versionado) | Armazenamento de catálogo, vendas offline e fila de sync |
| **HTTP Client** | Axios Encapsulado | Interceptors com injeção de `X-Tenant-ID`, `X-Correlation-ID` e fila de refresh token 401 |
| **Leitura Óptica** | `@zxing/library` + Laser USB | Leitura de código de barras/ISBN via webcam e leitor físico |

---

## 🏛️ Estrutura Arquitetural de Aplicações

A aplicação é dividida em três frentes principais dentro do Next.js App Router:

```
src/
├── app/
│   ├── (auth)/                  # Login unificado, tenant picker, recuperação
│   │   └── login/
│   ├── (admin)/                 # Backoffice SPA (Gestão Administrativa)
│   │   ├── layout.tsx           # Sidebar, Navbar, seletor de filial e RBAC
│   │   └── admin/
│   │       ├── catalog/         # Gestão de Produtos, SKUs, Kits e Importação XLSX
│   │       ├── taxonomy/        # Categorias, Autores e Editoras
│   │       ├── stock/           # Remessas, Romaneios, Transferências e Ledger
│   │       ├── events/          # Gestão de Feiras, Conferência Cega e Dashboard
│   │       ├── budgets/         # Orçamentos Corporativos B2B e Trava de Inadimplência
│   │       ├── fiscal/          # Emissão de NF-e 55, NFC-e 65, DANFE e Contingência
│   │       ├── audit/           # Trilha imutável de auditoria (LGPD/PCI mascarado)
│   │       ├── users/           # CRUD de Usuários e filiais autorizadas
│   │       └── profile/         # Perfil do operador (/api/v1/users/me)
│   ├── (pdv)/                   # PDV Mobile PWA (Offline-First)
│   │   └── pdv/                 # Frente de caixa, bipagem rápida, split e sincronização
│   └── (store)/                 # Loja Pública E-Commerce (SSR / SEO)
│       └── store/               # Vitrine, busca facetada, PDP, frete e checkout Pagar.me V5
├── components/                  # Componentes reutilizáveis (UI primitives, tabelas, modais)
├── hooks/                       # Custom hooks (useTenant, useAuth, useBarcodeScanner, useOfflineSync)
├── lib/
│   ├── api/                     # Axios client, fila de refresh token e endpoints
│   ├── db/                      # Dexie.js (banco local IndexedDB do PDV)
│   ├── stores/                  # Zustand stores (authStore, tenantStore)
│   └── utils/                   # Formatadores (BRL, CNPJ, CPF, datas, UUID v4)
└── types/                       # Interfaces TypeScript de modelos e DTOs
```

---

## 📋 Roadmap de Execução & Atividades por Sprint

### [x] Sprint 1: Fundação de Arquitetura, Multi-Tenancy e Autenticação
- [x] **Configuração do Cliente API**:
  - `lib/api/client.ts` com base URL configurável via `NEXT_PUBLIC_API_URL` (default: `http://localhost:8080`).
  - Interceptor de request: injeção de `X-Tenant-ID`, `X-Correlation-ID` (UUID v4) e `Authorization: Bearer <token>`.
  - Interceptor de response: fila assíncrona concorrente para erro 401 e rotação de Refresh Token via `/api/v1/auth/refresh`.
- [x] **Resolução Dinâmica de Tenant & Branding**:
  - Consumo de `GET /api/v1/auth/tenant-info` (`name`, `slug`, `logoUrl`, `primaryColor`).
  - Aplicação de cores dinâmicas via CSS Variables (`--primary`, `--primary-hover`).
- [x] **Autenticação & Controle de Acesso (RBAC)**:
  - Tela de login com validação Zod + React Hook Form e quick-fill de credenciais de homologação.
  - Armazenamento de sessão com Zustand (`persist`) em cookie e localStorage.
  - Componente de guarda de rota `ProtectedRoute` para papéis (`SUPER_ADMIN`, `TENANT_ADMIN`, `STORE_MANAGER`, `ATTENDANT`, `CUSTOMER`).
  - Tela de consulta e edição de perfil `/api/v1/users/me` (`/admin/profile`).
  - CRUD completo de usuários `/api/v1/users` com filiais autorizadas (`/admin/users`).
- [x] **Banco Local Offline**:
  - Configuração do Dexie.js (`PdvOfflineDb`) com schemas versionados (`catalog`, `cashShifts`, `offlineSales`, `syncQueue`).

---

### [ ] Sprint 2: Painel Administrativo — Catálogo, SKUs, Kits e Importação em Massa
- [ ] **Taxonomia**: CRUD de Categorias, Autores e Editoras (`/api/v1/taxonomy/*`).
- [ ] **Gestão de Produtos e SKUs**:
  - Formulário hierárquico: Produto Pai (título, slug, sinopse) e Variações/SKUs (código SKU, EAN-13, ISBN-10/13 com validação em tempo real, tipo de encadernação, dimensões e pesos para frete, preço de venda e custo).
  - Upload direto para S3/MinIO via Presigned URLs:
    - Solicitar URL via POST `/api/v1/products/{id}/upload-cover-url` ou `/upload-ebook-url`.
    - Executar upload binário PUT diretamente para a nuvem com barra de progresso.
- [ ] **Construtor Visual de Kits Virtuais**:
  - Interface para selecionar itens constituintes e quantidades.
  - Exibição em tempo real do saldo virtual disponível (`GET /api/v1/products/skus/{skuId}/stock?companyId={id}`).
  - Card de pré-visualização da decomposição fiscal e rateio proporcional de centavos (`GET /api/v1/products/skus/{skuId}/fiscal-decomposition?invoicedTotal={valor}`).
- [ ] **Importação em Lote de Planilhas (Streaming XLSX/CSV)**:
  - Dropzone para upload de planilhas (`POST /api/v1/products/import`).
  - Tabela com auditoria de falhas linha a linha (linha, motivo e dado inválido).

---

### [ ] Sprint 3: Painel Administrativo — Múltiplos Estoques, Feiras e Auditoria Cega
- [ ] **Gestão de Filiais e Stands de Feiras**: Cadastro e listagem de filiais (`/api/v1/companies`).
- [ ] **Remessas de Estoque & Romaneio de Carga**:
  - Formulário de criação de transferência com reserva temporária (`POST /api/v1/transfers`).
  - Fluxo de despacho físico (`POST /api/v1/transfers/{id}/dispatch`).
  - Visualização e impressão do **Romaneio de Transporte** (`GET /api/v1/transfers/{id}/romaneio`) com peso cúbico e dados fiscais.
  - Confirmação de recebimento no destino com detecção visual de divergências (`POST /api/v1/transfers/{id}/receive`).
- [ ] **Módulo de Conferência Cega Pós-Feira**:
  - Abertura de auditoria (`POST /api/v1/audits`).
  - Tela de bipagem contínua de código de barras/ISBN com feedback sonoro e contagem atômica (`POST /api/v1/audits/{id}/scan`).
  - Conciliação direta no ledger contábil de estoque (`POST /api/v1/audits/{id}/reconcile`).
- [ ] **Dashboard Operacional de Feira**:
  - Monitor de vendas, faturamento e alertas de estoque baixo por stand (`GET /api/v1/events/{companyId}/dashboard`).
- [ ] **Extrato do Ledger Contábil de Estoque**:
  - Grid imutável com filtros de movimentação (`GET /api/v1/stock/movements`).

---

### [ ] Sprint 4: PDV Mobile PWA — Offline-First e Venda Balcão/Feira
- [ ] **Suporte PWA & Rotina de Sincronização Delta**:
  - Configuração de Service Worker, web manifest e sincronização delta do catálogo (`GET /api/v1/pos/sync/catalog?companyId={id}&updatedSince={ts}`).
- [ ] **Controle de Turno de Caixa**:
  - Abertura de caixa informando fundo de troco (`POST /api/v1/pos/shifts/open`).
  - Ações de Suprimento e Sangria (validação impedindo sangria maior que o saldo em gaveta).
  - Fechamento Cego de Turno com apuração de divergência/quebra (`POST /api/v1/pos/shifts/{id}/close`).
- [ ] **Frente de Caixa (Terminal PDV)**:
  - Bipagem ultra-rápida via câmera integrada (`@zxing/library`) e leitor laser USB com atalhos (`F2: busca`, `F4: pagamento`, `ESC: cancelar`).
  - Pagamentos múltiplos combinados (Dinheiro com cálculo de troco, Cartão TEF/POS, PIX com QR Code dinâmico).
  - Baixa de estoque e emissão de NFC-e instantânea (`POST /api/v1/pos/sales`).
  - Emissão e impressão do cupom térmico ESC/POS (`GET /api/v1/pos/sales/{id}/receipt`).
- [ ] **Fila de Vendas Offline & Idempotência**:
  - Vendas salvas com `client_uuid` (UUID v4) local no Dexie.js.
  - Processador em background disparando `POST /api/v1/pos/sync/offline-sales` com garantia anti-duplicidade.

---

### [ ] Sprint 5: Loja Pública — E-Commerce Headless SSR & Checkout
- [ ] **Catálogo & Vitrine Pública (SSR / SEO)**:
  - Vitrine com banners, carrosséis e busca com autocomplete em tempo real (`GET /api/v1/store/search?q={query}`).
  - PDP detalhada por slug com variações de SKU (Brochura, Capa Dura, E-book), ficha técnica e estoque em tempo real.
- [ ] **Carrinho & Simulador de Frete**:
  - Carrinho desacoplado persistido via Zustand.
  - Cotação multi-transportadora (Correios SEDEX/PAC e Melhor Envio) via `POST /api/v1/ecommerce/shipping/calculate`.
- [ ] **Checkout Transparente Pagar.me V5**:
  - PIX (QR Code e Copia e Cola com polling de confirmação).
  - Cartão de Crédito (validação Luhn, detecção de bandeira e parcelamento).
  - Boleto Bancário (linha digitável e download do PDF).
- [ ] **Módulo B2B de Venda a Prazo / Orçamento Institucional**:
  - Formulário para empresas (CNPJ, razão social, faturamento a prazo 30/60 dias).
  - Aprovação administrativa (`POST /api/v1/budgets/{id}/approve`) com **Trava Visual de Inadimplência** (`422 Unprocessable Entity`).
  - Faturamento e conversão em pedido (`POST /api/v1/budgets/{id}/invoice`).
- [ ] **Área do Cliente & Download Seguro de E-books**:
  - Histórico de pedidos e download seguro de e-books com link pré-assinado temporário (`GET /api/v1/products/skus/{skuId}/download-ebook-url`).

---

### [ ] Sprint 6: Módulo Fiscal, Auditoria e Observabilidade
- [ ] **Painel de Homologação e Gestão Fiscal (SEFAZ)**:
  - Monitor de status SEFAZ em tempo real (`GET /api/v1/fiscal/status-sefaz`).
  - Emissão manual ou em lote de NF-e Modelo 55 (`POST /api/v1/fiscal/invoices/nfe/order/{orderId}`).
  - Cancelamento com justificativa mínima legal de 15 caracteres (`POST /api/v1/fiscal/invoices/{id}/cancel`).
  - Impressão direta do espelho DANFE responsivo (`GET /api/v1/fiscal/invoices/{id}/danfe`) e download do XML autorizado.
  - Indicador e chaveamento para modo **Contingência Offline**.
- [ ] **Trilha de Auditoria Imutável (LGPD / PCI-DSS)**:
  - Grid de auditoria (`GET /api/v1/audit/logs`) com filtros e mascaramento de CPF (`***.456.789-**`) e Cartão (`4111********1111`).
- [ ] **Painel de Observabilidade & Telemetria**:
  - Dashboard consumindo `GET /api/v1/observability/summary` e métricas do Prometheus (volume de vendas, taxa de conversão e saúde das Loom Virtual Threads).

---

## ⚙️ Instalação e Execução Local

### Pré-requisitos
- Node.js 20+ (recomendado Node 22 LTS)
- Backend Spring Boot em execução em `http://localhost:8080`

### 1. Clonar e Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Crie ou verifique o arquivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_DEFAULT_TENANT_ID=00000000-0000-0000-0000-000000000001
```

### 3. Executar o Servidor de Desenvolvimento
```bash
npm run dev
```
Acesse a aplicação no navegador em `http://localhost:3000`.

### 4. Build de Produção
```bash
npm run build
npm start
```

---

## 🔑 Credenciais Padrão de Homologação (Seed)

- **URL de Login**: `http://localhost:3000/login`
- **E-mail**: `admin@livrariamatriz.com.br`
- **Senha**: `Admin@123456`
- **Tenant ID**: `00000000-0000-0000-0000-000000000001`
*(A tela de login possui um botão de preenchimento automático para testes rápidos de desenvolvimento)*
