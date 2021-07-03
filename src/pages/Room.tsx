import { FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button/Button';
import { RoomCode } from '../components/RoomCode/RoomCode';

import '../styles/room.scss';
import { database } from '../services/firebase';
import { useEffect } from 'react';

type RoomParams = {
  id: string;
};

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    iisHighlighted: boolean;
    isAnswer: boolean;
  }
>;

type Question = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  iisHighlighted: boolean;
  isAnswer: boolean;
};

export function Room() {
  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState('');
  const [question, setQuestion] = useState<Question[]>([]);
  const [title, setTitle] = useState('');

  const roomId = params.id;

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on('value', (room) => {
      const databaseRoom = room.val();
      const FirebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
      const parsedQuestions = Object.entries(FirebaseQuestions).map(
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            iisHighlighted: value.iisHighlighted,
            isAnswer: value.isAnswer,
          };
        },
      );
      setTitle(databaseRoom.title);
      setQuestion(parsedQuestions);
    });
  }, []);

  async function handleSendQuestiom(event: FormEvent) {
    event.preventDefault();
    if (newQuestion.trim() === '') return;

    if (!user) {
      throw new Error('You must be logged in ');
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswer: false,
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion('');
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="letmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>

      <section className="main">
        <div className="room-title">
          <h1>Sala {title}</h1>
          {question.length > 0 && (
            <span>
              {question.length} pergunta{question.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <form onSubmit={handleSendQuestiom}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={({ target }) => setNewQuestion(target.value)}
            value={newQuestion}
          ></textarea>

          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <p>{user.name}</p>
              </div>
            ) : (
              <p>
                Para enviar uma pergunta, <button> faça seu login</button>
              </p>
            )}
            <Button type="submit">Enviar Pergunta </Button>
          </div>
        </form>
        {JSON.stringify(question)}
      </section>
    </div>
  );
}
