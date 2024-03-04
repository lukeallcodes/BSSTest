import { __decorate } from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
let ClientFormComponent = class ClientFormComponent {
    constructor(fb) {
        this.fb = fb;
        this.initialState = new BehaviorSubject({});
        this.formValuesChanged = new EventEmitter();
        this.formSubmitted = new EventEmitter();
        this.clientForm = new FormGroup({});
    }
    get clientname() { return this.clientForm.get('clientname'); }
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
};
__decorate([
    Input()
], ClientFormComponent.prototype, "initialState", void 0);
__decorate([
    Output()
], ClientFormComponent.prototype, "formValuesChanged", void 0);
__decorate([
    Output()
], ClientFormComponent.prototype, "formSubmitted", void 0);
ClientFormComponent = __decorate([
    Component({
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
], ClientFormComponent);
export { ClientFormComponent };
//# sourceMappingURL=client-form.component.js.map