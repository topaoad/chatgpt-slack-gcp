import {WebClient, ChatPostMessageArguments} from '@slack/web-api';

const web = new WebClient(process.env.BOT_USER_TOKEN);

export const postMessage = async (
  message: string,
  user: string,
  channel: string,
  thread: string
) => {
  const payload: ChatPostMessageArguments = {
    text: `<@${user}> ${message}`,
    channel: channel,
    thread_ts: thread,
  };
  web.chat.postMessage(payload);
};

export const getReplies = async (channel: string, ts: string) => {
  return await web.conversations.replies({
    channel,
    ts,
    include_all_metadata: false,
  });
};
