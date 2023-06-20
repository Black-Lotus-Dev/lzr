use tauri::{utils::config::AppUrl, window::WindowBuilder, WindowUrl};

fn main() {
    use tauri::Manager;
    tauri::Builder::default()
    .setup(move |app| {
        #[cfg(debug_assertions)] // only include this code on debug builds
        {
            let window = app.get_window("main").unwrap();
            window.open_devtools();
            window.close_devtools();
        }
        Ok(())
    })
    .plugin(tauri_plugin_store::Builder::default().build())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
