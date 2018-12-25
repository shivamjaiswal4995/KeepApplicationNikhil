/* export class Note {
    id: number;
    title: string;
    date: Date;
}*/

export class Note {
    noteId: string;
    userId: string;
    groupId: string;
    title: string;
    content: string;
    favorite: boolean;
    createdOn: Date;
    modifiedOn: Date;
    state: string;
    remindMe: Date;

    constructor() {
        this.title = '';
        this.content = '';
        this.state = '';
        this.favorite = false;
    }
// tslint:disable-next-line:eofline
}
