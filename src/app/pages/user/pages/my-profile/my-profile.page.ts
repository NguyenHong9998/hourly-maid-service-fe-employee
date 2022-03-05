import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ROUTER_UTILS } from '@core/utils/router.utils';
import { environment } from '@env/environment';
import { CustomSnackbarService } from '@pages/auth/services/custom-snackbar.service';
import { TokenStorageService } from '@pages/auth/services/token-storage.service';


@Component({
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage {

  role: string = "";
  status: string = "";

  experience: any = [
    {
      name: "",
      note: "",
      hasExperience: true
    },
    {
      name: "",
      note: "",
      hasExperience: true
    },
  ]

  file!: File;
  avatar!: string | ArrayBuffer;
  
  isVerifyEmail !: boolean;
  isVerifyPhone !: boolean;

  changePassForm = new FormGroup({
    oldPass: new FormControl(''),
    newPass: new FormControl(''),
    confirmNewPass: new FormControl(''),
  })

  personalInform = new FormGroup({
    email: new FormControl(''),
    gender: new FormControl(''),
    phone: new FormControl(''),
    idCard: new FormControl(''),
    address: new FormControl(''),
    dateOfBirth: new FormControl(new Date()),
    name: new FormControl(''),
    verifyPhone: new FormControl(''),
    verifyEmail: new FormControl('')

  })

  onFileChange(event: any) {
    console.log("Change avatar");
    this.file = event.target.files[0] || null;
    if (this.file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.avatar = reader.result as string;
      };
      reader.readAsDataURL(event.target.files[0]);
    } else {
      this.avatar = this.avatar;
    }
  }

  onRemoveAvatar() {
    this.avatar = "https://www.sibberhuuske.nl/wp-content/uploads/2016/10/default-avatar.png";
    this.file = null as any;
  }

  ngOnInit(): void {
    this.getUserCommonInform();
    this.getUserPersonalInform();
  }

  constructor(public http: HttpClient, public customSnackbarService: CustomSnackbarService,
    public tokenStorageService: TokenStorageService, private router: Router

  ) {
  }

  getUserCommonInform() {

    this.http.get(environment.apiUrl + "/user/common-inform").subscribe(data => {

      let avatar = (data as any).data.avatar;
      console.log("Avatarrrrr: " + avatar);
      if (avatar == null) {
        avatar = "https://www.sibberhuuske.nl/wp-content/uploads/2016/10/default-avatar.png";
      }
      this.role = (data as any).data.role;
      this.status = (data as any).data.status;
      console.log("xxxxxxx: " + status);

      this.avatar = avatar;
    })
  }

  getUserPersonalInform() {
    this.http.get(environment.apiUrl + "/user/personal-inform/" + this.tokenStorageService.getUser().user_id).subscribe(data => {
      this.personalInform.get('email')?.setValue((data as any).data.email);
      this.personalInform.get('gender')?.setValue((data as any).data.gender);
      this.personalInform.get('phone')?.setValue((data as any).data.phone);
      this.personalInform.get('idCard')?.setValue((data as any).data.id_card);
      this.personalInform.get('address')?.setValue((data as any).data.address);
      let birthday = (data as any).data.date_of_birth == "" ? new Date() : new Date((data as any).data.date_of_birth);
      this.personalInform.get('dateOfBirth')?.setValue(birthday);
      this.personalInform.get('name')?.setValue((data as any).data.name);
      this.isVerifyEmail = (data as any).data.verify_email;
      this.isVerifyPhone = (data as any).data.verify_phone;
    })

  }

  onItemChange(event: any) {
    this.personalInform.get('gender')?.setValue(event.target.value);
  }
  saveCommonInform() {
    let avatar = this.avatar as string;
    console.log("AVATARRR : " + avatar);
    const formData = new FormData();
    formData.append('file', this.file);
    if (!avatar.startsWith('http')) {
      this.http.post(environment.apiUrl + "/cloud/upload-avatar", formData).subscribe(data => {
        this.avatar = (data as any).data;
        let body = {
          avatar: this.avatar,
          role: this.role,
          status: this.status
        }
        this.http.put(environment.apiUrl + "/user/common-inform", body).subscribe(data => {
          this.customSnackbarService.success("Cập nhật thành công!")
        })
      })
    } else {
      let body = {
        avatar: this.avatar,
        role: this.role,
        status: this.status
      }
      this.http.put(environment.apiUrl + "/user/common-inform", body).subscribe(data => {
        this.customSnackbarService.success("Cập nhật thành công!")
      })
    }

  }

  saveUserPersonalInform() {
    const data = {
      email: this.personalInform.get('email')?.value,
      gender: this.personalInform.get('gender')?.value,
      phone: this.personalInform.get('phone')?.value,
      id_card: this.personalInform.get('idCard')?.value,
      address: this.personalInform.get('address')?.value,
      date_of_birth: this.personalInform.get('dateOfBirth')?.value.value,
      name: this.personalInform.get('name')?.value
    }

    this.http.put(environment.apiUrl + "/user/personal-inform/" , data).subscribe(data => {
      this.customSnackbarService.success("Cập nhật thành công!")
    })
  }

  changePassword() {
    console.log("kkkkkkkkk" + this.changePassForm.get('confirmNewPass')?.value);

    const data = {
      old_pass: this.changePassForm.get('oldPass')?.value,
      new_pass: this.changePassForm.get('newPass')?.value,
      confirm_new_pass: this.changePassForm.get('confirmNewPass')?.value
    }
    this.http.post(environment.apiUrl + "/user/change-pass", data).subscribe(data => {
      this.customSnackbarService.success("Cập nhật thành công! Hãy đăng nhập lại");
      this.tokenStorageService.signOut();
      // this.router.navigateByUrl('/auth/login');
      const { root, signIn } = ROUTER_UTILS.config.auth;
      this.router.navigate(['/', root, signIn]);
      window.location.reload();
    })
  }
  onRoleChange(event: any) {
    this.role = event.target.value;
  }


  sendCodeVerifyEmail() {
    const data = { email: this.personalInform.get('email')?.value }
    this.http.post(environment.apiUrl + '/user/send-verify-email', data).subscribe((data: any) => {
      this.customSnackbarService.success("Gửi mã thành công, hãy kiểm tra email của bạn")
    })
  }

  sendCodeVerifyPhone() {
    const data = { phone_number: this.personalInform.get('phone')?.value }

    this.http.post(environment.apiUrl + '/user/verify-phone-sms', data).subscribe((data: any) => {
      this.customSnackbarService.success("Gửi mã thành công, hãy kiểm tra điện thoại của bạn")
    })
  }
  verifyEmail() {
    const data = {
      verify_token: this.personalInform.get('verifyEmail')?.value
    }
    this.http.post(environment.apiUrl + '/user/verify-email', data).subscribe((data: any) => {
      this.customSnackbarService.success("Xác thực thành công")
      this.isVerifyEmail = true;
    })

  }

  verifyPhone() {
    const data = {
      verify_token: this.personalInform.get('verifyPhone')?.value
    }
    this.http.post(environment.apiUrl + '/user/verify-phone', data).subscribe((data: any) => {
      this.customSnackbarService.success("Xác thực thành công")
      this.isVerifyPhone = true;
    })
  }
}
