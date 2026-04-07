"use client";

import { useState } from "react";

export default function UserItem({ user, onUpdate, onToggleStatus }) {
  const [form, setForm] = useState({
    role: user.role,
  });

  const [dirty, setDirty] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setDirty(true);
  };

  const handleSave = () => {
    onUpdate(user.id, form);
    setDirty(false);
  };

  return (
    <div className="mb-lg">
      <p><strong>{user.email}</strong></p>

      <label>Perfil:</label><br />
      <select
        value={form.role}
        onChange={(e) => handleChange("role", e.target.value)}
      >
        <option value="administrator">Administrador</option>
        <option value="researcher">Pesquisador</option>
        <option value="respondent">Respondente</option>
      </select>

      <br /><br />

      <p>Status: {user.active ? "Ativo" : "Inativo"}</p>

      {/* Botões */}
      <div className="flex gap-sm">
        <button
          onClick={handleSave}
          disabled={!dirty}
        >
          Salvar
        </button>

        <button
          onClick={() => onToggleStatus(user.id, user.active)}
        >
          {user.active ? "Desativar" : "Ativar"}
        </button>
      </div>

      <hr />
    </div>
  );
}
