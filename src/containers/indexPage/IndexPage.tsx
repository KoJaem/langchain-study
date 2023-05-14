import React, { useEffect, useState } from 'react';
import { Typography } from 'src/components/Typography';
import styled from 'styled-components';
import axios from 'axios';
import { Message } from 'src/types/chat';
import { FieldValues, useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

export const IndexPage = () => {
  const schema = object().shape({
    question: string().required(`질문을 입력해주세요`),
  });

  const [loading, setLoading] = useState<boolean>(false);

  const [messageState, setMessageState] = useState<{
    messages: Message[];
    pending?: string;
    history: [string, string][];
    pendingSourceDocs?: Document[];
  }>({
    messages: [
      {
        message: 'Hi there. Do you have any questions about me?',
        type: 'apiMessage',
      },
    ],
    history: [],
  });

  const { messages, history } = messageState;

  const { handleSubmit, register } = useForm({
    resolver: yupResolver(schema),
  });

  // * 내 로직

  //////////////////////////////////////

  // const test = async () => {
  //   const testRoute = await axios.get('/api/test');
  //   console.log(testRoute.data);
  // };

  // useEffect(() => {
  //   test();
  // }, []);

  const submit = async (data: FieldValues) => {
    try {
      console.log(data);

      const question = data.question.trim();

      setMessageState(state => ({
        ...state,
        messages: [
          ...state.messages,
          {
            type: 'userMessage',
            message: question,
          },
        ],
      }));
      setLoading(true);

      const res = await axios.post('/api/chat', {
        question,
        history,
      });

      setMessageState(state => ({
        ...state,
        messages: [
          ...state.messages,
          {
            type: 'apiMessage',
            message: data.text,
            sourceDocs: data.sourceDocuments,
          },
        ],
        history: [...state.history, [question, data.text]],
      }));

      console.log('messageState', messageState);

      setLoading(false);

      console.log(res);
    } catch (e) {
      console.log('error : ', e);
    }
  };

  useEffect(() => {
    console.log('messageState', messageState);
  }, [messageState]);
  return (
    <Container>
      <Typography size="16">IndexPage</Typography>
      <form onSubmit={handleSubmit(submit)}>
        <textarea
          placeholder={
            loading
              ? 'Waiting for response...'
              : 'What is this legal case about?'
          }
          {...register('question')}
        />
        <button type="submit">보내기 버튼</button>
      </form>
    </Container>
  );
};

const Container = styled.div``;
