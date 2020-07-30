import * as rrweb from 'rrweb';
import { GodVProps, RecordEvent } from '../types';
import { uuid } from '../utils/uuid';
import axios from 'axios';

export default class GodV {

    constructor(props: GodVProps) {
        this.fetchUrl = props.fetchUrl;
        this.maxLength = props.maxLength || this.maxLength;
        this.interval = props.interval || this.interval;
        this.uuid = uuid();
        this.userTag = props.userTag || '';
    }

    private userTag: string = '';
    private uuid: string = null;
    private fetchUrl: string
    private maxLength: number = 10;
    private interval: number = 3000;
    private stopRecordFn: Function | null = null;
    private events: Array<RecordEvent> = [];
    private isStart: boolean = false;
    private token: string = null;

    record() {
        try {
            if (!this.token) {
                throw new Error('必须指定token');  
            }
            if (!this.fetchUrl) {
                throw new Error('必须指定fetchUrl');
            }
            if (this.interval <= 1000) {
                throw new Error('interval不能少于1000毫秒');
            }
            if (this.maxLength < 5) {
                throw new Error('maxLength最少设置为5');
            }
            if (this.isStart) {
                throw new Error('记录已开启，请勿重复记录，可以先进行关闭后再重新开启！');
            }
            this.stopRecordFn = rrweb.record({
                emit: (event: RecordEvent) => {
                    this.addEvent(event);
                },
            });
            this.setUploadInterval();
            this.isStart = true;
        } catch (err) {
            this.isStart = false;
            console.error(err.message);
        }

    }

    public stopRecord(): void {
        if (this.stopRecordFn && this.isStart) {
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
        const uploadData = {
            uuid: this.uuid,
            events: uploadEvents,
            userTag: this.userTag,
            token: this.token
        }

        axios.post(this.fetchUrl, uploadData)
            .then( (response: any) => {
                if ( response.status != 200 || response.data.code != 200 ) {
                    this.addUploadErrorEventsToQueue(uploadEvents);
                }
            })
            .catch((error: any) => {
                this.addUploadErrorEventsToQueue(uploadEvents);
                console.error(error);
            });

    }

    private addUploadErrorEventsToQueue(errorEvents: Array<RecordEvent>) {
        this.events.push(...errorEvents);
    }

}
