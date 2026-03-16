import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiBaseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login user', () => {
    service.login('testuser', '1234').subscribe(res => {
      expect(res).toBe('Login successful');
    });

    const req = httpMock.expectOne(
      `${baseUrl}/login?username=testuser&password=1234`
    );

    expect(req.request.method).toBe('GET');
    req.flush('Login successful');
  });

  it('should register user', () => {
    const payload = {
      username: 'newuser',
      password: '1234'
    };

    service.register(payload).subscribe(res => {
      expect(res).toBe('User registered successfully');
    });

    const req = httpMock.expectOne(`${baseUrl}/register`);
    expect(req.request.method).toBe('POST');
    req.flush('User registered successfully');
  });

  it('should reset password', () => {
    service.forgotPassword('testuser', 'newpass').subscribe(res => {
      expect(res).toBe('Password reset successful');
    });

    const req = httpMock.expectOne(
      `${baseUrl}/testuser/forgot?newPassword=newpass`
    );

    expect(req.request.method).toBe('GET');
    req.flush('Password reset successful');
  });
});
