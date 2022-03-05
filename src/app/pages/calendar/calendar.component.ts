import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogCreateLeaveDateComponent } from '@components/dialog-create-leave-date/dialog-create-leave-date.component';
import { DialogEditLeaveDateComponent } from '@components/dialog-edit-leave-date/dialog-edit-leave-date.component';
import { environment } from '@env/environment';
import { CustomSnackbarService } from '@pages/auth/services/custom-snackbar.service';
import { format } from 'date-fns';


export class LeaveDateOfEmployee {
  id: number;
  user_name: string;
  user_avatar: string;
  start: string;
  end: string;
  constructor(id: number, user_name: string, user_avatar: string, start: string,
    end: string) {
    this.user_avatar = user_avatar;
    this.user_name = user_name;
    this.start = start;
    this.end = end;
    this.id = id;
  }
}

@Component({
  selector: "highlighted-dates",
  template: `
    <mat-card class="demo-inline-calendar-card">
      <mat-calendar [(selected)]="selected" [dateClass]="dateClass" (selectedChange)="dateChanged($event)"></mat-calendar>
    </mat-card>

  `,
  styleUrls: ["calendar.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class HighlightedDatesComponent {
  private _orangeDatesArray !: Date[];
  private _redDatesArray!: Date[];
  selected = new Date() as any;

  @Output() dateChange = new EventEmitter<Date>();

  dateChanged(date: any) {
    this.dateChange.emit(this.selected);
  }

  @Input()
  get orangeDatesArray(): Date[] {
    return this._orangeDatesArray;
  }

  set orangeDatesArray(d: Date[]) {
    this._orangeDatesArray = d;
    this._setupClassFunction();
  }

  @Input()
  get redDatesArray(): Date[] {
    return this._redDatesArray;
  }
  set redDatesArray(d: Date[]) {
    this._redDatesArray = d;
  }

  dateClass!: (d: Date) => any;

  private _setupClassFunction() {
    this.dateClass = (d: Date) => {

      let selected = false;
      if (this._orangeDatesArray) {
        selected = this._orangeDatesArray.some(
          (item: Date) =>
            item.getFullYear() === d.getFullYear() &&
            item.getDate() === d.getDate() &&
            item.getMonth() === d.getMonth()
        );
        if (selected) {
          return selected ? "example-custom-date--orange-class " : undefined;
        }
        else if (this._redDatesArray) {

          selected = this._redDatesArray.some(
            (item: Date) =>
              item.getFullYear() === d.getFullYear() &&
              item.getDate() === d.getDate() &&
              item.getMonth() === d.getMonth()
          );
          return selected ? "example-custom-date--red-class " : undefined;
        }
      }
      return undefined;
    };
  }
}


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarsComponent implements OnInit {

  today = new Date();
  tomorrow = new Date(new Date().setDate(this.today.getDate() + 1));
  twoDaysAgo = new Date(new Date().setDate(this.today.getDate() - 2));
  nextWeek = new Date(new Date().setDate(this.today.getDate() + 9));
  orangeDatesArray: Date[] = [];
  redDatesArray = [];

  currentSelectedDate = new Date();
  displayedColumns: string[] = ['select', 'name', 'start', 'end', 'detail'];
  dataSource !: MatTableDataSource<LeaveDateOfEmployee>;
  selection = new SelectionModel<any>(true, []);
  public value!: Date[]
  public multiSelect: Boolean = true;


  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  leaveDateList: Array<LeaveDateOfEmployee> = [];

  totalRow: number = 10;
  isLoading !: boolean;
  keySearch = new FormControl('');
  arrayPageSize = [10, 20, 30];
  sortObj!: Sort;
  mapPageToken = new Map();
  status!: string;
  offset !: number;
  pageSize = this.arrayPageSize[0];

  constructor(private dialog: MatDialog, public http: HttpClient, public customSnakbarService: CustomSnackbarService) {
  }


  openDialogCreateLeaveDate() {
    const dialogRef = this.dialog.open(DialogCreateLeaveDateComponent);
    dialogRef.afterClosed().subscribe(() => {
      window.location.reload();
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  // checkboxLabel(row?: any): string {
  //   if (!row) {
  //     return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
  //   }
  //   return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  // }

  ngOnInit(): void {
    this.offset = 0;
    this.getListDateHasLeaveDate();
    this.getListLeaveDate();
  }
  onChange() {
  }
  deleteLeaveDate() {
    const body = {
      ids: this.selection.selected.map((item) => item.id)
    };

    console.log(body);

    this.http.post(environment.apiUrl + "/leave-date/delete", body).subscribe(data => {
      this.customSnakbarService.success("Xoá ngày nghỉ thành công");
      this.selection.clear();
      this.getListDateHasLeaveDate();
      this.getListLeaveDate();
    })
  }

  getListLeaveDateByDate() {
    this.clearSort();
    this.selection.clear();
    this.getListLeaveDate();
  }

  getListLeaveDate() {

    this.isLoading = true;
    const dateString = format(this.currentSelectedDate, "yyyy-MM-dd");

    let params = new HttpParams()
      .set('offset', this.offset)
      .set('limit', this.pageSize)
      .set('status', this.status ? this.status : '')
      .set('value_search', this.keySearch.value)
      .set('column_sort', this.sortObj && this.sortObj.direction ? this.sortObj.active.toUpperCase() : '')
      .set('type_sort', this.sortObj ? this.sortObj.direction.toUpperCase() : '')
      .set('date', dateString);

    this.http.get(environment.apiUrl + "/leave-date", { params: params })
      .subscribe((res: any) => {
        this.totalRow = res.total_rows;
        this._prepareLeaveDateList(res.data);
        this.isLoading = false;
      }
      );
  }


  _prepareLeaveDateList(data: any) {
    if (data) {
      const result = Array<LeaveDateOfEmployee>();
      for (let i = 0; i < data.length; i++) {
        const id = data[i].id;
        const name = data[i].name;
        const avatar = data[i].avatar;
        const start = data[i].start;
        const end = data[i].end;

        const domain = new LeaveDateOfEmployee(id, name, avatar, start, end);

        result.push(domain);
      }
      this.leaveDateList = result;
      this.dataSource = new MatTableDataSource<LeaveDateOfEmployee>(this.leaveDateList);
    }
  }

  onPaging(event: PageEvent) {
    this.selection.clear();
    if (event.pageSize !== this.pageSize) {
      this.mapPageToken = new Map();
      this.mapPageToken.set(1, 0);
      this.paginator.pageIndex = 0;
      event.pageIndex = 0;
    }
    this.pageSize = event.pageSize;
    this.offset = event.pageIndex + 1;
    this.getListLeaveDate();
  }

  onSearch() {
    this.clearSort();
    this.selection.clear();
    this.getListLeaveDate();
  }

  getListDateHasLeaveDate() {
    const listDate = new Array<Date>();
    this.http.get(environment.apiUrl + "/leave-date/list").subscribe((data: any) => {
      const list = data.data;
      for (let i = 0; i < list.length; i++) {
        listDate.push(new Date(list[i]));
      }
      this.orangeDatesArray = [...listDate];
    })

  }

  clearSort() {
    this.sort?.sort({ id: '', start: 'asc', disableClear: false });
    this.sortObj = {
      active: '',
      direction: '',
    };
    this.paginator.pageIndex = 0;
  }

  sortData(sort: Sort) {
    this.sortObj = sort;
    this.paginator.pageIndex = 0;
    this.selection.clear();
    this.getListLeaveDate();
  }

  openDialogEditLeaveDate(leaveDateId: any) {
    const data = { leaveDateId };
    const dialogRef = this.dialog.open(DialogEditLeaveDateComponent, { data });
    dialogRef.afterClosed().subscribe(() => {
      this.getListLeaveDate();

    })
  }

}


