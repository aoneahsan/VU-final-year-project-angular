// Core Imports
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

// Modules
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

// Packages
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Services
import { AuthInterceptorService } from './interceptors/auth-interceptor.service';

// Components
import { AppComponent } from './app.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HallsComponent } from './components/halls/halls.component';
import { BookingsComponent } from './components/bookings/bookings.component';
import { HallBookingsComponent } from './components/halls/hall-bookings/hall-bookings.component';
import { SearchHallComponent } from './components/search-hall/search-hall.component';
import { BookHallComponent } from './components/book-hall/book-hall.component';
import { CreateBookingComponent } from './components/bookings/create-booking/create-booking.component';
import { CreateHallComponent } from './components/halls/create-hall/create-hall.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { ManageHallsComponent } from './admin-panel/manage-halls/manage-halls.component';
import { ManageCustomersComponent } from './admin-panel/manage-customers/manage-customers.component';
import { DashboardComponent } from './admin-panel/dashboard/dashboard.component';
import { ManageBookingsComponent } from './admin-panel/manage-bookings/manage-bookings.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    LoadingSpinnerComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    HallsComponent,
    BookingsComponent,
    HallBookingsComponent,
    SearchHallComponent,
    BookHallComponent,
    CreateBookingComponent,
    CreateHallComponent,
    ProfileComponent,
    ManageHallsComponent,
    ManageCustomersComponent,
    DashboardComponent,
    ManageBookingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
