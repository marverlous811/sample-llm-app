// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{sync::Arc, time::Duration};

use app::{Message, MessageSender, OpenAICfg, OpenAIService, Storage};
use tauri::{generate_context, Manager};

enum Event {
  Ask(u32, String, String),
}

#[derive(Clone)]
struct Controller {
  storage: Arc<Storage>,
  sender: tokio::sync::mpsc::Sender<Event>,
}

#[tauri::command]
async fn send_message(
  _window: tauri::Window,
  model: String,
  message: String,
  state: tauri::State<'_, Controller>,
) -> Result<Message, String> {
  log::info!("current window {}", _window.label());
  let msg = state.storage.new_message(message.clone(), MessageSender::User);
  let _ = state.sender.send(Event::Ask(msg.id, model, message)).await;
  Ok(msg)
}

#[tokio::main]
async fn main() {
  env_logger::builder()
    .filter_level(log::LevelFilter::Debug)
    .format_timestamp_millis()
    .init();

  if std::env::var("OPENAI_API_BASE").is_err() {
    std::env::set_var("OPENAI_API_BASE", "http://localhost:1234/v1");
  }
  let openai_service = Arc::new(OpenAIService::new(OpenAICfg {
    api_key: "".to_string(),
  }));
  let openai_service2 = openai_service.clone();

  tauri::Builder::default()
    .setup(|app| {
      let window = app.get_window("main").unwrap();
      // let app_handle = app.app_handle();
      window.open_devtools();
      let (tx, mut rx) = tokio::sync::mpsc::channel::<Event>(1024);
      let controller = Controller {
        storage: Arc::new(Storage::default()),
        sender: tx.clone(),
      };
      let ctl2 = controller.clone();
      tauri::async_runtime::spawn(async move {
        while let Some(event) = rx.recv().await {
          match event {
            Event::Ask(_id, model, msg) => {
              log::info!("Received message: {}", msg);
              // std::thread::sleep(Duration::from_secs(2));
              let answer = openai_service2.answer_sync(model, msg.clone()).await.unwrap();
              let msg = ctl2.storage.new_message(answer, MessageSender::Bot);
              match window.emit("bot_answer", msg) {
                Ok(_) => log::info!("Message sent to the window"),
                Err(e) => log::error!("Error sending message to the window: {}", e),
              }
            }
          }
        }
      });
      app.manage(controller);
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![send_message])
    .build(generate_context!())
    .expect("error while running tauri application")
    .run(|_app_handle, _ev| {
      // log::info!("Tauri application initialized.");
      {}
    });
}
