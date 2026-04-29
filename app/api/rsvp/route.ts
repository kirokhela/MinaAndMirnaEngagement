import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function cleanText(value: unknown) {
  return String(value ?? "").trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = cleanText(body.name);
    const phone = cleanText(body.phone);
    const attending = cleanText(body.attending);
    const note = cleanText(body.note);
    const guestsCount = Number(body.guestsCount || 0);

    if (!name || !phone) {
      return NextResponse.json({ message: "Name and phone are required." }, { status: 400 });
    }

    if (!["yes", "no", "maybe"].includes(attending)) {
      return NextResponse.json({ message: "Invalid attendance status." }, { status: 400 });
    }

    if (!Number.isFinite(guestsCount) || guestsCount < 0 || guestsCount > 20) {
      return NextResponse.json({ message: "Guests count must be between 0 and 20." }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("rsvps").insert({
      name,
      phone,
      attending,
      guests_count: guestsCount,
      note,
    });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "RSVP saved successfully." });
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }
}
