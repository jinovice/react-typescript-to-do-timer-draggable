import React from 'react'
import { TicketModel } from '../models/Ticket/TicketModel';

const LocalStorage = (name: string, initialData: TicketModel[]) => {

    function saveToLocalStorage(key: string, value: TicketModel[]) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function loadFromLocalStorage(key: string) {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : initialData;
    }

    return loadFromLocalStorage(name);
}

export default LocalStorage