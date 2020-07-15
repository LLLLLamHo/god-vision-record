export function record(): void {

    const data = {...Object.assign({a: 111}, {b: 2222})};
    console.log(data);

    const arr = Array.from(new Set());
    console.log(arr);

    if ( document.readyState == 'interactive' || document.readyState == 'complete' ) {
        console.log('1开始任务');
    } else {
        document.addEventListener('DOMContentLoaded',function(){
            console.log('2开始任务');
        });
    }

}