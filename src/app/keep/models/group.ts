import { Note } from './note';

export class Group {
    groupId: string;
    userId: string;
    title: string;
    description: string;
    createdOn: Date;
    modifiedOn: Date;
    notes: Array<Note>;

    constructor() {
        this.title = '';
        this.description = '';
        this.notes = [];
    }
// tslint:disable-next-line:eofline
}