import {
  PaktSDK,
  PaktConfig,
  Status,
  ResponseDto,
  filterCollectionSchemaDto,
  FindCollectionSchemaDto,
  ICollectionSchemaDto,
  CreateCollectionSchemaDto,
  UpdateCollectionSchemaDto,
} from 'pakt-sdk';

export class CollectionSchemaService {
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

  static async getAll(filter?: filterCollectionSchemaDto): Promise<FindCollectionSchemaDto> {
    if (!this.sdk) {
      await this.initializeSDK();
    }

    try {
      const token = this.getToken();
      // Accessing collectionSchema via the SDK instance
      const response: ResponseDto<FindCollectionSchemaDto> = await this.sdk.collectionSchema.getAll(token, filter);

      if (response.status === Status.SUCCESS) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch collection schemas');
      }
    } catch (error) {
      console.error('Get all collection schemas error:', error);
      throw error;
    }
  }

  static async getById(id: string): Promise<ICollectionSchemaDto> {
    if (!this.sdk) {
      await this.initializeSDK();
    }

    try {
      const token = this.getToken();
      const response: ResponseDto<ICollectionSchemaDto> = await this.sdk.collectionSchema.getById(token, id);

      if (response.status === Status.SUCCESS) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch collection schema');
      }
    } catch (error) {
      console.error('Get collection schema by id error:', error);
      throw error;
    }
  }

  static async create(payload: CreateCollectionSchemaDto): Promise<ICollectionSchemaDto> {
    if (!this.sdk) {
      await this.initializeSDK();
    }

    try {
      const response: ResponseDto<ICollectionSchemaDto> = await this.sdk.collectionSchema.create( payload);

      if (response.status === Status.SUCCESS) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create collection schema');
      }
    } catch (error) {
      console.error('Create collection schema error:', error);
      throw error;
    }
  }

  static async update(id: string, payload: UpdateCollectionSchemaDto): Promise<ICollectionSchemaDto> {
    if (!this.sdk) {
      await this.initializeSDK();
    }

    try {
      const response: ResponseDto<ICollectionSchemaDto> = await this.sdk.collectionSchema.update( id, payload);

      if (response.status === Status.SUCCESS) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update collection schema');
      }
    } catch (error) {
      console.error('Update collection schema error:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    if (!this.sdk) {
      await this.initializeSDK();
    }

    try {
      const response: ResponseDto<{}> = await this.sdk.collectionSchema.delete( id);

      if (response.status !== Status.SUCCESS) {
        throw new Error(response.message || 'Failed to delete collection schema');
      }
    } catch (error) {
      console.error('Delete collection schema error:', error);
      throw error;
    }
  }
}
