import {useRecoilValue} from "recoil";
import {onBoardView} from "../../recoil/atoms";
import {OnboardView} from "../../constants/enums";
import SelectProvider from "./views/SelectProvider";
import ConfigureConnection from "./views/ConfigureConnection";

const Onboard = () => {
    const view = useRecoilValue(onBoardView);

    switch (view) {
        case OnboardView.CONFIGURE:
            return <ConfigureConnection/>
        case OnboardView.SETUP:
            return <div/>
        default:
            return <SelectProvider/>
    }
}

export default Onboard;