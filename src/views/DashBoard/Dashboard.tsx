import SideBar from "../../components/SideBar/SideBar";
import FootBar from "../../components/FootBar/FootBar";
import React from "react";
import MainContent from "./Content/MainContent";
import {useRecoilValue} from "recoil";
import {dashView} from "../../recoil/atoms";
import {ContentView} from "../../constants/enums";
import Logs from "./Content/Logs";
import Settings from "./Content/Settings";
import Validators from "./Content/Validators";
import Grafana from "./Content/Grafana";

const Dashboard = () => {
  const content = useRecoilValue(dashView)
  const renderContent = () => {
      switch (content) {
          case ContentView.GRAFANA:
              return <Grafana/>
          case ContentView.VALIDATORS:
              return <Validators/>
          case ContentView.SETTINGS:
              return <Settings/>
          case ContentView.LOGS:
              return <Logs/>
          default:
              return <MainContent/>
      }
  }
  return (
      <>
          <SideBar/>
          <div className="flex-1 flex flex-col bg-white dark:bg-dark750 items-center justify-center">
              <div className="flex-1">
                  {renderContent()}
              </div>
              <FootBar/>
          </div>
      </>
  )
}

export default Dashboard;