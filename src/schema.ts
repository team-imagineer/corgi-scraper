import { CorrectAnswerResponseDto } from "../type/dto/answer";
import { ItemResponseDto } from "../type/dto/item";
import { ItemsResponseDto } from "../type/dto/items";
import { SearchResponseDto } from "../type/dto/search";
import { findChildNodesByKey } from "./util/f";

export class BookSchema {
  public title: string;
  public problemSets: ProblemSetSchema[];

  constructor(
    public category: string,
    public grade: string,
    public year: string,
    public month: string
  ) {
    // 국어_3학년_2021년_11월
    this.title = `${this.category} ${this.grade}학년 ${this.year}년 ${this.month}월`;
  }

  public toRaw() {
    return {
      title: this.title,
      category: this.category,
      grade: this.grade,
      year: this.year,
      month: this.month,
      problemSets: this.problemSets.map((problemSet) => problemSet.toRaw()),
    };
  }
}

export class ProblemSetSchema {
  public id: string;
  public paragraph: string;
  public problems: ProblemSchema[];

  /**
   * 같은 groupId를 지닌 problem을 묶어서 ProblemSet 생성
   * @param problems 문제 인스턴스 배열
   */
  public static creatManyFromProblems(
    problems: ProblemSchema[]
  ): ProblemSetSchema[] {
    const problemSets = [];
    const problemGroupMap: { [id: string]: ProblemSchema[] } = {};

    problems.forEach((problem) => {
      if (problem.groupId) {
        if (problem.groupId in problemGroupMap) {
          problemGroupMap[problem.groupId].push(problem);
        } else {
          problemGroupMap[problem.groupId] = [problem];
        }
      } else {
        const problemSet = new ProblemSetSchema();

        problemSet.id = problem.groupId;
        problemSet.paragraph = "";
        problemSet.problems = [problem];

        problemSets.push(problemSet);
      }
    });

    Object.entries(problemGroupMap).forEach(([id, problems]) => {
      const problemSet = new ProblemSetSchema();

      problemSet.id = id;
      problemSet.paragraph = "";
      problemSet.problems = problems;

      problemSets.push(problemSet);
    });

    return problemSets;
  }

  public updateWithItemsResponse(itemsResponse: ItemsResponseDto) {
    const {
      Items: { Item },
    } = itemsResponse;

    if (Array.isArray(Item)) {
      this.paragraph = findChildNodesByKey(Item[0].LML, "Text").join("");
    } else {
      this.paragraph = findChildNodesByKey(Item, "Text").join("");
    }
  }

  public toRaw() {
    return {
      paragraph: this.paragraph,
      problems: this.problems.map((problem) => problem.toRaw()),
    };
  }
}

export class ProblemSchema {
  public id: string;
  public groupId: string;

  public title: string;
  public number: string;
  public point: string;
  public category1: string;
  public category2: string;
  public category3: string;
  public category4: string;
  public category5: string;
  public wrongRate: string;

  public question: string;
  public table: string;
  public choices: string;
  public answerIndex: string;
  public explanation: string;

  public static createManyFromSearchResponse(
    searchResponse: SearchResponseDto
  ) {
    const problems: ProblemSchema[] = [];

    searchResponse.itemList.item.forEach((item) => {
      const problem = new ProblemSchema();

      problem.id = item.item_id;
      problem.title = item.title;
      problem.number = item.item_number;
      problem.point = item.point;
      problem.category1 = item.cate_nm_1;
      problem.category2 = item.cate_nm_2;
      problem.category3 = item.cate_nm_3;
      problem.category4 = item.cate_nm_4;
      problem.category5 = item.cate_nm_5;
      problem.wrongRate = item.wrong_rate;

      problems.push(problem);
    });

    return problems;
  }

  public updateWithItemResponse(itemResponse: ItemResponseDto) {
    this.groupId = itemResponse.Item.GroupID;
    this.question = findChildNodesByKey(
      itemResponse.Item.LML.Question.Paragraph,
      "Text"
    ).join("");
    this.table = findChildNodesByKey(
      itemResponse.Item.LML.Question.Table,
      "Text"
    ).join("");
    this.choices = findChildNodesByKey(
      itemResponse.Item.LML.Question.List,
      "Text"
    ).join("");
    this.explanation = findChildNodesByKey(
      itemResponse.Item.LML.Question.Explanation,
      "Text"
    ).join("");
  }

  public updateWithCorrectAnswerResponse(
    correctAnswerResponse: CorrectAnswerResponseDto
  ) {
    this.answerIndex = correctAnswerResponse.correctNo;
  }

  public toRaw() {
    return {
      title: this.title,
      number: this.number,
      point: this.point,
      category1: this.category1,
      category2: this.category2,
      category3: this.category3,
      category4: this.category4,
      category5: this.category5,
      wrongRate: this.wrongRate,

      question: this.question,
      table: this.table,
      choices: this.choices,
      answerIndex: this.answerIndex,
      explanation: this.explanation,
    };
  }
}
