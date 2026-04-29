"use client";

import {
  CalendarCheck,
  Download,
  Heart,
  Lock,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

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
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function exportCsv(rows: Rsvp[]) {
  const headers = ["Name", "Phone", "Status", "Guests Count", "Note", "Submitted At"];

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      [
        row.name,
        row.phone,
        row.attending,
        row.guests_count,
        row.note || "",
        formatDate(row.created_at),
      ]
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "mina-mirna-rsvp-list.csv";
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

    const response = await fetch("/api/admin/rsvps", {
      headers: { "x-admin-password": pass },
    });

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

    if (response.ok) {
      setRsvps((items) => items.filter((item) => item.id !== id));
    }
  }

  const filtered = useMemo(() => {
    const text = search.toLowerCase();

    return rsvps.filter((item) => {
      const matchesSearch = `${item.name} ${item.phone} ${item.note || ""}`
        .toLowerCase()
        .includes(text);

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
      <main className="adminPage">
        <div className="goldGlow goldGlowOne" />
        <div className="goldGlow goldGlowTwo" />

        <div className="adminContainer">
          <nav className="weddingNav">
            <div className="weddingBrand">
              <span className="brandIcon">
                <Heart size={20} fill="currentColor" />
              </span>
              Wedding Admin
            </div>

            <Link className="adminLink" href="/">
              Guest Page
            </Link>
          </nav>

          <section className="adminLoginShell">
            <form className="adminLoginCard" onSubmit={login}>
              <div className="loginIcon">
                <ShieldCheck size={34} />
              </div>

              <p className="formKicker">PRIVATE DASHBOARD</p>
              <h1>Admin Login</h1>
              <p>Enter your private admin password to manage all RSVP responses.</p>

              {error && <div className="alert error">{error}</div>}

              <label className="field">
                <span>Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </label>

              <button className="submitBtn" type="submit" disabled={loading}>
                <Lock size={19} />
                {loading ? "Checking..." : "Login"}
              </button>
            </form>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="adminPage">
      <div className="goldGlow goldGlowOne" />
      <div className="goldGlow goldGlowTwo" />

      <div className="adminContainer">
        <nav className="weddingNav">
          <div className="weddingBrand">
            <span className="brandIcon">
              <Heart size={20} fill="currentColor" />
            </span>
            Wedding Admin
          </div>

          <Link className="adminLink" href="/">
            Guest Page
          </Link>
        </nav>

        <section className="adminHeader">
          <div>
            <p className="formKicker">MINA & MIRNA</p>
            <h1>RSVP Dashboard</h1>
            <p>Monitor confirmations, guest count, notes, and export the full list.</p>
          </div>

          <button className="goldButton" onClick={() => loadData()} type="button">
            <RefreshCw size={17} />
            {loading ? "Loading..." : "Refresh"}
          </button>
        </section>

        <section className="statsGrid">
          <div className="statCard">
            <span>
              <CalendarCheck size={22} />
            </span>
            <p>Total Forms</p>
            <strong>{stats.totalForms}</strong>
          </div>

          <div className="statCard">
            <span>
              <Heart size={22} />
            </span>
            <p>Confirmed</p>
            <strong>{stats.confirmed}</strong>
          </div>

          <div className="statCard">
            <span>
              <Users size={22} />
            </span>
            <p>Total Headcount</p>
            <strong>{stats.headcount}</strong>
          </div>

          <div className="statCard">
            <span>
              <ShieldCheck size={22} />
            </span>
            <p>Maybe / No</p>
            <strong>
              {stats.maybe}/{stats.declined}
            </strong>
          </div>
        </section>

        <section className="adminPanel">
          <div className="panelHeader">
            <div>
              <h2>Guest List</h2>
              <p>{filtered.length} result(s) shown from {rsvps.length} total forms.</p>
            </div>

            <button className="outlineButton" onClick={() => exportCsv(filtered)} type="button">
              <Download size={17} />
              Export CSV
            </button>
          </div>

          <div className="adminToolbar">
            <label className="field searchField">
              <span>
                <Search size={15} />
                Search
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, phone, or note..."
              />
            </label>

            <label className="field statusField">
              <span>Status</span>
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="yes">Confirmed</option>
                <option value="maybe">Maybe</option>
                <option value="no">Declined</option>
              </select>
            </label>
          </div>

          {error && <div className="alert error">{error}</div>}

          <div className="tableWrap">
            <table className="adminTable">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>People</th>
                  <th>Note</th>
                  <th>Date</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.name}</strong>
                    </td>
                    <td>{item.phone}</td>
                    <td>
                      <span className={`badge ${item.attending}`}>
                        {item.attending === "yes"
                          ? "Confirmed"
                          : item.attending === "maybe"
                            ? "Maybe"
                            : "Declined"}
                      </span>
                    </td>
                    <td>
                      <strong>{item.guests_count}</strong>
                    </td>
                    <td>{item.note || "-"}</td>
                    <td>{formatDate(item.created_at)}</td>
                    <td>
                      <button className="deleteBtn" onClick={() => deleteRow(item.id)} type="button">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="emptyCell">
                      No RSVPs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}