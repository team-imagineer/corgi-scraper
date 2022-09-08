export const findChildNodesByKey = (
  node: Object,
  targetKey: string
): string[] => {
  if (typeof node !== "object") return [];

  let result: string[] = [];

  for (let [key, value] of Object.entries(node)) {
    if (key === targetKey) {
      result.push(value);
    } else {
      if (!(typeof value === "object" || Array.isArray(value))) continue;
      if (!Array.isArray(value)) value = [value];

      value.forEach((obj: Object) => {
        result = result.concat(findChildNodesByKey(obj, targetKey));
      });
    }
  }

  return result;
};
