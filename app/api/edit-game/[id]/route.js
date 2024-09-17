import { NextResponse } from "next/server";
import { docClient } from "@/lib/aws-config";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const updatedGame = await request.json();

    const command = new UpdateCommand({
      TableName: "games",
      Key: { slug: id },
      UpdateExpression:
        "set #name = :name, releaseDate = :releaseDate, description = :description, publisher = :publisher, developer = :developer, platforms = :platforms, genres = :genres, coverImageUrl = :coverImageUrl, storeLinks = :storeLinks, aliases = :aliases, franchises = :franchises, isTBA = :isTBA",
      ExpressionAttributeNames: {
        "#name": "name", // 'name' es una palabra reservada en DynamoDB
      },
      ExpressionAttributeValues: {
        ":name": updatedGame.name,
        ":releaseDate": updatedGame.isTBA ? "TBA" : updatedGame.releaseDate,
        ":description": updatedGame.description,
        ":publisher": updatedGame.publisher,
        ":developer": updatedGame.developer,
        ":platforms": updatedGame.platforms,
        ":genres": updatedGame.genres,
        ":coverImageUrl": updatedGame.coverImageUrl,
        ":storeLinks": updatedGame.storeLinks,
        ":aliases": updatedGame.aliases,
        ":franchises": updatedGame.franchises,
        ":isTBA": updatedGame.isTBA,
      },
      ReturnValues: "ALL_NEW",
    });

    const result = await docClient.send(command);

    return NextResponse.json(result.Attributes, { status: 200 });
  } catch (error) {
    console.error("Error updating game:", error);
    return NextResponse.json({ error: "Error updating game" }, { status: 500 });
  }
}
