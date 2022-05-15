import { Component, Input, OnInit } from '@angular/core';
import { AppLayoutService } from 'src/app/app-layout/app-layout.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.css']
})
export class CommentsListComponent implements OnInit {

  constructor(private _layoutService: AppLayoutService, public _matSnackBar: MatSnackBar) { 

  }

  comment: string = '';
  @Input() comment_list = [
    {
      image: './../../../assets/user.jpg',
      user_id: 1,
      comment_id: 1,
      name: 'Haris Shaikh',
      comment: 'This is nice comment.',
      date: 'April 14, 2019',
      showReply: false,
      replyList : [
        {
          image: './../../../assets/user.jpg',
          user_id: 1,
          reply_id: 1,
          name: 'Haris Shaikh',
          reply: 'letters, as opposed to using Content here, content here, making it look like readable English.',
          date: 'April 14, 2019',
        },
        {
          image: './../../../assets/user.jpg',
          user_id: 1,
          reply_id: 1,
          name: 'Haris Shaikh',
          reply: 'the majority have suffered alteration in some form, by injected humour, or randomised words.',
          date: 'April 14, 2019',
        }
      ]
    },
    {
      image: './../../../assets/user.jpg',
      user_id: 1,
      comment_id: 1,
      name: 'Haris Shaikh',
      comment: 'This is nice comment.',
      date: 'April 14, 2019',
      showReply: false,
      replyList: [
        {
          image: './../../../assets/user.jpg',
          user_id: 1,
          reply_id: 1,
          name: 'Haris Shaikh',
          reply: 'Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.',
          date: 'April 14, 2019',
        },
        {
          image: './../../../assets/user.jpg',
          user_id: 1,
          reply_id: 1,
          name: 'Haris Shaikh',
          reply: 'a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur',
          date: 'April 14, 2019',
        },
        {
          image: './../../../assets/user.jpg',
          user_id: 1,
          reply_id: 1,
          name: 'Haris Shaikh',
          reply: 'the majority have suffered alteration in some form, by injected humour, or randomised words.',
          date: 'April 14, 2019',
        }
      ]
    }
  ];
  ngOnInit(): void {
  
  }
  onDelete() {

  }
  onEdit() {

  }
  submitReply(index) {
    if (this.comment_list[index]['reply']) {
      let reply_obj = {
        image: './../../../assets/user.jpg',
        user_id: 1,
        reply_id: 1,
        reply: this.comment_list[index]['reply'],
        name: 'Haris Shaikh',
        date: 'April 14, 2019',
      };
      this.comment_list[index]['replyList'].push(reply_obj);
      this.comment_list[index]['reply'] = null;
      this.comment_list[index]['showReply'] = false;
      this._matSnackBar.open("Reply posted.", "Dismiss", {
        duration: 2000,
      });

    } else {
      this._matSnackBar.open("Please write something in comment.", "Dismiss", {
        duration: 2000,
      });
    }
  }
  showHideComment(comment) {
    this.comment_list.forEach(element => {
      element.showReply = false;
      element['comment'] = null;
    });
    comment.showReply = true;
  }
  onSubmitComment() {
    if (this.comment) {
      let comment_obj = {
        image: this._layoutService.user['profileImage'],
        user_id: this._layoutService.user['userDetails']['id'],
        comment_id: null,
        name: this._layoutService.user['firstName'] + " " +this._layoutService.user['firstName']['lastName'],
        comment: this.comment,
        date: 'April 14, 2019',
        showReply: false,
        replyList: [

        ]
      };
      this.comment_list.push(comment_obj);
      this.comment = null;
    } else {
      this._matSnackBar.open("Please write something in comment.", "Dismiss", {
        duration: 2000,
      });
    }
    
  }

}
