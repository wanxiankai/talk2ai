/* eslint-disable @typescript-eslint/no-explicit-any */
import mitt from 'mitt';

type EventType = {
    [key: string]: any;
}

const eventBus = mitt<EventType>();

export default eventBus;
