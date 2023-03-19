import axios from 'axios';

type SlackPayload = {
  text: string;
  channel: string;
  thread_ts: string;
};

export const postMessage = async (
  message: string,
  user: string,
  channel: string,
  thread: string
) => {
  const payload: SlackPayload = {
    text: `<@${user}> ${message}`,
    channel: channel,
    thread_ts: thread,
  };

  const headers = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.BOT_USER_TOKEN}`,
    },
  };
  axios.post('https://slack.com/api/chat.postMessage', payload, headers);
};
