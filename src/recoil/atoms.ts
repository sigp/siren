import {atom} from "recoil";
import {AppView, ContentView, OnboardView, UiMode} from "../constants/enums";

export const uiMode = atom<UiMode>({
    key: 'UiMode',
    default: UiMode.LIGHT,
});

export const appView = atom<AppView>({
    key: 'AppView',
    default: AppView.ONBOARD
})

export const dashView = atom<ContentView>({
    key: 'DashView',
    default: ContentView.MAIN
})

export const onBoardView = atom<OnboardView>({
    key: 'OnboardView',
    default: OnboardView.CONFIGURE
})