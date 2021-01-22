import React, {useEffect, useState} from 'react';
import {useSrs, SrsProvider} from './SrsProvider';
import {useGlobal} from 'src/components/global/GlobalProvider';
import {Choice, SyncStatus, CardQueue, Card} from 'src/libs/types';
import logger from 'src/libs/logger';
import * as API from 'src/libs/api';

function CardReview() {
  const {sm2, loadSm2, loading} = useSrs();
  const {setSync} = useGlobal();

  const [card, setCard] = useState<Card | null>(null);
  const [cards, setCards] = useState([]);

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
    }
  };

  const unsuspendCard = async (card: Card) => {
    const newCard = sm2.unsuspend_card(card);

    try {
      await API.updateCard(card.id, {card: newCard});
      setSync(SyncStatus.Success, null);

      setCard({...newCard, id: card.id});
    } catch (error) {
      logger.error(error);
      setSync(SyncStatus.Error, error);
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
    <>
      {loading ? null : !card ? (
        <div>No card to learn for now</div>
      ) : (
        <div className="p-2 m-2 border border-gray-200 rounded shadow">
          {`Card #${card.id}`}

          {card.card_queue === CardQueue.Suspended ? (
            <div>
              <div>Card suspended</div>
              <div onClick={() => unsuspendCard(card)}>Unsuspend card</div>
            </div>
          ) : card.card_queue === CardQueue.Buried ? (
            <div>Card buried</div>
          ) : (
            <div className="flex text-center">
              <button
                className="flex-1 w-full px-3 py-1 mb-1 mr-1 font-bold text-gray-200 bg-red-700 rounded-full outline-none active:bg-red-500 hover:bg-red-600 focus:outline-none"
                onClick={() => answerCard(card, Choice.Again)}
              >
                Again ({nextInterval(Choice.Again)})
              </button>
              <button
                className="flex-1 w-full px-3 py-1 mb-1 mr-1 font-bold text-gray-200 bg-yellow-700 rounded-full outline-none active:bg-yellow-500 hover:bg-yellow-600 focus:outline-none"
                onClick={() => answerCard(card, Choice.Hard)}
              >
                Hard ({nextInterval(Choice.Hard)})
              </button>
              <button
                className="flex-1 w-full px-3 py-1 mb-1 mr-1 font-bold text-gray-100 bg-green-700 rounded-full outline-none active:bg-green-500 hover:bg-green-600 focus:outline-none"
                onClick={() => answerCard(card, Choice.Ok)}
              >
                Ok ({nextInterval(Choice.Ok)})
              </button>
              <button
                className="flex-1 w-full px-3 py-1 mb-1 mr-1 font-bold text-gray-100 bg-blue-700 rounded-full outline-none active:bg-blue-500 hover:bg-blue-600 focus:outline-none"
                onClick={() => answerCard(card, Choice.Easy)}
              >
                Easy ({nextInterval(Choice.Easy)})
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default function CardWithContext() {
  return (
    <SrsProvider>
      <CardReview />
    </SrsProvider>
  );
}
