import React, { useState, useRef, useEffect } from "react";
import { DndModel } from "../../models/Dnd/DndModel";
import { TicketModel } from '../../models/Ticket/TicketModel';
import TicketList from "./TicketList";
import dataTicketList from "../../Data/Data";
import LocalStorage from "../../Data/Data";
import './TicketStage.scss';

function saveToLocalStorage(key: string, value: TicketModel[]) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadFromLocalStorage(key: string) {
  const storedValue = localStorage.getItem(key) ?? saveToLocalStorage('dataTicketList', dataTicketList);
  return storedValue ? JSON.parse(storedValue) : [];
}

const storageData = loadFromLocalStorage('dataTicketList');




const TicketStage: React.FC = () => {
  const testRefTicketStage = useRef(0)
  const testRefTicket = useRef(0)
  testRefTicketStage.current += 1;

  // console.log('render TicketStage');

  // const [dndState, setDndState] = useState<DndStateModel>({isDragging: false, dragTarget: -1, x: 0, y: 0});
  const [ticketListState, setTicketListState] = useState<TicketModel[]>(storageData)
  const highestZindexInit: number = Math.max(...ticketListState.map(ticket => ticket.zIndex))
  // console.log('highestZindexInit  ' + highestZindexInit);

  const dndRef = useRef<DndModel>({isDragging: false, dragTarget: -1, highestZIndex: highestZindexInit, x: 0, y: 0})
  const [highestZIndex, setHighestZIndex] = useState<number>(Math.max(...ticketListState.map(ticket => ticket.zIndex)))

  function snapGrid(number: number, snapSize: number = 1) {
    // console.log(snapSize + ' | ' + Math.round(number / snapSize) * snapSize);
    return Math.round(number / snapSize) * snapSize
    // return number;
  }

  const updatePos = (targetId: number, isDragging?: boolean, zIndex?: number, moveX?: number, moveY?: number, boxWidth?: number, boxHeight?: number, snapSize?: number) => {
    // console.log('updatePos' +' '+ targetId +' '+ isDragging +' '+ zIndex +' '+ moveX +' '+ moveY +' '+ boxWidth +' '+ boxHeight +' '+ snapSize);
    const updatedTicketList = [...ticketListState];
    const indexToUpdate = updatedTicketList.findIndex((ticket) => ticket.id === targetId);

    // if (highestZIndex > 10) {
    //   updatedTicketList = modifyZIndex(updatedTicketList);
    //   console.log(ticketListState);
    // }

    if (indexToUpdate !== -1) {
      updatedTicketList[indexToUpdate] = {
        ...updatedTicketList[indexToUpdate],
        zIndex: zIndex ? zIndex : updatedTicketList[indexToUpdate].zIndex,
        isDragging: isDragging !== undefined ? isDragging : updatedTicketList[indexToUpdate].isDragging,
        posX: moveX ? snapGrid(moveX, snapSize) : updatedTicketList[indexToUpdate].posX,
        posY: moveY ? snapGrid(moveY, snapSize) : updatedTicketList[indexToUpdate].posY,
        boxWidth: boxWidth ? boxWidth : updatedTicketList[indexToUpdate].boxWidth,
        boxHeight: boxHeight ? boxHeight : updatedTicketList[indexToUpdate].boxHeight,
      };
      // console.log(posX, posY);

      // console.log(moveX ? snapGrid(moveX, Math.max(snapSize || 1, 1)) : updatedTicketList[indexToUpdate].posX);

      setTicketListState(updatedTicketList);
      saveToLocalStorage('dataTicketList', updatedTicketList);
    }
  };

  const modifyZIndex = (arr: TicketModel[]): TicketModel[] => {
    const sortedArr = [...arr].sort((a, b) => a.id - b.id);
    const modifiedArr = sortedArr.map((item, index) => ({
      ...item,
      zIndex: index + 10,
    }));
    console.log(modifiedArr);
    return modifiedArr;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // console.log('handleMouseDown');
    const targetElement = e.target as HTMLElement;
    dndRef.current.dragTarget = parseInt(targetElement.closest('.ticket')?.getAttribute('ticket-id') ?? '');

    const indexToUpdate = ticketListState.findIndex((ticket) => ticket.id === dndRef.current.dragTarget);

    if (indexToUpdate !== -1) {
      const gapX= ticketListState[indexToUpdate].posX - e.clientX;
      const gapY= ticketListState[indexToUpdate].posY - e.clientY;

      //wth --------- setHighestZIndex 가 비동기로 늦게 실행되어 문제 발생 - useEffect 로 해결
      if (highestZIndex > ticketListState[indexToUpdate].zIndex) {
        setHighestZIndex(highestZIndex + 10);
      }

      dndRef.current = ((previousRef: DndModel) => ({...previousRef, x: gapX, y: gapY}))(dndRef.current);
      
    }

    updatePos(dndRef.current.dragTarget, true, highestZIndex);
    // console.log(dndRef.current.x, dndRef.current.y);
  };

  useEffect(() => {
    console.log('useEffect : highestZIndex updated');
    updatePos(dndRef.current.dragTarget, undefined, highestZIndex);
  }, [highestZIndex]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dndRef.current.dragTarget === -1) return;
    const moveX = e.clientX + dndRef.current.x;
    const moveY = e.clientY + dndRef.current.y;
    updatePos(dndRef.current.dragTarget, undefined, undefined, moveX, moveY, undefined, undefined, 20);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    // console.log('handleMouseUp');

    if (dndRef.current.dragTarget) {
      updatePos(dndRef.current.dragTarget, false, undefined, undefined, undefined, undefined, undefined, 20);
    }

    dndRef.current = ((previousRef: DndModel) => ({...previousRef, dragTarget: -1}))(dndRef.current);
  };

  return (
    <>
      <div style={{zIndex: 9999, position: 'absolute'}}>
        <input type="text" size={6} value={testRefTicketStage.current} readOnly />
        <input type="text" size={6} value={testRefTicket.current} readOnly />
        <input
          type="text" size={6}
          value={highestZIndex.toString()}
          readOnly
        />
        <input
          type="text" size={6}
          value={`${dndRef.current.dragTarget}`}
          readOnly
        />
        <button className="icon">test</button>
      </div>
      <div
        className="ticketStage"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        // onMouseOut={handleMouseOut}
      >
        <TicketList ticketListState={ticketListState} />
      </div>
    </>
  );
};

export default React.memo(TicketStage);