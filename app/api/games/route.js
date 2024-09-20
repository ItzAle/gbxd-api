import { NextResponse } from "next/server";
import { docClient } from "../../../lib/aws-config";
import { ScanCommand, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const headers = {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
    "Access-Control-Allow-Headers":
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    "Cache-Control": "no-store, max-age=0",
  };

  try {
    const command = new ScanCommand({
      TableName: "games",
      ConsistentRead: true,
    });

    const response = await docClient.send(command);
    const games = response.Items;

    console.log(`Fetched ${games.length} games from DynamoDB`);

    return NextResponse.json(games, { 
      status: 200, 
      headers: {
        ...headers,
        'Cache-Control': 'no-store, max-age=0',
      }
    });
  } catch (error) {
    console.error("Error fetching games:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers }
    );
  }
}

export async function getGames() {
  const command = new ScanCommand({
    TableName: "games",
  });

  const response = await docClient.send(command);
  return response.Items;
}

export async function getGame(slug) {
  const command = new GetCommand({
    TableName: "games",
    Key: { slug: slug },
  });

  try {
    const response = await docClient.send(command);
    return response.Item;
  } catch (error) {
    console.error("Error fetching game:", error);
    return null;
  }
}
