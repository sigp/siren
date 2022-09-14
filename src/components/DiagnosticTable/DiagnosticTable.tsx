import HardwareInfo from "./HardwareInfo";
import LogsInfo from "./LogsInfo";
import AlertInfo from "./AlertInfo";

const DiagnosticTable = () => {
  return (
      <div className="flex-1 flex mt-2 w-full">
          <HardwareInfo/>
          <LogsInfo/>
          <AlertInfo/>
      </div>
  )
}

export default DiagnosticTable;