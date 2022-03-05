import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MaterialExampleModule } from "../material.module";
import { DialogCancelTaskComponent } from './dialog-cancel-task/dialog-cancel-task.component';
import { DialogChangeStatusDiscountComponent } from './dialog-change-status-discount/dialog-change-status-discount.component';
import { DialogChangeStatusNotifyComponent } from './dialog-change-status-notify/dialog-change-status-notify.component';
import { DialogConfirmBlockEmployeeComponent } from './dialog-confirm-block-employee/dialog-confirm-block-employee.component';
import { DialogCreateDiscountServiceComponent } from './dialog-create-discount-service/dialog-create-discount-service.component';
import { DialogCreateEmployeeComponent } from './dialog-create-employee/dialog-create-employee.component';
import { DialogCreateLeaveDateComponent } from './dialog-create-leave-date/dialog-create-leave-date.component';
import { DialogCreateNotifyComponent } from './dialog-create-notify/dialog-create-notify.component';
import { DialogCreateServiceComponent } from './dialog-create-service/dialog-create-service.component';
import { DialogCreateTaskComponent } from './dialog-create-task/dialog-create-task.component';
import { DialogDoneTaskComponent } from './dialog-done-task/dialog-done-task.component';
import { DialogEditDiscountServiceComponent } from './dialog-edit-discount-service/dialog-edit-discount-service.component';
import { DialogEditEmployeeInforComponent } from './dialog-edit-employee-infor/dialog-edit-employee-infor.component';
import { DialogEditLeaveDateComponent } from './dialog-edit-leave-date/dialog-edit-leave-date.component';
import { DialogEditNotifyComponent } from './dialog-edit-notify/dialod-edit-notify.component';
import { DialogEditServiceComponent } from './dialog-edit-service/dialog-edit-service.component';
import { DialogFeedbackOfEmployeeComponent } from './dialog-feedback-of-employee/dialog-feedback-of-employee.component';
import { DialogListDiscountServiceComponent } from './dialog-list-discount-service/dialog-list-discount-service.component';
import { DialogListEmployeeServiceComponent } from './dialog-list-employee-service/dialog-list-employee-service.component';
import { DialogTaskDetailComponent } from './dialog-task-detail/dialog-task-detail.component';
import { SnackBarComponent } from "./snack-bar/snack-bar.component";
import { StarRatingComponent } from './star-rating/star-rating.component';
import { SetExperenceComponent } from './set-experence/set-experence.component';
import { DialogEmployeeServiceInformComponent } from './dialog-employee-service-inform/dialog-employee-service-inform.component';


@NgModule({
    declarations: [
        SnackBarComponent,
        DialogListEmployeeServiceComponent,
        DialogCreateEmployeeComponent,
        DialogCreateServiceComponent,
        DialogEditServiceComponent,
        DialogEditEmployeeInforComponent,
        DialogListDiscountServiceComponent,
        DialogEditDiscountServiceComponent,
        DialogCreateDiscountServiceComponent,
        DialogCreateTaskComponent,
        DialogTaskDetailComponent,
        DialogCreateNotifyComponent,
        DialogEditNotifyComponent,
        DialogCreateLeaveDateComponent,
        DialogFeedbackOfEmployeeComponent,
        DialogConfirmBlockEmployeeComponent,
        DialogChangeStatusNotifyComponent,
        DialogEditLeaveDateComponent,
        DialogChangeStatusDiscountComponent,
        DialogCancelTaskComponent,
        DialogDoneTaskComponent,
        StarRatingComponent,
        SetExperenceComponent,
        DialogEmployeeServiceInformComponent,
    ],
    imports: [
        MatSnackBarModule,
        BrowserAnimationsModule,
        MaterialExampleModule,
        FormsModule, ReactiveFormsModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
    ],
})
export class ShareModule { }