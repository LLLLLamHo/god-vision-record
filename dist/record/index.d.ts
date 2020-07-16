import { GodVProps } from '../types';
export default class GodV {
    constructor(props: GodVProps);
    private userTag;
    private uuid;
    private fetchUrl;
    private maxLength;
    private interval;
    private stopRecordFn;
    private events;
    private isStart;
    record(): void;
    stopRecord(): void;
    private setUploadInterval;
    private addEvent;
    private checkEventIsOverMaxLength;
    private uploadEvent;
}
