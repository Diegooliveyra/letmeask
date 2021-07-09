// import { useAuth } from '../hooks/useAuth';
import { useHistory, useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';

import { Button } from '../components/Button/Button';
import { RoomCode } from '../components/RoomCode/RoomCode';
import { Question } from '../components/Question/Question';

import { database } from '../services/firebase';
import { useRoom } from '../hooks/useRoom';

import '../styles/room.scss';

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  // const { user } = useAuth();
  const params = useParams<RoomParams>();
  const history = useHistory();

  const roomId = params.id;
  const { questions, title } = useRoom(roomId);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.push('/');
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que deseja excluir essa pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar Sala
            </Button>
          </div>
        </div>
      </header>

      <section className="main">
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && (
            <span>
              {questions.length} pergunta{questions.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
              >
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="remover pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
      </section>
    </div>
  );
}