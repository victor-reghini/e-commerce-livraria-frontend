# Changelog

Todas as alterações notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [Não Lançado] - Sprints Planejadas

### [Sprint 2] - Catálogo, SKUs, Kits e Importação em Massa
- **Adicionado**: CRUD completo de Taxonomia: Categorias, Autores e Editoras (`/api/v1/taxonomy/*`).
- **Adicionado**: Gestão hierárquica de Produtos e Variações de SKU com validação de ISBN-10/13.
- **Adicionado**: Upload direto para MinIO/S3 via Presigned URLs para capas e e-books com progresso visual.
- **Adicionado**: Construtor visual de Kits com decomposição fiscal e rateio proporcional de centavos.
- **Adicionado**: Módulo de importação em streaming de planilhas XLSX/CSV com auditoria linha a linha.

### [Sprint 3] - Múltiplos Estoques, Feiras e Auditoria Cega
- **Adicionado**: Gestão de filiais e stands itinerantes de feiras (`/api/v1/companies`).
- **Adicionado**: Remessas de estoque entre filiais com reserva temporária e emissão do Romaneio de Carga.
- **Adicionado**: Módulo de conferência cega pós-feira com bipagem contínua e conciliação direta no ledger contábil.
- **Adicionado**: Dashboard operacional de feiras em tempo real por stand.
- **Adicionado**: Extrato imutável de movimentações de estoque.

### [Sprint 4] - PDV Mobile PWA Offline-First & Venda Balcão
- **Adicionado**: Suporte a PWA com Service Worker e rotina de sincronização delta do catálogo.
- **Adicionado**: Controle de turno de caixa: abertura com fundo de troco, suprimento, sangria e fechamento cego.
- **Adicionado**: Frente de caixa com bipagem por câmera (`@zxing/library`) e atalhos de teclado para leitor laser USB.
- **Adicionado**: Pagamento split (Dinheiro com troco, Cartão TEF/POS e PIX com QR Code dinâmico).
- **Adicionado**: Fila de vendas offline com `client_uuid` para garantia de idempotência no backend.
- **Adicionado**: Geração e impressão de cupons térmicos ESC/POS e Danfe NFC-e.

### [Sprint 5] - Loja Pública E-Commerce Headless SSR & Checkout
- **Adicionado**: Vitrine pública em Server-Side Rendering (SSR) otimizada para SEO.
- **Adicionado**: Busca facetada com autocomplete em tempo real.
- **Adicionado**: PDP detalhada com variações de SKU (Brochura, Capa Dura, E-book) e cálculo de frete.
- **Adicionado**: Checkout transparente Pagar.me V5 (PIX, Cartão de Crédito e Boleto Bancário).
- **Adicionado**: Módulo B2B de orçamento institucional a prazo com trava visual de inadimplência (`422`).
- **Adicionado**: Área do cliente com histórico de pedidos e download seguro de e-books.

### [Sprint 6] - Módulo Fiscal, Auditoria e Observabilidade
- **Adicionado**: Monitor de status em tempo real da SEFAZ com chaveamento de Contingência Offline.
- **Adicionado**: Emissão manual e em lote de NF-e Modelo 55, espelho DANFE e download do XML autorizado.
- **Adicionado**: Cancelamento homologado perante a SEFAZ com justificativa legal mínima de 15 caracteres.
- **Adicionado**: Trilha de auditoria imutável com mascaramento de dados sensíveis (LGPD e PCI-DSS).
- **Adicionado**: Dashboard de observabilidade e métricas de saúde das Virtual Threads do Java 21 Loom.

---

## [1.0.0-sprint1] - 2026-11-12

### Adicionado
- **Arquitetura Base**:
  - Inicialização do projeto com **Next.js 15 (App Router)**, **React 19** e **TypeScript 5** em strict mode.
  - Configuração do **Tailwind CSS** com suporte a variáveis CSS dinâmicas para multi-tenancy.
  - Setup do **TanStack Query v5** para controle inteligente de cache e revalidação de dados remotos.
  - Setup do **Dexie.js (IndexedDB)** com banco local versionado `PdvOfflineDb` (`catalog`, `cashShifts`, `offlineSales`, `syncQueue`).
- **Cliente HTTP & Segurança**:
  - Cliente Axios centralizado (`lib/api/client.ts`) com base URL configurável via `NEXT_PUBLIC_API_URL`.
  - Injeção automática dos cabeçalhos `X-Tenant-ID`, `X-Correlation-ID` (UUID v4) e `Authorization: Bearer <token>`.
  - Interceptor de resposta 401 com **fila de espera assíncrona** (`failedQueue`) para requisições concorrentes e rotação atômica de Refresh Token via `/api/v1/auth/refresh`.
  - Persistência e sincronização de tokens via `localStorage` e cookies em `lib/api/tokens.ts`.
- **Multi-Tenancy & Branding Dinâmico**:
  - Store Zustand `useTenantStore` para consumo de `GET /api/v1/auth/tenant-info`.
  - Injeção em tempo de execução das cores da marca via variáveis CSS (`--primary`, `--primary-hover`).
- **Autenticação & RBAC**:
  - Store Zustand `useAuthStore` com persistência de sessão e helpers de papéis de usuário.
  - Tela de login unificada (`/login`) com validação via **Zod** e **React Hook Form**.
  - Botão de auto-preenchimento das credenciais padrão de homologação (Seed Admin) para testes locais.
  - Componente guardião de rotas `ProtectedRoute` com redirecionamento para `/unauthorized` e `/login`.
  - Tela de consulta e atualização cadastral do operador (`/admin/profile`) consumindo `/api/v1/users/me`.
  - CRUD completo de colaboradores (`/admin/users`) consumindo `/api/v1/users` com atribuição de filiais autorizadas.
- **Layouts & Design System**:
  - Backoffice layout com sidebar expansível, navbar, seletor dinâmico de filial ativa e atalhos para os módulos.
  - Primitivas de interface em `components/ui/` (`Button`, `Input`, `Label`, `Card`, `Badge`).
  - Portal inicial `/` roteando para os módulos Backoffice, PDV e Loja.

