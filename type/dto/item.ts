export type ItemResponseDto = {
  Item: Item;
};

export type Item = {
  BookItem: BookItem;
  ItemStat: ItemStat;
  ItemIndexes: ItemIndexes;
  PreviewText: string;
  LML: LML;
  SheetName: string; // "2022 대학수학능력시험>국어>2번",
  ApplyYear: string;
  ConfirmDate: string;
  ConfirmLevelID: string;
  ConfirmUserID: string;
  CorrectAnswer: string;
  CreateUserID: string;
  Descript: string;
  FromCompanyID: string;
  GroupID: string;
  HasSound: string;
  ID: string;
  IsConfirm: string;
  IsDelete: string;
  IsMoc: string;
  IsSentence: string;
  ItemCode: string;
  ItemID: string;
  ItemNo: string;
  LevelID: string;
  MakeDate: string;
  PCode: string;
  Point: string;
  SearchWords: string;
  TypeID: string;
};

export type BookItem = {
  BookNo: string;
  Code: string;
  ExpCourseID: string;
  ExpLectureID: string;
  ItemNumber: string;
  MakeUserName: string;
  Title: string;
  Unit1: string;
  Unit2: string;
  Unit3: string;
};

export type ItemStat = {
  AnswerCount: string;
  CorrectCount: string;
  CorrectRate: string;
  FiveCount: string;
  FourCount: string;
  OneCount: string;
  ThreeCount: string;
  TwoCount: string;
};

export type ItemIndexes = {
  ItemIndex: ItemIndex | ItemIndex[];
  ID: string;
  ItemCount: string;
  Page: string;
  Size: string;
  TotalPage: string;
  TotalRow: string;
};

export type ItemIndex = {
  ApplyNo: string;
  DomainID: string;
  DomainName: string;
  ID: string;
  Index1ID: string;
  Index1Name: string;
  Index2ID: string;
  Index2Name: string;
  Index3ID: string;
  Index3Name: string;
  IndexType: string;
  SubjectID: string;
  SubjectName: string;
  YearID: string;
  YearName: string;
};

export type LML = {
  Question?: QuestionOrSentence;
  Sentence?: QuestionOrSentence;
  QuizID?: string;
  Numb: string;
  Seq: string;
};

export type QuestionOrSentence = {
  Paragraph?: Paragraph | Paragraph[];
  List?: List;
  Table?: Table;
  Explanation?: Explanation;
};

export type Paragraph = {
  Run?: Run | Run[];
  Image?: {
    ContentHeight?: string;
    ContentWidth?: string;
    Margin?: string;
    Uri?: string;
  };
  Table?: Table | Table[];
  Margin?: string;
  TextAlignment?: string;
};

export type Run = {
  FontSize?: string;
  FontWeight?: string;
  Text?: string;
  "self-closing"?: string;
};

export type List = {
  ListItem: {
    Paragraph?: Paragraph | Paragraph[];
    OriginalSequence?: string;
    IsCorrectAnswer?: string;
  }[];
};

export type Table = {
  ColumnInfo?: string;
  TextAlignment?: string;
  Margin?: string;
  TableRow?: TableRow | TableRow[];
};

export type TableRow = {
  Height?: string;
  TableCell?: TableCell | TableCell[];
};

export type TableCell = {
  BorderThickness?: string;
  Padding?: string;
  Background?: string;
  Paragraph?: Paragraph | Paragraph[];
};

export type Explanation = {
  Paragraph?: Paragraph | Paragraph[];
};
