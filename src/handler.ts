import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import { EbsAiClient } from "./api";
import { QueryParams } from "./api/query/make";
import { BookSchema, ProblemSchema, ProblemSetSchema } from "./schema";
import { parseJSON2CSV } from "./util/csv";
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

  // 5-1. json file
  await fs.writeFile(
    path.join(__dirname, "../data/json", `${book.title}.json`),
    JSON.stringify(raw, null, 2)
  );

  // 5-2. req json file
  const flatten = raw.problemSets.flatMap((ps) =>
    ps.problems.map((p) => ({
      ...p,
      paragraph: ps.paragraph,
    }))
  );

  await fs.writeFile(
    path.join(__dirname, "../data/req", `${book.title}.json`),
    JSON.stringify(
      {
        title: raw.title,
        category: raw.category,
        grade: raw.grade,
        year: raw.year,
        month: raw.month,
        problems: flatten.map((f) => ({
          title: f.title,
          number: f.number,
          category: f.category,
          itemCategory: f.itemCategory,
          point: f.point,
          paragraph: {
            rawText: f.paragraph + f.table + f.choices,
          },
          question: {
            rawText: f.question,
          },
          answer: f.answerIndex,
          explanation: {
            rawText: f.explanation,
          },
        })),
      },
      null,
      2
    )
  );

  // 5-3. csv file

  const csv = await parseJSON2CSV(flatten);
  await fs.writeFile(
    path.join(__dirname, "../data/csv", `${book.title}.csv`),
    csv
  );
};
