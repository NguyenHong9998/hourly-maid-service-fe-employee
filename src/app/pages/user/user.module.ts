import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialExampleModule } from 'src/app/material.module';
import { SidebarModule } from './component/sidebar/sidebar.module';
import { UserCalendarModule } from './component/user-calendar/user-calendar.module';
import { UserInforModule } from './component/user-infor/user-infor.module';
import { MyProfilePage } from './pages/my-profile/my-profile.page';
import { OverviewPage } from './pages/overview/overview.page';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [MyProfilePage, OverviewPage],
  imports: [
    CommonModule,
    UserRoutingModule,
    MaterialExampleModule,
    SidebarModule,
    UserInforModule,
    UserCalendarModule,
    FormsModule, ReactiveFormsModule
  ],
})
export class UserModule { }
