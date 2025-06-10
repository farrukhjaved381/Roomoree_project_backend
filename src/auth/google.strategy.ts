// src/auth/google.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, InternalServerErrorException } from '@nestjs/common'; // Import InternalServerErrorException
import { ConfigService } from '@nestjs/config';

/**
 * GoogleStrategy handles authentication with Google using OAuth 2.0.
 * It extends PassportStrategy and uses the 'google' strategy.
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    // Retrieve environment variables
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');

    // IMPORTANT: Add runtime checks for environment variables
    if (!clientID || !clientSecret) {
      // Throw an error if credentials are not found, indicating a setup issue
      throw new InternalServerErrorException(
        'Google OAuth client ID or client secret not found in environment variables. ' +
        'Please ensure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set in your .env file.'
      );
    }

    super({
      clientID: clientID, // Use the retrieved clientID
      clientSecret: clientSecret, // Use the retrieved clientSecret
      // The URL Google will redirect to after successful authentication
      callbackURL: 'http://localhost:3000/auth/google/redirect',
      // Scopes define what user data we request from Google
      scope: ['email', 'profile'],
      // Specify that the validate callback does NOT receive the request object.
      passReqToCallback: false,
    });
  }

  /**
   * validate is called after Google authenticates the user.
   * It receives the accessToken, refreshToken, user profile, and a done callback.
   *
   * @param accessToken - The access token provided by Google.
   * @param refreshToken - The refresh token provided by Google (may not always be present).
   * @param profile - The user's profile information from Google.
   * @param done - Callback function to signify completion of validation.
   * @returns The validated user object.
   */
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails } = profile;
    // Construct a user object with relevant information from Google profile
    const user = {
      email: emails[0].value, // Assuming email is always present and the first one is primary
      name: name.givenName + ' ' + name.familyName,
      provider: 'google', // Indicate the authentication provider
      accessToken, // Store accessToken if needed for subsequent Google API calls
    };
    // Call done with null for error and the user object for success
    done(null, user);
  }
}
