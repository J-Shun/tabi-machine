import { useDroppable } from '@dnd-kit/core';

const DroppableContainer = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'
    >
      {children}
    </div>
  );
};

export default DroppableContainer;
