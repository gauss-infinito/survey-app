# Visão Geral

## 1. Requisitos

[Histórias de Usuários](requisitos.md)

## 2. Arquitetura recomendada

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

## 3. Estrutura de namespaces (projeto OpenShift)

Sugestão:
- enquete-dev
- enquete-hml
- enquete-prod

## 4. RBAC (essencial no OpenShift)

OpenShift é restritivo por padrão (SCC) — isso pega muita gente.

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

