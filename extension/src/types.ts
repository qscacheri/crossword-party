export type Cell = {
  type: number;
  value: string;
  index: number;
  memberId?: string;
};

export type Member = {
  id: string;
  color: string;
  cursorIndex: number;
};
