import { Component, OnInit, Injector, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserForA } from '../Models/UserForA';

@Component({
  selector: 'app-user-roles-modal',
  templateUrl: './user-roles-modal.component.html',
  styleUrls: ['./user-roles-modal.component.scss']
})
export class UserRolesModalComponent implements OnInit {

  private fb:FormBuilder;
  rolesForm:FormGroup;

  private possibleRoles:string[];
  @Input() user:UserForA;
  constructor(private injector:Injector, public activeModal: NgbActiveModal) {
    this.fb = this.injector.get(FormBuilder);
   }

  ngOnInit() {
    this.possibleRoles = [
      "User",
      "Moderator",
      "Admin"
    ];
    this.rolesForm = this.createForm(this.user);
  }

  createForm(user:UserForA):FormGroup{
    const formControls = this.possibleRoles.map(v=>{
      return new FormControl(user.roles.some(val=>val===v));
    });
    return this.fb.group({
      roles:new FormArray(formControls)
    });
  }

  submit(){
    console.log("asdf")
    let rls = (this.rolesForm.controls["roles"] as FormArray).value;

    let userResp:UserForA = {
      id:this.user.id,
      roles:[],
      userName:this.user.userName
    };
    this.possibleRoles.forEach((v,i)=>{
      if(rls[i] === true){
        userResp.roles.push(v);
      }

    });
    this.activeModal.close(userResp);
  }
}
