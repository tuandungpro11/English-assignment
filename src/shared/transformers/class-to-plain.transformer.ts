import { ClassConstructor, instanceToPlain } from 'class-transformer';

export async function transformToPlain<T>(instance: T): Promise<T> {
  return Promise.resolve(instanceToPlain(instance) as T);
}