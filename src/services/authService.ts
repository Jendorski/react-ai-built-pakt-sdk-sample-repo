import {
  PaktSDK,
  PaktConfig,
  RegisterPayload,
  Status,
  ResponseDto,
  RegisterDto,
  ResetPasswordPayload,
  ResetDto,
  ValidatePasswordToken,
  ChangeAuthenticationPasswordPayload,
  ChangePasswordDto,
  GoogleOAuthGenerateDto,
  GoogleOAuthValdatePayload,
  GoogleOAuthValidateDto,
  IUser,
} from 'pakt-sdk'

// interface PaktConfig {
//   verbose: boolean
// }

interface RegisterData {
  email: string
  password: string
  fullName: string
}

export class AuthService {
  private static sdk: PaktSDK

  static async initializeSDK(): Promise<void> {
    const configData: PaktConfig = {
      baseUrl: 'http://localhost:9000',
      verbose: true,
    }

    try {
      this.sdk = await PaktSDK.init(configData)
    } catch (error) {
      console.error('Failed to initialize PAKT SDK:', error)
      throw new Error('Failed to initialize PAKT SDK')
    }
  }

  static async login(email: string, password: string): Promise<any> {
    if (!this.sdk) {
      await this.initializeSDK()
    }

    try {
      const loginData = {
        email,
        password,
      }

      const response = await this.sdk.auth.login(loginData)

      if (response.status) {
        localStorage.setItem('pakt_token', response.data.token)
        return response.data
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  static async register(
    userData: RegisterData
  ): Promise<{ tempToken: string }> {
    if (!this.sdk) {
      await this.initializeSDK()
    }

    try {
      const registerData: RegisterPayload = {
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.password,
        firstName: userData.fullName,
      }

      const response: ResponseDto<RegisterDto> = await this.sdk.auth.register(
        registerData
      )
      console.log({ response })

      if (response.status === Status.SUCCESS) {
        return {
          tempToken: response.data.token,
        }
      } else {
        throw new Error(response.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  static async verifyAccount(tempToken: string, token: string): Promise<any> {
    if (!this.sdk) {
      await this.initializeSDK()
    }

    try {
      const response = await this.sdk.auth.verifyAccount({ tempToken, token })

      if (response.status === Status.SUCCESS) {
        return response.data
      } else {
        throw new Error(response.message || 'Email verification failed')
      }
    } catch (error) {
      console.error('Email verification error:', error)
      throw error
    }
  }

  static async resetPassword(
    email: string
  ): Promise<{ tempToken: string; expiresIn: number }> {
    if (!this.sdk) {
      await this.initializeSDK()
    }

    try {
      const payload: ResetPasswordPayload = { email }
      const response: ResponseDto<ResetDto> = await this.sdk.auth.resetPassword(
        payload
      )

      if (response.status === Status.SUCCESS) {
        return {
          tempToken: response.data.tempToken.token,
          expiresIn: response.data.tempToken.expiresIn,
        }
      } else {
        throw new Error(response.message || 'Password reset failed')
      }
    } catch (error) {
      console.error('Password reset error:', error)
      throw error
    }
  }

  static async validatePasswordToken(
    token: string,
    tempToken: string
  ): Promise<void> {
    if (!this.sdk) {
      await this.initializeSDK()
    }

    try {
      const response: ResponseDto<ValidatePasswordToken> =
        await this.sdk.auth.validatePasswordToken({ token, tempToken })

      if (response.status !== Status.SUCCESS) {
        throw new Error(response.message || 'Token validation failed')
      }
    } catch (error) {
      console.error('Token validation error:', error)
      throw error
    }
  }

  static async changePassword(
    token: string,
    tempToken: string,
    password: string
  ): Promise<void> {
    if (!this.sdk) {
      await this.initializeSDK()
    }

    try {
      const payload: ChangeAuthenticationPasswordPayload = {
        token,
        tempToken,
        password,
      }
      const response: ResponseDto<ChangePasswordDto> =
        await this.sdk.auth.changePassword(payload)

      if (response.status !== Status.SUCCESS) {
        throw new Error(response.message || 'Password change failed')
      }
    } catch (error) {
      console.error('Password change error:', error)
      throw error
    }
  }

  static async googleOAuthGenerateState(): Promise<{
    googleAuthUrl: string
    state: string
  }> {
    if (!this.sdk) {
      await this.initializeSDK()
    }

    try {
      const response: ResponseDto<GoogleOAuthGenerateDto> =
        await this.sdk.auth.googleOAuthGenerateState()

      if (response.status === Status.SUCCESS) {
        return {
          googleAuthUrl: response.data.googleAuthUrl,
          state: response.data.state,
        }
      } else {
        throw new Error(
          response.message || 'Failed to generate Google OAuth state'
        )
      }
    } catch (error) {
      console.error('Google OAuth generate state error:', error)
      throw error
    }
  }

  static async googleOAuthValidateState(
    state: string,
    code: string
  ): Promise<any> {
    if (!this.sdk) {
      await this.initializeSDK()
    }

    try {
      const payload: GoogleOAuthValdatePayload = { state, code }
      const response: ResponseDto<GoogleOAuthValidateDto> =
        await this.sdk.auth.googleOAuthValidateState(payload)
      console.log({ googleOAuthValidateState: response })

      if (response.status === Status.SUCCESS) {
        localStorage.setItem('pakt_token', response.data.token)
        return response.data
      } else {
        throw new Error(response.message || 'Google OAuth validation failed')
      }
    } catch (error) {
      console.error('Google OAuth validate state error:', error)
      throw error
    }
  }

  static async logout(): Promise<void> {
    localStorage.removeItem('pakt_token')
  }

  static async getUser(): Promise<IUser> {
    if (!this.sdk) {
      await this.initializeSDK()
    }

    try {
      const token = this.getToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response: ResponseDto<IUser> = await this.sdk.account.getUser(token)
      
      if (response.status) {
        return response.data
      } else {
        throw new Error(response.message || 'Failed to get user data')
      }
    } catch (error) {
      console.error('Get user error:', error)
      throw error
    }
  }

  static getToken(): string | null {
    return localStorage.getItem('pakt_token')
  }

  isAuthenticated(): boolean {
    return !!AuthService.getToken()
  }
}
