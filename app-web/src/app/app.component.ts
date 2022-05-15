import { Component, OnInit } from '@angular/core';
import { AppLayoutService } from './app-layout/app-layout.service';
import { environment } from 'src/environments/environment'
import { APP_URL } from './common/app-urls/app-urls';
import { ServiceResponse } from './common/service-response';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'cqrworld';

  constructor(
    private _layoutService: AppLayoutService,
    private _cookieService: CookieService
  ) { }

  ngOnInit() {
    this.getMenuDetails();
    this.getUserDetails();
  }

  private getUserDetails() {

    this._layoutService._loggedUser$.subscribe(data => {
      if (data != null) {
        return;
      }
      let _url = environment.baseUrl + APP_URL.UMGMT_GET_USER_DETAILS;

      this._layoutService.getUserDetails(_url).subscribe(res => {

        if (res.status === ServiceResponse.STATUS_SUCCESS) {

          this._layoutService.user = res.response.data;
          this._layoutService.user["itemType"] = res.response["itemType"];
          this._layoutService.emitLoggedUser(this._layoutService.user);
        }
      });
    })

  }

  private getMenuDetails() {
    this._layoutService.emitMenuDetails([]);
    this._layoutService.updateMenu(false);
  }

}
