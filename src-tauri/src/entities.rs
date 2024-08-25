use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum MessageSender {
  #[serde(rename = "user")]
  User,
  #[serde(rename = "bot")]
  Bot,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Message {
  pub id: u32,
  pub content: String,
  pub timestamp: u64,
  pub sender: MessageSender,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Conservation {
  pub id: u32,
  pub name: String,
  pub messages: Vec<Message>,
}
