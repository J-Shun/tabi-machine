import { getTypeColor } from '../../../../helpers';
import type { TripDetail } from '../../../../types';

const TimelineNode = ({ detail }: { detail: TripDetail }) => {
  return (
    <div className='flex items-center'>
      <div
        className={`w-4 h-4 rounded-full ml-[11px] ${getTypeColor(detail.type)} shadow-sm shrink-0`}
      />
    </div>
  );
};

export default TimelineNode;
