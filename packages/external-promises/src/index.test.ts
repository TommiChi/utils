
import { PromiseWithExternalResolve } from './index';

describe('PromiseWithExternalResolve', () => {
  it('resolves with the correct value', async () => {
    const p = new PromiseWithExternalResolve<string>();
    setTimeout(() => p.resolve('test-value'), 10);
    await expect(p).resolves.toBe('test-value');
  });

  it('rejects with the correct error', async () => {
    const p = new PromiseWithExternalResolve<string>();
    setTimeout(() => p.reject(new Error('fail')), 10);
    await expect(p).rejects.toThrow('fail');
  });

  it('calls the callback if provided', async () => {
    let called = false;
    const p = new PromiseWithExternalResolve<string>((resolve) => {
      called = true;
      resolve('callback-value');
    });
    await expect(p).resolves.toBe('callback-value');
    expect(called).toBe(true);
  });
});
