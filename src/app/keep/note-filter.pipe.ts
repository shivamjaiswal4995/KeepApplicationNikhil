import { Note } from './models/note';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'noteFilter'
})
export class NoteFilterPipe implements PipeTransform {

    transform(value: Note[], filterBy: string): Note[] {
        filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
        return filterBy ? value.filter((note: Note) => {
            return (note.title.toLocaleLowerCase().indexOf(filterBy) !== -1) || (note.content.toLocaleLowerCase().indexOf(filterBy) !== -1);
        }) : value;
    }
// tslint:disable-next-line:eofline
}