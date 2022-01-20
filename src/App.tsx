import React, { useState } from "react";
import { QuestionState, fetchQuizQuestions } from "./API";

import QuestionCard from "./components/QuestionCard";

import { GlobalStyle, Wrapper } from "./App.styles";

export interface AnswerObject {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const TOTAL_QUESTIONS = 10;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  const startTrivia = async () => {
    setLoading(true);
    try {
      const newQuestions = await fetchQuizQuestions(TOTAL_QUESTIONS, "easy");
      setQuestions(newQuestions);
      setScore(0);
      setUserAnswers([]);
      setNumber(0);
      setGameOver(false);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { value },
    } = e;

    if (!gameOver) {
      const correct = questions[number].correct_answer === value;
      if (correct) setScore((prev) => prev + 1);
      const answerObj = {
        question: questions[number].question,
        answer: value,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers([...userAnswers, answerObj]);
    }
  };

  const nextQuestion = () => {
    const nextQuestion = number + 1;
    if (nextQuestion === TOTAL_QUESTIONS) setGameOver(true);
    else {
      setNumber(nextQuestion);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <div className="App">
          <h1>React Quiz</h1>
          {(gameOver || userAnswers.length === TOTAL_QUESTIONS) && (
            <button className="start" onClick={startTrivia}>
              Start
            </button>
          )}
          {!gameOver && <p className="score">Score: {score}</p>}
          {loading && <p>Loading questions...</p>}
          {!loading && !gameOver && (
            <QuestionCard
              questionNr={number + 1}
              totalQuestions={TOTAL_QUESTIONS}
              question={questions[number].question}
              answers={questions[number].answers}
              userAnswer={userAnswers ? userAnswers[number] : undefined}
              callback={checkAnswer}
            />
          )}
          {!gameOver &&
            !loading &&
            userAnswers.length === number + 1 &&
            number !== TOTAL_QUESTIONS - 1 && (
              <button className="next" onClick={nextQuestion}>
                Next
              </button>
            )}
        </div>
      </Wrapper>
    </>
  );
};

export default App;
