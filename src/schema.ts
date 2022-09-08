import { SearchResponseDto } from "../type/dto/search";

export class BookSchema {
  public title: string;
  public year: string;
  public month: string;
  public problemSets: ProblemSetSchema[];
}

export class ProblemSetSchema {
  public id: string;
  public paragraph: string;
  public problems: ProblemSchema[];
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

      problems.push(new ProblemSchema());
    });

    return problems;
  }
}
