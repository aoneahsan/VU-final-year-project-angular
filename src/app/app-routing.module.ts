// Core Imports
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Services & Guards
import { AuthGuard } from './route-guards/auth/auth-guard.service';
import { UnAuthGuard } from './route-guards/auth/unauth-guard.service';

// Components
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { HomeComponent } from './components/home/home.component';
import { HallsComponent } from './components/halls/halls.component';
import { CreateHallComponent } from './components/halls/create-hall/create-hall.component';
import { CreateBookingComponent } from './components/bookings/create-booking/create-booking.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { SearchHallComponent } from './components/search-hall/search-hall.component';
import { AdminGuard } from './route-guards/admin/admin-guard.service';
import { ManageCustomersComponent } from './admin-panel/manage-customers/manage-customers.component';
import { ManageHallsComponent } from './admin-panel/manage-halls/manage-halls.component';
import { DashboardComponent } from './admin-panel/dashboard/dashboard.component';
import { ManageBookingsComponent } from './admin-panel/manage-bookings/manage-bookings.component';
import { SimpleAuthGuard } from './route-guards/auth/simple-auth-guard.service';
import { BookingsComponent } from './components/bookings/bookings.component';
import { HallManagerGuard } from './route-guards/hall-manager/hall-manager.service';
import { CustomerGuard } from './route-guards/customer/customer.service';
import { EditHallComponent } from './components/halls/edit-hall/edit-hall.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home', 
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'sign-in', 
    component: SignInComponent,
    canActivate: [UnAuthGuard]
  },
  {
    path: 'sign-up', 
    component: SignUpComponent,
    canActivate: [UnAuthGuard]
  },
  {
    path: 'halls',
    component: HallsComponent,
    canActivate: [HallManagerGuard]
  },
  {
    path: 'halls/create',
    component: CreateHallComponent,
    canActivate: [HallManagerGuard]
  },
  {
    path: 'halls/:id/edit',
    component: EditHallComponent,
    canActivate: [HallManagerGuard]
  },
  {
    path: 'bookings',
    component: BookingsComponent,
    canActivate: [CustomerGuard]
  },
  {
    path: 'bookings/create',
    component: CreateBookingComponent,
    canActivate: [CustomerGuard]
  },
  {
    path: 'user/profile',
    component: ProfileComponent,
    canActivate: [SimpleAuthGuard]
  },
  {
    path: 'search-halls',
    component: SearchHallComponent,
    canActivate: [CustomerGuard]
  },
  {
    path: 'admin/dashboard',
    component: DashboardComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/customers',
    component: ManageCustomersComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/manage-halls',
    component: ManageHallsComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/manage-bookings',
    component: ManageBookingsComponent,
    canActivate: [AdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
