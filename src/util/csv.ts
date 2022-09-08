import jsonexport from "jsonexport/dist";

export const parseJSON2CSV = async (obj: object) => {
  return jsonexport(obj);
};
