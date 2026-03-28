# Visão Geral

## 1. Requisitos

[Histórias de Usuários](requisitos.md)

## 2. Arquitetura

**Frontend (React / Next.js)**

- Servido via container
- Pode ser estático (Nginx) ou SSR

**Backend (API)**

- REST API (Node.js, Java, etc.)
- Responsável por:
  - autenticação
  - regras de negócio
  - persistência

**Banco de dados**

- PostgreSQL (recomendado)
- Rodando dentro do cluster ou externo

**Camadas do OpenShift**

- Route → entrada HTTP
- Service → descoberta interna
- Deployment → pods
- ConfigMap / Secret → configuração
- RBAC → segurança

## 3. RBAC (essencial no OpenShift)

OpenShift é restritivo por padrão (SCC — Security Context Constraints)

Service Account:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: enquete-api-sa
```

Role (permissões mínimas):

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: enquete-api-role
rules:
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "list"]
```

RoleBinding:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: enquete-api-binding
subjects:
  - kind: ServiceAccount
    name: enquete-api-sa
roleRef:
  kind: Role
  name: enquete-api-role
  apiGroup: rbac.authorization.k8s.io
```

## 4. Gerenciamento SCC

Se a app precisar escrever no filesystem:

```bash
oc adm policy add-scc-to-user anyuid -z enquete-api-sa
```

Melhor alternativa (mais seguro):
- usar filesystem read-only, e
- usar /tmp ou volume

## 5. Boas práticas específicas do OpenShift

**Segurança:**
- não usar root (OpenShift bloqueia),
- evitar `anyuid` se possível, e
- usar `SecurityContext`.

**Imagens8**
- base: `ubi8` (Red Hat), e
- evitar Alpine em ambientes enterprise.

**Configuração:**
- tudo via env vars (12-factor).

**Deploy:**
- usar OpenShift GitOps (Argo CD), ou
- usar OpenShift Pipelines (Tekton).

## 6. Deploy

Com kustomize:

```bash
oc apply -k k8s/
```
