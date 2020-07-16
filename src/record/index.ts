import * as rrweb from 'rrweb';
import { GodVProps, RecordEvent } from '../types';
import { uuid } from '../utils/uuid';

export default class GodV {

    constructor(props: GodVProps) {
        this.fetchUrl = props.fetchUrl;
        this.maxLength = props.maxLength || this.maxLength;
        this.interval = props.interval || this.interval;
        this.uuid = uuid();
    }

    private uuid: string = null;
    private fetchUrl: string
    private maxLength: number = 10;
    private interval: number = 3000;
    private stopRecordFn: Function | null = null;
    private events: Array<RecordEvent> = [];
    private isStart: boolean = false;

    record() {
        try {
            if ( !this.fetchUrl ) {
                throw new Error('必须指定fetchUrl');
            }
            if ( this.interval <= 1000 ) {
                throw new Error('interval不能少于1000毫秒');
            }
            if ( this.maxLength < 5 ) {
                throw new Error('maxLength最少设置为5');
            }
            if ( this.isStart ) {
                throw new Error('记录已开启，请勿重复记录，可以先进行关闭后再重新开启！');
            }
            this.stopRecordFn = rrweb.record({
                emit: (event: RecordEvent) => {
                    this.addEvent(event);
                },
            });
            this.setUploadInterval();
            this.isStart = true;
        } catch(err) {
            this.isStart = false;
            console.error( err.message );
        }
        
    }

    public stopRecord(): void {
        if ( this.stopRecordFn && this.isStart ) {
            this.stopRecordFn();
            this.isStart = false;
        }
    }

    private setUploadInterval() {
        setTimeout(() => {
            this.events.length != 0 && this.uploadEvent(this.events.splice(0));
            this.setUploadInterval();
        }, this.interval)
    }

    private addEvent(event: RecordEvent): void {
        this.checkEventIsOverMaxLength();
        this.events.push(event);
    }

    private checkEventIsOverMaxLength(): void {
        if (this.events.length >= this.maxLength) {
            this.uploadEvent(this.events.splice(0));
        }
    }

    private uploadEvent(uploadEvents: Array<RecordEvent>): void {
        console.log(this.uuid)
        console.log(uploadEvents);
    }

}
