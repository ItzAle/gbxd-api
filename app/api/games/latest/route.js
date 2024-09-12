import { docClient } from "../../../../lib/aws-config";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit")) || 10;

  const headers = {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
    "Access-Control-Allow-Headers":
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers });
  }

  try {
    const command = new ScanCommand({
      TableName: "games",
      ProjectionExpression: "id, #name, releaseDate, coverImageUrl, slug",
      ExpressionAttributeNames: {
        "#name": "name",
      },
    });

    console.log("DynamoDB command:", JSON.stringify(command, null, 2));

    const response = await docClient.send(command);
    console.log("DynamoDB response:", JSON.stringify(response, null, 2));

    const games = response.Items;

    games.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));

    const latestGames = games.slice(0, limit);

    return NextResponse.json(latestGames, { status: 200, headers });
  } catch (error) {
    console.error("Error fetching latest games:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error.message,
        stack: error.stack,
      },
      { status: 500, headers }
    );
  }
}
