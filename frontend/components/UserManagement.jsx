"use client";

import { useState } from "react";
import { useFormFeedback } from "@/components/hooks/useFormFeedback";
import MessageForm from "@/components/MessageForm";

const API_URL = "http://localhost:3000/users";

export default function UserManagement() {
  const {
    loading,
    error,
    success,
    startLoading,
    stopLoading,
    showError,
    showSuccess,
  } = useFormFeedback();

  const [filters, setFilters] = useState({
    role: "",
    active: "",
  });

  const [users, setUsers] = useState([]);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      startLoading();

      const query = new URLSearchParams();

      if (filters.role) query.append("role", filters.role);
      if (filters.active !== "") query.append("active", filters.active);

      const res = await fetch(`${API_URL}?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUsers(data);

      showSuccess("Usuários carregados");
    } catch (err) {
      showError("Erro ao buscar usuários");
    } finally {
      stopLoading();
    }
  };

  const updateUser = async (id, payload) => {
    try {
      startLoading();

      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      showSuccess("Usuário atualizado");
      await fetchUsers();
    } catch (err) {
      showError("Erro ao atualizar usuário");
    } finally {
      stopLoading();
    }
  };

  const toggleStatus = async (id, active) => {
    try {
      startLoading();

      await fetch(`${API_URL}/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ active: !active }),
      });

      showSuccess("Status atualizado");
      await fetchUsers();
    } catch (err) {
      showError("Erro ao atualizar status");
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="w-285 ml-lg font-system">
      <h2>Gerenciar usuários</h2>

      <MessageForm error={error} success={success} />

      {/* Filtros */}
      <label>Perfil:</label><br />
      <select
        value={filters.role}
        onChange={(e) =>
          setFilters({ ...filters, role: e.target.value })
        }
      >
        <option value="">Todos</option>
        <option value="administrator">Administrador</option>
        <option value="researcher">Pesquisador</option>
        <option value="respondent">Respondente</option>
      </select>

      <br /><br />

      <label>Status:</label><br />
      <select
        value={filters.active}
        onChange={(e) =>
          setFilters({ ...filters, active: e.target.value })
        }
      >
        <option value="">Todos</option>
        <option value="true">Ativos</option>
        <option value="false">Inativos</option>
      </select>

      <br /><br />

      <button onClick={fetchUsers} disabled={loading}>
        {loading ? "Buscando..." : "Buscar"}
      </button>

      <hr />

      {/* Lista */}
      {users.map((user) => (
        <div key={user.id} className="mb-lg">
          <p><strong>{user.email}</strong></p>

          <label>Perfil:</label><br />
          <select
            value={user.role}
            onChange={(e) =>
              updateUser(user.id, { role: e.target.value })
            }
          >
            <option value="administrator">Administrador</option>
            <option value="researcher">Pesquisador</option>
            <option value="respondent">Respondente</option>
          </select>

          <p>Status: {user.active ? "Ativo" : "Inativo"}</p>

          <button
            onClick={() => toggleStatus(user.id, user.active)}
          >
            {user.active ? "Desativar" : "Ativar"}
          </button>

          <hr />
        </div>
      ))}
    </div>
  );
}
