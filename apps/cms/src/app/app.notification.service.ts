import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { interval, Observable, Subject, Subscription } from 'rxjs';
import { environment } from '../environments/environment';
import { NbAuthService, NbAuthToken } from '@nebular/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as Tone from 'tone';
import * as moment from 'moment-timezone';

export interface LatestOrder {
  date: string;
  nums: number;
}

@Injectable()
export class AppNotificationService implements OnDestroy {
  private numsNewDepositOrdersSource = new Subject<number>();
  private numsNewWithdrawOrdersSource = new Subject<number>();

  numsDepositOrders$ = this.numsNewDepositOrdersSource.asObservable();
  numsWithdrawOrders$ = this.numsNewWithdrawOrdersSource.asObservable();

  private depositOrderSubscribed: boolean;
  private withdrawOrderSubscribed: boolean;
  private latestDepositOrder: LatestOrder;
  private latestWithdrawOrder: LatestOrder;

  private subscriber: Subscription;

  private loading: boolean;
  private beepEnable: boolean;

  private data: { numsDepositNew: number; numsWithdrawNew: number };

  constructor(private http: HttpClient, private authService: NbAuthService) {
    this.reset();

    const obserable = interval(30000);
    this.subscriber = obserable.subscribe((n) => {
      if (this.loading) {
        return;
      }
      this.interval();
    });
  }

  reset() {
    this.loading = false;
    this.latestDepositOrder = null;
    this.latestWithdrawOrder = null;
    this.depositOrderSubscribed = true;
    this.withdrawOrderSubscribed = true;
    this.numsNewDepositOrdersSource.next(0);
    this.numsNewWithdrawOrdersSource.next(0);
    this.data = {
      numsDepositNew: 0,
      numsWithdrawNew: 0,
    };
    this.beepEnable = false;
  }

  ngOnDestroy(): void {
    this.subscriber.unsubscribe();
  }

  onLoadedDepositOrder(order) {
    if (!this.depositOrderSubscribed) {
      this.depositOrderSubscribed = true;
    }
    this.latestDepositOrder = order;

    this.interval();
  }

  onLoadedWithdrawOrder(order) {
    if (!this.withdrawOrderSubscribed) {
      this.withdrawOrderSubscribed = true;
    }
    this.latestWithdrawOrder = order;

    this.interval();
  }

  async interval() {
    const token = await this.authService.getToken().toPromise(),
      params = {};
    if (this.depositOrderSubscribed) {
      params['depositOrderLatest'] = {
        date: this.latestDepositOrder
          ? this.latestDepositOrder.date
          : moment().format('MM/DD/YYYY') /* '00/00/00000' */,
        nums: this.latestDepositOrder ? this.latestDepositOrder.nums : 0,
      };
    }
    if (this.withdrawOrderSubscribed) {
      params['withdrawOrderLatest'] = {
        date: this.latestWithdrawOrder
          ? this.latestWithdrawOrder.date
          : moment().format('MM/DD/YYYY') /* '00/00/00000' */,
        nums: this.latestWithdrawOrder ? this.latestWithdrawOrder.nums : 0,
      };
    }

    this.loading = true;
    let data;

    try {
      const response = await this.http
        .post(environment.apiUrl + environment.getNotify, params, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }),
        })
        .toPromise();

      if (!response['result']) {
        return;
      }

      data = response['data'];
    } catch (error) {
      console.log(error);
    }

    if (!data) {
      return;
    }

    if (
      data.numsDepositNew !== undefined &&
      this.data['numsDepositNew'] !== data.numsDepositNew
    ) {
      this.data['numsDepositNew'] = data.numsDepositNew;
      this.numsNewDepositOrdersSource.next(data.numsDepositNew);
    }

    if (
      data.numsWithdrawNew !== undefined &&
      this.data['numsWithdrawNew'] !== data.numsWithdrawNew
    ) {
      this.data['numsWithdrawNew'] = data.numsWithdrawNew;
      this.numsNewWithdrawOrdersSource.next(data.numsWithdrawNew);
    }

    const numsNotify = this.data.numsDepositNew + this.data.numsWithdrawNew;

    if (this.beepEnable && numsNotify < 1) {
      this.beepEnable = false;
      this.doBeepDisable();
    } else if (!this.beepEnable && numsNotify > 0) {
      this.beepEnable = true;
      this.doBeepEnable();
    }

    this.loading = false;
  }

  async doBeepEnable() {
    const synthA = new Tone.FMSynth().toDestination();
    const loopA = new Tone.Loop((time) => {
      synthA.triggerAttackRelease('C4', '8n', time);
    }, '2').start(0);

    Tone.Transport.start();
  }

  doBeepDisable() {
    Tone.Transport.stop();
  }
}
