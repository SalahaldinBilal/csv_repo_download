import type { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import * as dotenv from 'dotenv'
import { downloadS3File, response } from './helpers';
import type { CsvFile } from './types';
dotenv.config();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const csvFileToDownload: CsvFile | undefined = event.pathParameters?.name;

    if (!csvFileToDownload?.length) return response(400, "Empty or non existent file name")

    const file = await downloadS3File(decodeURIComponent(csvFileToDownload));

    if (!file) return response(404, "File doesn't exist");

    return response(200, file, { 'Content-Type': 'text/csv' })
  }
  catch (error) {
    return response(500, `Unexpected Error Happened: ${error}`);
  }
};