import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from '@env/environment';
import { CustomSnackbarService } from '@pages/auth/services/custom-snackbar.service';
import { TokenStorageService } from '@pages/auth/services/token-storage.service';

export class EmployeeService {
  id: string;
  banner: string;
  service_name: string;
  level: number;


  constructor(id: string, banner: string,
    service_name: string,
    level: number) {
    this.id = id;
    this.banner = banner;
    this.service_name = service_name;
    this.level = level;
  }
}
@Component({
  selector: 'app-dialog-list-employee-service',
  templateUrl: './dialog-list-employee-service.component.html',
  styleUrls: ['./dialog-list-employee-service.component.scss']
})
export class DialogListEmployeeServiceComponent implements OnInit {
  displayedColumns: string[] = ['name', 'level', 'delete'];
  service_name: string = "";
  stars: number[] = [1, 2, 3, 4, 5];
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  sortObj!: Sort;
  dataSource!: MatTableDataSource<EmployeeService>;
  employeeList: Array<EmployeeService> = [];

  constructor(public dialogRef: MatDialogRef<DialogListEmployeeServiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public http: HttpClient, public tokenStorage: TokenStorageService,
    public snackbar: CustomSnackbarService) {
  }

  ngOnInit(): void {
    this.getListItemsEmloyeeServices();
  }

  sortData(sort: Sort) {

    this.sortObj = sort;
    this.getListItemsEmloyeeServices();

  }

  getListItemsEmloyeeServices() {
    this.http.get(environment.apiUrl + "/user/experience/" + this.tokenStorage.getUser().user_id).subscribe((data: any) => {
      const list = data.data;
      const employeeList = new Array<EmployeeService>();
      for (let i = 0; i < list.length; i++) {
        employeeList.push(new EmployeeService(list[i].service_id, list[i].banner, list[i].service_name, list[i].level));
      }
      this.employeeList = employeeList;
      console.log(this.employeeList);
      this.dataSource = new MatTableDataSource<EmployeeService>(this.employeeList);
    })
  }

  onRatingChanged(rating: any, serviceId: any) {
    for (let i = 0; i < this.employeeList.length; i++) {
      if (this.employeeList[i].id == serviceId) {
        this.employeeList[i].level = rating;
      }
    }
  }

  onSave() {
    const listExperience: { service_id: string; level: number; }[] = [];
    this.employeeList.forEach(t => {
      const item = {
        service_id: t.id,
        level: t.level
      }
      listExperience.push(item);
    })
    const employeeId = this.tokenStorage.getUser().user_id;
    const body = {
      employee_service: listExperience,
      employee_id: employeeId
    }

    this.http.post(environment.apiUrl + "/user/employee/experience", body).subscribe((data: any) => {
      this.snackbar.success("Cập nhật thành công")
      this.dialogRef.close();
    })
  }

  deleteRow(serviceId: any) {
    this.employeeList.forEach((value, index) => {
      if (value.id == serviceId) this.employeeList.splice(index, 1);
    });
    this.dataSource.data = this.employeeList;
  }
}

