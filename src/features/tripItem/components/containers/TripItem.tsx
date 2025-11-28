import { useState, useEffect, useRef } from 'react';
import { useParams } from '@tanstack/react-router';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import useTripItem from '../../hooks/useTripItem';
import TripDetailModal from '../widgets/TripDetailModal';
import Loading from '../../../../components/units/Loading';
import DraggableTripItemCard from '../widgets/DraggableTripItemCard';
import FloatButton from '../../../../components/units/FloatButton';
import Empty from '../units/Empty';
import TripHeader from '../widgets/TripHeader';
import TripItemHeader from '../widgets/TripItemHeader';
import Test from '../containers/Test';

import type { DragEndEvent } from '@dnd-kit/core';
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
    moveDetailToNewPosition,
  } = useTripItem({ tripId });

  const [isShowItemModal, setIsShowItemModal] = useState(false);
  const [editingDetail, setEditingDetail] = useState<TripDetail | null>(null);

  const hasScrolledToToday = useRef(false);

  // 用於儲存日期元素的 ref
  const dateRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const dateOptions = tripItems ? tripItems.map((item) => item.date) : [];

  // 設定拖拽感測器
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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

  // 找到指定 detail 的位置資訊
  const findDetailPosition = (detailId: string) => {
    if (!tripItems) return null;

    for (const tripItem of tripItems) {
      const detailIndex = tripItem.details.findIndex(
        (detail) => detail.id === detailId
      );
      if (detailIndex !== -1) {
        return {
          date: tripItem.date,
          index: detailIndex,
          detail: tripItem.details[detailIndex],
        };
      }
    }
    return null;
  };

  // 拖拽結束
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !tripItems) return;

    const activePosition = findDetailPosition(active.id as string);
    if (!activePosition) return;

    // 檢查是否拖拽到其他 detail
    const overPosition = findDetailPosition(over.id as string);
    if (!overPosition) return;

    if (activePosition.date === overPosition.date) {
      // 同一天內的排序
      if (activePosition.index !== overPosition.index) {
        moveDetailToNewPosition({
          sourceDate: activePosition.date,
          targetDate: overPosition.date,
          dragIndex: activePosition.index,
          hoverIndex: overPosition.index,
        });
      }
    } else {
      // 跨天移動
      moveDetailToNewPosition({
        sourceDate: activePosition.date,
        targetDate: overPosition.date,
        dragIndex: activePosition.index,
        hoverIndex: overPosition.index,
      });
    }
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

  // 收集所有 detail 的 id，用於統一的 SortableContext
  const allDetailIds = tripItems.flatMap((tripItem) =>
    tripItem.details.map((detail) => detail.id)
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={allDetailIds}
        strategy={verticalListSortingStrategy}
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
                  className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'
                >
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
                      <>
                        <Test />
                        <Empty />
                      </>
                    )}
                  </div>
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
      </SortableContext>
    </DndContext>
  );
};

export default TripItem;
