import React, {useEffect, useState} from 'react';
import {useSrs, SrsProvider} from './SrsProvider';
import {useGlobal} from 'src/components/global/GlobalProvider';
import NotePreview from 'src/components/note/NotePreview';
import NoteEmpty from 'src/components/note/NoteEmpty';

import {Choice, SyncStatus, SrsConfig, Card} from 'src/libs/types';
import logger from 'src/libs/logger';
import * as API from 'src/libs/api';

type AnswerProps = {
  card: Card;
  config?: SrsConfig;
  answerCard: (card: Card, choice: Choice) => void;
  nextInterval: (card: Card, choice: Choice) => string;
};

const getAnswerButtonClass = (color: string) => {
  return `w-full p-1 mb-1 font-bold text-${color}-700 border-2 border-${color}-700 rounded-full outline-none hover:text-${color}-600 hover:border-${color}-600 active:text-${color}-500 active:border-${color}-500 focus:outline-none`;
};

type AnswerItemProps = {
  text: string;
  color: string;
  showDue: boolean;
  card: Card;
  choice: Choice;
  answerCard: (card: Card, choice: Choice) => void;
  nextInterval: (card: Card, choice: Choice) => string;
};

function AnswerItem(props: AnswerItemProps) {
  const {text, showDue, choice, color, answerCard, card, nextInterval} = props;
  return (
    <button
      className={getAnswerButtonClass(color)}
      onClick={() => answerCard(card, choice)}
    >
      {text}
      {showDue && ` (${nextInterval(card, choice)})`}
    </button>
  );
}

function Answers(props: AnswerProps) {
  const {card, config, answerCard, nextInterval} = props;

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
          nextInterval={nextInterval}
          showDue={config?.show_next_due ? true : false}
        />
      ))}
    </div>
  );
}

function CardReview() {
  const {sm2, loadSm2, loading, error, config} = useSrs();
  const {setSync} = useGlobal();

  const [card, setCard] = useState<Card | null>(null);
  const [cards, setCards] = useState([]);
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

  if (!loading && error) {
    // https://github.com/repeatnotes/repeatnotes/issues/28
    return (
      <NoteEmpty text="Your web browser is not supported to run this feature." />
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-5">
      {!card ? (
        <NoteEmpty text="No more note to review today, come back later." />
      ) : (
        <div className="p-2 border rounded shadow-sm">
          <NotePreview content={card.note.content} />

          <Answers
            card={card}
            answerCard={answerCard}
            nextInterval={nextInterval}
            config={config}
          />
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
