interface FrequencyBand {
  lower: number;
  upper: number;
}

interface FrequencyAllocation {
  service: string;
  primary: boolean;
  footnotes?: string[];
}

interface FrequencyAllocationBlock {
  band: FrequencyBand;
  allocations: FrequencyAllocation[];
}

interface FrequencyAllocations {
  name: string;
  region: string;
  parentRegion?: string;
  year?: number;
  meta?: Record<string, any>;
  allocationBlocks: FrequencyAllocationBlock[];
}

export {
  FrequencyBand,
  FrequencyAllocation,
  FrequencyAllocationBlock,
  FrequencyAllocations
};
