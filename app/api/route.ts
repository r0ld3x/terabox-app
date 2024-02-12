import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams: params } = new URL(req.url);
  if (!params.has("data")) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }
  const link = params.get("data");
  if (!link) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }
  try {
    const data = await fetch(
      `https://afca-174-138-88-233.ngrok-free.app/get?url=${link}`
    );

    if (!data)
      return NextResponse.json({ error: "Unknown Error" }, { status: 400 });
    const respo = await data.json();
    return NextResponse.json(respo, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Unknown Error" }, { status: 400 });
  }
}
