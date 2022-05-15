import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(public _cookieService: CookieService, public _router: Router) { }

  ngOnInit(): void {
    let token = this._cookieService.get('access-token');
    if(token) {
      this._router.navigate(['dashboard']);
    }
  }
}
