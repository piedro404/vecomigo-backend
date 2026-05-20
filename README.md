# 🍿🎥 VeComigo — Backend API

API em tempo real do ecossistema VeComigo. Responsável por gerenciar salas, usuários e toda a comunicação bidirecional via Socket.IO entre os clientes conectados.

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=flat&logo=socket.io&logoColor=white)](https://socket.io)

---

## 📌 Sobre o projeto

O VeComigo é um projeto pessoal desenvolvido com foco em aprender e aplicar comunicação em tempo real com Socket.IO. A ideia central é explorar como manter frontend e backend conectados de forma persistente, eliminando a necessidade de polling e permitindo que o servidor dispare eventos diretamente para os clientes quando algo muda.

Este repositório contém a **API Backend** responsável por:

- Gerenciar a criação e entrada de salas
- Controlar o estado de usuários conectados com cache em memória
- Emitir eventos em tempo real para todos os clientes de uma sala
- Expor endpoints REST para operações pontuais

O ecossistema é dividido em dois repositórios:

| Parte | Repositório | Descrição |
| --- | --- | --- |
| 🖥️ Frontend | [vecomigo-frontend](https://github.com/piedro404/vecomigo-frontend) | Interface React que escuta os eventos do socket |
| ⚙️ Backend | este repositório | API Express + Socket.IO que emite os eventos |

---

## ⚙️ Tecnologias

- **Runtime:** Node.js
- **Linguagem:** TypeScript
- **Framework:** Express 5
- **Tempo real:** Socket.IO 4
- **Cache:** node-cache (estado das salas em memória)
- **Validação:** Zod
- **Logs:** Pino + pino-pretty
- **Utilitários:** UUID, dotenv, cors

---

## 🔁 Como funciona o Socket.IO aqui

Em vez de o frontend ficar fazendo requisições repetidas pra API pra saber se algo mudou (polling), o Socket.IO mantém uma conexão persistente entre cliente e servidor via WebSocket.

<img width="1536" height="1024" alt="ChatGPT Image 19 de mai  de 2026, 19_13_29" src="https://github.com/user-attachments/assets/052fc285-af83-451d-a552-6fe166af2cc5" />
<img width="1736" height="906" alt="ChatGPT Image 19 de mai  de 2026, 20_04_09" src="https://github.com/user-attachments/assets/42692a63-bc05-46f5-8ff8-37ddc8eb06ae" />
<img width="1736" height="906" alt="ChatGPT Image 19 de mai  de 2026, 20_37_48" src="https://github.com/user-attachments/assets/ca4cfda2-3255-4c50-bb23-40b73c598373" />
<img width="1736" height="906" alt="ChatGPT Image 19 de mai  de 2026, 20_43_38" src="https://github.com/user-attachments/assets/14de2176-e4dc-4618-9b71-673d50bb1ccd" />


O fluxo básico funciona assim:

1. O frontend se conecta ao backend e passa a escutar eventos com `socket.on`
2. Quando algo relevante acontece na API (ex: um usuário entrou na sala), o backend emite um evento com `io.to(sala).emit`
3. O frontend recebe o evento instantaneamente e atualiza a UI sem precisar fazer nenhuma requisição

Isso permite que todos os clientes de uma mesma sala vejam atualizações em tempo real, sincronizados.

---

## 🚀 Rodando localmente

Pré-requisitos: Node.js 18+

```bash
# 1. Clonar o repositório
git clone https://github.com/piedro404/vecomigo-backend.git
cd vecomigo-backend

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env

# 4. Rodar em modo desenvolvimento
npm run dev
```

A API ficará disponível em `http://localhost:3000`.

---

## 🔗 Links

- 🖥️ Frontend: [vecomigo-frontend.vercel.app](https://vecomigo-frontend.vercel.app)
- 📦 Repositório Frontend: [github.com/piedro404/vecomigo-frontend](https://github.com/piedro404/vecomigo-frontend)
- 📦 Repositório Backend: [github.com/piedro404/vecomigo-backend](https://github.com/piedro404/vecomigo-backend)

---

## 👤 Autor

Desenvolvido por **Pedro Henrique** como projeto pessoal de estudos em comunicação em tempo real.

- GitHub: [@piedro404](https://github.com/piedro404)
- Email: pedro.henrique.martins404@gmail.com
