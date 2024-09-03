use openai_api_rs::v1::{
  api::OpenAIClient,
  chat_completion::{self, ChatCompletionRequest},
};

pub struct OpenAICfg {
  pub api_key: String,
}

pub struct OpenAIService {
  cli: OpenAIClient,
}

impl OpenAIService {
  pub fn new(cfg: OpenAICfg) -> Self {
    OpenAIService {
      cli: OpenAIClient::new(cfg.api_key),
    }
  }

  pub async fn answer_sync(&self, model: String, content: String) -> Option<String> {
    let msg: chat_completion::ChatCompletionMessage = chat_completion::ChatCompletionMessage {
      role: chat_completion::MessageRole::user,
      content: chat_completion::Content::Text(content),
      name: None,
      tool_calls: None,
      tool_call_id: None,
    };
    let req = ChatCompletionRequest::new(model, vec![msg]);
    let result = self.cli.chat_completion(req).await.unwrap();
    result.choices[0].message.content.clone()
  }
}
