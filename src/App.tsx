import React from 'react';
import {useRecoilValue} from "recoil";
import {uiMode} from "./recoil/atoms";
import {UiMode} from "./constants/enums";
import Dashboard from "./views/DashBoard/Dashboard";

function App() {
    const mode = useRecoilValue(uiMode);
  return (
    <div className={`${mode === UiMode.DARK ? 'dark' : ''} relative h-screen w-screen overflow-hidden flex`}>
        <Dashboard/>
    </div>
  );
}

export default App;
