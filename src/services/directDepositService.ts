import {
  PaktSDK,
  PaktConfig,
  ResponseDto,
  ICreateDirectDepositPayload,
  ICreateDirectDepositResponse,
  IValidateDirectDepositPayload,
  IValidateDirectDepositResponse,
  IBlockchainCoin,
  IRPCServer,
  Status,
} from 'pakt-sdk'

interface CreateDirectDepositData {
  collectionType: string
  amount: number
  coin: string
  name: string
  description: string
  owner: string
}

interface ValidateDirectDepositData {
  collection: string
  method?: 'stripe' | 'crypto'
  status?: string
  owner?: string
  meta?: Record<string, any>
  release?: boolean
}

export class DirectDepositService {
  private static sdk: PaktSDK

  static async initializeSDK(): Promise<void> {
    const configData: PaktConfig = {
      baseUrl: 'http://localhost:9000',
accessToken: "",      verbose: true,
    }

    try {
      this.sdk = await PaktSDK.init(configData)
    } catch (error) {
      console.error('Failed to initialize PAKT SDK:', error)
      throw new Error('Failed to initialize PAKT SDK')
    }
  }

  private static getToken(): string | null {
    return localStorage.getItem('pakt_token')
  }

  static async createDirectDeposit(
    depositData: CreateDirectDepositData
  ): Promise<ICreateDirectDepositResponse> {
    if (!this.sdk) {
      await this.initializeSDK()
    }

    const token = this.getToken()
    if (!token) {
      throw new Error('Authentication token required')
    }

    try {
      const payload: ICreateDirectDepositPayload = {
        collectionType: 'payments',
        amount: depositData.amount,
        coin: depositData.coin,
        name: depositData.name,
        description: depositData.description,
        owner: depositData.owner,
      }

      const response: ResponseDto<ICreateDirectDepositResponse> =
        await this.sdk.directDeposit.createDirectDeposit({
          authToken: token,
          payload,
        })

      if (response.status === Status.SUCCESS) {
        return response.data
      } else {
        throw new Error(response.message || 'Failed to create direct deposit')
      }
    } catch (error) {
      console.error('Create direct deposit error:', error)
      throw error
    }
  }

  static async validateDirectDeposit(
    validationData: ValidateDirectDepositData
  ): Promise<IValidateDirectDepositResponse> {
    if (!this.sdk) {
      await this.initializeSDK()
    }

    const token = this.getToken()
    if (!token) {
      throw new Error('Authentication token required')
    }

    try {
      const payload: IValidateDirectDepositPayload = {
        collection: validationData.collection,
        method: validationData.method,
        status: validationData.status,
        owner: validationData.owner,
        meta: validationData.meta,
      }

      const response: ResponseDto<IValidateDirectDepositResponse> =
        await this.sdk.directDeposit.validateDirectDeposit({
          authToken: token,
          payload,
        })

      if (response.status === Status.SUCCESS) {
        return response.data
      } else {
        throw new Error(response.message || 'Failed to validate direct deposit')
      }
    } catch (error) {
      console.error('Validate direct deposit error:', error)
      throw error
    }
  }

  static async fetchPaymentMethods(): Promise<IBlockchainCoin[]> {
    if (!this.sdk) {
      await this.initializeSDK()
    }

    const token = this.getToken()
    if (!token) {
      throw new Error('Authentication token required')
    }

    try {
      const response: ResponseDto<IBlockchainCoin[]> =
        await this.sdk.directDeposit.fetchPaymentMethods(token)

      if (response.status === Status.SUCCESS) {
        return response.data
      } else {
        throw new Error(response.message || 'Failed to fetch payment methods')
      }
    } catch (error) {
      console.error('Fetch payment methods error:', error)
      throw error
    }
  }

  static async fetchActiveRPC(): Promise<IRPCServer> {
    if (!this.sdk) {
      await this.initializeSDK()
    }

    const token = this.getToken()
    if (!token) {
      throw new Error('Authentication token required')
    }

    try {
      const response: ResponseDto<IRPCServer> =
        await this.sdk.directDeposit.fetchActiveRPC(token)

      if (response.status === Status.SUCCESS) {
        return response.data
      } else {
        throw new Error(response.message || 'Failed to fetch active RPC')
      }
    } catch (error) {
      console.error('Fetch active RPC error:', error)
      throw error
    }
  }
}
