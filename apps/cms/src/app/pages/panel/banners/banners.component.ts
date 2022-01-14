import { CdkDrag, CdkDragStart } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { BannersForm } from './banners.form';

@Component({
  selector: 'cms-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BannersComponent implements OnInit {
  buttonBackgroundColor = '#555'
  buttonText = 'Button'
  buttonWidth: number
  buttonHeight: number
  buttonFont: string
  buttonFontSize: number
  fontList: ['Arial', 'Roboto']


  heroBannerForm = new FormGroup({
    name: new FormControl()
  });
  spinner = true;
  getSlides = undefined;
  slides: Observable<Array<any>>;
  dragPosition = { x: 0, y: 0 };

  constructor(
    private dialogService: NbDialogService,
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {

    this.createForm();
  }

  createForm() {
    this.heroBannerForm = this.formBuilder.group({
      type: 'hero',
      title: undefined,
      order: undefined,
      buttonText: undefined,
      buttonColor: undefined,
      positionX: undefined,
      positionY: undefined,
      enabled: false
    });
  }

  ngOnInit() {
    console.log(this.buttonText);
    this.slides = this.getAllBanners();
    this.spinner = false;
  }

  submit() {
    this.buttonBackgroundColor = 'white';
  }

  buttonTextChange(data: string) {
    this.buttonText = data
    console.log(data);
  }
  buttonHeightChange(data) {
    this.buttonHeight = data
    console.log(data);
  }
  buttonWidthChange(data) {
    this.buttonWidth = data
    console.log(data);
  }
  buttonFontChange(data) {
    this.buttonFont = data
  }

  buttonFontSizeChange(data) {
    this.buttonFontSize = data
  }

  setPosition(event) {
    const element = event.source.getRootElement();
    const boundingClientRect = element.getBoundingClientRect();
    const parentPosition = this.getPosition(element);
    console.log('x: ' + (boundingClientRect.x - parentPosition.left), 'y: ' + (boundingClientRect.y - parentPosition.top));
  }

  getPosition(el) {
    let x = 0;
    let y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      x += el.offsetLeft - el.scrollLeft;
      y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return { top: y, left: x };
  }

  getAllBanners(): Observable<any> {
    this.spinner = true;
    return this.http.get(environment.apiUrl + environment.getBannersHero)
      .pipe(map(result => result)
      );

  }
}
