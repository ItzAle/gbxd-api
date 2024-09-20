import { NextResponse } from "next/server";
import { docClient } from "../../../lib/aws-config";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const headers = {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
    "Access-Control-Allow-Headers":
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
  };

  try {
    console.log("Iniciando consulta a DynamoDB...");
    const command = new ScanCommand({
      TableName: "games",
      ConsistentRead: true,
    });

    const response = await docClient.send(command);
    const games = response.Items;

    console.log(`Fetched ${games.length} games from DynamoDB`);
    console.log("Primer juego:", JSON.stringify(games[0], null, 2));

    return NextResponse.json(games, { 
      status: 200, 
      headers
    });
  } catch (error) {
    console.error("Error fetching games:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500, headers }
    );
  }
}
