import { docClient } from "../../../../lib/aws-config";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit")) || 10; // Por defecto, devuelve 10 juegos

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
    const today = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD

    const command = new ScanCommand({
      TableName: "games",
      FilterExpression: "releaseDate > :today",
      ExpressionAttributeValues: {
        ":today": today,
      },
    });

    console.log("DynamoDB command:", JSON.stringify(command, null, 2));

    const response = await docClient.send(command);
    console.log("DynamoDB response:", JSON.stringify(response, null, 2));

    let upcomingGames = response.Items;

    // Ordenar los juegos por fecha de lanzamiento, los más cercanos primero
    upcomingGames.sort(
      (a, b) => new Date(a.releaseDate) - new Date(b.releaseDate)
    );

    // Limitar el número de juegos devueltos
    upcomingGames = upcomingGames.slice(0, limit);

    console.log(`Found ${upcomingGames.length} upcoming games`);

    if (upcomingGames.length === 0) {
      return NextResponse.json(
        { message: "No upcoming games found" },
        { status: 404, headers }
      );
    }

    return NextResponse.json(upcomingGames, { status: 200, headers });
  } catch (error) {
    console.error("Error fetching upcoming games:", error);
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
