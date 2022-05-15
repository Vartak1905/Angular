import { Component, OnInit } from '@angular/core';
import { TableViewService } from 'src/app/app-widgets/table/table-view/table-view.service';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css']
})
export class AddClientComponent implements OnInit {

  constructor(
    private _tableService: TableViewService
  ) { }

  add_mode: boolean = true;
  edit_mode: boolean = false;
  heading : string = 'Business Entity Registration';
  ngOnInit(): void {

    if (this._tableService.selRecord != null && this._tableService.selMenu 
      && (this._tableService.selMenu['owner'] == 'addclient' || this._tableService.selMenu['owner'] == 'addclient-req')) {
      this.add_mode = false;
      this.edit_mode = true;
      this.heading = 'View / Edit Business Entity';
    }
  }
}
