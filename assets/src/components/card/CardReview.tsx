import React, {useEffect, useState} from 'react';
import {useSrs, SrsProvider} from './SrsProvider';
import {useGlobal} from 'src/components/global/GlobalProvider';
import NoteEdit from 'src/components/note/NoteEdit';

import {Choice, SyncStatus, SrsConfig, Card, EditorTab} from 'src/libs/types';
import logger from 'src/libs/logger';
import * as API from 'src/libs/api';

type AnswerProps = {
  card: Card;
  config?: SrsConfig;
  answerCard: (card: Card, choice: Choice) => void;
  nextInterval: (card: Card, choice: Choice) => string;
};

function Answer(props: AnswerProps) {
  const {card, config, answerCard, nextInterval} = props;

  return (
    <div className="flex items-center justify-center p-2 mt-2">
      <button
        className="flex-1 w-full px-3 py-1 mb-1 mr-1 font-bold text-gray-200 bg-red-700 rounded-full outline-none active:bg-red-500 hover:bg-red-600 focus:outline-none"
        onClick={() => answerCard(card, Choice.Again)}
      >
        Again
        {config?.show_next_due && (
          <span> ({nextInterval(card, Choice.Again)})</span>
        )}
      </button>
      <button
        className="flex-1 w-full px-3 py-1 mb-1 mr-1 font-bold text-gray-200 bg-yellow-700 rounded-full outline-none active:bg-yellow-500 hover:bg-yellow-600 focus:outline-none"
        onClick={() => answerCard(card, Choice.Hard)}
      >
        Hard
        {config?.show_next_due && (
          <span> ({nextInterval(card, Choice.Hard)})</span>
        )}
      </button>
      <button
        className="flex-1 w-full px-3 py-1 mb-1 mr-1 font-bold text-gray-100 bg-green-700 rounded-full outline-none active:bg-green-500 hover:bg-green-600 focus:outline-none"
        onClick={() => answerCard(card, Choice.Ok)}
      >
        Good
        {config?.show_next_due && (
          <span> ({nextInterval(card, Choice.Ok)})</span>
        )}
      </button>
      <button
        className="flex-1 w-full px-3 py-1 mb-1 mr-1 font-bold text-gray-100 bg-blue-700 rounded-full outline-none active:bg-blue-500 hover:bg-blue-600 focus:outline-none"
        onClick={() => answerCard(card, Choice.Easy)}
      >
        Easy
        {config?.show_next_due && (
          <span> ({nextInterval(card, Choice.Easy)})</span>
        )}
      </button>
    </div>
  );
}

function CardReview() {
  const {sm2, loadSm2, loading, config} = useSrs();
  const {setSync} = useGlobal();

  const [card, setCard] = useState<Card | null>(null);
  const [cards, setCards] = useState([]);
  const [selectedTab, setSelectedTab] = useState<EditorTab>('preview');
  const [fetchingCards, setFetchingCards] = useState(true);

  const answerCard = async (card: Card, choice: Choice) => {
    const newCard = sm2.answer_card(card, choice);

    try {
      setSync(SyncStatus.Syncing, null);
      await API.updateCard(card.id, {card: newCard});
      setSync(SyncStatus.Success);

      if (cards.length > 1) {
        setCard(cards[1]);
      } else {
        fetchAllCards();
      }
      setCards(cards.slice(1));
    } catch (error) {
      setSync(SyncStatus.Error, error);
      logger.error(error);
    }
  };

  const nextInterval = (card: Card, choice: Choice) => {
    return sm2.next_interval_string(card, choice);
  };

  const fetchAllCards = () => {
    setFetchingCards(true);
    sm2 &&
      API.fetchAllCards(sm2.day_today()).then(
        (cards) => {
          setCards(cards);
          if (cards.length) {
            setCard(cards[0]);
          } else {
            setCard(null);
          }
          setFetchingCards(false);
        },
        (error) => {
          logger.error(error);
          setFetchingCards(false);
        }
      );
  };

  useEffect(loadSm2, [loadSm2]);

  useEffect(fetchAllCards, [sm2]);

  if (loading) {
    return null;
  }

  if (fetchingCards) {
    return null;
  }

  return (
    <div className="max-w-xl mx-auto mt-5">
      {!card ? (
        <div className="px-4 py-3 border rounded shadow">
          No card to learn for now, come back here later.
        </div>
      ) : (
        <div className="p-2 border rounded shadow">
          <NoteEdit
            noteId={card.note.id}
            noteContent={card.note.content}
            setNote={(note) => setCard({...card, note})}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />

          {selectedTab === 'preview' && (
            <Answer
              card={card}
              answerCard={answerCard}
              nextInterval={nextInterval}
              config={config}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default function CardWithContext() {
  return (
    <SrsProvider>
      <CardReview />
    </SrsProvider>
  );
}
