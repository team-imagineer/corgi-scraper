import { EbsAiClient } from "./api";
import { search } from "./constant/search";
import { handler } from "./handler";

(async () => {
  const client = new EbsAiClient();
  await client.auth(process.env.USERNAME!, process.env.PASSWORD!);

  await Promise.all(
    Object.entries(search).map(async ([_, queryParam]) => {
      await handler(client, queryParam);
    })
  );
})();
