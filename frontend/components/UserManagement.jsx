import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000/users"; // ajuste se necessário

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    role: "",
    active: ""
  });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  async function fetchUsers() {
    setLoading(true);

    const query = new URLSearchParams();

    if (filters.role) query.append("role", filters.role);
    if (filters.active !== "") query.append("active", filters.active);

    const res = await fetch(`${API_URL}?${query.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    setUsers(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  async function updateUser(id, payload) {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    fetchUsers();
  }

  async function toggleStatus(id, active) {
    await fetch(`${API_URL}/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ active: !active })
    });

    fetchUsers();
  }

  return (
    <div className="container">
      <h2>Gerenciar Usuários</h2>

      {/* Filtros */}
      <div className="filters">
        <select
          value={filters.role}
          onChange={(e) =>
            setFilters({ ...filters, role: e.target.value })
          }
        >
          <option value="">Todos os perfis</option>
          <option value="administrator">Administrador</option>
          <option value="researcher">Pesquisador</option>
          <option value="respondent">Respondente</option>
        </select>

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
      </div>

      {/* Tabela */}
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Perfil</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>

                <td>
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
                </td>

                <td>
                  {user.active ? "Ativo" : "Inativo"}
                </td>

                <td>
                  <button
                    onClick={() =>
                      toggleStatus(user.id, user.active)
                    }
                  >
                    {user.active ? "Desativar" : "Ativar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
