import {
  PaktSDK,
  PaktConfig,
  Status,
  ResponseDto,
  filterCollectionStoreDto,
  FindCollectionStoreDto,
  ICollectionStoreDto,
  CreateCollectionStoreDto,
  UpdateCollectionStoreDto,
} from 'pakt-sdk';

export class CollectionStoreService {
  private static sdk: PaktSDK;

  static async initializeSDK(): Promise<void> {
    const configData: PaktConfig = {
      baseUrl: 'http://localhost:9000',
      accessToken: "",
      verbose: true,
    };

    try {
      this.sdk = await PaktSDK.init(configData);
    } catch (error) {
      console.error('Failed to initialize PAKT SDK:', error);
      throw new Error('Failed to initialize PAKT SDK');
    }
  }

  static getToken(): string {
    const token = localStorage.getItem('pakt_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return token;
  }

  static async getAll(schemaReference: string, filter?: filterCollectionStoreDto): Promise<FindCollectionStoreDto> {
    if (!this.sdk) {
      await this.initializeSDK();
    }

    try {
      const token = this.getToken();
      const response: ResponseDto<FindCollectionStoreDto> = await this.sdk.collectionStore.getAll(token, schemaReference, filter);

      if (response.status === Status.SUCCESS) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch collection store items');
      }
    } catch (error) {
      console.error('Get all collection store items error:', error);
      throw error;
    }
  }

  static async getById(schemaReference: string, id: string): Promise<ICollectionStoreDto> {
    if (!this.sdk) {
      await this.initializeSDK();
    }

    try {
      const token = this.getToken();
      const response: ResponseDto<ICollectionStoreDto> = await this.sdk.collectionStore.getById(token, schemaReference, id);

      if (response.status === Status.SUCCESS) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch collection store item');
      }
    } catch (error) {
      console.error('Get collection store item by id error:', error);
      throw error;
    }
  }

  static async getCount(schemaReference: string, filter?: filterCollectionStoreDto): Promise<number> {
    if (!this.sdk) {
      await this.initializeSDK();
    }

    try {
      const token = this.getToken();
      const response: ResponseDto<number> = await this.sdk.collectionStore.getCount(token, schemaReference, filter);

      if (response.status === Status.SUCCESS) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch collection store count');
      }
    } catch (error) {
      console.error('Get collection store count error:', error);
      throw error;
    }
  }

  static async create(schemaReference: string, payload: CreateCollectionStoreDto): Promise<ICollectionStoreDto> {
    if (!this.sdk) {
      await this.initializeSDK();
    }

    try {
      const token = this.getToken();
      const response: ResponseDto<ICollectionStoreDto> = await this.sdk.collectionStore.create(token, schemaReference, payload);

      if (response.status === Status.SUCCESS) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create collection store item');
      }
    } catch (error) {
      console.error('Create collection store item error:', error);
      throw error;
    }
  }

  static async update(schemaReference: string, id: string, payload: UpdateCollectionStoreDto): Promise<ICollectionStoreDto> {
    if (!this.sdk) {
      await this.initializeSDK();
    }

    try {
      const token = this.getToken();
      const response: ResponseDto<ICollectionStoreDto> = await this.sdk.collectionStore.update(token, schemaReference, id, payload);

      if (response.status === Status.SUCCESS) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update collection store item');
      }
    } catch (error) {
      console.error('Update collection store item error:', error);
      throw error;
    }
  }

  static async delete(schemaReference: string, id: string): Promise<void> {
    if (!this.sdk) {
      await this.initializeSDK();
    }

    try {
      const token = this.getToken();
      const response: ResponseDto<{}> = await this.sdk.collectionStore.delete(token, schemaReference, id);

      if (response.status !== Status.SUCCESS) {
        throw new Error(response.message || 'Failed to delete collection store item');
      }
    } catch (error) {
      console.error('Delete collection store item error:', error);
      throw error;
    }
  }
}
