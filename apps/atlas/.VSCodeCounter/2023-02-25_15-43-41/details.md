# Details

Date : 2023-02-25 15:43:41

Directory d:\\Code\\GitHub\\black-lotus-dev\\stream-apps\\lzr

Total : 80 files,  10919 codes, 196 comments, 399 blanks, all 11514 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [lzr/.env](/lzr/.env) | Properties | 13 | 0 | 0 | 13 |
| [lzr/README.md](/lzr/README.md) | Markdown | 4 | 0 | 4 | 8 |
| [lzr/index.html](/lzr/index.html) | HTML | 13 | 0 | 2 | 15 |
| [lzr/package-lock.json](/lzr/package-lock.json) | JSON | 8,674 | 0 | 1 | 8,675 |
| [lzr/package.json](/lzr/package.json) | JSON | 56 | 0 | 1 | 57 |
| [lzr/public/tauri.svg](/lzr/public/tauri.svg) | XML | 6 | 0 | 1 | 7 |
| [lzr/public/vite.svg](/lzr/public/vite.svg) | XML | 1 | 0 | 0 | 1 |
| [lzr/src-tauri/build.rs](/lzr/src-tauri/build.rs) | Rust | 3 | 0 | 1 | 4 |
| [lzr/src-tauri/src/main.rs](/lzr/src-tauri/src/main.rs) | Rust | 24 | 3 | 3 | 30 |
| [lzr/src-tauri/tauri.conf.json](/lzr/src-tauri/tauri.conf.json) | JSON | 73 | 0 | 1 | 74 |
| [lzr/src/api/spotify/queue.ts](/lzr/src/api/spotify/queue.ts) | TypeScript | 11 | 1 | 2 | 14 |
| [lzr/src/api/twitch/login.ts](/lzr/src/api/twitch/login.ts) | TypeScript | 44 | 0 | 4 | 48 |
| [lzr/src/api/user/user.ts](/lzr/src/api/user/user.ts) | TypeScript | 22 | 0 | 3 | 25 |
| [lzr/src/assets/react.svg](/lzr/src/assets/react.svg) | XML | 1 | 0 | 0 | 1 |
| [lzr/src/components/layout.tsx](/lzr/src/components/layout.tsx) | TypeScript JSX | 18 | 2 | 3 | 23 |
| [lzr/src/components/music/settingsSection.tsx](/lzr/src/components/music/settingsSection.tsx) | TypeScript JSX | 183 | 107 | 37 | 327 |
| [lzr/src/components/twitch/settingsSection.tsx](/lzr/src/components/twitch/settingsSection.tsx) | TypeScript JSX | 94 | 1 | 12 | 107 |
| [lzr/src/configs/firebase.ts](/lzr/src/configs/firebase.ts) | TypeScript | 16 | 0 | 4 | 20 |
| [lzr/src/constants/store/base.ts](/lzr/src/constants/store/base.ts) | TypeScript | 5 | 0 | 2 | 7 |
| [lzr/src/constants/store/prefs.ts](/lzr/src/constants/store/prefs.ts) | TypeScript | 17 | 1 | 3 | 21 |
| [lzr/src/constants/store/slices.ts](/lzr/src/constants/store/slices.ts) | TypeScript | 2 | 0 | 1 | 3 |
| [lzr/src/constants/user.ts](/lzr/src/constants/user.ts) | TypeScript | 3 | 0 | 2 | 5 |
| [lzr/src/constants/websocket.ts](/lzr/src/constants/websocket.ts) | TypeScript | 5 | 0 | 1 | 6 |
| [lzr/src/lzrClients/music/client.ts](/lzr/src/lzrClients/music/client.ts) | TypeScript | 40 | 1 | 13 | 54 |
| [lzr/src/lzrClients/music/local.ts](/lzr/src/lzrClients/music/local.ts) | TypeScript | 13 | 4 | 5 | 22 |
| [lzr/src/lzrClients/music/queue.ts](/lzr/src/lzrClients/music/queue.ts) | TypeScript | 81 | 0 | 17 | 98 |
| [lzr/src/lzrClients/music/spotify.ts](/lzr/src/lzrClients/music/spotify.ts) | TypeScript | 176 | 9 | 34 | 219 |
| [lzr/src/lzrClients/twitch/chat/commandHandler.ts](/lzr/src/lzrClients/twitch/chat/commandHandler.ts) | TypeScript | 45 | 3 | 6 | 54 |
| [lzr/src/lzrClients/twitch/chat/commands/music.ts](/lzr/src/lzrClients/twitch/chat/commands/music.ts) | TypeScript | 38 | 4 | 12 | 54 |
| [lzr/src/lzrClients/twitch/chat/commands/test.ts](/lzr/src/lzrClients/twitch/chat/commands/test.ts) | TypeScript | 8 | 0 | 1 | 9 |
| [lzr/src/lzrClients/twitch/client.ts](/lzr/src/lzrClients/twitch/client.ts) | TypeScript | 164 | 12 | 30 | 206 |
| [lzr/src/main.tsx](/lzr/src/main.tsx) | TypeScript JSX | 16 | 0 | 2 | 18 |
| [lzr/src/pages/app.tsx](/lzr/src/pages/app.tsx) | TypeScript JSX | 65 | 3 | 14 | 82 |
| [lzr/src/pages/landing.tsx](/lzr/src/pages/landing.tsx) | TypeScript JSX | 82 | 2 | 7 | 91 |
| [lzr/src/pages/user.tsx](/lzr/src/pages/user.tsx) | TypeScript JSX | 56 | 0 | 5 | 61 |
| [lzr/src/provider/firebase.tsx](/lzr/src/provider/firebase.tsx) | TypeScript JSX | 26 | 1 | 6 | 33 |
| [lzr/src/redux/models.ts](/lzr/src/redux/models.ts) | TypeScript | 21 | 1 | 5 | 27 |
| [lzr/src/redux/slices/music.ts](/lzr/src/redux/slices/music.ts) | TypeScript | 63 | 3 | 2 | 68 |
| [lzr/src/redux/slices/prefs.ts](/lzr/src/redux/slices/prefs.ts) | TypeScript | 33 | 3 | 4 | 40 |
| [lzr/src/redux/slices/twitch.ts](/lzr/src/redux/slices/twitch.ts) | TypeScript | 63 | 2 | 4 | 69 |
| [lzr/src/redux/slices/user.ts](/lzr/src/redux/slices/user.ts) | TypeScript | 29 | 3 | 2 | 34 |
| [lzr/src/redux/store.ts](/lzr/src/redux/store.ts) | TypeScript | 8 | 0 | 3 | 11 |
| [lzr/src/style.css](/lzr/src/style.css) | CSS | 85 | 0 | 18 | 103 |
| [lzr/src/styles/app.css](/lzr/src/styles/app.css) | CSS | 31 | 4 | 4 | 39 |
| [lzr/src/styles/musicSettings.css](/lzr/src/styles/musicSettings.css) | CSS | 38 | 0 | 7 | 45 |
| [lzr/src/styles/sharedLayout.css](/lzr/src/styles/sharedLayout.css) | CSS | 57 | 4 | 11 | 72 |
| [lzr/src/styles/twitchSettings.css](/lzr/src/styles/twitchSettings.css) | CSS | 8 | 0 | 1 | 9 |
| [lzr/src/types/apiResponses/apiError.ts](/lzr/src/types/apiResponses/apiError.ts) | TypeScript | 10 | 1 | 4 | 15 |
| [lzr/src/types/apiResponses/apiReturn.ts](/lzr/src/types/apiResponses/apiReturn.ts) | TypeScript | 29 | 0 | 11 | 40 |
| [lzr/src/types/apiResponses/spotify/auth.ts](/lzr/src/types/apiResponses/spotify/auth.ts) | TypeScript | 6 | 0 | 3 | 9 |
| [lzr/src/types/music/local/base.ts](/lzr/src/types/music/local/base.ts) | TypeScript | 17 | 0 | 5 | 22 |
| [lzr/src/types/music/local/props.ts](/lzr/src/types/music/local/props.ts) | TypeScript | 27 | 0 | 5 | 32 |
| [lzr/src/types/music/spotify/playlist.ts](/lzr/src/types/music/spotify/playlist.ts) | TypeScript | 15 | 0 | 2 | 17 |
| [lzr/src/types/music/spotify/user.ts](/lzr/src/types/music/spotify/user.ts) | TypeScript | 6 | 0 | 3 | 9 |
| [lzr/src/types/nestedPartial.ts](/lzr/src/types/nestedPartial.ts) | TypeScript | 3 | 0 | 1 | 4 |
| [lzr/src/types/redux/base.ts](/lzr/src/types/redux/base.ts) | TypeScript | 3 | 0 | 1 | 4 |
| [lzr/src/types/redux/music.ts](/lzr/src/types/redux/music.ts) | TypeScript | 10 | 0 | 3 | 13 |
| [lzr/src/types/redux/prefs.ts](/lzr/src/types/redux/prefs.ts) | TypeScript | 5 | 0 | 3 | 8 |
| [lzr/src/types/redux/twitch.ts](/lzr/src/types/redux/twitch.ts) | TypeScript | 24 | 0 | 4 | 28 |
| [lzr/src/types/redux/user.ts](/lzr/src/types/redux/user.ts) | TypeScript | 5 | 0 | 4 | 9 |
| [lzr/src/types/store/base.ts](/lzr/src/types/store/base.ts) | TypeScript | 4 | 0 | 1 | 5 |
| [lzr/src/types/store/music/index.ts](/lzr/src/types/store/music/index.ts) | TypeScript | 8 | 0 | 3 | 11 |
| [lzr/src/types/store/music/local.ts](/lzr/src/types/store/music/local.ts) | TypeScript | 14 | 0 | 3 | 17 |
| [lzr/src/types/store/music/spotify.ts](/lzr/src/types/store/music/spotify.ts) | TypeScript | 10 | 0 | 3 | 13 |
| [lzr/src/types/store/prefs.ts](/lzr/src/types/store/prefs.ts) | TypeScript | 15 | 1 | 3 | 19 |
| [lzr/src/types/store/slice.ts](/lzr/src/types/store/slice.ts) | TypeScript | 12 | 0 | 4 | 16 |
| [lzr/src/types/store/twitch.ts](/lzr/src/types/store/twitch.ts) | TypeScript | 7 | 0 | 3 | 10 |
| [lzr/src/types/store/user.ts](/lzr/src/types/store/user.ts) | TypeScript | 6 | 1 | 3 | 10 |
| [lzr/src/types/twitch/index.ts](/lzr/src/types/twitch/index.ts) | TypeScript | 14 | 0 | 0 | 14 |
| [lzr/src/types/user.ts](/lzr/src/types/user.ts) | TypeScript | 10 | 1 | 4 | 15 |
| [lzr/src/utils/apiWrapper.ts](/lzr/src/utils/apiWrapper.ts) | TypeScript | 16 | 3 | 5 | 24 |
| [lzr/src/utils/converters/typeConverter.ts](/lzr/src/utils/converters/typeConverter.ts) | TypeScript | 4 | 2 | 3 | 9 |
| [lzr/src/utils/converters/userConverter.ts](/lzr/src/utils/converters/userConverter.ts) | TypeScript | 21 | 0 | 3 | 24 |
| [lzr/src/utils/createRandString.ts](/lzr/src/utils/createRandString.ts) | TypeScript | 10 | 2 | 1 | 13 |
| [lzr/src/utils/createReqBody.ts](/lzr/src/utils/createReqBody.ts) | TypeScript | 12 | 0 | 1 | 13 |
| [lzr/src/utils/fetchApi.ts](/lzr/src/utils/fetchApi.ts) | TypeScript | 16 | 1 | 3 | 20 |
| [lzr/src/vite-env.d.ts](/lzr/src/vite-env.d.ts) | TypeScript | 0 | 1 | 1 | 2 |
| [lzr/tsconfig.json](/lzr/tsconfig.json) | JSON with Comments | 21 | 0 | 1 | 22 |
| [lzr/tsconfig.node.json](/lzr/tsconfig.node.json) | JSON | 9 | 0 | 1 | 10 |
| [lzr/vite.config.ts](/lzr/vite.config.ts) | TypeScript | 16 | 9 | 3 | 28 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)