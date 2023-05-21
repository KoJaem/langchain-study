import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
// import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { makeChain } from '@/utils/makechain';
// import { pinecone } from '@/utils/pinecone-client';
// import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';

import { TextLoader } from 'langchain/document_loaders/fs/text';
// import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
// import { Document } from 'langchain/document';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { question, history } = req.body;

  //only accept post requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!question) {
    return res.status(400).json({ message: 'No question in the request' });
  }
  // OpenAI recommends replacing newlines with spaces for best results
  const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

  try {
    const textLoader = new TextLoader(
      'src/document_loaders/example_data/example.txt',
    );

    const textDocs = await textLoader.load();

    // const splitter = new RecursiveCharacterTextSplitter({
    //   chunkSize: 20, // 청크 글자 수 제한
    //   chunkOverlap: 10, // 겹쳐지는 수
    // });

    // const docOutput = await splitter.splitDocuments([
    //   new Document({ pageContent: textDocs[0].pageContent }),
    // ]);

    const vectorStore = await MemoryVectorStore.fromDocuments(
      textDocs,
      new OpenAIEmbeddings(),
    );

    const resultOne = await vectorStore.similaritySearch('KoJaem', 1);

    console.log('result', resultOne);
    // console.log(jsonDocs);

    // const index = pinecone.Index(PINECONE_INDEX_NAME);

    // /* create vectorstore*/
    // const vectorStore = await PineconeStore.fromExistingIndex(
    //   new OpenAIEmbeddings({}),
    //   {
    //     pineconeIndex: index,
    //     textKey: 'text',
    //     namespace: PINECONE_NAME_SPACE, //namespace comes from your config folder
    //   },
    // );

    //create chain
    const chain = makeChain(vectorStore);
    //Ask a question using chat history
    const response = await chain.call({
      question: sanitizedQuestion,
      chat_history: history || [],
    });

    console.log('response', response);
    res.status(200).json(response);
  } catch (error: any) {
    console.log('error', error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
}

// import type { NextApiRequest, NextApiResponse } from 'next';
// import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
// import { PineconeStore } from 'langchain/vectorstores/pinecone';
// import { makeChain } from '@/utils/makechain';
// import { pinecone } from '@/utils/pinecone-client';
// import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   const { question, history } = req.body;

//   console.log('question', question);

//   //only accept post requests
//   if (req.method !== 'POST') {
//     res.status(405).json({ error: 'Method not allowed' });
//     return;
//   }

//   if (!question) {
//     return res.status(400).json({ message: 'No question in the request' });
//   }
//   // OpenAI recommends replacing newlines with spaces for best results
//   const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

//   try {
//     const index = pinecone.Index(PINECONE_INDEX_NAME);

//     /* create vectorstore*/
//     const vectorStore = await PineconeStore.fromExistingIndex(
//       new OpenAIEmbeddings({}),
//       {
//         pineconeIndex: index,
//         textKey: 'text',
//         namespace: PINECONE_NAME_SPACE, //namespace comes from your config folder
//       },
//     );

//     //create chain
//     const chain = makeChain(vectorStore);
//     //Ask a question using chat history
//     const response = await chain.call({
//       question: sanitizedQuestion,
//       chat_history: history || [],
//     });

//     console.log('response', response);
//     res.status(200).json(response);
//   } catch (error: any) {
//     console.log('error', error);
//     res.status(500).json({ error: error.message || 'Something went wrong' });
//   }
// }
