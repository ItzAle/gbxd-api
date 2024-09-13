import { docClient } from "../../../../../lib/aws-config";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { name } = params;

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
      FilterExpression: "contains(developer, :developer)",
      ExpressionAttributeValues: {
        ":developer": decodeURIComponent(name),
      },
    });

    const response = await docClient.send(command);
    const games = response.Items;

    return NextResponse.json(games, { status: 200, headers });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers }
    );
  }
}
