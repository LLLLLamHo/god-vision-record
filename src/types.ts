export type GodVProps = {
    fetchUrl: string,
    maxLength?: number
    interval?: number
    userTag?: string
}

export type RecordEvent = {
    [propName: string] : any;
}