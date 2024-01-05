import React from "react";
import Ticket from "./Ticket";
import { TicketModel } from "../../models/Ticket/TicketModel";

interface TicketListProps {
  ticketListState: TicketModel[];
}

const TicketList: React.FC<TicketListProps> = ({ticketListState}) => {

  // console.log('<TicketList>' + isDragging, dragTarget, x, y);

  return (
    <>
    {/* map의 첫번째 매개변수는 항상 요소다 */}
      {ticketListState.map((ticket, index) => (
        <Ticket key={index} {...ticket} />
      ))}
    </>
  );
}

export default React.memo(TicketList);
