use openai_api_rs::v1::{
  api::OpenAIClient,
  chat_completion::{self, ChatCompletionRequest},
};

#[tokio::main]
async fn main() {
  if std::env::var("OPENAI_API_BASE").is_err() {
    std::env::set_var("OPENAI_API_BASE", "http://localhost:1234/v1");
  }

  let client = OpenAIClient::new("".to_string());
  let req = ChatCompletionRequest::new(
    "lmstudio-community/Meta-Llama-3.1-8B-Instruct-GGUF/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf".to_string(),
    vec![chat_completion::ChatCompletionMessage {
      role: chat_completion::MessageRole::user,
      content: chat_completion::Content::Text(String::from("What is bitcoin?")),
      name: None,
      tool_calls: None,
      tool_call_id: None,
    }],
  );

  let result = client.chat_completion(req).await.unwrap();
  println!("Content: {:?}", result.choices[0].message.content);
  println!("Response Headers: {:?}", result.headers);
}
