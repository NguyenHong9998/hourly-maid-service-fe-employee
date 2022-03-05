import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { DialogEditNotifyComponent } from '@components/dialog-edit-notify/dialod-edit-notify.component';
import { environment } from '@env/environment';
import { CustomSnackbarService } from '@pages/auth/services/custom-snackbar.service';
import { format, parse } from 'date-fns';
import { NotifyListDomain } from './notify.domain';

const DEFAULT_NOTIFY_LIST_PARAMS = {
    column_sort: '',
    limit: 1,
    offset: 1,
    type_sort: '',
    value_search: '',
    status: ''
};

const COLUMN_NAME_MAP = {
    title: 'TITLE',
    content: 'CONTENT',
    type: 'TYPE',
    status: 'STATUS'
};
@Component({
    selector: 'app-notify',
    templateUrl: './notify.component.html',
    styleUrls: ['./notify.component.scss'],
})
export class NotifyComponent implements OnInit {
    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
    notifyList: Array<NotifyListDomain> = [];

    totalRow: number = 10;
    keySearch = new FormControl('');
    arrayPageSize = [10, 20, 30];
    sortObj!: Sort;
    mapPageToken = new Map();
    status!: string;
    offset !: number;

    pageSize = this.arrayPageSize[0];
    constructor(
        private dialog: MatDialog, public http: HttpClient, public customSnackbarService: CustomSnackbarService, public router: Router
    ) {
    }

    ngOnInit(): void {
        this.offset = 0;
        this.getListNotify();
    }


    getListNotify() {
        let params = new HttpParams()
            .set('offset', this.offset)
            .set('limit', this.pageSize)
            .set('status', this.status ? this.status : '')
            .set('value_search', this.keySearch.value)
            .set('column_sort', this.sortObj && this.sortObj.direction ? this.sortObj.active.toUpperCase() : '')
            .set('type_sort', this.sortObj ? this.sortObj.direction.toUpperCase() : '');


        this.http.get(environment.apiUrl + "/notify/user", { params: params })
            .subscribe((res: any) => {
                this.totalRow = res.total_rows;
                this._prepareNotifyList(res.data);
            }
            );
    }
    _prepareNotifyList(data: any) {
        if (data) {
            console.log(data);
            const result = Array<NotifyListDomain>();
            for (let i = 0; i < data.length; i++) {
                const id = data[i].id;
                const title = data[i].title;
                const content = data[i].content;
                const publishDate = parse(data[i].publish_date, 'yyyy-MM-dd HH:mm:ss', new Date()) // not MM-DD-YY

                const date = format(publishDate, "dd-MM-yyyy");
                const time = format(publishDate, "HH:mm:ss");
                const domain = new NotifyListDomain(id as number, title, content, date, time);

                result.push(domain);
            }
            this.notifyList = result;
        }
    }

    onPaging(event: PageEvent) {
        if (event.pageSize !== this.pageSize) {
            this.mapPageToken = new Map();
            this.mapPageToken.set(1, 0);
            this.paginator.pageIndex = 0;
            event.pageIndex = 0;
        }
        this.pageSize = event.pageSize;
        this.offset = event.pageIndex + 1;
        this.getListNotify();

    }



    openDialogEditNotify(notifyId: any) {
        const data = { notifyId };
        const dialogRef = this.dialog.open(DialogEditNotifyComponent, { data });

        dialogRef.afterClosed().subscribe(() => {
        });

    }

    onSearch() {
        this.getListNotify();
    }


}
