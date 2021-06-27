import { useHistory, useParams } from "react-router-dom";
import deleteImg from "../assets/images/delete.svg";
import logoImg from "../assets/images/logo.svg";
import checkImg from "../assets/images/check.svg";
import answerImg from "../assets/images/answer.svg";
import { Button } from "../components/Button";
import { LogoutUser } from "../components/Logout";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";
// import { useAuth } from "../hooks/useAuth";
import { useRoom } from "../hooks/useRoom";
import { auth, database } from "../services/firebase";
import "../styles/room.scss";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  // const { user } = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { title, questions, authorId, roomNum } = useRoom(roomId);
  const { user } = useAuth();

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      closedAt: new Date(),
    });

    history.push("/");
  }

  async function handleDeleteQuestion(questionId: string) {
    window.confirm("Tem certeza que você deseja excluir esta pergunta?") &&
      (await database.ref(`rooms/${roomId}/questions/${questionId}`).remove());
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }
  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  // history.push("/");

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="" />
          <div>
            {" "}
            <RoomCode code={roomNum} />
            {user?.id === authorId ? (
              <Button isOutlined onClick={handleEndRoom}>
                Encerrar Sala
              </Button>
            ) : (
              ""
            )}
            <LogoutUser userIn={user} redirect={history} />
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length ? (
            <span>
              {questions.length} pergunta{questions.length !== 1 && "s"}
            </span>
          ) : (
            ""
          )}
        </div>
        {user?.id === authorId ? (
          <div className="question-list">
            {questions.map((question) => {
              return (
                <Question
                  key={question.id}
                  content={question.content}
                  author={question.author}
                  isAnswered={question.isAnswered}
                  isHighlighted={question.isHighlighted}
                >
                  {!question.isAnswered && [
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img src={checkImg} alt="Mark question as answered" />
                    </button>,
                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Highlight question" />
                    </button>,
                  ]}
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    <img src={deleteImg} alt="Delete Question" />
                  </button>
                </Question>
              );
            })}
          </div>
        ) : (
          <h1>Acesso Não Autorizado!</h1>
        )}
      </main>
    </div>
  );
}
