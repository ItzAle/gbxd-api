import { docClient } from "../../../../lib/aws-config";
import {
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
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

  const { name } = params;

  try {
    const command = new QueryCommand({
      TableName: "games",
      KeyConditionExpression: "slug = :slug",
      ExpressionAttributeValues: {
        ":slug": name,
      },
    });

    const response = await docClient.send(command);

    if (response.Items.length === 0) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404, headers }
      );
    }

    const gameData = response.Items[0];

    return NextResponse.json(gameData, { status: 200, headers });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers }
    );
  }
}

export async function PUT(request, { params }) {
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

  const { name } = params;
  const updatedGame = await request.json();
  const { oldSlug, ...gameData } = updatedGame;

  try {
    const updateCommand = new UpdateCommand({
      TableName: "games",
      Key: { slug: oldSlug },
      UpdateExpression:
        "set #name = :name, description = :description, releaseDate = :releaseDate, publisher = :publisher, developer = :developer, platforms = :platforms, genres = :genres, coverImageUrl = :coverImageUrl, slug = :newSlug",
      ExpressionAttributeNames: {
        "#name": "name",
      },
      ExpressionAttributeValues: {
        ":name": gameData.name,
        ":description": gameData.description,
        ":releaseDate": gameData.releaseDate,
        ":publisher": gameData.publisher,
        ":developer": gameData.developer,
        ":platforms": gameData.platforms,
        ":genres": gameData.genres,
        ":coverImageUrl": gameData.coverImageUrl,
        ":newSlug": gameData.slug,
      },
      ReturnValues: "ALL_NEW",
    });

    const result = await docClient.send(updateCommand);

    return NextResponse.json(
      {
        message: "Game updated successfully",
        updatedSlug: gameData.slug,
      },
      { status: 200, headers }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error: " },
      { status: 500, headers }
    );
  }
}

export async function DELETE(request, { params }) {
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

  const { name } = params;

  try {
    const deleteCommand = new DeleteCommand({
      TableName: "games",
      Key: { slug: name },
    });

    await docClient.send(deleteCommand);

    return NextResponse.json(
      {
        message: "Game deleted successfully",
      },
      { status: 200, headers }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error: " },
      { status: 500, headers }
    );
  }
}
