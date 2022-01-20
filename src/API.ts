import { shuffleArray } from "./utils";

export type difficultyOptions = "easy" | "medium" | "hard";

export interface Question {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
}

export type QuestionState = Question & { answers: string[] };

export const fetchQuizQuestions = async (
  amount: number,
  difficulty: difficultyOptions
) => {
  const endpoint = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`;
  let data;
  try {
    data = await (await fetch(endpoint)).json();
  } catch (err) {
    console.log(err);
  }

  return data?.results?.map((item: Question) => ({
    ...item,
    answers: shuffleArray([...item?.incorrect_answers, item?.correct_answer]),
  }));
};
