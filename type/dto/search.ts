export type SearchRequestDto = {
  is_moc: string;
  item_point: string;
  item_type: string;
  item_num: string;
  del_dupitem_yn: number;
  wrong_rate: string;
  target_cd: string;
  cate_cd_2: string;
  previous_questions: {
    cate_cd_2?: string;
    year?: string;
    month?: string;
  }[];
};

export type SearchResponseDto = {
  resultStatus: string;
  itemList: {
    status: number;
    reason: string;
    total_value: number;
    item: {
      item_id: string;
      cate_cd_1: string;
      cate_nm_1: string;
      cate_cd_2: string;
      cate_nm_2: string;
      cate_cd_3: string;
      cate_nm_3: string;
      cate_cd_4: string;
      cate_nm_4: string;
      cate_cd_5: string;
      cate_nm_5: string;
      avg_time: number;
      point: string;
      year: string;
      title: string;
      is_moc: number;
      item_number: string;
      level_rate: string;
      wrong_rate: string;
    }[];
  };
};
