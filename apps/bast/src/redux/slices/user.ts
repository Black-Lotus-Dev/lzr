/* eslint-disable import/no-cycle */
import { createModel } from "@rematch/core";
import { extractColors } from "extract-colors";
import { FinalColor } from "extract-colors/lib/types/Color";
import { User } from "firebase/auth";
import { RootModel } from "../models";

export interface UserState {
	authUser?: User;
	colorPalette?: FinalColor[];
}

const initialState: UserState = {};
const userSlice = () =>
	createModel<RootModel>()({
		name: "user",
		state: initialState,
		reducers: {
			setValue(state, payload: Partial<UserState>) {
				return {
					...state,
					...payload,
				};
			},
			setUser(state, authUser: User) {
				return {
					...state,
					authUser,
				};
			},
			setUserColorPalette(state, colorPalette: FinalColor[]) {
				colorPalette = colorPalette.sort((a, b) => b.area - a.area);
				return {
					...state,
					colorPalette,
				};
			},
		},
		effects: (dispatch) => ({
			async startUp(user: User) {
				if (user !== null && user.photoURL) {
					const colorPalette = await extractColors(user.photoURL, {
						crossOrigin: "anonymous",
					});

					dispatch.user.setValue({
						colorPalette,
						authUser: user,
					});
				} else {
					dispatch.user.setUser(user);
				}
			},
			getUser: (_, state): UserState => state.user,
		}),
	});

export default userSlice;
