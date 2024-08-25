use std::sync::{atomic::AtomicU32, Arc};

use parking_lot::RwLock;

use crate::{entities::Message, now_ms, MessageSender};

#[derive(Debug, Default)]
pub struct Storage {
  messages: Arc<RwLock<Vec<Message>>>,
  seed: AtomicU32,
}

impl Storage {
  pub fn new_message(&self, payload: String, sender: MessageSender) -> Message {
    let id = self.seed.fetch_add(1, std::sync::atomic::Ordering::Relaxed);
    let payload = Message {
      id,
      content: payload,
      timestamp: now_ms(),
      sender,
    };
    self.messages.write().push(payload.clone());
    payload
  }

  pub fn get_messages(&self) -> Vec<Message> {
    self.messages.read().clone()
  }
}
