import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { backendCredentialsInterceptor } from './backend-credentials.interceptor';

describe('backendCredentialsInterceptor', () => {
  let http: HttpClient;
  let requests: HttpTestingController;
  let auth: { sessionGeneration: number; invalidateSession: jasmine.Spy };

  beforeEach(() => {
    auth = { sessionGeneration: 7, invalidateSession: jasmine.createSpy('invalidateSession') };
    TestBed.configureTestingModule({ providers: [
      provideHttpClient(withInterceptors([backendCredentialsInterceptor])), provideHttpClientTesting(),
      { provide: AuthService, useValue: auth }
    ] });
    http = TestBed.inject(HttpClient);
    requests = TestBed.inject(HttpTestingController);
  });
  afterEach(() => requests.verify());

  it('adds credentials only for the exact trusted origin', () => {
    const urls = ['http://localhost:3000/products', 'https://images.example/products', 'http://localhost:3000.evil.example/products', '/assets/image.png'];
    urls.forEach(url => http.get(url).subscribe());
    urls.forEach((url, index) => {
      const req = requests.expectOne(url);
      expect(req.request.withCredentials).toBe(index === 0);
      req.flush({});
    });
  });
  it('clears session on business 401 but not on 403', () => {
    http.get('http://localhost:3000/products').subscribe({ error: () => {} });
    requests.expectOne('http://localhost:3000/products').flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(auth.invalidateSession).toHaveBeenCalledOnceWith(7);
    auth.invalidateSession.calls.reset();
    http.get('http://localhost:3000/products').subscribe({ error: () => {} });
    requests.expectOne('http://localhost:3000/products').flush({}, { status: 403, statusText: 'Forbidden' });
    expect(auth.invalidateSession).not.toHaveBeenCalled();
  });
  it('leaves auth failures to AuthService while sending credentials', () => {
    http.post('http://localhost:3000/auth/login', {}).subscribe({ error: () => {} });
    const req = requests.expectOne('http://localhost:3000/auth/login');
    expect(req.request.withCredentials).toBeTrue();
    req.flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(auth.invalidateSession).not.toHaveBeenCalled();
  });
});
