import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DialogCancelTaskComponent } from '@components/dialog-cancel-task/dialog-cancel-task.component';
import { PriceList } from '@components/dialog-create-task/dialog-create-task.component';
import { ListSelectServiceTaskDomain } from '@components/dialog-create-task/service-list-domain';
import { DialogFeedbackOfEmployeeComponent } from '@components/dialog-feedback-of-employee/dialog-feedback-of-employee.component';
import { environment } from '@env/environment';
import { CustomSnackbarService } from '@pages/auth/services/custom-snackbar.service';
import { format } from 'date-fns';

export class Employee {
  id !: number;
  employeeAvatar !: string;
  employeeName !: string;
  employeeEmail !: string;
  employeePhone !: string;

  constructor(id: number,
    employeeAvatar: string,
    employeeName: string,
    employeeEmail: string,
    employeePhone: string) {
    this.id = id;
    this.employeeAvatar = employeeAvatar;
    this.employeeName = employeeName;
    this.employeeEmail = employeeEmail;
    this.employeePhone = employeePhone;
  }
}

export class TaskProgress {
  status: string;
  time: string;
  index: number;

  constructor(index: number, status: string, time: string) {
    this.status = status;
    this.time = time;
    this.index = index;
  }
}
@Component({
  selector: 'app-dialog-task-detail',
  templateUrl: './dialog-task-detail.component.html',
  styleUrls: ['./dialog-task-detail.component.scss']
})
export class DialogTaskDetailComponent implements OnInit {
  isLoading = false;
  customerPhone = "";
  customerName = "";
  address = "";
  email = "";
  date = new FormControl(new Date());
  startTime = format(new Date(), "HH:mm");
  endTime = format(new Date(), "HH:mm");
  note = "";
  validTime: boolean = true;
  minDate = new Date();
  progress !: Array<any>;

  service = new FormControl();
  employee = new FormControl();
  serviceList !: Array<ListSelectServiceTaskDomain>;
  selectedService: any;
  isExistClient: boolean = true;
  disableNext: boolean = false;
  checkbox: boolean = false;
  dataSource !: MatTableDataSource<PriceList>;
  priceList: Array<PriceList> = [];
  numberOfemployee: number = 1;
  employeeList: Array<Employee> = [];
  selectedEmployee: any = [];

  totalMoney !: number;
  displayedColumns: string[] = ['service', 'service_price', 'hours', 'discount', 'percent', 'price'];

  status !: string;
  constructor(public dialogRef: MatDialogRef<DialogTaskDetailComponent>,
    private formBuilder: FormBuilder, public http: HttpClient,
    private customSnackBar: CustomSnackbarService, @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog
  ) {
    this.status = data.status;
  }

  ngOnInit(): void {
    this.getTaskInform();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }


  save(model: any, isValid: boolean, e: any) {
    e.preventDefault();
  }

  onChangeEnd() {
    const start = format(new Date(), "yyyy-MM-dd") + " " + this.startTime + ":00";
    const end = format(new Date(), "yyyy-MM-dd") + " " + this.endTime + ":00";
    const newDate = format(new Date(), "yyyy-MM-dd") + " 00:00:00";
    console.log(new Date(start).getTime() - new Date(newDate).getTime() <= 360000)
    console.log(new Date(end).getTime() - new Date(start).getTime() <= 360000)
    if (new Date(start).getTime() - new Date(newDate).getTime() >= 360000 && new Date(end).getTime() - new Date(start).getTime() >= 360000) {
      this.validTime = false;
    } else {
      this.validTime = true;
    }

  }

  onChangeCheckbox(event: MatCheckboxChange) {
    if (event.checked) {
      this.disableNext = false;
    }
  }

