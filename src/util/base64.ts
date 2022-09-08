export const encodeToBase64 = (s: string) => {
  return Buffer.from(s).toString("base64");
};

export const decodeFromBase64 = (s: string) => {
  return Buffer.from(s, "base64").toString();
};
