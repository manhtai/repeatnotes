import React, {useEffect, useState} from 'react';
import {useCard, CardProvider} from './CardProvider';
import {Choice, CardQueue} from 'src/libs/types';
import logger from 'src/libs/logger';

function Card() {
  const {sm2, loadSm2, loading} = useCard();

  useEffect(() => loadSm2(), [loadSm2]);

  const cardDefault = {
    id: 1234,
    card_type: 0,
    card_queue: 0,
    due: 0,
    interval: 0,
    ease_factor: 0,
    reps: 0,
    lapses: 0,
    remaining_steps: 0,
  };
  const [card, setCard] = useState(cardDefault);

  const answerCard = (choice: Choice) => {
    logger.info('Answer with choice', choice);
    const newCard = sm2.answer_card(card, choice);
    setCard({...newCard, id: 1234});
    if (newCard.card_queue === CardQueue.Suspended) {
      alert('Card is suspended!');
    }
  };

  const nextInterval = (choice: Choice) => {
    return sm2.next_interval_string(card, choice);
  };

  return (
    <>
      {loading ? null : (
        <div>
          {`Card #${card.id}`}

          <div className="flex text-center">
            <button
              className="flex-1 w-full px-3 py-1 mb-1 mr-1 font-bold text-gray-200 bg-red-700 rounded-full outline-none active:bg-red-500 hover:bg-red-600 focus:outline-none"
              onClick={() => answerCard(Choice.Again)}
            >
              Again ({nextInterval(Choice.Again)})
            </button>
            <button
              className="flex-1 w-full px-3 py-1 mb-1 mr-1 font-bold text-gray-200 bg-yellow-700 rounded-full outline-none active:bg-yellow-500 hover:bg-yellow-600 focus:outline-none"
              onClick={() => answerCard(Choice.Hard)}
            >
              Hard ({nextInterval(Choice.Hard)})
            </button>
            <button
              className="flex-1 w-full px-3 py-1 mb-1 mr-1 font-bold text-gray-100 bg-green-700 rounded-full outline-none active:bg-green-500 hover:bg-green-600 focus:outline-none"
              onClick={() => answerCard(Choice.Ok)}
            >
              Ok ({nextInterval(Choice.Ok)})
            </button>
            <button
              className="flex-1 w-full px-3 py-1 mb-1 mr-1 font-bold text-gray-100 bg-blue-700 rounded-full outline-none active:bg-blue-500 hover:bg-blue-600 focus:outline-none"
              onClick={() => answerCard(Choice.Easy)}
            >
              Easy ({nextInterval(Choice.Easy)})
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function CardWithContext() {
  return (
    <CardProvider>
      <Card />
    </CardProvider>
  );
}
