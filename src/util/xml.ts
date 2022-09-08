import parser from "xml2json";

export const parseXML2JSON = (xmlData: string) => {
  return JSON.parse(parser.toJson(xmlData));
};
