import React, { useState } from "react";
import { Plus, Pencil, Trash2, Settings as SettingsIcon } from "lucide-react";

const users = [
  { name: "Marie Dupont", email: "marie@mail.com", role: "Patient", status: "Actif" },
  { name: "Gingivite", email: "jean@mail.com", role: "Patient", status: "Actif" },
  { name: "Dr. Paul Leroy", email: "paul@mail.com", role: "Admin", status: "Actif" },
  { name: "Sophie Durand", email: "sophie@mail.cone", role: "Patient", status: "Inactif" },
];

function StatusBadge({ status }) {
  const isActive = status === "Actif";
  return (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
        isActive
          ? "bg-emerald-50 text-emerald-600"
          : "bg-rose-50 text-rose-500"
      }`}
    >
      {status}
    </span>
  );
}

function UsersTable() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900">Utilisateurs</h2>
        <button className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Plus size={16} />
          Ajouter
        </button>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400 text-xs border-b border-gray-100">
            <th className="font-medium py-2 pr-4">Nom</th>
            <th className="font-medium py-2 pr-4">Email</th>
            <th className="font-medium py-2 pr-4">Rôle</th>
            <th className="font-medium py-2 pr-4">Statut</th>
            <th className="font-medium py-2 pr-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.email} className="border-b border-gray-50 last:border-0">
              <td className="py-3 pr-4 text-gray-900 font-medium">{u.name}</td>
              <td className="py-3 pr-4 text-gray-500">{u.email}</td>
              <td className="py-3 pr-4 text-gray-500">{u.role}</td>
              <td className="py-3 pr-4">
                <StatusBadge status={u.status} />
              </td>
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2">
                  <button
                    aria-label="Modifier"
                    className="w-7 h-7 flex items-center justify-center rounded-md bg-indigo-50 text-indigo-500 hover:bg-indigo-100"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    aria-label="Supprimer"
                    className="w-7 h-7 flex items-center justify-center rounded-md bg-rose-50 text-rose-500 hover:bg-rose-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-center gap-2 mt-5 text-sm text-gray-500">
        <button className="w-7 h-7 rounded-md bg-indigo-500 text-white font-medium">1</button>
        <button className="w-7 h-7 rounded-md hover:bg-gray-50">2</button>
        <button className="w-7 h-7 rounded-md hover:bg-gray-50">3</button>
        <span>...</span>
        <button className="w-7 h-7 rounded-md hover:bg-gray-50">10</button>
      </div>
    </div>
  );
}

function SettingsPanel() {
  const [tab, setTab] = useState("general");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-md bg-indigo-500 flex items-center justify-center text-white">
          <SettingsIcon size={14} />
        </div>
        <h2 className="text-sm font-semibold tracking-wide text-gray-900">
          PARAMÈTRES
        </h2>
      </div>

      <p className="text-sm text-gray-400 mb-2">Paramètres</p>

      <div className="flex items-center gap-6 border-b border-gray-100 mb-5">
        <button
          onClick={() => setTab("general")}
          className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
            tab === "general"
              ? "border-indigo-500 text-indigo-600"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Général
        </button>
        <button
          onClick={() => setTab("securite")}
          className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
            tab === "securite"
              ? "border-indigo-500 text-indigo-600"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Sécurité
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-1.5 border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50">
          <Pencil size={14} />
          Modifier
        </button>
        <button className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium px-4 py-2 rounded-lg">
          <Trash2 size={14} />
          Supprimer
        </button>
      </div>
    </div>
  );
}

export default function UsersAndSettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans p-8 max-w-3xl mx-auto">
      <UsersTable />
      <SettingsPanel />
    </div>
  );
}
