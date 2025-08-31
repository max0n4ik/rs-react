export interface Data {
  [country: string]: CountryInfo;
}

export interface CountryInfo {
  iso_code: string;
  data: CountryData[];
}

export type CountryData = {
  year: number;
  population: number;
  co2: number;
  co2_per_capita: number;
  methane: number;
  oil_co2: number;
};

type SortState = {
  column: keyof CountryData | null;
  order: 'asc' | 'desc';
};

export type NewColumns = {
  oil_co2: boolean;
  methane: boolean;
};

export type Filters = {
  country: string;
  year: number | null;
  sort: SortState;
  newColumns: NewColumns;
};
