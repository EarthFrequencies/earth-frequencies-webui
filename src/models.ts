// interface FrequencyBand {
//   lf: number;
//   uf: number;
// }

interface FrequencyService {
  desc: string;
  primary: boolean;
  category: string;
  footnotes?: string[];
}

interface FrequencyAllocationBand {
  lf: number,
  uf: number
  services: FrequencyService[];
  footnotes?: string[];
}

interface FrequencyAllocations {
  name: string;
  region: string;
  parentRegion?: string;
  year?: number;
  meta?: Record<string, unknown>;
  allocationBands: FrequencyAllocationBand[];
}

export {
  FrequencyService,
  FrequencyAllocationBand,
  FrequencyAllocations
};
