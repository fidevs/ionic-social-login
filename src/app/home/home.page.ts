import { Component } from '@angular/core';
import { FacebookLogin } from '@capacitor-community/facebook-login';
import { HttpClient } from '@angular/common/http';

const FACEBOOK_PERMISSIONS = ['email', 'user_birthday', 'user_photos', 'user_gender'];

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  user = null;
  token = null;

  constructor(private http: HttpClient) { }

  async login() {
    console.log("Loging...");
    const result = await FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });
    console.log(`Facebook Login response`);
    console.log({ result });

    if (result.accessToken && result.accessToken.userId) {
      this.token = result.accessToken;
    } else if (result.accessToken && !result.accessToken.userId) {
      this.getCurrentToken();
    } else console.error("Login error");
  }

  async getCurrentToken() {
    const result = await FacebookLogin.getCurrentAccessToken();
    console.log("Current Token response");
    console.log({ result });

    if (result.accessToken) {
      this.token = result.accessToken;
      this.loadUserData();
    } else {
      console.error("Current token error");
    }
  }

  async loadUserData() {
    const url = `https://graph.facebook.com/${this.token.userId}?fields=id,name,picture.width(720),birthday,email&access_token=${this.token.token}`;
    this.http.get(url).subscribe(user => {
      console.log({ user });
      this.user = user;
    });
  }

  logout() {
    console.log("Logout...");
    FacebookLogin.logout().then(() => {
      console.log("Success logout");
      this.token = null;
      this.user = null;
    }).catch(() => console.log("Fail Logout"));
  }

}
