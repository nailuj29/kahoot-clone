export interface Quiz {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: Date;
  private: boolean;
  questions: Question[];
}

export interface Question {
  text: string;
  answers: string[];
  correctAnswers: number[];
}
