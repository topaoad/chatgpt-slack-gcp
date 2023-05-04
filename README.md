# chatgpt-slack-gcp

slack api で chatGPT と壁打ちするためのソースコードです。
gcp となっているが、当初使用する予定だった gcp ではなく、AWS Lambda での実装方法を説明します。

## 実装手順

- Slack App を作成し、SLACK_SIGNING_SECRET と SLACK_BOT_TOKEN を取得したものを環境変数に設定する。
- OPENAI_API_KEY を取得し、環境変数に設定する。
- npm install
　 npm run build
　 cd dist
　 zip -r deploy_package.zip ./bundle.js ../node_modules
　を順に実行する。
　最後のコマンドにより、dist ディレクトリに deploy_package.zip が作成される。
- AWS Lambda に deploy_package.zip をアップロードする。
- AWS Lambda の設定で、環境変数を設定するともに、エンドポイントを作成する。
- AWS Lambda のランタイム設定を[bundle.handler]に変更する。
　※デフォルトでは[index.handler]になっているが、作成したファイルが bundle.js なので、変更する。
- AWS Lambda の設定で、API Gateway の設定によってエンドポイントを作成する。
エンドポイントの設定で、API のタイプを REST API にし、エンドポイントタイプをリージョンに設定する。
- Slack App の設定で、Event Subscriptions を有効にし、Request URL に AWS Lambda のエンドポイントを設定する。
- Slack App の設定で、Bot User を有効にする。
Subscribe to bot events に app_mention を追加する。

## 今後の使い方
- ロールについて
      const chatCompletionRequestMessage: ChatCompletionRequestMessage[] = [
        {
          role: 'system',
          content: 'You are a full-stack engineer.',
        },
        {
          role: 'system',
          content: 'You are experienced in JavaScript, Python, and SQL.',
        },
        {
          role: 'system',
          content:
            'You have experience working with React, Django, and PostgreSQL.',
        },
      ];

の部分のロールを書き換えます。
- 精度について
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: chatCompletionRequestMessage,
        // temperature: 0.8, // ここで temperature を設定
        // top_p: 1.0, // ここで top_p を設定
      });
の  temperatureとtop_pを変えます。
## 実装の参考にしたサイト

- Node.js の実装や slack api の設定
  https://qiita.com/Yuki_Oshima/items/112e69df63df9958709f

- SlackBolt
  https://slack.dev/bolt-js/ja-jp/deployments/aws-lambda#set-up-aws-lambda

- AWS lambda の実装
  https://qiita.com/melty_go/items/a6929b0a341e75d24f01
