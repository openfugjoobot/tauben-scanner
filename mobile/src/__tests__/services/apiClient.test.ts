/**
 * @jest-environment node
 */
import axios from 'axios';

// Mock axios
jest.mock('axios', () => {
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn((onFulfilled) => {
          // Store the interceptor for later use
          (mockAxiosInstance as any)._requestInterceptor = onFulfilled;
          return 0;
        }),
      },
      response: {
        use: jest.fn((onFulfilled, onRejected) => {
          // Store the rejection handler for later use
          (mockAxiosInstance as any)._responseRejectHandler = onRejected;
          return 0;
        }),
      },
    },
    _requestInterceptor: null,
    _responseRejectHandler: null,
  };
  
  return {
    create: jest.fn(() => mockAxiosInstance),
    default: mockAxiosInstance,
    ...mockAxiosInstance,
  };
});

// Mock settings store
jest.mock('../../stores/settings', () => ({
  useSettingsStore: {
    getState: jest.fn(() => ({
      apiUrl: 'http://test-api.com',
      apiKey: 'test-key',
    })),
  },
}));

import { apiClient } from '../../services/api/apiClient';

describe('ApiClient', () => {
  let axiosInstance: any;

  beforeEach(() => {
    jest.clearAllMocks();
    axiosInstance = axios.create();
  });

  describe('Request Interceptor', () => {
    it('should add base URL and authorization header', async () => {
      const config = { headers: {} };
      
      // Call the request interceptor
      const modifiedConfig = await (axiosInstance as any)._requestInterceptor(config);
      
      expect(modifiedConfig.baseURL).toBe('http://test-api.com');
      expect(modifiedConfig.headers.Authorization).toBe('Bearer test-key');
    });

    it('should work without API key', async () => {
      // Mock settings without API key
      jest.requireMock('../../stores/settings').useSettingsStore.getState = jest.fn(() => ({
        apiUrl: 'http://test-api.com',
        apiKey: null,
      }));
      
      const config = { headers: {} };
      const modifiedConfig = await (axiosInstance as any)._requestInterceptor(config);
      
      expect(modifiedConfig.headers.Authorization).toBeUndefined();
    });
  });

  describe('Error Handling', () => {
    it('should normalize 400 error to VALIDATION_ERROR', async () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Invalid data' },
        },
        message: 'Request failed',
      };
      
      const rejectHandler = (axiosInstance as any)._responseRejectHandler;
      
      await expect(rejectHandler(error)).rejects.toEqual({
        code: 'VALIDATION_ERROR',
        message: 'Invalid data',
        status: 400,
      });
    });

    it('should normalize 401 error to UNAUTHORIZED', async () => {
      const error = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
        message: 'Request failed',
      };
      
      const rejectHandler = (axiosInstance as any)._responseRejectHandler;
      
      await expect(rejectHandler(error)).rejects.toEqual({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized',
        status: 401,
      });
    });

    it('should normalize 404 error to NOT_FOUND', async () => {
      const error = {
        response: {
          status: 404,
          data: {},
        },
        message: 'Not found',
      };
      
      const rejectHandler = (axiosInstance as any)._responseRejectHandler;
      
      await expect(rejectHandler(error)).rejects.toEqual({
        code: 'NOT_FOUND',
        message: 'Not found',
        status: 404,
      });
    });

    it('should normalize 500 error to SERVER_ERROR', async () => {
      const error = {
        response: {
          status: 500,
          data: { message: 'Internal server error' },
        },
        message: 'Request failed',
      };
      
      const rejectHandler = (axiosInstance as any)._responseRejectHandler;
      
      await expect(rejectHandler(error)).rejects.toEqual({
        code: 'SERVER_ERROR',
        message: 'Internal server error',
        status: 500,
      });
    });

    it('should handle network error', async () => {
      const error = {
        request: {},
        message: 'Network Error',
      };
      
      const rejectHandler = (axiosInstance as any)._responseRejectHandler;
      
      await expect(rejectHandler(error)).rejects.toEqual({
        code: 'NETWORK_ERROR',
        message: 'Netzwerkfehler. Bitte prüfen Sie Ihre Verbindung.',
      });
    });

    it('should handle unknown error', async () => {
      const error = {
        message: 'Something went wrong',
      };
      
      const rejectHandler = (axiosInstance as any)._responseRejectHandler;
      
      await expect(rejectHandler(error)).rejects.toEqual({
        code: 'UNKNOWN_ERROR',
        message: 'Something went wrong',
      });
    });
  });

  describe('HTTP Methods', () => {
    it('should make GET request', async () => {
      const mockData = { id: 1, name: 'Test' };
      axiosInstance.get.mockResolvedValue({ data: mockData });
      
      const result = await apiClient.get('/test');
      
      expect(result).toEqual(mockData);
    });

    it('should make POST request', async () => {
      const mockData = { id: 1, name: 'Created' };
      axiosInstance.post.mockResolvedValue({ data: mockData });
      
      const result = await apiClient.post('/test', { name: 'Created' });
      
      expect(result).toEqual(mockData);
    });

    it('should make PUT request', async () => {
      const mockData = { id: 1, name: 'Updated' };
      axiosInstance.put.mockResolvedValue({ data: mockData });
      
      const result = await apiClient.put('/test/1', { name: 'Updated' });
      
      expect(result).toEqual(mockData);
    });

    it('should make DELETE request', async () => {
      axiosInstance.delete.mockResolvedValue({ data: {} });
      
      const result = await apiClient.delete('/test/1');
      
      expect(result).toEqual({});
    });
  });
});