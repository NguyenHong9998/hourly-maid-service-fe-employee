import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogCreateServiceComponent } from '@components/dialog-create-service/dialog-create-service.component';
import { DialogEditServiceComponent } from '@components/dialog-edit-service/dialog-edit-service.component';
import { DialogEmployeeServiceInformComponent } from '@components/dialog-employee-service-inform/dialog-employee-service-inform.component';
import { DialogListDiscountServiceComponent } from '@components/dialog-list-discount-service/dialog-list-discount-service.component';
import { DialogListEmployeeServiceComponent } from '@components/dialog-list-employee-service/dialog-list-employee-service.component';
import { environment } from '@env/environment';
import { CustomSnackbarService } from '@pages/auth/services/custom-snackbar.service';
import { CleanServiceListDomain } from './clean-service-list.domain';

@Component({
  selector: 'app-clean-service',
  templateUrl: './clean-service.component.html',
  styleUrls: ['./clean-service.component.scss']
})
export class CleanServiceComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  displayedColumns: string[] = ['select', 'name', 'price', 'note', 'status', 'detail'];
  selection = new SelectionModel<any>(true, []);

  dataSource!: MatTableDataSource<CleanServiceListDomain>;
  notifyList: Array<CleanServiceListDomain> = [];

  totalRow: number = 10;
  isLoading !: boolean;
  keySearch = new FormControl('');
  arrayPageSize = [10, 20, 30];
  sortObj!: Sort;
  mapPageToken = new Map();
  status!: string;
  offset !: number;

  pageSize = this.arrayPageSize[0];

  constructor(
    private dialog: MatDialog, public http: HttpClient, public customSnackbarService: CustomSnackbarService,
  ) {
  }

  ngOnInit(): void {
    this.offset = 0;

    this.getListService();
  }



  getListService() {

    this.isLoading = true;

    let params = new HttpParams()
      .set('offset', this.offset)
      .set('limit', this.pageSize)
      .set('status', this.status ? this.status : '')
      .set('value_search', this.keySearch.value)
      .set('column_sort', this.sortObj && this.sortObj.direction ? this.sortObj.active.toUpperCase() : '')
      .set('type_sort', this.sortObj ? this.sortObj.direction.toUpperCase() : '');


    this.http.get(environment.apiUrl + "/service", { params: params })
      .subscribe((res: any) => {
        this.totalRow = res.total_rows;
        this._prepareNotifyList(res.data);
        this.isLoading = false;
      }
      );


  }
  _prepareNotifyList(data: any) {
    if (data) {
      const result = Array<CleanServiceListDomain>();
      for (let i = 0; i < data.length; i++) {
        const id = data[i].id;
        const position = i;
        const name = data[i].name;
        const note = data[i].note;
        const banner = data[i].banner;
        const price = data[i].price;
        const createDate = data[i].create_date;
        const status = data[i].status;
        const domain = new CleanServiceListDomain(id, position, name, banner, price, note, createDate, status);

        result.push(domain);
      }
      this.notifyList = result;
      this.dataSource = new MatTableDataSource<CleanServiceListDomain>(this.notifyList);
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
    this.getListService();

  }

  onSearch() {
    this.clearSort();
    this.selection.clear();
    this.getListService();
  }

  clearSort() {
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
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
    this.getListService();
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

  openDialogListEmployee(serviceId: string, serviceName: string) {
    const data = { serviceId, serviceName };
    const dialogRef = this.dialog.open(DialogEmployeeServiceInformComponent, { data });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  openDialogCreateService() {
    const dialogRef = this.dialog.open(DialogCreateServiceComponent);

    dialogRef.afterClosed().subscribe(() => {
      this.getListService();
    });
  }

  openDialogEditService(serviceId: string, serviceName: string) {
    const data = { serviceId, serviceName };
    const dialogRef = this.dialog.open(DialogEditServiceComponent, { data });

    dialogRef.afterClosed().subscribe(() => {
      this.getListService();
    });
  }

  openDialoglistDiscountService(serviceId: string, serviceName: string) {
    const data = { serviceId, serviceName };
    const dialogRef = this.dialog.open(DialogListDiscountServiceComponent, { data });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  setExperence() {
    const dialogref = this.dialog.open(DialogListEmployeeServiceComponent);
    dialogref.afterClosed().subscribe(() => {

    })

  }
}
