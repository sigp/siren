import DiagnosticCard from "../DiagnosticCard/DiagnosticCard";
import Typography from "../Typography/Typography";

const HardwareInfo = () => {
  return (
      <div className="h-full w-full flex flex-col xl:min-w-316">
          <div className="w-full h-12 border flex border-style500">
              <div className="flex-1 p-2 flex items-center justify-center cursor-pointer">
                <Typography type="text-caption2" className="xl:text-caption1" color="text-primary" darkMode="dark:text-white" isBold>Hardware Usage</Typography>
              </div>
              <div className="flex-1 p-2 flex items-center justify-center cursor-pointer">
                  <Typography type="text-caption2" className="xl:text-caption1" color="text-dark500">Device Diagnostics</Typography>
              </div>
          </div>
          <DiagnosticCard title="Disk" maxHeight="flex-1" status="bg-success" border="border-t-0 border-style500" subTitle="22% Utilization" metric="511 GB" />
          <DiagnosticCard title="CPU" maxHeight="flex-1" status="bg-warning" border="border-t-0 border-style500" subTitle="13% Utilization" metric="1.9 GHZ" />
          <DiagnosticCard title="RAM" maxHeight="flex-1" status="bg-error" border="border-t-0 border-style500" subTitle="48% Utilization" metric="16 GB" />
      </div>
  )
}

export default HardwareInfo;