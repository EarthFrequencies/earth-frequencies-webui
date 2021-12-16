class FrequencyRange {
  lowerFrequency: number
  upperFrequency: number
  constructor (lowerFrequency: number, upperFrequency: number) {
    this.lowerFrequency = lowerFrequency;
    this.upperFrequency = upperFrequency;
  }
}

class AllocationService {
  applications: Array<string>
  category: string
  footnotes: Array<string>
  region: string
  service: string
  subTable: string

  constructor (
    applications: Array<string>,
    category: string,
    footnotes: Array<string>,
    region: string,
    service: string,
    subTable: string) {
    this.applications = applications;
    this.category = category;
    this.footnotes = footnotes;
    this.region = region;
    this.service = service;
    this.subTable = subTable;
  }
}

class Allocation {
  band: FrequencyRange
  service: AllocationService

  constructor (band: FrequencyRange, service: AllocationService) {
    this.band = band;
    this.service = service;
  }
}

class AllocationsTable {
  name: string
  allocations: Array<Allocation>
  metadata: Record<string, string>

  constructor (
    name: string,
    allocations: Array<Allocation>,
    metadata: Record<string, string>
  ) {
    this.name = name;
    this.allocations = allocations;
    this.metadata = metadata;
  }

  static empty (): AllocationsTable {
    return new AllocationsTable('empty', [], {});
  }

  static fromJsonString (jsonString: string): AllocationsTable {
    // TODO (jrmlhermitte): We should add our own
    // validation or some kind of JSON validation.
    // ex: define a method called AllocationsTable.fromJsonObject(...)
    //  and add the validation there.
    const allocations: AllocationsTable = JSON.parse(jsonString);
    return allocations;
  }
}

export { AllocationsTable };
