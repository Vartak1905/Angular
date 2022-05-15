import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-content-wrapper',
  templateUrl: './content-wrapper.component.html',
  styleUrls: ['./content-wrapper.component.css']
})
export class ContentWrapperComponent implements OnInit {
  hideBreadCrumb: boolean = true;
  url: string = '';
  no_breadcrumb_pages = ['/login', '/', '/dashboard','/request-dashboard', '/user-list', '/policy-dashboard', '/view-edit'];
  constructor(
    public _router: Router
  ) { }

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
