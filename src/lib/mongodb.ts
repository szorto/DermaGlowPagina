import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;

if (!uri) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

// In development, reuse the client across hot reloads to avoid
// exhausting MongoDB connection limits
declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
}

let client: MongoClient;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri);
  }
  client = global._mongoClient;
} else {
  client = new MongoClient(uri);
}

export const COLLECTION = process.env.MONGODB_COLLECTION ?? 'DGDB';

export async function getDb() {
  await client.connect();
  return client.db(process.env.MONGODB_DB ?? 'dermaglow');
}
