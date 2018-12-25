export class Notification {
    notificationId: string;
    userId: string;
    content: string;
    readFlag: boolean;

    constructor() {
        this.notificationId = '';
        this.userId = '';
        this.content = '';
    }
}