"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarDays, CheckCircle2, Heart, MapPin, PartyPopper, Users } from "lucide-react";

const wedding = {
  groom: process.env.NEXT_PUBLIC_WEDDING_GROOM || "Your Brother",
  bride: process.env.NEXT_PUBLIC_WEDDING_BRIDE || "Bride Name",
  date: process.env.NEXT_PUBLIC_WEDDING_DATE || "Friday, 20 September 2026",
  time: process.env.NEXT_PUBLIC_WEDDING_TIME || "7:00 PM",
  location: process.env.NEXT_PUBLIC_WEDDING_LOCATION || "Wedding Hall, Cairo",
};

export default function HomePage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    attending: "yes",
    guestsCount: 1,
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submitRsvp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const response = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(result.message || "Something went wrong.");
      return;
    }

    setMessage("Thank you! Your RSVP has been saved.");
    setForm({ name: "", phone: "", attending: "yes", guestsCount: 1, note: "" });
  }

  return (
    <main className="page">
      <div className="container">
        <nav className="nav">
          <div className="brand">
            <div className="logo"><Heart size={24} fill="currentColor" /></div>
            Wedding RSVP
          </div>
          <Link className="navLink" href="/admin">Admin</Link>
        </nav>

        <section className="hero">
          <div className="card heroText">
            <div className="kicker"><PartyPopper size={16} /> You are invited</div>
            <h1>
              {wedding.groom} <span className="gradientText">&</span><br /> {wedding.bride}
            </h1>
            <p className="subtitle">
              Please confirm if you will attend the wedding so we can prepare the seats, food, and guest list correctly.
            </p>
            <div className="details">
              <div className="detail"><CalendarDays size={21} /> {wedding.date} — {wedding.time}</div>
              <div className="detail"><MapPin size={21} /> {wedding.location}</div>
              <div className="detail"><Users size={21} /> Add how many people will come with you</div>
            </div>
          </div>

          <form className="card formCard" onSubmit={submitRsvp}>
            <h2 className="formTitle">Confirm Attendance</h2>
            <p className="formSubtitle">Fill this simple form once.</p>

            <div className="grid">
              {message && <div className="alert success">{message}</div>}
              {error && <div className="alert error">{error}</div>}

              <label className="label">
                Full Name
                <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Example: David Samy" required />
              </label>

              <label className="label">
                Phone Number
                <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="01xxxxxxxxx" required />
              </label>

              <div className="grid two">
                <label className="label">
                  Attendance
                  <select className="select" value={form.attending} onChange={(e) => setForm({ ...form, attending: e.target.value })}>
                    <option value="yes">Yes, I will attend</option>
                    <option value="maybe">Maybe</option>
                    <option value="no">No, sorry</option>
                  </select>
                </label>

                <label className="label">
                  Number of People
                  <input className="input" type="number" min="0" max="20" value={form.guestsCount} onChange={(e) => setForm({ ...form, guestsCount: Number(e.target.value) })} required />
                </label>
              </div>

              <label className="label">
                Note Optional
                <textarea className="textarea" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Any note for the family?" />
              </label>

              <button className="primaryBtn" disabled={loading} type="submit">
                <CheckCircle2 size={20} /> {loading ? "Saving..." : "Send RSVP"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
