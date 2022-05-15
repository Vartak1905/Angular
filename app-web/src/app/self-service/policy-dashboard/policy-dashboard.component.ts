import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { TableViewService } from 'src/app/app-widgets/table/table-view/table-view.service';
import { DashboardService } from 'src/app/common/dashboard-service/dashboard.service';
import { ServiceResponse } from 'src/app/common/service-response';
import { UserService } from 'src/app/common/user.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-policy-dashboard',
  templateUrl: './policy-dashboard.component.html',
  styleUrls: ['./policy-dashboard.component.css']
})
export class PolicyDashboardComponent implements OnInit {

  
  constructor(
  ) { }

  ngOnInit(): void {
  }

}
