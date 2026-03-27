# Survey App

**Repositório em construção.**

Aplicação de pesquisa de opinião (enquetes) desenvolvida para execução em ambientes Kubernetes/OpenShift, seguindo princípios cloud-native.

## Visão Geral

O **Survey App** permite criar, publicar e analisar pesquisas de opinião de forma escalável e segura.

A aplicação é baseada em três perfis de usuário:

* **Admin**

  * Gerencia usuários (admins e pesquisadores)
  * Cria e administra pesquisas

* **Pesquisador**

  * Cria e configura pesquisas
  * Publica pesquisas e gera links de acesso
  * Visualiza resultados

* **Respondente**

  * Realiza cadastro na plataforma
  * Responde pesquisas através de links compartilhados

## Arquitetura

A aplicação segue princípios de arquitetura cloud-native e é projetada para rodar em Kubernetes/OpenShift.

Componentes principais:

* **Frontend**: Interface web
* **Backend**: API responsável pelas regras de negócio
* **Banco de Dados**: PostgreSQL
* **Infraestrutura OpenShift/K8s**:

  * Deployment
  * Service
  * Route (OpenShift)
  * ConfigMap e Secret

## Segurança

* Controle de acesso baseado em perfis (RBAC)
* Execução de containers como usuário não-root
* Uso de **ConfigMaps** e **Secrets** para configuração
* Compatível com políticas de segurança do OpenShift (SCC)

## Deploy

Deploy inicial utilizando OpenShift CLI:

```bash
oc new-app <url-do-repositorio>
oc expose svc/survey-api
```

Os manifests Kubernetes/OpenShift estão disponíveis no diretório `/k8s`.

## Estrutura do Projeto

```
backend/
frontend/
k8s/
```

## Licença

Este projeto está licenciado sob a **GNU General Public License v3.0 (GPLv3)**.

Isso significa que você pode usar, modificar e distribuir este software, desde que qualquer trabalho derivado também seja distribuído sob a mesma licença.

