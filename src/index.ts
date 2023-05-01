import type { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import * as dotenv from 'dotenv'
import { deleteS3File } from './helpers';
import type { CsvFile } from './types';
dotenv.config();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const csvFileToDownload: CsvFile | undefined = event.pathParameters?.name;

    if (!csvFileToDownload?.length) {
      return {
        statusCode: 400,
        body: "Empty or non existent file name"
      }
    }

    const file = await deleteS3File(csvFileToDownload);

    if (!file) {
      return {
        statusCode: 404,
        body: "File doesn't exist"
      }
    }

    return {
      statusCode: 200,
      body: file
    }
  }
  catch (error) {
    return {
      statusCode: 500,
      body: `Unexpected Error Happened: ${error}`
    }
  }
};