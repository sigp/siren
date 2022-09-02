import DiagnosticCard, {DiagnosticCardProps} from "./DiagnosticCard";
import {Story} from "@storybook/react";


export default {
    title: 'Diagnostic Card',
    component: DiagnosticCard
}

const Template: Story<DiagnosticCardProps> = (props) => (
    <div className="h-screen w-screen">
        <DiagnosticCard {...props}/>
    </div>
)

export const LargeCard = Template.bind({});
LargeCard.args = {
    status: 'bg-success',
    title: 'Health Check',
    metric: '16 MS',
    subTitle: 'Good Connection',
    size: 'lg'
}

export const StandardCard = Template.bind({});
StandardCard.args = {
    status: 'bg-warning',
    title: 'Disk',
    metric: '511 GB',
    subTitle: '22% Utilization',
}

export const SmallCard = Template.bind({});
SmallCard.args = {
    status: 'bg-error',
    title: 'Health Check',
    metric: 'Uptime: 2H 44M',
    subTitle: 'Good, Nodes Syncing..',
    size: 'sm'
}