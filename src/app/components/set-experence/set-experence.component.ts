import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomSnackbarService } from '@pages/auth/services/custom-snackbar.service';

@Component({
  selector: 'app-set-experence',
  templateUrl: './set-experence.component.html',
  styleUrls: ['./set-experence.component.scss']
})
export class SetExperenceComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef <SetExperenceComponent>, public http: HttpClient,
    private customSnackBar: CustomSnackbarService, @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog
  ) {}

  ngOnInit(): void {
  }
  onNoClick() {
    this.dialogRef.close();
  }


}
