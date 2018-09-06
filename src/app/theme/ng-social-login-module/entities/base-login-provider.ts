import { LoginProvider } from './login-provider';
import { LoginProviderClass, SocialUser } from './user';

export abstract class BaseLoginProvider implements LoginProvider {
  public abstract isInitialize: boolean;

  constructor() {
    //
  }

  public abstract initialize(): Promise<SocialUser>;

  public abstract signIn(): Promise<SocialUser>;

  public abstract signOut(): Promise<any>;

  public loadScript(obj: LoginProviderClass, onload: any): void {
    if (document.getElementById(obj.name)) {
      return;
    }
    const signInJS = document.createElement('script');
    signInJS.async = true;
    signInJS.src = obj.url;
    signInJS.onload = onload;
    if (obj.name === 'LINKEDIN') {
      signInJS.async = false;
      signInJS.text = ('api_key: ' + obj.id).replace('\'', '');
    }
    document.head.appendChild(signInJS);
  }
}
