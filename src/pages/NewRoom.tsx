import { FormEvent, useState } from 'react';
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import { Link, useHistory } from 'react-router-dom';

import { Button } from '../components/Button/Button';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

import '../styles/auth.scss';

export function NewRoom() {
  const { user } = useAuth();
  const [newRoom, setNewRoom] = useState('');
  const history = useHistory();

  async function handleCreateRomm(event: FormEvent) {
    event.preventDefault();
    // Caso o usuario não digitar nada ou espaços vazios, a função sera retornada
    if (newRoom.trim() === '') return;
    // Criado um referencia no firebase a uma nova sessão com o nome 'rooms'
    const roomRef = database.ref('rooms');
    // Cria um novo registro de sala e joga dentro sa sessão 'rooms' no firebase.
    const firebaseRomm = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });
    // muda para rota /rooms/key da sala, essa key é gerada pelo firebase
    history.push(`/rooms/${firebaseRomm.key}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img
          src={illustrationImg}
          alt="ilustração simbolizando perguntas e respostas"
        />
        <strong>Crie salas de Q & A ao vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="LetMeAsk" />
          <h2>Criar uma nova sala</h2>

          <form onSubmit={handleCreateRomm}>
            <input
              type="text"
              placeholder="Nome da sala"
              onChange={(event) => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button type="submit">Criar Sala</Button>
          </form>
          <p>
            Quer entrar em uma sala ja existente?
            <Link to="/"> Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
