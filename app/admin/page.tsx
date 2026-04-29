"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Download, Heart, Lock, Search, Trash2 } from "lucide-react";

type Rsvp = {
  id: string;
  name: string;
  phone: string;
  attending: "yes" | "no" | "maybe";
  guests_count: number;
  note: string | null;
  created_at: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function exportCsv(rows: Rsvp[]) {
  const headers = ["Name", "Phone", "Status", "Guests Count", "Note", "Submitted At"];
  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      [row.name, row.phone, row.attending, row.guests_count, row.note || "", formatDate(row.created_at)]
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "wedding-rsvp-list.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [savedPassword, setSavedPassword] = useState("");
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  async function loadData(pass = savedPassword) {
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/rsvps", { headers: { "x-admin-password": pass } });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(result.message || "Cannot load RSVPs.");
      return;
    }
    setRsvps(result.data || []);
  }

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavedPassword(password);
    await loadData(password);
  }

  async function deleteRow(id: string) {
    if (!confirm("Delete this RSVP?")) return;
    const response = await fetch(`/api/admin/rsvps?id=${id}`, {
      method: "DELETE",
      headers: { "x-admin-password": savedPassword },
    });
    if (response.ok) setRsvps((items) => items.filter((item) => item.id !== id));
  }

  const filtered = useMemo(() => {
    const text = search.toLowerCase();
    return rsvps.filter((item) => {
      const matchesSearch = `${item.name} ${item.phone} ${item.note || ""}`.toLowerCase().includes(text);
      const matchesFilter = filter === "all" || item.attending === filter;
      return matchesSearch && matchesFilter;
    });
  }, [rsvps, search, filter]);

  const stats = useMemo(() => {
    const yes = rsvps.filter((item) => item.attending === "yes");
    return {
      totalForms: rsvps.length,
      confirmed: yes.length,
      maybe: rsvps.filter((item) => item.attending === "maybe").length,
      declined: rsvps.filter((item) => item.attending === "no").length,
      headcount: yes.reduce((sum, item) => sum + Number(item.guests_count || 0), 0),
    };
  }, [rsvps]);

  if (!savedPassword || error === "Unauthorized") {
    return (
      <main className="page">
        <div className="container">
          <nav className="nav">
            <div className="brand"><div className="logo"><Heart size={24} fill="currentColor" /></div>Wedding Admin</div>
            <Link className="navLink" href="/">Guest Page</Link>
          </nav>
          <form className="card loginBox" onSubmit={login}>
            <h1 style={{ fontSize: 36, margin: "0 0 10px", letterSpacing: -1 }}>Admin Login</h1>
            <p className="formSubtitle">Enter your private admin password.</p>
            {error && <div className="alert error">{error}</div>}
            <div className="grid" style={{ marginTop: 14 }}>
              <label className="label">
                Password
                <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </label>
              <button className="primaryBtn" type="submit"><Lock size={19} /> Login</button>
            </div>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container">
        <nav className="nav">
          <div className="brand"><div className="logo"><Heart size={24} fill="currentColor" /></div>Wedding Admin</div>
          <Link className="navLink" href="/">Guest Page</Link>
        </nav>

        <section className="stats">
          <div className="card stat"><div className="statLabel">Total Forms</div><div className="statValue">{stats.totalForms}</div></div>
          <div className="card stat"><div className="statLabel">Confirmed</div><div className="statValue">{stats.confirmed}</div></div>
          <div className="card stat"><div className="statLabel">Maybe / No</div><div className="statValue">{stats.maybe}/{stats.declined}</div></div>
          <div className="card stat"><div className="statLabel">Total Headcount</div><div className="statValue">{stats.headcount}</div></div>
        </section>

        <section className="card formCard">
          <h2 className="formTitle">Guest List</h2>
          <p className="formSubtitle">Monitor who will attend the wedding.</p>

          <div className="toolbar">
            <label className="label">
              <span><Search size={15} /> Search</span>
              <input className="input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, phone, note..." />
            </label>
            <label className="label">
              Status
              <select className="select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="yes">Yes</option>
                <option value="maybe">Maybe</option>
                <option value="no">No</option>
              </select>
            </label>
            <div style={{ display: "flex", gap: 8, alignItems: "end", flexWrap: "wrap" }}>
              <button className="secondaryBtn" onClick={() => loadData()} type="button">{loading ? "Loading..." : "Refresh"}</button>
              <button className="secondaryBtn" onClick={() => exportCsv(filtered)} type="button"><Download size={17} /> CSV</button>
            </div>
          </div>

          {error && <div className="alert error">{error}</div>}

          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th><th>Phone</th><th>Status</th><th>People</th><th>Note</th><th>Date</th><th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.name}</strong></td>
                    <td>{item.phone}</td>
                    <td><span className={`badge ${item.attending}`}>{item.attending}</span></td>
                    <td>{item.guests_count}</td>
                    <td>{item.note || "-"}</td>
                    <td>{formatDate(item.created_at)}</td>
                    <td><button className="deleteBtn" onClick={() => deleteRow(item.id)}><Trash2 size={16} /></button></td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={7}>No RSVPs found.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
