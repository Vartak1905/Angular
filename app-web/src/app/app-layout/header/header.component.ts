import { Component, OnInit, Input } from '@angular/core';
import { AppLayoutService } from '../app-layout.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { APP_URL } from 'src/app/common/app-urls/app-urls';
import { environment } from 'src/environments/environment';
import { ServiceResponse } from 'src/app/common/service-response';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { EntryPointsService } from 'src/app/entry-points/entry-points.service';
import { UserService } from 'src/app/common/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    public _layoutService: AppLayoutService,
    private _spinnerService: NgxSpinnerService,
    private _cookieService: CookieService,
    private _entrypointService: EntryPointsService,
    private _router: Router,
    private _userService: UserService
  ) { }

  loggedUser: Object;
  homepage:string = '';
  async ngOnInit() {
    this._layoutService._loggedUser$.subscribe(data => {
      if (data && !this.loggedUser) {
        this.loggedUser = data;
        this._userService.getAttachment({ itemId: this.loggedUser["id"], itemType: this.loggedUser["itemType"], attachType: "PROFILE" }).subscribe((data) => {
          this._spinnerService.hide();
          if (data.status == ServiceResponse.STATUS_SUCCESS && data.response && data.response.attachmentData) {
            let imageData = data.response.attachmentData;
            this.loggedUser["profileImage"]= "data:image/jpeg;base64," + imageData.data;
          }
        }, (err) => {
          this._spinnerService.hide();
        })
      }
    })

    this._layoutService._menuDetails$.subscribe((menuData) => {
       if (menuData && menuData[0]) {
        if (menuData[0]["childrenList"][0]) {
          menuData[0]["childrenList"] = menuData[0]["childrenList"].sort((e1, e2) => e1.position > e2.position ? 1 : -1);
          this.homepage = menuData[0]["childrenList"][0].route;
        } else {
          this.homepage= menuData[0].route;
        }
      }
    })
  }

  logout() {

    if (this.loggedUser && this.loggedUser['username'] != "") {

      let _url = environment.baseUrl + APP_URL.UMGMT_USER_LOGOUT;
      let _dataObj = { 'username': this.loggedUser['username'] }

      this._spinnerService.show();
      this._entrypointService.logout(_url, _dataObj).subscribe(res => {

        this._spinnerService.hide();
        if (res.status === ServiceResponse.STATUS_SUCCESS) {
          this.resetAndRedirect();
        }
      });
    }
    else {
      this.resetAndRedirect();
    }
  }

  resetAndRedirect() {
    this._cookieService.delete("access-token");
    this._layoutService.user = '';
    this.loggedUser = null;
    this._layoutService.emitLoggedUser(this._layoutService.user);

    this._layoutService.menu = '';
    this._layoutService.emitLoggedUser(this._layoutService.menu);

    this._router.navigate(['login']);
  }
}
