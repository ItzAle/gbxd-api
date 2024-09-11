import { NextResponse } from 'next/server';
import { docClient } from '../../../lib/aws-config';
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  if (!name) {
    return NextResponse.json({ error: 'Name parameter is required' }, { status: 400 });
  }

  try {
    const command = new QueryCommand({
      TableName: "games",
      KeyConditionExpression: "slug = :slug",
      ExpressionAttributeValues: {
        ":slug": name.toLowerCase(),
      },
      Limit: 1
    });

    const response = await docClient.send(command);

    const exists = response.Items && response.Items.length > 0;

    return NextResponse.json({ exists });
  } catch (error) {
    console.error('Error checking game existence:', error);
    return NextResponse.json({ 
      error: 'Error checking game existence', 
      details: error.message 
    }, { status: 500 });
  }
}