import { Link, useHistory } from "react-router-dom";
import { FormEvent } from "react";

import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";

import { Button } from "../components/Button";

import "../styles/auth.scss";
import { useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "../hooks/useAuth";
import { LogoutUser } from "../components/Logout";

export function NewRoom() {
  const { user } = useAuth();
  const history = useHistory();
  const [newRoom, setNewRoom] = useState("");

  async function handleCreateRoom(e: FormEvent) {
    try {
      e.preventDefault();
      if (!newRoom.trim().length) return;
      let roomNumber = ("" + Math.trunc(Math.random() * 10 ** 6)).padStart(
        6,
        "0"
      );

      const roomRef = database.ref("rooms");

      const firebaseRoom = await roomRef.push({
        title: newRoom,
        authorId: user?.id,
        roomNum: roomNumber,
      });

      const roomCode = firebaseRoom.key;
      roomRef.child(roomNumber).update({ key: roomCode });

      history.push(`/admin/rooms/${roomCode}`);
    } catch (err) {
      console.error(err);
    }
  }

  // async function logoutUser() {
  // history.push("/");
  // }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Illustration about Q&A" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="logging-out">
          <LogoutUser userIn={user} redirect={history} />
        </div>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="nome da sala"
              onChange={(e) => setNewRoom(e.target.value)}
              value={newRoom}
            />
            <Button type="submit">Criar sala</Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
