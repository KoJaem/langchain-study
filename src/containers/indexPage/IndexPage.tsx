import React, { useEffect, useState } from 'react';
import { Typography } from 'src/components/Typography';
import styled from 'styled-components';
import axios from 'axios';
import { Message } from 'src/types/chat';
import { FieldValues, useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { customColor } from '~/src/constants';

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
        // message: 'Hi there. Do you have any questions about KoJaem?',
        message: '안녕하세요. KoJaem 님에 대해 궁금하신점이 있으신가요?',
        type: 'apiMessage',
      },
    ],
    history: [],
  });

  const { messages, history } = messageState;

  const { handleSubmit, register } = useForm({
    resolver: yupResolver(schema),
  });

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

      const { data: res } = await axios.post('/api/chat', {
        question,
        history,
      });

      setMessageState(state => ({
        ...state,
        messages: [
          ...state.messages,
          {
            type: 'apiMessage',
            message: res.text,
            sourceDocs: res.sourceDocuments,
          },
        ],
        history: [...state.history, [question, res.text]],
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
      <Wrapper>
        <MessageBox>
          {messages.map((message, index) =>
            message.type === 'apiMessage' ? (
              <p key={index} style={{ color: 'blue' }}>
                {message.message}
              </p>
            ) : (
              <p key={index} style={{ color: 'green' }}>
                {message.message}
              </p>
            ),
          )}
        </MessageBox>
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
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${customColor.gray}80;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 800px;
`;

const MessageBox = styled.div``;
