import { ApiBase } from '../api-base';
import type { ApiServiceConfig, EntityWithId } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Creates an API service for a feature
 *
 * @param endpoint - API endpoint (e.g., '/posts')
 * @param config - Optional configuration
 * @returns ApiBase instance with CRUD methods
 *
 * @example
 * export const postsApi = createApiService<Post>('/posts');
 *
 * @example
 * export const commentsApi = createApiService<Comment>('/comments', {
 *   transformRequest: (data) => ({ ...data, userId: getCurrentUser() }),
 *   transformResponse: (data) => normalizeDates(data),
 * });
 */
export function createApiService<TEntity extends EntityWithId>(
  endpoint: string,
  config: ApiServiceConfig<TEntity> = {}
): ApiBase<TEntity> {
  const {
    transformRequest,
    transformResponse,
    headers,
  } = config;

  // Extend ApiBase with transforms
  class ApiServiceWithTransforms extends ApiBase<TEntity> {
    constructor() {
      super(endpoint, BASE_URL);
    }

    // Override methods to apply transforms
    async create(data: any): Promise<TEntity> {
      const requestData = transformRequest ? transformRequest(data) : data;
      return super.create(requestData);
    }

    async update(id: string | number, data: any): Promise<TEntity> {
      const requestData = transformRequest ? transformRequest(data) : data;
      return super.update(id, requestData);
    }
  }

  const apiService = new ApiServiceWithTransforms();

  return apiService;
}

/**
 * Creates an API service for a nested resource
 *
 * @example
 * // For /posts/:postId/comments
 * export const postCommentsApi = createNestedApiService<Comment>(
 *   (postId: string) => `/posts/${postId}/comments`
 * );
 */
export function createNestedApiService<TEntity extends EntityWithId>(
  getEndpoint: (params: any) => string,
  config?: ApiServiceConfig<TEntity>
): ApiBase<TEntity> {
  const apiService = new (class extends ApiBase<TEntity> {
    constructor() {
      super('', BASE_URL);
    }

    private getEndpointUrl(params?: any): string {
      const path = getEndpoint(params || {});
      return this.getUrl(path);
    }
  })();

  return apiService;
}

/**
 * Creates an API service with mock data for development
 *
 * @example
 * export const mockPostsApi = createMockApiService<Post>(mockPosts, {
 *   delay: 500,
 * });
 */
export function createMockApiService<TEntity extends EntityWithId>(
  mockData: TEntity[],
  config: { delay?: number; enableMutations?: boolean } = {}
) {
  const { delay = 500, enableMutations = true } = config;
  let data = [...mockData];

  const wait = () => new Promise((resolve) => setTimeout(resolve, delay));

  return {
    async list(params?: any): Promise<{ items: TEntity[]; total: number; page: number; pageSize: number; totalPages: number; hasMore: boolean }> {
      await wait();
      let filtered = [...data];

      // Apply search
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        filtered = filtered.filter((item: any) =>
          JSON.stringify(item).toLowerCase().includes(searchLower)
        );
      }

      // Apply pagination
      const page = params?.page || 1;
      const pageSize = params?.pageSize || 10;
      const total = filtered.length;
      const totalPages = Math.ceil(total / pageSize);
      const startIndex = (page - 1) * pageSize;
      const items = filtered.slice(startIndex, startIndex + pageSize);

      return {
        items,
        total,
        page,
        pageSize,
        totalPages,
        hasMore: page < totalPages,
      };
    },

    async getById(id: string | number): Promise<TEntity> {
      await wait();
      const item = data.find((item) => item.id === id);
      if (!item) throw new Error(`Item with id ${id} not found`);
      return item;
    },

    async create(itemData: any): Promise<TEntity> {
      await wait();
      if (!enableMutations) throw new Error('Mutations disabled');
      const newItem = {
        ...itemData,
        id: Date.now().toString(),
      } as TEntity;
      data.unshift(newItem);
      return newItem;
    },

    async update(id: string | number, itemData: any): Promise<TEntity> {
      await wait();
      if (!enableMutations) throw new Error('Mutations disabled');
      const index = data.findIndex((item) => item.id === id);
      if (index === -1) throw new Error(`Item with id ${id} not found`);
      data[index] = { ...data[index], ...itemData };
      return data[index];
    },

    async delete(id: string | number): Promise<void> {
      await wait();
      if (!enableMutations) throw new Error('Mutations disabled');
      data = data.filter((item) => item.id !== id);
    },

    async deleteMany(ids: (string | number)[]): Promise<void> {
      await wait();
      if (!enableMutations) throw new Error('Mutations disabled');
      data = data.filter((item) => !ids.includes(item.id));
    },
  };
}
