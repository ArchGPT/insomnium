import React, { useEffect, useState } from 'react';
import { FC } from 'react';
import {
  LoaderFunction,
  isRouteErrorResponse,
  useNavigate,
  useNavigation,
  useRouteError,
} from 'react-router-dom';
import styled from 'styled-components';

import llama from "../../../src/ui/components/assets/llama-icon.png"



import { Button } from "../../../components/ui/button"

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  width: '100%',
});

const Spinner = () => <i className="fa fa-spin fa-refresh" />;


type OllmaModel = {
  name: string,
  modified_at: string,
  size: number
}

export const LLMRoute: FC = () => {
  const error = useRouteError();
  const getErrorMessage = (err: any) => {
    if (isRouteErrorResponse(err)) {
      return err.data;
    }
    if (err instanceof Error) {
      return err.message;
    }

    return err?.message || 'Unknown error';
  };
  const getErrorStack = (err: any) => {
    if (isRouteErrorResponse(err)) {
      return err.error?.stack;
    }
    return err?.stack;
  };

  const navigate = useNavigate();
  const navigation = useNavigation();
  const errorMessage = getErrorMessage(error);

  const URL = "http://localhost:11434/api/tags"

  const [models, setModels] = useState<OllmaModel[]>([
    {
      "name": "llama2:7b",
      "modified_at": "2023-08-02T17:02:23.713454393-07:00",
      "size": 3791730596
    },
    {
      "name": "llama2:13b",
      "modified_at": "2023-08-08T12:08:38.093596297-07:00",
      "size": 7323310500
    }
  ]
  )

  useEffect(() => {
    fetch(URL)
      .then(res => res.json())
      .then(res => setModels(res.models))
      .catch(err => console.log(err))
  }, [])

  return (
    <Container style={{ background: "#f3a17c" }}>
      <img src={llama} width="400px" style={{ borderRadius: "10px" }} />

      {/* <h1 style={{ color: 'var(--color-font)' }}>Ollama is running at http://localhost:11434/</h1>
      <h2 style={{ color: 'var(--color-font)' }}>Models:</h2>
      <ul>
        {models.map(model => <li>{model.name}</li>)}
      </ul> */}

      <code className="selectable" style={{ color: "#111", wordBreak: 'break-word', margin: 'var(--padding-sm)' }}>Start your Large Language Model Adventure now. (Y/n)</code>
      <div className="flex space-x-2" style={{ color: "#111" }}>
        <Button>Yes</Button> <Button>nope</Button>
      </div>
    </Container>
  );
};

export default LLMRoute
