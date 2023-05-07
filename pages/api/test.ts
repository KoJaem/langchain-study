import { TextLoader } from 'langchain/document_loaders/fs/text';
import { JSONLoader } from 'langchain/document_loaders/fs/json';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';


import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const jsonLoader = new JSONLoader(
      'src/document_loaders/example_data/example.json',
    );

    const textLoader = new TextLoader(
      'src/document_loaders/example_data/example.txt',
    );

    const jsonDocs = await jsonLoader.load();
    const textDocs = await textLoader.load();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 20, // 청크 글자 수 제한
      chunkOverlap: 10, // 겹쳐지는 수
    });

    const docOutput = await splitter.splitDocuments([
      new Document({ pageContent: textDocs[0].pageContent }),
    ]);

    // * region vectorStore
    // const vectorStore = await MemoryVectorStore.fromDocuments(
    //   textDocs,
    //   new OpenAIEmbeddings(),
    // );

    // const resultOne = await vectorStore.similaritySearch('KoJaem', 1);

    // console.log('result', resultOne);
    // console.log(jsonDocs);
    // * end region vectorStore
    res.status(200).json(docOutput);
  } catch (e) {
    console.log(e);
  }
}
