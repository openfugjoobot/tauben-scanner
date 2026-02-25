import { useAddPigeon } from '../../contexts/AddPigeonContext';
import { StepIndicator } from './StepIndicator';
import { Step1PhotoInfo } from './Step1PhotoInfo';
import { Step2Location } from './Step2Location';
import { Step3Confirmation } from './Step3Confirmation';
import './AddPigeonPage.css';

export const AddPigeonPage: React.FC = () => {
  const { step } = useAddPigeon();
  const totalSteps = 3;

  const renderStep = () => {
    switch (step) {
      case 0:
        return <Step1PhotoInfo />;
      case 1:
        return <Step2Location />;
      case 2:
        return <Step3Confirmation />;
      default:
        return <Step1PhotoInfo />;
    }
  };

  return (
    <div className="add-pigeon-page">
      <div className="page-header">
        <h2>Neue Taube erfassen</h2>
        <p className="page-subtitle">
          Schritt {step + 1} von {totalSteps}
        </p>
      </div>

      <StepIndicator />

      <div className="step-container">
        {renderStep()}
      </div>
    </div>
  );
};
