import { Injectable } from '@angular/core';

declare let toastr: any;

@Injectable()
export class ToastrService {

    error(message: string, title?: string) {
        toastr.options = {
            'positionClass': 'toast-top-center',
            'showDuration': '300',
            'hideDuration': '1000'
        };
        toastr.error(message, title);
    }

    success(message: string, title?: string) {
        toastr.options = {
            'positionClass': 'toast-top-center',
            'showDuration': '300',
            'hideDuration': '1000'
        };
        toastr.success(message, title);
    }

    info(message: string, title?: string) {
        toastr.options = {
            'positionClass': 'toast-top-center',
            'showDuration': '300',
            'hideDuration': '1000'
        };
        toastr.info(message, title);
    }
// tslint:disable-next-line:eofline
}