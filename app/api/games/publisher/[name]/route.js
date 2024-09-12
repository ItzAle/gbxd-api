import { docClient } from "../../../../../lib/aws-config";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { name } = params;
  const decodedName = decodeURIComponent(name);

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
      FilterExpression: "contains(publisher, :publisherName)",
      ExpressionAttributeValues: {
        ":publisherName": decodedName,
      },
    });

    console.log("DynamoDB command:", JSON.stringify(command, null, 2));

    const response = await docClient.send(command);
    console.log("DynamoDB response:", JSON.stringify(response, null, 2));

    const games = response.Items;

    if (games.length === 0) {
      return NextResponse.json(
        { message: "No games found for this publisher" },
        { status: 404, headers }
      );
    }

    return NextResponse.json(games, { status: 200, headers });
  } catch (error) {
    console.error("Error fetching games by publisher:", error);
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
