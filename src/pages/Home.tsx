import { useHistory } from "react-router";

import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import googleIconImg from "../assets/images/google-icon.svg";

import "../styles/auth.scss";
import { useAuth } from "../hooks/useAuth";
import { FormEvent, useState } from "react";
import { auth, database } from "../services/firebase";
import { Button } from "../components/Button";
import { LogoutUser } from "../components/Logout";

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState("");

  async function handleCreateRoom() {
    try {
      if (!user) await signInWithGoogle();
      history.push("./rooms/new");
    } catch (error) {
      console.error(error);
    }
  }

  async function handleJoinRoom(e: FormEvent) {
    e.preventDefault();

    if (!roomCode.trim().length) return;

    const roomNum = await (await database.ref(`rooms/${roomCode}`).get()).val()
      ?.key;
    console.log(roomCode, roomNum);
    const roomRef = await database.ref(`rooms/${roomNum}`).get();

    if (!roomRef.exists()) throw new Error("Room does not exists");

    if (roomRef.val().closedAt) return alert("Room already closed");

    const { authorId } = roomRef.val();
    if (user?.id === authorId) return history.push(`/admin/rooms/${roomNum}`);

    history.push(`/rooms/${roomNum}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Illustration about Q&A" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="logging-out">
          <LogoutUser userIn={user} />
        </div>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconImg} alt="Google logo" />
            Crie sua sala com o Google
          </button>
          <div className="separator"> ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={(e) => setRoomCode(e.target.value)}
              value={roomCode}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
