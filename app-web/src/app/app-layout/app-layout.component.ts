import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { APP_URL } from '../common/app-urls/app-urls';
import { ServiceResponse } from '../common/service-response';
import { AppLayoutService } from './app-layout.service';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css']
})
export class AppLayoutComponent implements OnInit {

  constructor(
    public _router: Router
  ) { }

  hideBreadCrumb: boolean = true;
  url: string = '';
  no_breadcrumb_pages = ['/login', '/', '/dashboard','/request-dashboard', '/user-list', '/policy-dashboard', '/view-edit'];
  ngOnInit(): void {
    
    this._router.events.subscribe(() => {
      this.url = this._router.url;
      if (this.no_breadcrumb_pages.includes(this.url)) {
        this.hideBreadCrumb = true;
      } else {
        this.hideBreadCrumb = false;
      }
    })
  }
}
