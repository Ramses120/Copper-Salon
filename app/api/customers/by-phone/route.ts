import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const phone = searchParams.get("phone");

  if (!phone) {
    return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
  }

  try {
    const customers = await db.customer.findMany({
      where: { phone: phone }
    });

    if (customers.length > 0) {
      return NextResponse.json(customers[0]);
    } else {
      return NextResponse.json(null); // Not found
    }
  } catch (error) {
    console.error("Error fetching customer by phone:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
