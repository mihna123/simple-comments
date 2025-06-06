import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const allowCORSHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, OPTIONS, POST",
	"Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
	return new Response(null, {
		status: 204,
		headers: allowCORSHeaders,
	});
}

export async function GET(request, { params }) {
	const { post } = await params;
	const sql = neon(process.env.DATABASE_URL);
	const comments = await sql.query("SELECT * FROM comments WHERE post = $1", [
		post,
	]);
	comments.reverse();
	return new NextResponse(
		`<ul class="simple-comments">
            ${comments.map((c) => `<li><p>${c.username} - ${c.createddate.toUTCString()}:</p><p>${c.comment}</p></li>`).join("")}
        </ul>`,
		{
			headers: { "content-type": "text/html", ...allowCORSHeaders },
			status: 200,
		},
	);
}

/**
 * @param {NextRequest} request
 * */
export async function POST(request, { params }) {
	const formData = await request.formData();

	const { post } = await params;
	const username = formData.get("username");
	const comment = formData.get("comment");

	if (!username || !comment) {
		return new NextResponse("Missing fields", {
			status: 400,
			headers: allowCORSHeaders,
		});
	}

	const sql = neon(process.env.DATABASE_URL);

	await sql.query(
		`INSERT INTO comments 
            (post, username, comment, createddate) 
            VALUES ($1,$2,$3, current_timestamp)`,
		[post, username, comment],
	);

	return new NextResponse("Success", {
		status: 200,
		headers: allowCORSHeaders,
	});
}
