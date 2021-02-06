import React, {useEffect, useState} from 'react';
import {useGlobal} from 'src/components/global/GlobalProvider';
import NotePreview from 'src/components/note/NotePreview';
import NoteEmpty from 'src/components/note/NoteEmpty';
import Loading from 'src/components/common/Loading';

import {Choice, SyncStatus, Card} from 'src/libs/types';
import logger from 'src/libs/logger';
import * as API from 'src/libs/api';

type AnswerProps = {
  card: Card;
  answerCard: (card: Card, choice: Choice) => void;
};

const getAnswerButtonClass = (color: string) => {
  return `w-full p-1 mb-1 font-bold text-${color}-700 border-2 border-${color}-700 rounded-full outline-none hover:text-${color}-600 hover:border-${color}-600 active:text-${color}-500 active:border-${color}-500 focus:outline-none`;
};

type AnswerItemProps = {
  text: string;
  color: string;
  card: Card;
  choice: Choice;
  answerCard: (card: Card, choice: Choice) => void;
};

function AnswerItem(props: AnswerItemProps) {
  const {text, choice, color, answerCard, card} = props;
  return (
    <button
      className={getAnswerButtonClass(color)}
      onClick={() => answerCard(card, choice)}
    >
      {text}
    </button>
  );
}

function Answers(props: AnswerProps) {
  const {card, answerCard} = props;

  const choices = [
    {text: 'Forgot', choice: Choice.Again, color: 'red'},
    {text: 'Hard', choice: Choice.Hard, color: 'yellow'},
    {text: 'Good', choice: Choice.Ok, color: 'green'},
    {text: 'Easy', choice: Choice.Easy, color: 'indigo'},
  ];

  return (
    <div className="flex items-center justify-center p-2 mt-2 text-xs space-x-2">
      {choices.map((choice) => (
        <AnswerItem
          key={choice.text}
          text={choice.text}
          color={choice.color}
          choice={choice.choice}
          card={card}
          answerCard={answerCard}
        />
      ))}
    </div>
  );
}

export default function CardReview() {
  const {setSync} = useGlobal();

  const [card, setCard] = useState<Card | null>(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  const answerCard = async (card: Card, choice: Choice) => {
    try {
      setSync(SyncStatus.Syncing, null);
      await API.answerCard(card.id, {answer: {choice}});
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

  const fetchAllCards = () => {
    setLoading(true);
    API.fetchAllCards().then(
      (cards) => {
        setCards(cards);
        if (cards.length) {
          setCard(cards[0]);
        } else {
          setCard(null);
        }
        setLoading(false);
      },
      (error) => {
        logger.error(error);
        setLoading(false);
      }
    );
  };

  useEffect(fetchAllCards, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-xl mx-auto mt-5">
      {!card ? (
        <NoteEmpty text="No more note to review today, come back later." />
      ) : (
        <div className="p-2 border rounded shadow-sm">
          <NotePreview content={card.note.content} />

          <Answers card={card} answerCard={answerCard} />
        </div>
      )}
    </div>
  );
}
