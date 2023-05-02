import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import * as dotenv from 'dotenv'
import type { CsvFile } from "./types";
import type { APIGatewayProxyResult } from "aws-lambda";
dotenv.config();

const client = new S3Client({
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  }
});

export async function downloadS3File(file: CsvFile) {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: file
  })

  const response = await client.send(command);
  return response.Body?.transformToString();
}

export function response(statusCode: number, body: any, extraHeaders: { [key: string]: string } = {}): APIGatewayProxyResult {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      ...extraHeaders
    },
    body
  }
}