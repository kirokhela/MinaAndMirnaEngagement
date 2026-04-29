"use client";

import {
  CheckCircle2,
  Crown,
  Heart,
  MapPin,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const wedding = {
  groom: process.env.NEXT_PUBLIC_WEDDING_GROOM || "Mina",
  bride: process.env.NEXT_PUBLIC_WEDDING_BRIDE || "Mirna",
  date: process.env.NEXT_PUBLIC_WEDDING_DATE || "Friday, 15 May 2026",
  time: process.env.NEXT_PUBLIC_WEDDING_TIME || "6:00 PM",
  location:
    process.env.NEXT_PUBLIC_WEDDING_LOCATION ||
    "Fleet club,ElZamalek",
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
    setForm({
      name: "",
      phone: "",
      attending: "yes",
      guestsCount: 1,
      note: "",
    });
  }

  return (
    <main className="weddingPage">
      <div className="goldGlow goldGlowOne" />
      <div className="goldGlow goldGlowTwo" />

      <div className="weddingContainer">
        <nav className="weddingNav">
          <div className="weddingBrand">
            <span className="brandIcon">
              <Heart size={20} fill="currentColor" />
            </span>
            Mina & Mirna
          </div>

          <Link className="adminLink" href="/admin">
            Admin
          </Link>
        </nav>

        <section className="weddingHero">
          <div className="invitationCard">
            <div className="corner cornerTL" />
            <div className="corner cornerTR" />
            <div className="corner cornerBL" />
            <div className="corner cornerBR" />

            <div className="crossMark">✝</div>

            <div className="inviteKicker">
              <Sparkles size={16} />
              Together with our families
            </div>

            <h1>
              {wedding.groom}
              <span>&</span>
              {wedding.bride}
            </h1>

            <p className="inviteText">invite you to celebrate our</p>

            <h2>Engagement Ceremony</h2>

            <div className="dateBox">
              <div>
                <strong>Friday</strong>
              </div>

              <div className="mainDate">
                <small>May</small>
                <small>15</small>
                <small>2026</small>
              </div>

              <div>
                <strong>{wedding.time}</strong>
              </div>
            </div>

            <div className="locationBox">
              <MapPin size={20} />
              <p>{wedding.location}</p>
            </div>

            <div className="heroDetails">
          

                <a
  className="locationButton"
  href="https://www.google.com/maps/place/FLEET+CLUB+EL+GEZIRAH/@30.0404173,31.2235516,17z/data=!3m1!4b1!4m6!3m5!1s0x1458410008dedd15:0xad624ac096c218b7!8m2!3d30.0404173!4d31.2261265!16s%2Fg%2F11h6n12nwz?entry=ttu&g_ep=EgoyMDI2MDQyNy4wIKXMDSoASAFQAw%3D%3D"
  target="_blank"
  rel="noopener noreferrer"
>
  <MapPin size={18} />
  Open Location
</a>
  
            </div>
          </div>

          <form className="rsvpCard" onSubmit={submitRsvp}>
        <div className="formTopOrnament">◆</div>

        <div className="formHeader">
          <span>
            <Crown size={20} />
          </span>
          <div>
            <p className="formKicker">RSVP FORM</p>
            <h3>Confirm Attendance</h3>
            <p>Please fill this form once for accurate seating.</p>
          </div>
        </div>

        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}

        <div className="formBody">
          <label className="field">
            <span>Full Name</span>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Example: David Samy"
              required
            />
          </label>

    <label className="field">
  <span>Phone Number</span>
  <input
    value={form.phone}
    onChange={(e) => {
      const onlyNumbers = e.target.value.replace(/\D/g, "").slice(0, 11);
      setForm({ ...form, phone: onlyNumbers });
    }}
    placeholder="01xxxxxxxxxxxx"
    inputMode="numeric"
    pattern="[0-9]{11m}"
    minLength={11}
    maxLength={11}
    title="Phone number must be exactly 11 digits"
    required
  />
</label>

          <div className="formGrid">
            <label className="field">
              <span>Attendance</span>
              <select
                value={form.attending}
                onChange={(e) => setForm({ ...form, attending: e.target.value })}
              >
                <option value="yes">Yes, I will attend</option>
                <option value="maybe">Maybe</option>
                <option value="no">No, sorry</option>
              </select>
            </label>

            <label className="field">
              <span>People</span>
              <input
                type="number"
                min="0"
                max="20"
                value={form.guestsCount}
                onChange={(e) =>
                  setForm({ ...form, guestsCount: Number(e.target.value) })
                }
                required
              />
            </label>
          </div>

          <label className="field">
            <span>Leave a message for the host</span>
            <textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Share your wishes or a special message for Mina & Mirna ✨"
            />
          </label>
        </div>

        <button className="submitBtn" disabled={loading} type="submit">
          <CheckCircle2 size={20} />
          {loading ? "Saving..." : "Send RSVP"}
        </button>

        <p className="privacyText">Your response is private and saved securely.</p>
      </form>
        </section>
      </div>
    </main>
  );
}