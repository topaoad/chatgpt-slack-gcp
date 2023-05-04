# chatgpt-slack-gcp
slack apiでchatGPTと壁打ちするためのソースコードです。
gcpとなっているが、当初使用する予定だったgcpではなく、AWS Lambdaでの実装方法を説明します。
## 実装手順
1️ Slack Appを作成し、SLACK_SIGNING_SECRETとSLACK_BOT_TOKENを取得したものを環境変数に設定する。
2 OPENAI_API_KEYを取得し、環境変数に設定する。
3 npm install
　npm run build
　cd dist
　zip -r deploy_package.zip ./bundle.js ../node_modules
　を順に実行する。
　最後のコマンドにより、distディレクトリにdeploy_package.zipが作成される。
4 AWS Lambdaにdeploy_package.zipをアップロードする。
5 AWS Lambdaの設定で、環境変数を設定するともに、エンドポイントを作成する。
6 AWS Lambdaのランタイム設定を[bundle.handler]に変更する。
　※デフォルトでは[index.handler]になっているが、作成したファイルがbundle.jsなので、変更する。
7 AWS Lambdaの設定で、API Gatewayの設定によってエンドポイントを作成する。
  エンドポイントの設定で、APIのタイプをREST APIにし、エンドポイントタイプをリージョンに設定する。
8 Slack Appの設定で、Event Subscriptionsを有効にし、Request URLにAWS Lambdaのエンドポイントを設定する。
9 Slack Appの設定で、Bot Userを有効にする。
  Subscribe to bot eventsにapp_mentionを追加する。
  

## 実装の参考にしたサイト
- Node.jsの実装やslack apiの設定
https://qiita.com/Yuki_Oshima/items/112e69df63df9958709f

- SlackBolt
https://slack.dev/bolt-js/ja-jp/deployments/aws-lambda#set-up-aws-lambda

- AWS lambdaの実装
https://qiita.com/melty_go/items/a6929b0a341e75d24f01

