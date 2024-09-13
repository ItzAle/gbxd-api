import { NextResponse } from "next/server";
import { docClient } from "../../../lib/aws-config";
import { PutCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import slugify from "slugify";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileContent = await file.text();
    const games = JSON.parse(fileContent);

    let addedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    let errorDetails = [];

    for (const game of games) {
      try {
        const slug = slugify(game.name, { lower: true, strict: true });

        // Verificar si el juego ya existe
        const getCommand = new GetCommand({
          TableName: "games",
          Key: { slug },
        });

        const existingGame = await docClient.send(getCommand);

        if (existingGame.Item) {
          // El juego existe, actualizarlo
          const updateCommand = new UpdateCommand({
            TableName: "games",
            Key: { slug },
            UpdateExpression:
              "set #name = :name, releaseDate = :releaseDate, description = :description, publisher = :publisher, developer = :developer, platforms = :platforms, genres = :genres, coverImageUrl = :coverImageUrl, addedBy = :addedBy, isNSFW = :isNSFW, storeLinks = :storeLinks",
            ExpressionAttributeNames: {
              "#name": "name",
            },
            ExpressionAttributeValues: {
              ":name": game.name,
              ":releaseDate": game.releaseDate,
              ":description": game.description,
              ":publisher": game.publisher,
              ":developer": game.developer,
              ":platforms": game.platforms,
              ":genres": game.genres,
              ":coverImageUrl": game.coverImageUrl,
              ":addedBy": "JSON Upload (Update)",
              ":isNSFW": game.isNSFW || false,
              ":storeLinks": game.storeLinks || [],
            },
          });

          await docClient.send(updateCommand);
          updatedCount++;
        } else {
          // El juego no existe, añadirlo
          const putCommand = new PutCommand({
            TableName: "games",
            Item: {
              ...game,
              slug,
              addedBy: "JSON Upload",
            },
          });

          await docClient.send(putCommand);
          addedCount++;
        }
      } catch (error) {
        console.error(`Error processing game ${game.name}:`, error);
        errorCount++;
        errorDetails.push({
          name: game.name,
          error: error.message,
        });
      }
    }

    return NextResponse.json(
      {
        message: `Imported ${addedCount} new games. Updated ${updatedCount} existing games. Errors occurred for ${errorCount} games.`,
        errorDetails: errorDetails,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing JSON upload:", error);
    return NextResponse.json(
      { error: "Error processing JSON upload", details: error.message },
      { status: 500 }
    );
  }
}
