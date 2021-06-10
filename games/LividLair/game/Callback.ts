module LividLair {
    export class Callback {
        context: any;
        callback: Function;
        constructor(context: any, callback: Function) {
            this.context = context;
            this.callback = callback;
        }

        call(caller: any) {
            this.callback.call(this.context, caller);
        }
    }
}