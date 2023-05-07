import React, { useEffect } from 'react';
import { Typography } from 'src/components/Typography';
import styled from 'styled-components';
import axios from 'axios';

export const IndexPage = () => {
  const test = async () => {
    const testRoute = await axios.get('/api/test')
    console.log(testRoute.data)
  };

  useEffect(() => {
    test()
  }, [])

  return (
    <Container>
      <Typography size="16">IndexPage</Typography>
    </Container>
  );
};

const Container = styled.div``;
