import {atom} from "recoil";
import {ContentView, UiMode} from "../constants/enums";

export const uiMode = atom<UiMode>({
    key: 'UiMode',
    default: UiMode.LIGHT,
});

export const dashView = atom<ContentView>({
    key: 'AppView',
    default: ContentView.DASHBOARD
})