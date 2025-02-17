import { findProduct, AddProduct } from '@/services/ProductServices'; 
import apiClient from '@/config/axios'; 

jest.mock('@/config/axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe('findProduct', () => {
  it('should return a product if found', async () => {
    const mockProducts = [
      { barcode: '12345', name: 'Product A' },
      { barcode: '67890', name: 'Product B' },
    ];
    apiClient.get.mockResolvedValueOnce({ data: mockProducts });

    const product = await findProduct('12345');
    expect(product).toEqual({ barcode: '12345', name: 'Product A' });
    expect(apiClient.get).toHaveBeenCalledWith('/products');
  });

  it('should return null if no product is found', async () => {
    apiClient.get.mockResolvedValueOnce({ data: [] });
    const product = await findProduct('99999');
    expect(product).toBeNull();
  });

  it('should return null and log an error if API request fails', async () => {
    console.error = jest.fn();
    apiClient.get.mockRejectedValueOnce(new Error('Network Error'));

    const product = await findProduct('12345');
    expect(product).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Failed to find product', expect.any(Error));
  });
});

describe('AddProduct', () => {
  it('should call API to add a product', async () => {
    const mockData = { barcode: '54321', name: 'New Product' };
    apiClient.post.mockResolvedValueOnce({});

    await AddProduct(mockData);
    expect(apiClient.post).toHaveBeenCalledWith('/products', mockData);
  });

  it('should log an error if API request fails', async () => {
    console.error = jest.fn();
    apiClient.post.mockRejectedValueOnce(new Error('Failed to add product'));

    await AddProduct({ barcode: '54321', name: 'New Product' });
    expect(console.error).toHaveBeenCalledWith('Failed to insert product', expect.any(Error));
  });
});
