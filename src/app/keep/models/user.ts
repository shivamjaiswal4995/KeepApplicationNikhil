/*import { Note } from './note';

export class User {
    id: number;
    birthDate: Date;
    name: string;
    avatar: string;
    bio: string;
    notes: Note[] = [];
}*/

export class User {
    userId: string;
    userName: string;
    userEmail: string;
    password: string;

    constructor() {
        this.userName = '';
        this.userEmail = '';
        this.password = '';
    }
}
