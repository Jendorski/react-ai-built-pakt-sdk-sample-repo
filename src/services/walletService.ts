import {
  PaktSDK,
  PaktConfig,
  Status,
  ResponseDto,
  IWalletResponseDto,
  ISingleWalletDto,
  IWalletExchangeDto,
  FindTransactionsDto,
  ITransactionDto,
  ITransactionStatsDto,
  ITransactionStatsFormat,
  AggTxns,
} from 'pakt-sdk'

export class WalletService {
  private static sdk: PaktSDK

  static async initializeSDK(): Promise<void> {
    const configData: PaktConfig = {
      baseUrl: 'http://localhost:9000',
      accessToken: "",
      verbose: true,
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

  static async getWallets(): Promise<IWalletResponseDto> {
    if (!this.sdk) {
      await this.initializeSDK()
    }

    try {
      const token = this.getToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response: ResponseDto<IWalletResponseDto> =
        await this.sdk.wallet.getWallets(token)

      if (response.status === Status.SUCCESS) {
        return response.data
      } else {
        throw new Error(response.message || 'Failed to get wallet data')
      }
    } catch (error) {
      console.error('Get wallets error:', error)
      throw error
    }
  }

  static async getSingleWalletById(id: string): Promise<ISingleWalletDto> {
    if (!this.sdk) {
      await this.initializeSDK()
    }

    try {
      const token = this.getToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response: ResponseDto<ISingleWalletDto> =
        await this.sdk.wallet.getSingleWalletById(token, id)

      if (response.status) {
        return response.data
      } else {
        throw new Error(response.message || 'Failed to get wallet data')
      }
    } catch (error) {
      console.error('Get single wallet by ID error:', error)
      throw error
    }
  }

  static async getSingleWalletByCoin(coin: string): Promise<ISingleWalletDto> {
    if (!this.sdk) {
      await this.initializeSDK()
    }

    try {
      const token = this.getToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response: ResponseDto<ISingleWalletDto> =
        await this.sdk.wallet.getSingleWalletByCoin(token, coin)

      if (response.status) {
        return response.data
      } else {
        throw new Error(response.message || 'Failed to get wallet data')
      }
    } catch (error) {
      console.error('Get single wallet by coin error:', error)
      throw error
    }
  }

  static async getExchange(): Promise<IWalletExchangeDto> {
    if (!this.sdk) {
      await this.initializeSDK()
    }

    try {
      const token = this.getToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response: ResponseDto<IWalletExchangeDto> =
        await this.sdk.wallet.getExchange(token)

      if (response.status) {
        return response.data
      } else {
        throw new Error(response.message || 'Failed to get exchange data')
      }
    } catch (error) {
      console.error('Get exchange error:', error)
      throw error
    }
  }

  static async getTransactions(): Promise<FindTransactionsDto> {
    if (!this.sdk) {
      await this.initializeSDK()
    }

    try {
      const token = this.getToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response: ResponseDto<FindTransactionsDto> =
        await this.sdk.wallet.getTransactions(token)

      if (response.status) {
        return response.data
      } else {
        throw new Error(response.message || 'Failed to get transactions data')
      }
    } catch (error) {
      console.error('Get transactions error:', error)
      throw error
    }
  }

  static async getATransaction(id: string): Promise<ITransactionDto> {
    if (!this.sdk) {
      await this.initializeSDK()
    }

    try {
      const token = this.getToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response: ResponseDto<ITransactionDto> =
        await this.sdk.wallet.getATransaction(token, id)

      if (response.status) {
        return response.data
      } else {
        throw new Error(response.message || 'Failed to get transaction data')
      }
    } catch (error) {
      console.error('Get transaction error:', error)
      throw error
    }
  }

  static async getTransactionStats(
    format: ITransactionStatsFormat
  ): Promise<ITransactionStatsDto[]> {
    if (!this.sdk) {
      await this.initializeSDK()
    }

    try {
      const token = this.getToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response: ResponseDto<ITransactionStatsDto[]> =
        await this.sdk.wallet.getTransactionStats(token, format)

      if (response.status) {
        return response.data
      } else {
        throw new Error(
          response.message || 'Failed to get transaction stats data'
        )
      }
    } catch (error) {
      console.error('Get transaction stats error:', error)
      throw error
    }
  }

  static async getAggregateTransactionStats(): Promise<AggTxns[]> {
    if (!this.sdk) {
      await this.initializeSDK()
    }

    try {
      const token = this.getToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response: ResponseDto<AggTxns[]> =
        await this.sdk.wallet.getAggregateTransactionStats(token)

      if (response.status) {
        return response.data
      } else {
        throw new Error(
          response.message || 'Failed to get aggregate transaction stats data'
        )
      }
    } catch (error) {
      console.error('Get aggregate transaction stats error:', error)
      throw error
    }
  }
}