  getTaskInform() {
    this.isLoading = true;
    const employeesList = new Array<Employee>();
    const priceListArray = new Array<PriceList>();

    this.http.get(environment.apiUrl + "/task/" + this.data.taskId).subscribe((data: any) => {
      this.isLoading = false;
      this.address = data.data.address;
      this.email = data.data.client_inform.email;
      this.customerPhone = data.data.client_inform.phone;
      this.customerName = data.data.client_inform.full_name;
      this.note = data.data.note;
      this.date.setValue(new Date(data.data.work_date));
      this.numberOfemployee = data.data.num_of_employee;
      this.startTime = data.data.start_time;
      this.endTime = data.data.end_time;

      const pricesList = data.data.price_list.price_list;

      for (let i = 0; i < pricesList.length; i++) {
        const serviceName = pricesList[i].service_name;
        const servicePrice = pricesList[i].service_price;
        const discountAply = pricesList[i].discount_apply == null ? "" : pricesList[i].discount_apply;
        const percentAply = pricesList[i].percent_apply == null ? "0.00" : pricesList[i].percent_apply;
        const hours = pricesList[i].hours;
        const price = pricesList[i].price;
        const item = new PriceList(serviceName, servicePrice, discountAply, percentAply, hours, price);
        priceListArray.push(item);
      }
      this.totalMoney = data.data.price_list.total;
      priceListArray.push(new PriceList("Tổng cộng", "(VNĐ/h)", "", "(%)", "", this.totalMoney + "(VNĐ)"));
      this.priceList = priceListArray;
      this.dataSource = new MatTableDataSource<PriceList>(this.priceList);
      const list = data.data.price_list.employees;
      if (list.length != 0) {
        for (let i = 0; i < list.length; i++) {
          const id = list[i].id;
          const employeeAvatar = list[i].avatar;
          const employeeName = list[i].full_name;
          const employeeEmail = list[i].email;
          const employeePhone = list[i].phone;
          employeesList.push(new Employee(id, employeeAvatar, employeeName, employeeEmail, employeePhone))
        }
        this.selectedEmployee = employeesList;

      } else {
        this.getListEmployee();
      }

      const progressList = new Array<TaskProgress>();
      for (let i = 0; i < data.data.progress.length; i++) {
        const status = data.data.progress[i].status;
        const time = data.data.progress[i].time;
        progressList.push(new TaskProgress(i, status, time == null ? "" : time));
      }
      this.progress = progressList;
    })
  }

  getTotalMoney() {
    return this.numberOfemployee * this.totalMoney;
  }

  getListEmployee() {
    const start = format(this.date.value, "yyyy-MM-dd") + " " + this.startTime + ":00";
    const end = format(this.date.value, "yyyy-MM-dd") + " " + this.endTime + ":00";
    let params = new HttpParams()
      .set('start_time', start)
      .set('end_time', end)
    this.http.get(environment.apiUrl + "/task/check-employee", { params: params }).subscribe((data: any) => {
      const list = data.data;
      const employeesList = new Array<Employee>();
      if (list.length != 0) {
        for (let i = 0; i < list.length; i++) {
          const id = list[i].id;
          const employeeAvatar = list[i].avatar;
          const employeeName = list[i].full_name;
          const employeeEmail = list[i].email;
          const employeePhone = list[i].phone;
          employeesList.push(new Employee(id, employeeAvatar, employeeName, employeeEmail, employeePhone))
        }
        this.employeeList = employeesList;
      }
    })
  }

  isOptionDisabled(opt: any) {
    return this.selectedEmployee.length >= this.numberOfemployee && !this.selectedEmployee.find((el: any) => el.id == opt.id)
  }

  onAssignListEmployee() {
    const employeeIds = this.selectedEmployee.map((x: any) => x.id);
    const body = {
      ids: employeeIds,
      task_id: this.data.taskId
    }
    this.http.put(environment.apiUrl + "/task/assign", body).subscribe((data: any) => {
      this.customSnackBar.success("Cập nhật thành công")
    })
  }
  onUpdateInform() {
    const body = {
      task_id: this.data.taskId,
      address: this.address,
      note: this.note
    }

    this.http.put(environment.apiUrl + "/task/update-inform", body).subscribe((data: any) => {
      this.customSnackBar.success("Cập nhật thành công!")
    })
  }

  OpenDiaLogFeedbackOfUser(employeeId: any, elementName: any) {
    const data = { employeeId, elementName }
    const dialogRef = this.dialog.open(DialogFeedbackOfEmployeeComponent, { data });
    dialogRef.afterClosed().subscribe(() => {
    })
  }

  cancelTask() {
    const taskId = this.data.taskId;
    const data = { taskId };
    const dialogRef = this.dialog.open(DialogCancelTaskComponent, { data });
    dialogRef.afterClosed().subscribe((data: any) => {
      if (data.isChange) {
        this.dialogRef.close();
      }
    })
  }

}
