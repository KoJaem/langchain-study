import { TextLoader } from 'langchain/document_loaders/fs/text';
import { JSONLoader } from 'langchain/document_loaders/fs/json';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const jsonLoader = new JSONLoader(
    'src/document_loaders/example_data/example.json',
  );

  const textLoader = new TextLoader(
    'src/document_loaders/example_data/example.txt',
  );

  const jsonDocs = await jsonLoader.load();
  const textDocs = await textLoader.load();

  // console.log(jsonDocs);

  res.status(200).json(textDocs)
}
