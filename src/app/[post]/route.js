import { NextResponse } from "next/server";

export async function GET(request, { params }) {
	const { post } = await params;
	return NextResponse.json({ message: `Hello ${post}!` });
}
