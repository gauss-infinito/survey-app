# Survey App — Next.js + Node.js on OpenShift

> [!IMPORTANT]
> **Repositório em construção.**

Aplicação fullstack desenvolvida para validar práticas de build, deploy e integração em ambiente Kubernetes/OpenShift utilizando:

* Frontend: Next.js
* Backend: Node.js + Express
* Plataforma: OpenShift

## Visão Geral

O [**Survey App**](requisitos.md) permite criar, publicar e analisar pesquisas de opinião rápidas (enquetes).

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
  * ConfigMap (configurações não sensíveis)
  * Secret (gerado dinamicamente via Vault)

* **Gerenciamento de Segredos**:

  * HashiCorp Vault (fonte de verdade dos secrets)
  * argocd-vault-plugin (injeção dinâmica nos manifests)

## Pré-requisitos

* Cluster OpenShift ou Kubernetes
* Vault configurado com secrets necessários
* argocd-vault-plugin instalado
* oc CLI configurado

## Tecnologias Utilizadas

* Next.js (App Router)
* Node.js
* Express
* PostgreSQL
* OpenShift (BuildConfig, ImageStream, Route)
* Kubernetes (Deployment, Service)
* argocd-vault-plugin
* Kustomize

## Segurança

* Controle de acesso baseado em perfis (RBAC)
* Execução de containers como usuário não-root
* Uso de **ConfigMaps** para configurações não sensíveis
* Uso de **Secrets** gerados dinamicamente via Vault (sem armazenamento de segredos no repositório)
* Integração com HashiCorp Vault para gerenciamento centralizado de credenciais
* Compatível com políticas de segurança do OpenShift (SCC)

## Configuração de Ambiente

Variável crítica (Frontend)
```bash
NEXT_PUBLIC_API_URL=https://<route-da-api>
```

Importante:
* O Next.js embute variáveis no build
* Qualquer alteração exige novo build

## Build

O build é realizado via BuildConfig com estratégia Docker:

```yaml
strategy:
  type: Docker
  dockerStrategy:
    env:
      - name: NEXT_PUBLIC_API_URL
        value: "https://<route-da-api>"
```

Criação de novos builds:

```bash
oc new-build https://github.com/gauss-infinito/survey-app --name=survey-api --context-dir=backend --strategy=docker
oc new-build https://github.com/gauss-infinito/survey-app --name=survey-frontend --context-dir=frontend --strategy=docker
oc set env bc/survey-frontend NEXT_PUBLIC_API_URL=https://survey-api-<project>.<apps-domain>.openshiftapps.com
```

Executar build: 

```bash
oc start-build survey-api --follow
oc start-build survey-frontend --follow
```

Após gerar novas imagens, reiniciamos os deployments para aplicar as mudanças:

```bash
oc rollout restart deployment survey-api
oc rollout restart deployment survey-frontend
```

## Deploy

Variáveis de Ambiente:

* DB_HOST
* DB_PORT
* DB_USER
* DB_PASSWORD
* DB_NAME
* JWT_SECRET

Fluxo de Deploy:

```
1. Aplicar infraestrutura:
   oc apply -k k8s/

2. Gerar secrets via Vault:
   argocd-vault-plugin generate k8s/base/secret.yaml | oc apply -f -

3. Reiniciar aplicação:
   oc rollout restart deployment survey-api
```

Os serviços são implantados via `Deployment` e ficam disponíveis em **registry interno**::

```yaml
image-registry.openshift-image-registry.svc:5000/<project>/survey-api
imagePullPolicy: Always

image: image-registry.openshift-image-registry.svc:5000/<project>/survey-frontend:latest
imagePullPolicy: Always
```

Atualizar aplicação: 

```bash
oc rollout restart deployment survey-api
oc rollout restart deployment survey-frontend
```

Deploy inicial utilizando OpenShift CLI e Kustomize:

```bash
oc apply -k https://github.com/gauss-infinito/survey-app/k8s/
```

Dentro do pod do HashiCorp Vault, criar segredo no Vault:

```bash
vault kv put secret/survey \
  DB_USER=SEU_USUARIO \
  DB_PASSWORD=SUA_SENHA \
  JWT_SECRET=SEU_SEGREDO_JWT
```

Estrutura de Segredos no Vault:

```
Path: secret/data/survey

Campos esperados:
- DB_USER
- DB_PASSWORD
- JWT_SECRET
```

Ajustar autenticação:

```
export AVP_TYPE=vault
export AVP_AUTH_TYPE=token
export VAULT_ADDR=http://SEU-VAULT:8200
export VAULT_TOKEN=SEU_TOKEN
argocd-vault-plugin generate ...secret.yaml | oc apply -f -
oc rollout restart deployment survey-api
```

A API é exposta via OpenShift Route:

```bash
https://survey-frontend-<projeto>.apps...
https://survey-api-<projeto>.apps...
```

Os manifests Kubernetes/OpenShift estão disponíveis no diretório `/k8s`.

## Troubleshooting

Problemas comuns:

* Variáveis não atualizadas → executar rollout restart
* Falha de conexão com DB → verificar DB_HOST e Service
* Secrets não substituídos → validar execução do plugin

## Estrutura do Projeto

```
survey-app/
├── frontend/        # Aplicação Next.js
├── backend/         # API Node.js (Express)
└───k8s/             # Manifests Kubernetes
    ├── backend/ 
    ├── base/ 
    ├── database/ 
    ├── frontend/ 
    ├── openshift/   # Configurações específicas do OpenShift
    └───vault/
```

## Licença

Este projeto está licenciado sob a **GNU General Public License v3.0 (GPLv3)**.

Isso significa que você pode usar, modificar e distribuir este software, desde que qualquer trabalho derivado também seja distribuído sob a mesma licença.

