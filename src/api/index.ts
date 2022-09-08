import * as cheerio from "cheerio";
import { CookieJar } from "tough-cookie";
import got, { Got, OptionsOfTextResponseBody, Response } from "got";
import { Service } from "typedi";

import {
  EBS_LOGIN_PAGE_URL,
  EBS_LOGIN_URL,
  EBS_AUTH_PAGE_URL,
  EBS_AUTH_REDIRECT_URL,
  EBS_ITEM_URL,
  EBS_ITEMS_URL,
  EBS_ANSWER_URL,
  EBS_ITEM_SEARCH_URL,
} from "../constant/url";
import { ItemResponseDto } from "../../type/dto/item";
import { parseXML2JSON } from "../util/xml";
import { decodeFromBase64 } from "../util/base64";
import { ItemsResponseDto } from "../../type/dto/items";
import { makeQuery, QueryParams } from "./query/make";
import { SearchResponseDto } from "../../type/dto/search";
import { CorrectAnswerResponseDto } from "../../type/dto/answer";
import { logger } from "../util/logger";

@Service()
export class EbsAiClient {
  private readonly request: Got;

  constructor() {
    const cookieJar = new CookieJar();

    this.request = got.extend({
      cookieJar: cookieJar,
    });
  }

  async get(url: string, options?: OptionsOfTextResponseBody) {
    return this.request.get(url, options);
  }

  async post(url: string, options?: OptionsOfTextResponseBody) {
    return this.request.post(url, options);
  }

  async auth(username: string, password: string) {
    logger.info(`[LOGIN] ${username} 접속...`);
    let response: Response<string>, $: cheerio.CheerioAPI, hrefs: string[];

    response = await this.get(EBS_LOGIN_PAGE_URL);
    $ = cheerio.load(response.body);

    const state = $(`input[name="state"]`).attr("value");
    response = await this.post(EBS_AUTH_PAGE_URL, {
      form: {
        scope: "openid",
        response_type: "code",
        redirect_uri: EBS_AUTH_REDIRECT_URL,
        login: true,
        login_uri: EBS_LOGIN_URL,
        prompt: "login",
        client_id: "ebsi",
        i: username,
        c: password,
        state,
      },
    });
    $ = cheerio.load(response.body);

    hrefs = [];
    $("img").each((_, elem) => {
      const href = $(elem).attr("src");
      hrefs.push(href as string);
    });

    Promise.all(
      hrefs.map((href: string) => {
        this.get(href);
      })
    );

    let actionUrl = $(`form[id="kc-form-login"]`).attr("action");
    response = await this.post(actionUrl!);

    $ = cheerio.load(response.body);
    actionUrl = $(`form[id="kc-form-login"]`).attr("action");

    hrefs = [];
    $("img").each((_, elem) => {
      const href = $(elem).attr("src");
      hrefs.push(href as string);
    });

    Promise.all(
      hrefs.map((href: string) => {
        this.get(href);
      })
    );
    await this.post(actionUrl!);

    await this.get(`https://ai.ebs.co.kr/ebs/ai/com/aiIndex.ebs`);

    logger.info(`[LOGIN] ${username} 접속 완료...`);
  }

  async search({
    grade,
    year,
    month,
    category,
  }: QueryParams): Promise<SearchResponseDto> {
    const query = makeQuery({
      grade,
      year,
      month,
      category,
    });

    const response = await this.post(EBS_ITEM_SEARCH_URL, {
      json: query,
    });

    return JSON.parse(response.body);
  }

  async getItemById(id: string): Promise<ItemResponseDto> {
    const response = await this.get(EBS_ITEM_URL, {
      searchParams: {
        Action: "Select",
        site: "HSC",
        IsEncrypt: "false",
        itemId: id,
      },
    });

    return parseXML2JSON(decodeFromBase64(response.body));
  }

  async getItemsById(id: string): Promise<ItemsResponseDto> {
    const response = await this.get(EBS_ITEMS_URL, {
      searchParams: {
        Action: "Select",
        site: "HSC",
        IsEncrypt: "false",
        itemId: id,
      },
    });

    return parseXML2JSON(decodeFromBase64(response.body));
  }

  async getCorrectAnswer(id: string): Promise<CorrectAnswerResponseDto> {
    const response = await this.post(EBS_ANSWER_URL, {
      form: {
        itemId: id,
      },
    });

    return JSON.parse(response.body);
  }
}
