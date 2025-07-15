export type QuestionResponse = {
  answers: {
    description: string;
    id: number;
  }[];
  id: number;
  isMultipleAnswers: boolean;
  question: string;
};
