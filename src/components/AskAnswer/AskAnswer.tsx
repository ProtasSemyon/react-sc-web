import axios from 'axios';

import { useLocation } from 'react-router-dom';
import { ChangeEvent, useEffect, useReducer, useState, useRef } from 'react';

import { Spinner, useLanguage } from 'ostis-ui-lib';
import { SPINER_COLOR } from '@constants';
import { AskElement } from './AskElement';

import styles from './AskAnswer.module.scss';
import { AskInput } from '@components/AskInput';

import { getHintButtonHandler } from 'src/constants/hintButtons';
import { getDescriptionById } from '@api/requests/getDescription';

interface NavigateState {
  query?: string;
  isHintButton: boolean;
}

interface ElementPayload {
  query: string;
  answer: string;
}

interface State {
  history: ElementPayload[];
}

type Action = { type: 'ADD'; payload: ElementPayload } | { type: 'RESET' };

const historyReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        history: [...state.history, action.payload],
      };
    case 'RESET':
      return {
        ...state,
        history: [],
      };
    default:
      throw new Error('Unknown action type');
  }
};

export const AskAnswer = () => {
  const state = useLocation().state as NavigateState;

  const lang = useLanguage();

  const [historyState, dispatch] = useReducer(historyReducer, { history: [] });

  const [isLoading, setIsLoading] = useState(false);

  const [query, setQuery] = useState<string>();

  const scrollRef = useRef<HTMLDivElement>(null);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => setQuery(e.currentTarget.value);
  const onInputSubmit = async () => await fetchAnswerByQuery(query);

  const isDescribeQuery = (query: string): boolean => {
    const starts =
      lang === 'ru'
        ? ['Что это', 'Что это такое', 'Расскажи про']
        : ['What is', 'Tell me about', 'Describe'];
    return starts.some((start) => query.startsWith(start));
  };

  const fetchAnswerByQuery = async (query: string | undefined) => {
    if (!query) return;

    let answer: string | null = null;

    if (state.isHintButton) {
      const handler = getHintButtonHandler(lang, query!);
      answer = await handler();
    } else {
      answer = await getDescriptionById(query);
    }

    if (answer) {
      dispatch({ type: 'ADD', payload: { query, answer } });
    } else {
      dispatch({ type: 'ADD', payload: { query, answer: 'Failed to fetch data' } });
    }
  };

  useEffect(() => {
    if (state.query) {
      fetchAnswerByQuery(state.query);
    }
  }, [state]);

  useEffect(() => {
    scrollToBottom();
  }, [historyState]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  if (!state) return null;

  if (isLoading) return <Spinner className={styles.spinner} appearance={SPINER_COLOR} />;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.history}>
        {historyState.history.map((entry, idx) => (
          <AskElement key={idx} {...entry} />
        ))}
        <div ref={scrollRef} />
      </div>
      <AskInput
        className={styles.inputQueryBar}
        onChange={onInputChange}
        onSubmit={onInputSubmit}
      />
    </div>
  );
};