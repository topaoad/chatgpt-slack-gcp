import type {HttpFunction} from '@google-cloud/functions-framework/build/src/functions';
import {askToAI} from './chatgpt';
import {postMessage} from './slack';

export const slackChatGPT: HttpFunction = (req, res) => {
  const payload = req.body;

  if (payload.type === 'url_verification') {
    res.status(200).json({challenge: payload.challenge});
    return;
  }

  if (payload.event && payload.event.type === 'app_mention') {
    if (payload.event.text) {
      askToAI(payload.event.text.replace(/<@.*> /, '')).then(
        (reply?: string) => {
          if (typeof reply === 'string') {
            postMessage(
              reply,
              payload.event.user,
              payload.event.channel,
              payload.event.event_ts
            );
          }
        }
      );
    }
  }
  res.status(200).send('OK');
};
