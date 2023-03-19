# chatgpt-slack-gcp
ChatGPT adapter for Slack, on google cloud functions

# initialize

yarn

# deployment

first of all, initialize your gcloud cli config
copy `env.tmpl.yml` to `env.yml` and replace slack and openapi tokens.

modify character config.
It is assumed to be used like a `env.tmpl.yml`, but please devise it as you like.
`PROMPT_PREFIX` is prefix of prompt written in slack app.
`CHARACTER_CONFIG` is inserted into `system` prompt of ChatGPT API.
`ASSISTANT_PROMPT` is inserted into `assistant` prompt of ChatGPT API.

run `yarn deploy`

# usage

access [slack app](https://api.slack.com/apps) and Create New App from scratch.

issue Bot User OAuth Token.

add Bot Token Scopes to execute slack bot App

`app_mentions:read`
`chat:write`

Enable Event Subscriptions.
Set the URL deployed to GCP Cloud Functions as the request URL.
