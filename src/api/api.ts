import type { Data } from '../types/data-type';

export async function getInfo(): Promise<Data> {
  // const response = await fetch('../data.json');
  const response = await fetch('../data2.json');
  const data = (await response.json()) as Data;

  const currentData = Object.entries(data).filter(([, value]) => 'iso_code' in value);

  return Object.fromEntries(currentData);
}

export const DataPromise = getInfo();
