import { useNavigate } from '@tanstack/react-router';
import GoBackButton from '../../../../components/units/GoBackButton';

const TripHeader = ({ name, days }: { name: string; days: number }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate({ to: '/' });
  };

  return (
    <div className='bg-white shadow-sm sticky top-0 z-50'>
      <div className='p-4 flex items-center'>
        <GoBackButton onClick={handleBack} />
        <div className='flex-1'>
          <h1 className='text-lg font-bold text-gray-800'>{name}</h1>
          <p className='text-sm text-gray-500'>{days} 天行程</p>
        </div>
      </div>
    </div>
  );
};

export default TripHeader;
