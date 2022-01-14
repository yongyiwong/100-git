import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { WebSocketSubject } from 'rxjs/internal-compatibility';
import { webSocket } from 'rxjs/webSocket';
import { EMPTY, Observable, Subject, timer } from 'rxjs';
import {
  catchError,
  retryWhen,
  switchAll,
  tap,
  delayWhen,
} from 'rxjs/operators';
import { ErrorService } from '../error/error.service';

export interface DataServiceListener {
  onWSConnected(socket$: WebSocketSubject<any>): void;
  onWSDisconnected(): void;
}

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private isConnected = false;
  private listeners: DataServiceListener[] = [];

  openSocket: any;
  reconnectAttempts = 3;
  private pageLang: string;
  private socket$: WebSocketSubject<any>;
  private messagesSubject$ = new Subject();
  public socketInfo = new Subject();
  isOpenSocket$ = this.socketInfo.asObservable();
  public reconnectWebsocket$ = new Subject<any>();
  public messages$ = this.messagesSubject$.pipe(
    switchAll(),
    catchError((e) => {
      throw e;
    })
  );
  initPayload: object;

  constructor(private error: ErrorService) {}

  public addListener(listener: DataServiceListener) {
    this.listeners.push(listener);
  }

  public removeListener(listener: DataServiceListener) {
    const idxFound = this.listeners.findIndex((item) => item === listener);
    if (idxFound < 0) {
      return;
    }
    this.listeners.splice(idxFound, 1);
  }

  public connect(lang): Observable<any> {
    if (!this.socket$ || this.socket$.closed) {
      console.log(
        '%c BC initPayload: ' + JSON.stringify(this.initPayload),
        'color:green;'
      );
      this.socket$ = this.getNewWebSocket();

      this.pageLang = lang === 'en' || lang === 'eng' ? 'eng' : 'zhh';
      this.initPayload = {
        command: 'request_session',
        params: {
          language: this.pageLang,
          site_id: environment.settings.siteID,
        },
      };
      this.socket$.next(this.initPayload);

      this.socket$.asObservable().subscribe();

      return this.socket$.asObservable();
    }
  }

  private reconnect(observable: Observable<any>): Observable<any> {
    return observable.pipe(
      retryWhen((errors) =>
        errors.pipe(
          tap((val) =>
            console.log(
              '%c [Data Service] Try to reconnect',
              'color:blue;',
              val
            )
          ),
          delayWhen((_) => timer(2000))
        )
      )
    );
  }

  public getData(): Observable<any> {
    return this.socket$;
  }

  private getNewWebSocket() {
    return webSocket({
      url: environment.settings.wssUrl,
      openObserver: {
        next: () => {
          console.log('%c [DataService]: connection opened', 'color: green;');
          this.listeners.forEach((observer) =>
            observer.onWSConnected(this.socket$)
          );
          this.isConnected = true;
        },
      },
      closeObserver: {
        next: () => {
          console.log('%c [DataService]: connection closed', 'color: red;');

          this.isConnected = false;
          this.socket$ = undefined;
          this.listeners.forEach((observer) => observer.onWSDisconnected());

          this.connect(this.pageLang);
        },
      },
    });
  }

  public getConnectedSocket() {
    if (!this.isConnected) {
      return null;
    }

    return this.socket$;
  }

  sendMessage(msg: any) {
    // if (!this.openSocket) {
    //   this.isOpenSocket$.subscribe((data) => {
    //     if (data) {
    //       this.openSocket = data;
    //       this.socket$.next(msg);
    //     }
    //   });
    // } else {
    //   this.socket$.next(msg);
    // }
    if (this.socket$) {
      this.socket$.next(msg);
    }
  }
  close() {
    console.log('closing...');
    this.socket$.complete();
    this.socket$.unsubscribe();
  }
}
