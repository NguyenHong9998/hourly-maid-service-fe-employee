import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from '@env/environment';
export class EmployeeService {
  avatar: string;
  name: string;
  level: number;

  constructor(avatar: string,
    name: string,
    level: number) {
    this.avatar = avatar;
    this.name = name;
    this.level = level;
  }
}
@Component({
  selector: 'app-dialog-employee-service-inform',
  templateUrl: './dialog-employee-service-inform.component.html',
  styleUrls: ['./dialog-employee-service-inform.component.scss']
})
export class DialogEmployeeServiceInformComponent implements OnInit {

  displayedColumns: string[] = ['name', 'level'];
  service_name: string = "";
  stars: number[] = [1, 2, 3, 4, 5];
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  sortObj!: Sort;
  dataSource!: MatTableDataSource<EmployeeService>;
  employeeList: Array<EmployeeService> = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, public http: HttpClient) {
    this.service_name = data.serviceName;
  }

  ngOnInit(): void {
    this.getListItemsEmloyeeServices();
  }

  sortData(sort: Sort) {

    this.sortObj = sort;
    this.getListItemsEmloyeeServices();

  }

  getListItemsEmloyeeServices() {
    const employee = new Array<EmployeeService>();
    let params = new HttpParams()
      .set('column_sort', this.sortObj && this.sortObj.direction ? this.sortObj.active.toUpperCase() : '')
      .set('type_sort', this.sortObj ? this.sortObj.direction.toUpperCase() : '');
    this.http.get(environment.apiUrl + "/service/" + this.data.serviceId + "/employee", { params: params }).subscribe(data => {
      const list = (data as any).data;
      for (let i = 0; i < list.length; i++) {
        const avatar = list[i].user_avatar;
        const name = list[i].user_name;
        const level = list[i].level;

        employee.push(new EmployeeService(avatar, name, level));
      }
      this.employeeList = employee;

      this.dataSource = new MatTableDataSource<EmployeeService>(this.employeeList);
    })
  }

}
