import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { HeaderComponent } from './app-layout/header/header.component';
import { LeftSideComponent } from './app-layout/left-side/left-side.component';
import { httpInterceptorProvider } from './common/http-interceptors';
import { CookieService } from 'ngx-cookie-service';
import { AuthGuard } from './common/guards/auth.guard';
import { ContentWrapperComponent } from './app-layout/content-wrapper/content-wrapper.component';
import { MainFooterComponent } from './app-layout/main-footer/main-footer.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RegistrationModule } from './registration/registration.module';
import { UsermanagementModule } from './usermanagement/usermanagement.module';
import { SelfServiceModule } from './self-service/self-service.module';
import { NgDynamicBreadcrumbModule } from "ng-dynamic-breadcrumb";
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { IprModModule } from 'src/app/ipr-mod/ipr-mod.module';
import { DocViewComponent } from './common/doc-view/doc-view.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';

@NgModule({
  declarations: [
    AppComponent,
    AppLayoutComponent,
    HeaderComponent,
    LeftSideComponent,
    ContentWrapperComponent,
    MainFooterComponent,
    DocViewComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    RegistrationModule,
    UsermanagementModule,
    SelfServiceModule,
    IprModModule,
    NgDynamicBreadcrumbModule,
    NgxDocViewerModule
  ],
  entryComponents: [
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }, httpInterceptorProvider, AuthGuard, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule {

}
