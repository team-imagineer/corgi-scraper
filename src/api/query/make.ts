import { SearchRequestDto } from "../../../type/dto/search";

const CATEGORY = {
  국어: "2002730,2002731,2002734,2002733,2002732,2006158,2006372",
  화법과작문: "2002730,2002731,2002734,2002733",
  언어와매체: "2002730,2002731,2002732,2006158,2006372",
  독서: "2002730",
  문학: "2002731",
  화법: "2002734",
  작문: "2002733",
  언어_문법: "2002732",
  언어와매체_언어: "2006158",
  언어와매체_매체: "2006372",
} as const;
type CATEGORY = typeof CATEGORY[keyof typeof CATEGORY];

const DEFAULT_QUERY: SearchRequestDto = {
  is_moc: "1",
  item_point: "1,2,3,4",
  item_type: "1",
  item_num: "100",
  del_dupitem_yn: 1,
  wrong_rate: "0",
  target_cd: "",
  cate_cd_2: "",
  previous_questions: [],
};

export type QueryParams = {
  grade: string;
  year: string;
  month: string;
  category: keyof typeof CATEGORY;
};

export const makeQuery = ({ grade, year, month, category }: QueryParams) => {
  const query = DEFAULT_QUERY;

  query.cate_cd_2 = CATEGORY[category];
  query.previous_questions = query.cate_cd_2.split(",").map((cate_cd_2) => ({
    cate_cd_2,
    month,
    year,
  }));
  query.target_cd = grade;

  return query;
};
