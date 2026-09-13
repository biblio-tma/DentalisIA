import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  LayoutDashboard,
  Users,
  FlaskConical,
  Building2,
  Stethoscope,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Tableau de bord", icon: LayoutDashboard, active: true },
  { label: "Utilisateurs", icon: Users },
  { label: "Analyses", icon: FlaskConical },
  { label: "Centres de santé", icon: Building2 },
  { label: "Pathologies", icon: Stethoscope },
  { label: "Base de connaissances", icon: BookOpen },
  { label: "Statistiques", icon: BarChart3 },
  { label: "Paramètres", icon: Settings },
];

const stats = [
  { label: "Utilisateurs", value: "1 256", delta: "+12% ce mois", dot: null },
  { label: "Analyses", value: "2 458", delta: "+18% ce mois", dot: null },
  { label: "Centres de santé", value: "78", delta: "+5 ce mois", dot: "#22C55E" },
  { label: "Pathologies", value: "24", delta: "Total", dot: null },
];

const chartData = [
  { date: "15 Avr", analyses: 210, valides: 150 },
  { date: "18 Avr", analyses: 260, valides: 190 },
  { date: "20 Avr", analyses: 300, valides: 200 },
  { date: "23 Avr", analyses: 240, valides: 180 },
  { date: "26 Avr", analyses: 320, valides: 230 },
  { date: "30 Avr", analyses: 180, valides: 140 },
  { date: "03 Mai", analyses: 300, valides: 210 },
  { date: "05 Mai", analyses: 340, valides: 240 },
  { date: "08 Mai", analyses: 260, valides: 200 },
  { date: "11 Mai", analyses: 360, valides: 250 },
  { date: "13 Mai", analyses: 300, valides: 220 },
  { date: "15 Mai", analyses: 380, valides: 260 },
];

function StatCard({ label, value, delta, dot }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex-1 min-w-[150px]">
      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
        {dot && (
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: dot }}
          />
        )}
        {label}
      </div>
      <div className="text-2xl font-semibold text-gray-900 mt-2">{value}</div>
      <div className="text-xs text-emerald-500 font-medium mt-1">{delta}</div>
    </div>
  );
}

export default function DentAIDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-sm">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1E1B33] text-gray-300 flex flex-col py-6 px-4">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-7 h-7 rounded-md bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
            D
          </div>
          <span className="text-white font-semibold text-base">
            DentAI Admin
          </span>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-indigo-500 text-white font-medium"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-white/5 hover:text-white mt-4">
          <LogOut size={17} />
          Déconnexion
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">
          Vue d'ensemble
        </h1>

        {/* Stat cards */}
        <div className="flex gap-4 flex-wrap mb-6">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">
            Graphique des analyses (30 derniers jours)
          </h2>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F1F4" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="analyses"
                  stroke="#4F46E5"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="valides"
                  stroke="#A5B4FC"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
