const Agenda = require('agenda');
const agendaUrl = "mongodb://localhost:27017/keepApp";
const notesUrl = "mongodb://localhost:27017";
const { MongoClient } = require('mongodb');
const mailService = require('../api/v1/mailService');
const notesController = require('../api/v1/notes/notes.controller');

async function run() {
    const db = await MongoClient.connect(agendaUrl);
    const agenda = new Agenda({ db: {address: agendaUrl, collection: 'jobs'}});

    agenda.define('test', () => {
        // const noteDb = await MongoClient.connect(notesUrl);
        console.log('new run');
        const notesCollection = db.db('keepApp');
        let gteDate = new Date();
        const currentMinute = gteDate.getMinutes();
        const futureMinute = currentMinute + 15;
        const lseDate = new Date();
        lseDate.setMinutes(futureMinute);
        console.log(gteDate, currentMinute, futureMinute, lseDate);
        const notesList = notesCollection.collection('notes')
            .find({remindMe: {$gte: gteDate, $lte: lseDate}, sentFlag: false});
        notesList.forEach((data) => {
             console.log('DATA rcvd: ',JSON.stringify(data));
             let hour = null;
             const time = new Date(data.remindMe);
             const tempHour = time.getHours();
             const tempMins = time.getMinutes();
             if(tempHour <= 12) {
                 hour = tempHour + ':' + tempMins +' AM';
             } else  {
                 hour = (tempHour - 12) + ':' + tempMins + ' PM';
             }
            console.log(time, tempHour, typeof tempHour, hour);
            const details = {
                to: data.userEmail,
                title: data.title,
                time: hour
            };
            const condition = {
                userId: data.userId,
                noteId: data.noteId
            };
            const update = {
                sentFlag: true
            };
            notesCollection.collection('notes')
            .findOneAndUpdate(condition,
                { $set: update },
                (err, updatedNote) => {
                    if(err) {
                        console.log('Error occurred while toggling the sentFlag of note', err);
                    } else {
                        console.log('response: ', updatedNote);
                        console.log('Toggling successful for noteID: ', updatedNote.noteId);
                        mailService.sendReminderMail(details);
                    }
            });
            /*notesController.toggleSentFlags(data.userId, data.noteId, (err, updatedNote) => {
                if(err) {
                    console.log('Error occurred while toggling the sentflags during sending reminder mails!', err);
                } else {
                    mailService.sendReminderMail(details);
                    console.log(`Toggling of sent flags for ${data.content} Note is done`);
                }
            });*/
        });
    });

    await new Promise(resolve => agenda.once('ready', resolve));
    await agenda.start();
    agenda.every('15 seconds', 'test');
}

run().catch(error => {
    console.log(error);
    process.exit(-1);
});