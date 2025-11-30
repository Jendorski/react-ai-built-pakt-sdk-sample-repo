import {
  PaktSDK,
  PaktConfig,
  Status,
  ResponseDto,
  filterCollectionDto,
  FindCollectionDto,
  ICollectionDto,
  FindCollectionTypeDto,
  CreateCollectionDto,
  CreateManyCollectionDto,
  UpdateCollectionDto,
  UpdateManyCollectionsDto,
  ICollectionTypeDto,
} from 'pakt-sdk';

export class CollectionService {
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

  static async getAll(filter?: filterCollectionDto): Promise<FindCollectionDto> {
    if (!this.sdk) {
      await this.initializeSDK();
    }

    try {
      const token = this.getToken();
      const response: ResponseDto<FindCollectionDto> = await this.sdk.collection.getAll(token, filter);

      if (response.status === Status.SUCCESS) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch collections');
      }
    } catch (error) {
      console.error('Get all collections error:', error);
      throw error;
    }
  }

  static async getById(id: string): Promise<ICollectionDto> {
    if (!this.sdk) {
      await this.initializeSDK();
    }

    try {
      const token = this.getToken();
      const response: ResponseDto<ICollectionDto> = await this.sdk.collection.getById(token, id);

      if (response.status === Status.SUCCESS) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch collection');
      }
    } catch (error) {
      console.error('Get collection by id error:', error);
      throw error;
    }
  }

  static async getTypes(filter?: filterCollectionDto): Promise<FindCollectionTypeDto> {
    if (!this.sdk) {
      await this.initializeSDK();
    }

    try {
      const token = this.getToken();
      const response: ResponseDto<FindCollectionTypeDto> = await this.sdk.collection.getTypes(token, filter);

      if (response.status === Status.SUCCESS) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch collection types');
      }
    } catch (error) {
      console.error('Get collection types error:', error);
      throw error;
    }
  }

  static async getACollectionType(typeId: string): Promise<ICollectionTypeDto> {
    if (!this.sdk) {
      await this.initializeSDK();
    }

    try {
      const token = this.getToken();
      const response: ResponseDto<ICollectionTypeDto> = await this.sdk.collection.getACollectionType(token, typeId);

      if (response.status === Status.SUCCESS) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch collection type');
      }
    } catch (error) {
      console.error('Get collection type error:', error);
      throw error;
    }
  }

  static async create(payload: CreateCollectionDto): Promise<ICollectionDto> {
    if (!this.sdk) {
      await this.initializeSDK();
    }

    try {
      const token = this.getToken();
      const response: ResponseDto<ICollectionDto> = await this.sdk.collection.create(token, payload);

      if (response.status === Status.SUCCESS) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create collection');
      }
    } catch (error) {
      console.error('Create collection error:', error);
      throw error;
    }
  }

  static async createMany(payload: CreateManyCollectionDto): Promise<ICollectionDto[]> {
    if (!this.sdk) {
      await this.initializeSDK();
    }

    try {
      const token = this.getToken();
      const response: ResponseDto<ICollectionDto[]> = await this.sdk.collection.createMany(token, payload);

      if (response.status === Status.SUCCESS) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create collections');
      }
    } catch (error) {
      console.error('Create many collections error:', error);
      throw error;
    }
  }

  static async update(id: string, payload: UpdateCollectionDto): Promise<void> {
    if (!this.sdk) {
      await this.initializeSDK();
    }

    try {
      const token = this.getToken();
      const response: ResponseDto<{}> = await this.sdk.collection.updateCollection(token, id, payload);

      if (response.status !== Status.SUCCESS) {
        throw new Error(response.message || 'Failed to update collection');
      }
    } catch (error) {
      console.error('Update collection error:', error);
      throw error;
    }
  }

  static async updateMany(payload: UpdateManyCollectionsDto): Promise<void> {
    if (!this.sdk) {
      await this.initializeSDK();
    }

    try {
      const token = this.getToken();
      const response: ResponseDto<{}> = await this.sdk.collection.updateManyCollections(token, payload);

      if (response.status !== Status.SUCCESS) {
        throw new Error(response.message || 'Failed to update collections');
      }
    } catch (error) {
      console.error('Update many collections error:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    if (!this.sdk) {
      await this.initializeSDK();
    }

    try {
      const token = this.getToken();
      const response: ResponseDto<{}> = await this.sdk.collection.deleteACollection(token, id);

      if (response.status !== Status.SUCCESS) {
        throw new Error(response.message || 'Failed to delete collection');
      }
    } catch (error) {
      console.error('Delete collection error:', error);
      throw error;
    }
  }
}
