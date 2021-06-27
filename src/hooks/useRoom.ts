import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";
type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
};

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<
      string,
      {
        authorId: string;
      }
    >;
  }
>;

export function useRoom(roomId: string) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [roomNum, setRoomNum] = useState("");

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);
    roomRef.on("value", (room) => {
      const databaseRoom = room.val();
      const firebaseAdmin = databaseRoom.authorId;
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
      const parsedQuestions = Object.entries(firebaseQuestions).map(
        ([key, val]) => {
          return {
            id: key,
            content: val.content,
            author: val.author,
            isHighlighted: val.isHighlighted,
            isAnswered: val.isAnswered,
            likeCount: Object.values(val.likes ?? {}).length,
            likeId: Object.entries(val.likes ?? {}).find(
              ([_, like]) => like.authorId === user?.id
            )?.[0],
          };
        }
      );
      // const questionsSorted = parsedQuestions.sort(
      //   (a, b) => a.likeCount - b.likeCount
      // );
      // setQuestions(questionsSorted);
      setQuestions(parsedQuestions);
      setTitle(databaseRoom.title);
      setRoomNum(databaseRoom.roomNum);
      setAuthorId(firebaseAdmin);
    });

    return () => {
      roomRef.off("value");
    };
  }, [roomId, user?.id]);

  return { questions, title, authorId, roomNum };
}
