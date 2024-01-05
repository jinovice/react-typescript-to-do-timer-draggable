import React, { useEffect, useState, useMemo } from "react";
// import counter, { increase, decrease } from '../../modules/counter';
import { TicketModel } from "../../models/Ticket/TicketModel";
import { DndModel } from "../../models/Dnd/DndModel";
import './Ticket.scss';

const Ticket: React.FC<TicketModel> = ({ id, isDragging,zIndex, posX, posY, boxWidth, boxHeight }) => {
  // console.log('render Ticket');

  const style: React.CSSProperties = {
    zIndex: zIndex,
    left: posX + 'px',
    top: posY + 'px',
    width: boxWidth,
    height: boxHeight,
  };

  return (
    <>
      <div ticket-id={id} style={style} className={`ticket ${isDragging ? 'isDragging' : ''}`}>
        <div className="ticket__box">
          <div className="ticket__box__content">
            <div className="ticket__tag">
              <div className="drag">{isDragging.toString()}</div>
            </div>
            <div className="ticket__info">
              <p>z {zIndex}</p>
            </div>
            <div className="ticket__button">
              <p>id {id}</p>
            </div>
            <div className="ticket__timer">
              <p>Graph Timer</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(Ticket);
