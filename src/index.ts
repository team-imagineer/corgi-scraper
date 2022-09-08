import "dotenv/config";
import { EbsAiClient } from "./api";
import search from "./constant/search";
import { ProblemSchema } from "./schema";

export const run = async () => {
  const client = new EbsAiClient(process.env.USERNAME!, process.env.PASSWORD!);
  await client.setup();

  const searchResponse = await client.search(search["국어_3학년_2021년_11월"]);
  const problems = ProblemSchema.createManyFromSearchResponse(searchResponse);
};

run();
