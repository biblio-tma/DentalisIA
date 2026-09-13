import React, { useState, useRef, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { BarChart3, Users2, ChevronDown, Check } from "lucide-react";

const pathologies = [
  { name: "Carie dentaire", value: 30, color: "#4F46E5" },
  { name: "Gingivite", value: 20, color: "#818CF8" },
  { name: "Plaque dentaire", value: 20, color: "#C7D2FE" },
  { name: "Sensibilité dentaire", value: 20, color: "#E0E7FF" },
  { name: "Autres", value: 10, color: "#F1F1FA" },
];

const urgences = [
  { name: "Faible", value: 60, color: "#4F46E5" },
  { name: "Moyen", value: 30, color: "#FBBF24" },
  { name: "Élevé", value: 10, color: "#F87171" },
];

const stats = [
  { label: "Analyses totales", value: "2 458" },
  { label: "Patients actifs", value: "1 256" },
  { label: "Taux de détection", value: "92%" },
];

function LegendRow({ items, isDark }) {
  return (
    <div className="flex flex-col gap-2 ml-4">
      {items.map((item) => (
        <div key={item.name} className="flex items-center gap-2 text-xs">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span style={{ color: isDark ? "#D1D5DB" : "#6B7280" }}>{item.name}</span>
          <span
            className="font-medium ml-auto"
            style={{ color: isDark ? "#FFFFFF" : "#000000" }}
          >
            {item.value}%
          </span>
        </div>
      ))}
    </div>
  );
}

function DonutCard({ title, data, isDark }) {
  return (
    <div
      className="rounded-2xl border shadow-sm p-5 flex-1"
      style={{
        backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
        borderColor: isDark ? "#374151" : "#F3F4F6",
      }}
    >
      <h3
        className="text-sm font-semibold mb-3"
        style={{ color: isDark ? "#FFFFFF" : "#000000" }}
      >
        {title}
      </h3>
      <div className="flex items-center">
        <div style={{ width: 110, height: 110 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={32}
                outerRadius={50}
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                {data.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <LegendRow items={data} isDark={isDark} />
      </div>
    </div>
  );
}

function StatsHeader({ isDark }) {
  return (
    <div
      className="rounded-2xl border shadow-sm p-6 mb-6"
      style={{
        backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
        borderColor: isDark ? "#374151" : "#F3F4F6",
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <h2
          className="text-base font-semibold flex items-center gap-2"
          style={{ color: isDark ? "#FFFFFF" : "#000000" }}
        >
          <BarChart3 size={18} className="text-indigo-500" />
          Statistiques
        </h2>
        <button
          className="flex items-center gap-1.5 border text-sm font-medium px-3 py-1.5 rounded-lg"
          style={{
            borderColor: isDark ? "#4B5563" : "#E5E7EB",
            color: isDark ? "#D1D5DB" : "#4B5563",
          }}
        >
          30 derniers jours
          <ChevronDown size={14} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-xs mb-1" style={{ color: isDark ? "#9CA3AF" : "#9CA3AF" }}>
              {s.label}
            </p>
            <p
              className="text-xl font-semibold"
              style={{ color: isDark ? "#FFFFFF" : "#000000" }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThemeSelect({ theme, onChange, isDark }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = ["Clair", "Sombre"];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-sm font-medium"
        style={{ color: isDark ? "#FFFFFF" : "#000000" }}
      >
        {theme}
        <ChevronDown size={14} className="text-gray-400" />
      </button>

      {open && (
        <div
          className="absolute left-0 mt-2 w-32 border rounded-lg shadow-lg py-1 z-10"
          style={{
            backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
            borderColor: isDark ? "#374151" : "#F3F4F6",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-sm"
              style={{ color: isDark ? "#FFFFFF" : "#000000" }}
            >
              {opt}
              {theme === opt && <Check size={14} className="text-indigo-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function UserManagementCard({ theme, onThemeChange, isDark }) {
  return (
    <div
      className="rounded-2xl border shadow-sm p-6 mt-6"
      style={{
        backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
        borderColor: isDark ? "#374151" : "#F3F4F6",
      }}
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="w-6 h-6 rounded-md bg-indigo-500 flex items-center justify-center text-white">
          <Users2 size={14} />
        </div>
        <h2
          className="text-sm font-semibold tracking-wide"
          style={{ color: isDark ? "#FFFFFF" : "#000000" }}
        >
          GESTION DES UTILISATEURS
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <p className="text-xs mb-1" style={{ color: "#9CA3AF" }}>
            Nom de fonction
          </p>
          <p className="text-sm font-medium" style={{ color: isDark ? "#FFFFFF" : "#000000" }}>
            Landréal
          </p>
        </div>
        <div>
          <p className="text-xs mb-1" style={{ color: "#9CA3AF" }}>
            Langue
          </p>
          <p className="text-sm font-medium" style={{ color: isDark ? "#FFFFFF" : "#000000" }}>
            Français
          </p>
        </div>
        <div>
          <p className="text-xs mb-1" style={{ color: "#9CA3AF" }}>
            Sécurité active
          </p>
          <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
            Activée
          </span>
        </div>
        <div>
          <p className="text-xs mb-1" style={{ color: "#9CA3AF" }}>
            Thème
          </p>
          <ThemeSelect theme={theme} onChange={onThemeChange} isDark={isDark} />
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button className="text-sm text-indigo-500 font-medium hover:text-indigo-600">
          Modifier
        </button>
      </div>
    </div>
  );
}

export default function StatisticsPage() {
  const [theme, setTheme] = useState("Clair");
  const isDark = theme === "Sombre";

  return (
    <div
      className="min-h-screen font-sans p-8 max-w-3xl mx-auto transition-colors"
      style={{ backgroundColor: isDark ? "#111827" : "#F9FAFB" }}
    >
      <StatsHeader isDark={isDark} />

      <div className="flex gap-6">
        <DonutCard title="Pathologies les plus fréquentes" data={pathologies} isDark={isDark} />
        <DonutCard title="Répartition des urgences" data={urgences} isDark={isDark} />
      </div>

      <UserManagementCard theme={theme} onThemeChange={setTheme} isDark={isDark} />
    </div>
  );
}
