export type UnitItem = {
  id: number;
  name: string;
  display_name: string;
  decimal_places: number;
};

export type Units = {
  count: number;
  next: string | null;
  previous: string | null;
  results: UnitItem[];
};
