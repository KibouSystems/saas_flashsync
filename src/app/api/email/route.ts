import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import csvParser from "csv-parser";
import Stream from "stream";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const formData = await req.formData();
  const subject = formData.get("subject") as string;
  const body = formData.get("body") as string;
  const file = formData.get("file") as File | null;

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials({
    access_token: session.accessToken,
    refresh_token: session.refreshToken,
  });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  let recipients: { firstName: string; lastName: string; email: string }[] = [];

  if (file) {
    const text = await file.text();
    recipients = await new Promise((resolve, reject) => {
      const results: { firstName: string; lastName: string; email: string }[] =
        [];
      const readStream = new Stream.Readable();
      readStream.push(text);
      readStream.push(null);
      readStream
        .pipe(csvParser())
        .on("data", (data) => {
          results.push({
            firstName: data["First Name"]?.trim(),
            lastName: data["Last Name"]?.trim(),
            email: data["Email"]?.trim(),
          });
        })
        .on("end", () => resolve(results))
        .on("error", reject);
    });
  }

  // Send to each recipient
  for (const r of recipients) {
    if (!r.email) continue; // skip if no email

    let personalizedBody = body;
    personalizedBody = personalizedBody.replace(
      /{{First Name}}/g,
      r.firstName || ""
    );
    personalizedBody = personalizedBody.replace(
      /{{Last Name}}/g,
      r.lastName || ""
    );
    personalizedBody = personalizedBody.replace(/{{Email}}/g, r.email || "");

    const message = `To: ${r.email}
Subject: ${subject}
Content-Type: text/plain; charset="UTF-8"

${personalizedBody}`;

    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    console.log("RAW MESSAGE:\n", message);

    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: encodedMessage },
    });
  }

  return NextResponse.json({ success: true, sent: recipients.length });
}
