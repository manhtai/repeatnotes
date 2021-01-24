import React, {useEffect, useState} from 'react';
import {useSrs, SrsProvider} from './SrsProvider';
import {useGlobal} from 'src/components/global/GlobalProvider';
import {Choice, SyncStatus, Card, EditorTab} from 'src/libs/types';
import logger from 'src/libs/logger';
import * as API from 'src/libs/api';

import Editor from 'src/components/editor/MarkdownEditor';

function CardReview() {
  const {sm2, loadSm2, loading, config} = useSrs();
  const {setSync} = useGlobal();

  const [card, setCard] = useState<Card | null>(null);
  const [cards, setCards] = useState([]);
  const [selectedTab, setSelectedTab] = useState<EditorTab>('preview');

  const answerCard = async (card: Card, choice: Choice) => {
    const newCard = sm2.answer_card(card, choice);

    try {
      setSync(SyncStatus.Syncing, null);
      await API.updateCard(card.id, {card: newCard});
      setSync(SyncStatus.Success);

      if (cards.length > 1) {
        setCard(cards[1]);
      } else {
        setCard(null);
      }
      setCards(cards.slice(1));
    } catch (error) {
      setSync(SyncStatus.Error, error);
      logger.error(error);
    }
  };

  const nextInterval = (choice: Choice) => {
    return sm2.next_interval_string(card, choice);
  };

  const fetchAllCards = () => {
    sm2 &&
      API.fetchAllCards(sm2.day_today()).then((cards) => {
        setCards(cards);
        if (cards.length) {
          setCard(cards[0]);
        }
      });
  };

  useEffect(loadSm2, [loadSm2]);

  useEffect(fetchAllCards, [sm2]);

  return (
    <div className="mt-10">
      {loading ? null : !card ? (
        <div className="px-4 py-3 border rounded shadow">
          No card to learn for now, come back here later.
        </div>
      ) : (
        <div className="p-2 border rounded shadow">
          <div
            onClick={() => selectedTab === 'preview' && setSelectedTab('write')}
          >
            <Editor
              content={card.id}
              setContent={(s) => {
                setCard({...card, id: s});
              }}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          </div>

          <div className="flex items-center justify-center mt-2">
            <button
              className="flex-1 w-full px-3 py-1 mb-1 mr-1 font-bold text-gray-200 bg-red-700 rounded-full outline-none active:bg-red-500 hover:bg-red-600 focus:outline-none"
              onClick={() => answerCard(card, Choice.Again)}
            >
              Again
              {config?.show_next_due && (
                <span> ({nextInterval(Choice.Again)})</span>
              )}
            </button>
            <button
              className="flex-1 w-full px-3 py-1 mb-1 mr-1 font-bold text-gray-200 bg-yellow-700 rounded-full outline-none active:bg-yellow-500 hover:bg-yellow-600 focus:outline-none"
              onClick={() => answerCard(card, Choice.Hard)}
            >
              Hard
              {config?.show_next_due && (
                <span> ({nextInterval(Choice.Hard)})</span>
              )}
            </button>
            <button
              className="flex-1 w-full px-3 py-1 mb-1 mr-1 font-bold text-gray-100 bg-green-700 rounded-full outline-none active:bg-green-500 hover:bg-green-600 focus:outline-none"
              onClick={() => answerCard(card, Choice.Ok)}
            >
              Good
              {config?.show_next_due && (
                <span> ({nextInterval(Choice.Ok)})</span>
              )}
            </button>
            <button
              className="flex-1 w-full px-3 py-1 mb-1 mr-1 font-bold text-gray-100 bg-blue-700 rounded-full outline-none active:bg-blue-500 hover:bg-blue-600 focus:outline-none"
              onClick={() => answerCard(card, Choice.Easy)}
            >
              Easy
              {config?.show_next_due && (
                <span> ({nextInterval(Choice.Easy)})</span>
              )}
            </button>
          </div>
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
