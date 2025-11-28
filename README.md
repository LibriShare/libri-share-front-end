# 📚 LibriShare - Front-end

![LibriShare Cover](librishare/public/placeholder-logo.png)

> **Sua biblioteca pessoal, reinventada.** > O LibriShare é uma plataforma open-source para organizar sua coleção de livros, acompanhar seu progresso de leitura e gerenciar empréstimos para amigos de forma simples e visual.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8)](https://tailwindcss.com/)
[![Shadcn/UI](https://img.shields.io/badge/Shadcn-UI-000000)](https://ui.shadcn.com/)

---

## ✨ Funcionalidades

Este front-end consome a API REST do LibriShare e oferece as seguintes funcionalidades:

* **📚 Gestão de Acervo:** Adicione livros buscando online (OpenLibrary) ou manualmente.
* **🔖 Organização:** Classifique livros em *Lendo*, *Lido*, *Para Ler* e *Lista de Desejos*.
* **🤝 Controle de Empréstimos:** Registre para quem você emprestou seus livros físicos e monitore datas de devolução.
* **📈 Progresso de Leitura:** Gamifique sua leitura atualizando a página atual e visualizando barras de progresso.
* **💌 Lista de Desejos:** Salve livros que deseja comprar com links diretos.
* **🌓 Modo Escuro:** Interface nativa em Dark Mode para conforto visual.

---

## 🛠️ Tecnologias

O projeto foi construído utilizando as tecnologias mais modernas do ecossistema React:

-   **[Next.js 14](https://nextjs.org/)** (App Router)
-   **[TypeScript](https://www.typescriptlang.org/)**
-   **[Tailwind CSS](https://tailwindcss.com/)**
-   **[Shadcn/UI](https://ui.shadcn.com/)** (Componentes acessíveis baseados em Radix UI)
-   **[Lucide React](https://lucide.dev/)** (Ícones)
-   **[Date-fns](https://date-fns.org/)** (Manipulação de datas)

---

## 🚀 Como Rodar Localmente

Siga os passos abaixo para executar o projeto na sua máquina.

### Pré-requisitos

* Node.js 18+ instalado.
* Gerenciador de pacotes `pnpm` (recomendado) ou `npm`.
* O **Back-end** do LibriShare rodando (localmente na porta 8080 ou no Render).

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/LibriShare/libri-share-front-end.git](https://github.com/LibriShare/libri-share-front-end.git)
    cd libri-share-front-end/librishare
    ```

2.  **Instale as dependências:**
    ```bash
    pnpm install
    # ou
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env.local` na raiz da pasta `librishare` e aponte para sua API:

    ```env
    # Se o back-end estiver rodando localmente:
    NEXT_PUBLIC_API_URL=http://localhost:8080

    # Se estiver usando o back-end de produção:
    # NEXT_PUBLIC_API_URL=[https://seu-backend.onrender.com](https://seu-backend.onrender.com)
    ```

4.  **Execute o servidor de desenvolvimento:**
    ```bash
    pnpm dev
    ```

5.  Acesse **http://localhost:3000** no seu navegador.

---

## 📂 Estrutura do Projeto

```bash
librishare/
├── app/                    # Rotas da aplicação (App Router)
│   ├── dashboard/          # Painel principal
│   ├── library/            # Grid de livros
│   ├── reading/            # Leitura atual e progresso
│   ├── loans/              # Gestão de empréstimos
│   └── ...
├── components/             # Componentes React modularizados
│   ├── ui/                 # Componentes base (Shadcn)
│   ├── books/              # Componentes de negócio (Livros)
│   └── ...
├── hooks/                  # Custom Hooks (ex: useUserId)
└── lib/                    # Utilitários e configurações