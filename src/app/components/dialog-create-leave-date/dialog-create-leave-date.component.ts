import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from '@env/environment';
import { CustomSnackbarService } from '@pages/auth/services/custom-snackbar.service';
import { TokenStorageService } from '@pages/auth/services/token-storage.service';
import { addDays, compareAsc, format } from 'date-fns';
export class LeaveDate {
  id: number;
  date: string;
  start: string;
  end: string
  constructor(id: number, date: string,
    start: string, end: string) {
    this.date = date;
    this.start = start;
    this.end = end;
    this.id = id;
  }
};

export class Employee {
  id: number;
  name: string;
  avatar: string;

  constructor(id: number, name: string, avatar: string) {
    this.id = id;
    this.name = name;
    this.avatar = avatar;
  }
}
@Component({
  selector: 'app-dialog-create-leave-date',
  templateUrl: './dialog-create-leave-date.component.html',
  styleUrls: ['./dialog-create-leave-date.component.scss']
})
export class DialogCreateLeaveDateComponent implements OnInit {
  selectedValue: any;
  exampleForm: FormGroup | any;
  displayedColumns: string[] = ['date', 'morning', 'afternoon', 'delete'];
  dataSource = new MatTableDataSource<LeaveDate>();
  range = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });
  row: any;
  note = '';

  userAvatar !: string;
  userName !: string;

  constructor(public dialogRef: MatDialogRef<DialogCreateLeaveDateComponent>, private formBuilder: FormBuilder,
    private http: HttpClient, private customSnackBar: CustomSnackbarService, private tokenStorage : TokenStorageService
  ) {
    this.row = this.getListLeaveDate(this.range.controls.start.value, this.range.controls.end.value);
    this.dataSource = new MatTableDataSource<LeaveDate>(this.row);

  }

  deleteRow(x: any) {
    let indexOfDeleteItem = null;
    for (let index = 0; index < this.row.length; index++) {
      if (this.row[index].date == x) {
        indexOfDeleteItem = index;
      }
    }
    this.row.splice(indexOfDeleteItem, 1);
    this.dataSource = new MatTableDataSource<LeaveDate>(this.row);
  }

  employees !: Array<Employee>

  ngOnInit(): void {
    this.getLisEmployees();
    this.range.get('end')?.valueChanges.subscribe(res => {
      var start = this.range.get('start')?.value;
      var end = res;
      if (start != null && end != null) {
        this.row = this.getListLeaveDate(start, end);
        this.dataSource = new MatTableDataSource<LeaveDate>(this.row);
      }
    })

  }

  onNoClick() {
    this.dialogRef.close();
  }

  nativeSelectFormControl = new FormControl('valid', [
    Validators.required,
    Validators.pattern('valid'),
  ]);

  getListLeaveDate(start: Date, end: Date): LeaveDate[] | undefined {
    var currentDate = start;
    var endDate = end;
    var arr = []
    var i = 1;
    var newDate = currentDate;

    let now = new Date();
    let str = format(now, "HH:mm");

    while (compareAsc(newDate, endDate)) {
      arr.push(new LeaveDate(i, format(newDate, "dd-MM-yyyy"), str, str));
      newDate = addDays(newDate, 1);
      i++;
    }
    arr.push(new LeaveDate(i, format(endDate, "dd-MM-yyyy"), str, str));
    return arr;
  }

  getLisEmployees() {

    let params = new HttpParams()
      .set('offset', 0)
      .set('limit', 1000)
      .set('status', 'Nhân viên')
      .set('value_search', '')
      .set('column_sort', '')
      .set('type_sort', '');

    this.http.get(environment.apiUrl + "/user/list", { params: params })
      .subscribe((res: any) => {
        this._prepareEmplyeeList(res.data);
      }
      );

  }
  _prepareEmplyeeList(data: any) {
    if (data) {
      const result = Array<Employee>();
      for (let i = 0; i < data.length; i++) {
        const id = data[i].id;
        const name = data[i].name;
        const avatar = data[i].avatar;
        const domain = new Employee(id, name, avatar);
        result.push(domain);
      }
      this.employees = result;
    }
  }

  onChangeStart(element: any, id: any) {
    const item = this.row.find((x: LeaveDate) => x.id == id);
    item.start = element;
  }
  onChangeEnd(element: any, id: any) {
    const item = this.row.find((x: LeaveDate) => x.id == id);
    item.end = element;
  }
  setAssessmentLevel(leaveDate: any, value: any) {
    var leaveDate = this.row[this.row.indexOf(leaveDate)];
    leaveDate.level = value;

  }
  saveLeaveDate() {
    console.log(this.row);

    const userId = this.tokenStorage.getUser().user_id;
    const note = this.note;
    const array = new Array<LeaveDate>();
    for (let i = 0; i < this.row.length; i++) {
      const startTime = this.row[i].date + " " + this.row[i].start + ":00";
      const endTime = this.row[i].date + " " + this.row[i].end + ":00";

      const item = new LeaveDate(this.row[i].id, this.row[i].date, startTime, endTime);
      array.push(item);
    }

    const data = {
      note: note,
      user_id: userId,
      leave_domains: array
    }

    this.http.post(environment.apiUrl + "/leave-date", data).subscribe(data => {
      this.customSnackBar.success("Tạo mới thành công");
      this.dialogRef.close();
    })

  }


  startChange(event: MatDatepickerInputEvent<any, any>) {
    var start = event.value;
    var end = this.range.controls.end.value;
    this.row = this.getListLeaveDate(start, end);
    this.dataSource = new MatTableDataSource<LeaveDate>(this.row);
    console.log("startChange", event.value)
  }

  endChange(event: MatDatepickerInputEvent<any, any>) {
    var end = event.value;
    var start = this.range.controls.start.value;
    this.row = this.getListLeaveDate(start, end);
    this.dataSource = new MatTableDataSource<LeaveDate>(this.row);
    console.log("startChange", event.value)
  }

  selectEmployee(event: any) {
    const selectEmpl = this.employees.find( epl => epl.id == event.value);
    this.userAvatar = selectEmpl?.avatar as any;
    console.log(this.userAvatar);
    this.userName = selectEmpl?.name as any;
  }
}
