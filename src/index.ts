import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import { EbsAiClient } from "./api";
import search from "./constant/search";
import { BookSchema, ProblemSchema, ProblemSetSchema } from "./schema";
import { logger } from "./util/logger";

export const handler = async () => {
  const client = new EbsAiClient();
  await client.auth(process.env.USERNAME!, process.env.PASSWORD!);

  const book = new BookSchema("언어와매체", "3", "2021", "09");

  // 1. 검색
  logger.info(`[NEW] ${book.title}`);
  const searchResponse = await client.search(search[book.title]);

  // 2. 검색된 문제들 조회
  const problems = await Promise.all(
    ProblemSchema.createManyFromSearchResponse(searchResponse).map(
      async (problem) => {
        const itemResponse = await client.getItemById(problem.id);
        problem.updateWithItemResponse(itemResponse);

        const correctAnswerResponse = await client.getCorrectAnswer(problem.id);
        problem.updateWithCorrectAnswerResponse(correctAnswerResponse);

        return problem;
      }
    )
  );

  // 3. 그룹짓고 본문 조회
  const problemSets = await Promise.all(
    ProblemSetSchema.creatManyFromProblems(problems).map(async (problemSet) => {
      const itemsResponse = await client.getItemsById(
        problemSet.problems[0].id
      );
      problemSet.updateWithItemsResponse(itemsResponse);

      return problemSet;
    })
  );
  book.problemSets = problemSets;

  // 4. 문제 순서에 맞게 정렬
  const raw = book.toRaw();
  raw.problemSets.sort(
    (ps, _ps) => +ps.problems[0].number - +_ps.problems[0].number
  );
  raw.problemSets.forEach((ps) => {
    ps.problems.sort((p, _p) => +p.number - +_p.number);
  });

  await fs.writeFile(
    path.join(__dirname, "../data", `${book.title}.json`),
    JSON.stringify(raw, null, 2)
  );
};

handler();
