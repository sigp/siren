import Typography from '../Typography/Typography';
import ValidatorActionIcon from '../ValidatorActionIcon/ValidatorActionIcon';

const ValidatorGraffitiInput = () => {
  return (
    <div className="w-full border-t flex opacity-60">
      <div className="border-r py-2 px-6 w-42">
        <Typography type="text-caption1">Validator <br/> Graffiti</Typography>
      </div>
      <div className="flex-1 flex justify-between items-center px-8 py-3">
        <Typography type="text-caption1" color="text-primary">Graffitti goes here</Typography>
        <ValidatorActionIcon icon="bi-pencil-square" color="text-primary"/>
      </div>
    </div>
  )
}

export default ValidatorGraffitiInput;