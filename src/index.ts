import type {HttpFunction} from '@google-cloud/functions-framework/build/src/functions';
import {askToAI} from './chatgpt';
import {postMessage, getReplies} from './slack';
import {ChatCompletionRequestMessage} from 'openai';

type Payload = {
  challenge?: string;
  type?: string;
  event?: SlackEvent;
  authorizations: Authorization[];
};

type SlackEvent = {
  text: string;
  type: string;
  ts: string;
  thread_ts: string;
  event_ts: string;
  channel: string;
  user: string;
};

type Authorization = {
  user_id: string;
};

export const slackChatGPT: HttpFunction = (req, res) => {
  const payload: Payload = req.body;

  if (payload.type === 'url_verification') {
    res.status(200).json({challenge: payload.challenge});
    return;
  }

  const postChatGPTAnswer = async () => {
    if (
      !payload.event ||
      payload.event.type !== 'app_mention' ||
      !payload.event.text
    )
      return;
    const prompts = await buildPromptsFromSlackMessage(payload);
    const reply = await askToAI(prompts);
    if (!reply) return;
    postMessage(
      reply,
      payload.event.user,
      payload.event.channel,
      payload.event.event_ts
    );
  };
  postChatGPTAnswer();
  res.status(200).send('OK');
};

const buildPromptsFromSlackMessage = async (
  payload: Payload
): Promise<ChatCompletionRequestMessage[]> => {
  if (
    !payload.event ||
    payload.event.type !== 'app_mention' ||
    !payload.event.text
  )
    return [];
  const prompts: ChatCompletionRequestMessage[] = [];
  const ts = payload.event.thread_ts || payload.event.ts;
  const replies = await getReplies(payload.event.channel, ts);
  const botID = payload.authorizations[0].user_id;
  replies.messages?.forEach(message => {
    const role = message.user === botID ? 'assistant' : 'user';
    prompts.push({
      role: role,
      content: message.text?.replace(/<@.*>/, '') || '',
    });
  });
  return prompts;
};
