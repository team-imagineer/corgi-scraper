import { parse } from "json2csv";

export const parseJSON2CSV = (obj: object) => {
  return parse(obj);
};
