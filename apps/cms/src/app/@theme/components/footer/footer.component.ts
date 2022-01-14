import { Component } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      Created with ♥ by
      <b><a href="https://catch.star.com" target="_blank">Catch Team</a></b>
      2020
    </span>
    <div class="socials">
      <a href="" target="_blank" class="">
        <ion-icon name="logo-github"></ion-icon>
      </a>
      <a href="" target="_blank" class="">
        <ion-icon name="logo-facebook"></ion-icon>
      </a>
      <a href="" target="_blank" class="">
        <ion-icon name="logo-twitter"></ion-icon>
      </a>
      <a href="" target="_blank" class="">
        <ion-icon name="logo-linkedin"></ion-icon>
      </a>
    </div>
  `,
})
export class FooterComponent {}
