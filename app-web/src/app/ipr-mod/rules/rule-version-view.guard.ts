import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppLayoutService } from 'src/app/app-layout/app-layout.service';

@Injectable({
  providedIn: 'root'
})
export class RuleVersionViewGuard implements CanActivate {

  isActivate: boolean = false;

  constructor(private __layoutService: AppLayoutService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let roleList = this.__layoutService.user && this.__layoutService.user['roleList'] ? this.__layoutService.user['roleList'] : [];
    if (roleList) {
      let index = roleList.findIndex(item => item.name == "CQRWorld Admin");
      if (index > -1) {
        this.isActivate = true;
      } else {
        this.isActivate = false;
      }
    }
    return this.isActivate;

  }

}
