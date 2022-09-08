import { LML } from "./item";

export type ItemsResponseDto = {
  Items: Items;
};

export type Items = {
  ID: string;
  ItemCount: string;
  Page: string;
  PageSize: string;
  Size: string;
  TotalPage: string;
  TotalRow: string;
  Item: Item[] | Item;
};

export type Item = {
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
  SheetName: string; // "화법과 작문>0번",
  TypeID: string;
  BookItem: BookItem;
  ItemStat: any;
  ItemIndexes: any;
  PreviewText: PreviewText;
  LML: LML;
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
  "self-closing": string;
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
  "self-closing": string;
};

export type PreviewText = {
  "self-closing": string;
};
