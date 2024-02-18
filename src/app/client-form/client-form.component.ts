import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Client } from '../client'; // Make sure this import points to your Client model
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form class="client-form" autocomplete="off" [formGroup]="clientForm" (ngSubmit)="submitForm()">
      <div class="form-group">
        <label for="clientname">Client Name</label>
        <input type="text" id="clientname" formControlName="clientname" placeholder="Client Name" required>
      </div>
  
      <div *ngIf="clientname.invalid && (clientname.dirty || clientname.touched)" class="alert alert-danger">
        <div *ngIf="clientname.errors?.['required']">
          Client name is required.
        </div>
        <div *ngIf="clientname.errors?.['minlength']">
          Client name must be at least 3 characters long.
        </div>
      </div>
  
      <button class="btn btn-primary" type="submit" [disabled]="clientForm.invalid">Submit</button>
    </form>
  `,
  styles: [
    `.client-form {
      max-width: 560px;
      margin-left: auto;
      margin-right: auto;
    }`
  ]
})
export class ClientFormComponent implements OnInit {
  @Input()
  initialState: BehaviorSubject<Client> = new BehaviorSubject<Client>({} as Client);

  @Output()
  formValuesChanged = new EventEmitter<Client>();

  @Output()
  formSubmitted = new EventEmitter<Client>();

  clientForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) { }

  get clientname() { return this.clientForm.get('clientname')!; }

  ngOnInit() {
    this.initialState.subscribe(client => {
      this.clientForm = this.fb.group({
        clientname: [client.clientname, [Validators.required, Validators.minLength(3)]],
      });
    });

    this.clientForm.valueChanges.subscribe(val => this.formValuesChanged.emit(val));
  }

  submitForm() {
    this.formSubmitted.emit(this.clientForm.value);
  }
}
