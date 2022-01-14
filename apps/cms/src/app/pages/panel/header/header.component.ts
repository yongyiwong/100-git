import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  NbMenuBag,
  NbMenuService,
  NbSidebarService,
  NbToastrService,
} from '@nebular/theme';
import { NbAuthService, NbTokenService } from '@nebular/auth';
import { Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import {
  NextObserver,
  Observable,
  Observer,
  PartialObserver,
  Subscription,
} from 'rxjs';

@Component({
  selector: 'cms-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userMenu = [
    { title: 'Profile', data: 'profile' },
    { title: 'Change Password', data: 'changePassword' },
    { title: 'Logout', data: 'logout' },
  ];
  user = {
    name: 'Bruce Lee',
    picture:
      'https://www.biography.com/.image/t_share/MTE5NTU2MzE2NDIwOTk4NjY3/bruce-lee-9542095-1-402.jpg',
  };

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private authService: NbAuthService,
    private tokenService: NbTokenService,
    private router: Router,
    private toastrService: NbToastrService
  ) {}
  menuScriber: Subscription;

  ngOnInit(): void {
    this.menuScriber = this.menuService.onItemClick().subscribe({
      next: async (event) => {
        const data = event.item.data;
        if (data === 'logout') {
          const authResult = await this.authService.logout('email').toPromise();

          console.log('%c, loggedout', 'color: #07A;');

          this.tokenService.clear();
          this.toastrService.success(status, 'Logged out successfully!', {
            icon: '',
          });
          setTimeout(() => {
            this.router.navigate(['auth/login']);
          }, 750);
        } else if (data === 'changePassword') {
          this.router.navigate(['auth/reset']);
        }
      },
      error: (err: any) => {},
      complete: () => {},
    });
  }

  ngOnDestroy(): void {
    this.menuScriber.unsubscribe();
  }

  toggleSidebar() {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }
}
