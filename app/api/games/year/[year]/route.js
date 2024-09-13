import { docClient } from "../../../../../lib/aws-config";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { year } = params;
  const numericYear = parseInt(year, 10);

  if (isNaN(numericYear)) {
    return NextResponse.json({ error: "Invalid year format" }, { status: 400 });
  }

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
      FilterExpression: "begins_with(releaseDate, :year)",
      ExpressionAttributeValues: {
        ":year": year,
      },
    });

    console.log("DynamoDB command:", JSON.stringify(command, null, 2));

    const response = await docClient.send(command);
    console.log("DynamoDB response:", JSON.stringify(response, null, 2));

    const games = response.Items;

    if (games.length === 0) {
      return NextResponse.json(
        { message: "No games found for this year" },
        { status: 404, headers }
      );
    }

    return NextResponse.json(games, { status: 200, headers });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers }
    );
  }
}
