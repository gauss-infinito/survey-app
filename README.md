# Survey App — Next.js + Node.js on OpenShift

> [!IMPORTANT]
> **Repositório em construção.**

Aplicação fullstack desenvolvida para validar práticas de build, deploy e integração em ambiente Kubernetes/OpenShift utilizando:

* Frontend: Next.js
* Backend: Node.js + Express
* Plataforma: OpenShift

## Visão Geral

O [**Survey App**](requisitos.md) permite criar, publicar e analisar pesquisas de opinião de forma escalável e segura.

A aplicação é baseada em três perfis de usuário:

* **Administrador**
  * Gerencia usuários

* **Pesquisador**
  * Cria e configura pesquisas
  * Publica pesquisas e gera links de acesso
  * Visualiza resultados

* **Respondente**
  * Registrar-se na plataforma
  * Responde pesquisas através de links compartilhados

## Arquitetura

A aplicação segue princípios de arquitetura cloud-native e é projetada para rodar em Kubernetes/OpenShift.

```
Browser
   ↓
Route (OpenShift)
   ↓
Frontend (Next.js)
   ↓
Backend API (Express)
```

Componentes principais:
* **Frontend**: Interface web (React / Next.js)
* **Backend**: API responsável pelas regras de negócio
* **Banco de Dados**: PostgreSQL
* **Infraestrutura OpenShift/K8s**:

  * Deployment
  * Service
  * Route (OpenShift)
  * ConfigMap e Secret

## Tecnologias Utilizadas

* Next.js (App Router)
* Node.js
* Express
* PostgreSQL
* OpenShift (BuildConfig, ImageStream, Route)
* Kubernetes (Deployment, Service)

## Segurança

* Controle de acesso baseado em perfis (RBAC)
* Execução de containers como usuário não-root
* Uso de **ConfigMaps** e **Secrets** para configuração
* Compatível com políticas de segurança do OpenShift (SCC)

## Build

Limpeza de recursos existentes:

```bash
oc delete bc survey-api
oc delete is survey-api
oc delete bc survey-frontend
oc delete is survey-frontend
oc delete builds --all
```

Criação de novos builds:

```bash
oc new-build https://github.com/gauss-infinito/survey-app --name=survey-api --context-dir=backend --strategy=docker
oc new-build https://github.com/gauss-infinito/survey-app --name=survey-frontend --context-dir=frontend --strategy=docker
oc set env bc/survey-frontend NEXT_PUBLIC_API_URL=https://survey-api-<project>.<apps-domain>.openshiftapps.com
```

As imagens ficam disponíveis em **registry interno**:

```
image-registry.openshift-image-registry.svc:5000/<project>/survey-api
image-registry.openshift-image-registry.svc:5000/<project>/survey-frontend
```

Após gerar novas imagens, reiniciamos os deployments para aplicar as mudanças:

```bash
oc rollout restart deployment survey-api
oc rollout restart deployment survey-frontend
```

## Deploy

Deploy inicial utilizando OpenShift CLI e Kustomize:

```bash
oc apply -k https://github.com/gauss-infinito/survey-app/k8s/
```

Os manifests Kubernetes/OpenShift estão disponíveis no diretório `/k8s`.

## Estrutura do Projeto

```
survey-app/
├── frontend/        # Aplicação Next.js
├── backend/         # API Node.js (Express)
├── k8s/             # Manifests Kubernetes
├── openshift/       # Configurações específicas do OpenShift
```

## Licença

Este projeto está licenciado sob a **GNU General Public License v3.0 (GPLv3)**.

Isso significa que você pode usar, modificar e distribuir este software, desde que qualquer trabalho derivado também seja distribuído sob a mesma licença.

