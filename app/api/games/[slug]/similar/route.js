import { docClient } from "../../../../../lib/aws-config";
import { ScanCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { slug } = params;

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
    // Primero, obtenemos el juego por su slug
    const getCommand = new GetCommand({
      TableName: "games",
      Key: { slug: slug },
    });

    const { Item: game } = await docClient.send(getCommand);

    if (!game) {
      return NextResponse.json({ message: "Game not found" }, { status: 404, headers });
    }

    console.log("Original game:", JSON.stringify(game, null, 2));

    // Ahora buscamos juegos similares
    const scanCommand = new ScanCommand({
      TableName: "games",
      FilterExpression: "(contains(genres, :genre1) OR contains(genres, :genre2)) AND slug <> :slug",
      ExpressionAttributeValues: {
        ":genre1": game.genres[0],
        ":genre2": game.genres.length > 1 ? game.genres[1] : game.genres[0],
        ":slug": game.slug,
      },
      Limit: 10, // Aumentamos el límite a 10 juegos similares
    });

    console.log("Scan command:", JSON.stringify(scanCommand, null, 2));

    const { Items: similarGames } = await docClient.send(scanCommand);

    console.log("Similar games found:", similarGames.length);

    if (similarGames.length === 0) {
      // Si no encontramos juegos similares, buscamos solo por el primer género
      const fallbackScanCommand = new ScanCommand({
        TableName: "games",
        FilterExpression: "contains(genres, :genre1) AND slug <> :slug",
        ExpressionAttributeValues: {
          ":genre1": game.genres[0],
          ":slug": game.slug,
        },
        Limit: 10,
      });

      console.log("Fallback scan command:", JSON.stringify(fallbackScanCommand, null, 2));

      const { Items: fallbackSimilarGames } = await docClient.send(fallbackScanCommand);

      console.log("Fallback similar games found:", fallbackSimilarGames.length);

      if (fallbackSimilarGames.length === 0) {
        return NextResponse.json({ message: "No similar games found" }, { status: 404, headers });
      }

      return NextResponse.json(fallbackSimilarGames, { status: 200, headers });
    }

    return NextResponse.json(similarGames, { status: 200, headers });
  } catch (error) {
    console.error("Error fetching similar games:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message, stack: error.stack },
      { status: 500, headers }
    );
  }
}
