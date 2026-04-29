"use client";

import {
  CheckCircle2,
  Crown,
  Heart,
  MapPin,
  Plus,
  Sparkles,
  Trash2,
  Volume2,
  VolumeX
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

const wedding = {
  groom: process.env.NEXT_PUBLIC_WEDDING_GROOM || "Mina",
  bride: process.env.NEXT_PUBLIC_WEDDING_BRIDE || "Mirna",
  date: process.env.NEXT_PUBLIC_WEDDING_DATE || "Friday, 15 May 2026",
  time: process.env.NEXT_PUBLIC_WEDDING_TIME || "6:00 PM",
  Church: process.env.NEXT_PUBLIC_WEDDING_CHURCH || "St. Mary and St. Athanasius Church, Nasr City",
  location: process.env.NEXT_PUBLIC_WEDDING_LOCATION || "Fleet Club (Nile Hall), El Zamalek",
};

type Person = {
  name: string;
  phone: string;
  attending: "yes" | "no";
};

export default function HomePage() {
  const [musicStarted, setMusicStarted] = useState(false);
const audioRef = useRef<HTMLAudioElement | null>(null);

function toggleMusic() {
  const audio = audioRef.current;
  if (!audio) return;

  if (musicStarted) {
    audio.pause();
    setMusicStarted(false);
  } else {
    audio.play();
    setMusicStarted(true);
  }
}
  const [people, setPeople] = useState<Person[]>([
    { name: "", phone: "", attending: "yes" },
  ]);

  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updatePerson(index: number, field: keyof Person, value: string) {
    setPeople((current) => {
      const updated = [...current];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  function addPerson() {
    setPeople((current) => [
      ...current,
      { name: "", phone: "", attending: "yes" },
    ]);
  }

  function removePerson(index: number) {
    setPeople((current) => current.filter((_, i) => i !== index));
  }

  async function submitRsvp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      for (const person of people) {
        const response = await fetch("/api/rsvp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: person.name,
            phone: person.phone,
            attending: person.attending,
            guestsCount: 1,
            note,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          setError(result.message || "Something went wrong.");
          setLoading(false);
          return;
        }
      }

  const hasAttendingPerson = people.some((person) => person.attending === "yes");

if (hasAttendingPerson) {
  setMessage("Thank you! Waiting for you ❤️");
} else {
  setMessage("We Will Miss U 😭");
}
      setPeople([{ name: "", phone: "", attending: "yes" }]);
      setNote("");
    } catch {
      setError("Something went wrong.");
    }

    setLoading(false);
  }

  return (
    <main className="weddingPage">
      <div className="goldGlow goldGlowOne" />
      <div className="goldGlow goldGlowTwo" />

<div className="musicPlayerBox">
  <button
    type="button"
    className={`musicButton ${musicStarted ? "playing" : ""}`}
    onClick={toggleMusic}
  >
    {musicStarted ? <VolumeX size={22} /> : <Volume2 size={22} />}
    <span>{musicStarted ? "Stop Music" : "Play Wedding Music"}</span>
  </button>

  <audio ref={audioRef} src="/music/wedding.mp3" loop preload="auto" />
</div>

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
     <div className="crossMark" aria-label="Cross">
  <span className="crossVertical" />
  <span className="crossHorizontal" />
</div>

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

               <div className="ChurchlocationBox">
              <p>    <MapPin size={20} /> {wedding.Church}</p>
            </div>

            <div className="locationBox">
           
              <p>   <MapPin size={20} /> {wedding.location}</p>
            </div>

            <div className="heroDetails">
              <a
                className="locationButton"
                href="https://www.google.com/maps/place/FLEET+CLUB+EL+GEZIRAH/@30.0404173,31.2235516,17z/data=!3m1!4b1!4m6!3m5!1s0x1458410008dedd15:0xad624ac096c218b7!8m2!3d30.0404173!4d31.2261265!16s%2Fg%2F11h6n12nwz?entry=ttu&g_ep=EgoyMDI2MDQyNy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin size={18} />
                Open Fleet Club Location
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
                <p>Add one or more people. Each person will be saved separately.</p>
              </div>
            </div>

            {message && <div className="alert success">{message}</div>}
            {error && <div className="alert error">{error}</div>}

            <div className="formBody">
              <div className="peopleList">
                {people.map((person, index) => (
                  <div className="personCard" key={index}>
                    <div className="personHeader">
                      <strong>Person {index + 1}</strong>

                      {people.length > 1 && (
                        <button
                          type="button"
                          className="removePersonBtn"
                          onClick={() => removePerson(index)}
                        >
                          <Trash2 size={15} />
                          Remove
                        </button>
                      )}
                    </div>

                    <label className="field">
                      <span>Full Name</span>
                      <input
                        value={person.name}
                        onChange={(e) => updatePerson(index, "name", e.target.value)}
                        placeholder="Example: Kirolos Amgad"
                        required
                      />
                    </label>

                    <label className="field">
                      <span>Phone Number</span>
                      <input
                        value={person.phone}
                        onChange={(e) => {
                          const onlyNumbers = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 11);

                          updatePerson(index, "phone", onlyNumbers);
                        }}
                        placeholder="01xxxxxxxxx"
                        inputMode="numeric"
                        pattern="[0-9]{11}"
                        minLength={11}
                        maxLength={11}
                        title="Phone number must be exactly 11 digits"
                        required
                      />
                    </label>

                    <div className="attendanceButtons">
                      <button
                        type="button"
                        className={`attendanceOption ${
                          person.attending === "yes" ? "active" : ""
                        }`}
                        onClick={() => updatePerson(index, "attending", "yes")}
                      >
                        Yes, I will attend
                      </button>

                      <button
                        type="button"
                        className={`attendanceOption ${
                          person.attending === "no" ? "active" : ""
                        }`}
                        onClick={() => updatePerson(index, "attending", "no")}
                      >
                        No, sorry
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button type="button" className="addPersonBtn" onClick={addPerson}>
                <Plus size={18} />
                Add another person
              </button>

              <label className="field">
                <span>Leave a message for the host</span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Share your wishes or a special message for Mina & Mirna ✨"
                />
              </label>
            </div>

            <button className="submitBtn" disabled={loading} type="submit">
              <CheckCircle2 size={20} />
              {loading ? "Saving..." : "Send"}
            </button>

            <p className="privacyText">
              Your response is private and saved securely.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}