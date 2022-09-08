import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import { EbsAiClient } from "./api";
import { QueryParams } from "./api/query/make";
import { BookSchema, ProblemSchema, ProblemSetSchema } from "./schema";
import { logger } from "./util/logger";

export const handler = async (
  client: EbsAiClient,
  { category, grade, year, month }: QueryParams
) => {
  const book = new BookSchema(category, grade, year, month);

  // 1. 검색
  logger.info(`[NEW] ${book.title}`);
  const searchResponse = await client.search({ category, grade, year, month });

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

  // json file
  await fs.writeFile(
    path.join(__dirname, "../data/json", `${book.title}.json`),
    JSON.stringify(raw, null, 2)
  );
};
