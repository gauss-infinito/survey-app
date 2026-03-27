# Histórias de Usuário

## Estrutura geral (visão do produto)

* **Admin** → governa o sistema
* **Pesquisador** → cria e publica pesquisas
* **Respondente** → responde pesquisas

## 1. Histórias do Admin

### Gestão de usuários

**US-ADM-01 — Criar usuário administrador**

> Como admin, quero cadastrar novos administradores para compartilhar a gestão do sistema.

**Critérios de aceitação:**

* Deve informar nome, e-mail e senha
* Não permitir e-mail duplicado
* Usuário criado já pode acessar o sistema

**US-ADM-02 — Criar usuário pesquisador**

> Como admin, quero cadastrar pesquisadores para que possam criar pesquisas.

**Critérios:**

* Definir perfil como "pesquisador"
* Enviar credenciais ou convite por e-mail

**US-ADM-03 — Gerenciar usuários**

> Como admin, quero listar, editar e desativar usuários.

**Critérios:**

* Listagem com filtros (perfil, status)
* Permitir ativar/desativar
* Permitir reset de senha

### Gestão de pesquisas

**US-ADM-04 — Criar pesquisa**

> Como admin, quero criar pesquisas para coleta de dados.

**Critérios:**

* Nome, descrição, status (rascunho/publicada)
* Definir prazo de validade

**US-ADM-05 — Criar perguntas da pesquisa**

> Como admin, quero adicionar perguntas à pesquisa.

**Critérios:**

* Tipos: múltipla escolha, texto, escala
* Ordem das perguntas configurável

**US-ADM-06 — Responder pesquisa**

> Como admin, quero responder pesquisas como um usuário comum.

## 2. Histórias do **Pesquisador**

### Criação e gestão de pesquisas

**US-PESQ-01 — Criar pesquisa**

> Como pesquisador, quero criar uma pesquisa para coletar respostas do público.

**US-PESQ-02 — Editar pesquisa**

> Como pesquisador, quero editar uma pesquisa enquanto ela estiver em rascunho.

**US-PESQ-03 — Criar perguntas**

> Como pesquisador, quero adicionar e editar perguntas da pesquisa.

**US-PESQ-04 — Publicar pesquisa**

> Como pesquisador, quero publicar a pesquisa para disponibilizá-la ao público.

**Critérios:**

* Gera uma URL única
* Após publicar, não permitir edição estrutural

**US-PESQ-05 — Compartilhar pesquisa**

> Como pesquisador, quero compartilhar o link da pesquisa com respondentes.

### Resultados

**US-PESQ-06 — Visualizar resultados**

> Como pesquisador, quero visualizar os resultados da pesquisa.

**Critérios:**

* Dados agregados
* Visualização por pergunta

## 3. Histórias do **Respondente**

### Cadastro e acesso

**US-RESP-01 — Registrar-se**

> Como respondente, quero me cadastrar para responder pesquisas.

**Critérios:**

* Nome + e-mail (mínimo)
* Evitar duplicidade

**US-RESP-02 — Acessar pesquisa via link**

> Como respondente, quero acessar uma pesquisa através de um link compartilhado.

### Resposta

**US-RESP-03 — Responder pesquisa**

> Como respondente, quero responder perguntas e enviar minhas respostas.

**Critérios:**

* Validação de campos obrigatórios
* Submissão única (ou controlada)

**US-RESP-04 — Confirmar envio**

> Como respondente, quero receber confirmação de que minha resposta foi enviada.

## 4. Histórias transversais (importantes!)

### Autenticação e segurança

**US-AUTH-01 — Login**

> Como usuário, quero autenticar no sistema para acessar funcionalidades.

**US-AUTH-02 — Controle de acesso (RBAC)**

> Como sistema, quero garantir que cada perfil acesse apenas suas funcionalidades.

### Compartilhamento

**US-SYS-01 — URL pública de pesquisa**

> Como sistema, quero gerar uma URL única para cada pesquisa publicada.

### Operacional (pensando em OpenShift)

**US-OPS-01 — Deploy em OpenShift**

> Como time DevOps, quero implantar a aplicação no OpenShift.

**US-OPS-02 — Configuração via variáveis**

> Como sistema, quero receber configurações via variáveis de ambiente (12-factor).

**US-OPS-03 — Healthcheck**

> Como plataforma (K8s/OpenShift), quero verificar se a aplicação está saudável.
