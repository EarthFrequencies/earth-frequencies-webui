interface FrequencyRange {
  lowerFrequency: number
  upperFrequency: number
}

interface AllocationService {
  applications: Array<string>
  category: string
  footnotes: Array<string>
  region: string
  service: string
  subTable: string
}

interface Allocation {
  band: FrequencyRange
  service: AllocationService
}

// TODO (jrmlhermitte): find more shorthand way for defining this
//  constructor.
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
