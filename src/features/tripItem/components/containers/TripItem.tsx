import { useState, useEffect, useRef } from 'react';
import { useParams } from '@tanstack/react-router';
import {
  DndContext,
  closestCorners,
  useDroppable,
  DragOverlay,
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import useTripItem from '../../hooks/useTripItem';
import TripDetailModal from '../widgets/TripDetailModal';
import Loading from '../../../../components/units/Loading';
import DraggableTripItemCard from '../widgets/DraggableTripItemCard';
import FloatButton from '../../../../components/units/FloatButton';
import Empty from '../units/Empty';
import TripHeader from '../widgets/TripHeader';
import TripItemHeader from '../widgets/TripItemHeader';

import type {
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import type { TripDetail } from '../../../../types';
import TimelineNode from '../units/TimelineNode';

const TripItem = () => {
  const { tripId } = useParams({ from: '/tripItem/$tripId/' });

  const {
    tripItems,
    tripName,
    createTripItem,
    editTripDetail,
    deleteTripDetail,
    moveToOtherDate,
    moveToOtherIndex,
  } = useTripItem({ tripId });

  const [activeId, setActiveId] = useState<string | null>(null);
  const [isShowItemModal, setIsShowItemModal] = useState(false);
  const [editingDetail, setEditingDetail] = useState<TripDetail | null>(null);

  const hasScrolledToToday = useRef(false);

  // 用於儲存日期元素的 ref
  const dateRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const dateOptions = tripItems ? tripItems.map((item) => item.date) : [];

  const handleCloseItemModal = () => {
    setIsShowItemModal(false);
    setEditingDetail(null);
  };

  const handleEditDetail = (detail: TripDetail) => {
    setEditingDetail(detail);
    setIsShowItemModal(true);
  };

  const handleSubmit = (newTripDetail: TripDetail) => {
    const { id } = newTripDetail;
    // 沒有 id，代表是建立新行程
    if (!id) {
      createTripItem(newTripDetail);
    } else {
      // 有 id，代表是編輯行程
      editTripDetail(newTripDetail);
    }
  };

  const handleDelete = (detail: TripDetail) => {
    deleteTripDetail(detail);
  };

  const getActiveDetail = () => {
    if (!activeId || !tripItems) return null;

    for (const tripItem of tripItems) {
      const detail = tripItem.details.find((d) => d.id === activeId);
      if (detail) return detail;
    }
    return null;
  };

  const findContainer = (id: string) => {
    if (!tripItems) return id;

    for (const tripItem of tripItems) {
      if (tripItem.details.some((detail) => detail.id === id)) {
        return tripItem.date;
      }
    }
    return id;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string);

    // 移往不同容器時，重新排序
    if (activeContainer === overContainer) return;
    console.log('over');

    moveToOtherDate({
      detailId: active.id as string,
      fromDate: activeContainer,
      toDate: overContainer,
    });
  };

  // 拖拽結束
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string);

    // 在同一容器內重新排序
    if (activeContainer !== overContainer) return;
    console.log('end');

    moveToOtherIndex({
      detailId: active.id as string,
      targetId: over.id as string,
      date: activeContainer,
    });
  };

  // 自動捲動到今天日期
  useEffect(() => {
    if (!tripItems || hasScrolledToToday.current) return;

    const today = new Date();
    // // 格式：YYYY/MM/DD
    const todayString = `${today.getFullYear()}/${String(
      today.getMonth() + 1
    ).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;

    // 找到今天對應的行程日期
    const todayTripItem = tripItems.find((item) => {
      return item.date === todayString;
    });

    if (todayTripItem && dateRefs.current[todayTripItem.date]) {
      // 延遲執行以確保元素已渲染
      setTimeout(() => {
        // 滾動時要把標題列考慮進去
        const headerOffset = 92;
        const element = dateRefs.current[todayTripItem.date];
        if (element) {
          const elementPosition =
            element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }, 100);

      hasScrolledToToday.current = true;
    }
  }, [tripItems]);

  if (!tripItems) return <Loading />;

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className='min-h-screen bg-gray-50'>
        <TripHeader name={tripName} days={tripItems.length} />

        {/* 行程內容 */}
        <div className='p-4 space-y-6 pb-24'>
          {tripItems.map((tripItem, dayIndex) => {
            return (
              <div
                key={tripItem.date}
                ref={(el) => {
                  dateRefs.current[tripItem.date] = el;
                }}
              >
                <DroppableContainer id={tripItem.date}>
                  <SortableContext items={tripItem.details.map((d) => d.id)}>
                    {/* 日期標題區塊 */}
                    <TripItemHeader tripItem={tripItem} day={dayIndex + 1} />

                    <div id={tripItem.date} className='p-6 min-h-[100px]'>
                      {tripItem.details.length ? (
                        <div className='relative'>
                          {/* 連續的時間軸線 */}
                          <div className='absolute left-[18px] top-14 bottom-14 w-0.5 bg-gray-300' />

                          <div className='space-y-0'>
                            {tripItem.details.map((detail) => (
                              <div
                                key={detail.id}
                                className='flex items-stretch space-x-4 relative pb-6 last:pb-0'
                              >
                                {/* 時間軸點 */}
                                <TimelineNode detail={detail} />

                                {/* 行程內容卡片 */}
                                <DraggableTripItemCard
                                  detail={detail}
                                  onEdit={handleEditDetail}
                                  onDelete={handleDelete}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Empty />
                      )}
                    </div>
                  </SortableContext>
                </DroppableContainer>
              </div>
            );
          })}
        </div>

        {/* 浮動新增按鈕 */}
        <FloatButton onClick={() => setIsShowItemModal(true)} />

        {/* 行程項目詳情彈窗 */}
        {isShowItemModal && (
          <TripDetailModal
            itemData={editingDetail}
            dateOptions={dateOptions}
            mode={editingDetail ? 'edit' : 'create'}
            onClose={handleCloseItemModal}
            onSubmit={handleSubmit}
          />
        )}
      </div>

      {/* dragOverlay 讓拖曳時更順 */}
      <DragOverlay>
        {activeId ? (
          <div className='relative flex items-center w-full'>
            <div className='flex w-full bg-gray-50 rounded-xl p-4 m-0 shadow-lg cursor-pointer opacity-90 transform'>
              <div className='w-full'>
                <div className='flex items-center justify-between space-x-2 mb-2'>
                  <h3 className='font-semibold text-gray-800'>
                    {getActiveDetail()?.title || 'Dragging...'}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TripItem;

const DroppableContainer = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        border: `2px solid ${isOver ? '#228be6' : '#aaa'}`,
      }}
      className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'
    >
      {children}
    </div>
  );
};
