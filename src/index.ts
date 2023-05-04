import { App, AwsLambdaReceiver } from "@slack/bolt";
import {
  AwsCallback,
  AwsEvent,
} from "@slack/bolt/dist/receivers/AwsLambdaReceiver";
import { isAxiosError } from "axios";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

if (!process.env.SLACK_SIGNING_SECRET) process.exit(1);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: awsLambdaReceiver,
});

const bot_userid = "...";

app.event("app_mention", async ({ event, context, client, say }) => {
  if (context.retryNum) {
    console.log(`skipped retry. retryReason: ${context.retryReason}`);
    return;
  }
  console.log(event);
  try {
    const { channel, thread_ts, event_ts } = event;
    const threadTs = thread_ts ?? event_ts;
    await say({
      channel,
      thread_ts: threadTs,
      text: "`system` 回答作成中",
    });
    try {
      const threadResponse = await client.conversations.replies({
        channel,
        ts: threadTs,
      });
      // あらかじめフルスタックエンジニアの役割を設定。配列の中に複数配置しても良い
      const chatCompletionRequestMessage: ChatCompletionRequestMessage[] = [
        {
          role: "system",
          content: "You are a full-stack engineer.",
        },
        {
          role: "system",
          content: "You are experienced in JavaScript, Python, and SQL.",
        },
        {
          role: "system",
          content:
            "You have experience working with React, Django, and PostgreSQL.",
        },
      ];
      threadResponse.messages?.forEach((message) => {
        const { text, user } = message;
        if (!text) return;
        const content = text.replace(`<@${bot_userid}>`, "") ?? "";
        if (user && user === bot_userid) {
          if (text.startsWith("`system`")) {
            chatCompletionRequestMessage.push({ role: "system", content });
          } else {
            chatCompletionRequestMessage.push({ role: "assistant", content });
          }
        } else {
          chatCompletionRequestMessage.push({ role: "user", content });
        }
      });
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: chatCompletionRequestMessage,
        // temperature: 0.8, // ここで temperature を設定
        // top_p: 1.0, // ここで top_p を設定
      });
      const outputText = completion.data.choices
        .map(({ message }) => message?.content)
        .join("");
      await client.chat.postMessage({
        channel,
        thread_ts: threadTs,
        text: outputText,
      });
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(error.response?.data);
      } else {
        console.error(error);
      }
      await client.chat.postMessage({
        channel,
        thread_ts: threadTs,
        text: "`system` エラーが発生しました。(管理人: <@...>)",
      });
    }
  } catch (error) {
    console.error(error);
  }
});

module.exports.handler = async (
  event: AwsEvent,
  context: unknown,
  callback: AwsCallback,
) => {
  if (event.httpMethod === "POST" && event.body) {
    const body = JSON.parse(event.body);

    if (body.type === "url_verification") {
      return {
        statusCode: 200,
        body: body.challenge,
      };
    }
  }

  const handler = await awsLambdaReceiver.start();
  return handler(event, context, callback);
};
