"use client";

import { useState } from "react";
import { useFormFeedback } from "@/components/hooks/useFormFeedback";
import MessageForm from "@/components/MessageForm";
import UserItem from "@/components/UserItem";

import {
  getUsers,
  updateUserRequest,
  updateUserStatus,
} from "@/services/api";

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

  const handleSearch = async () => {
    try {
      startLoading();

      const data = await getUsers(filters);
      setUsers(data);

      showSuccess("Usuários carregados");
    } catch (err) {
      showError(err.message);
    } finally {
      stopLoading();
    }
  };

  const handleUpdateUser = async (id, payload) => {
    try {
      startLoading();

      await updateUserRequest(id, payload);

      showSuccess("Usuário atualizado");
      await handleSearch();
    } catch (err) {
      showError(err.message);
    } finally {
      stopLoading();
    }
  };

  const handleToggleStatus = async (id, active) => {
    try {
      startLoading();

      await updateUserStatus(id, !active);

      showSuccess("Status atualizado");
      await handleSearch();
    } catch (err) {
      showError(err.message);
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

      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Buscando..." : "Buscar"}
      </button>

      <hr />

      {/* Lista */}
      {users.map((user) => (
        <UserItem
          key={user.id}
          user={user}
          onUpdate={handleUpdateUser}
          onToggleStatus={handleToggleStatus}
        />
      ))}
    </div>
  );
}
