
import { APIV1Db, DocsV1Db } from "../../../../../packages/fdr-sdk/src";
import { AlgoliaService } from "./AlgoliaService";
import type { AlgoliaSearchRecord, ConfigSegmentTuple } from "./types";

export class LocalAlgoliaService implements AlgoliaService {
  generateSearchApiKey(_filters: string): string {
    return "";
  }

  async deleteIndexSegmentRecords(_indexSegmentIds: string[]): Promise<void> {
    return;
  }

  async generateSearchRecords(_: {
    docsDefinition: DocsV1Db.DocsDefinitionDb;
    apiDefinitionsById: Record<string, APIV1Db.DbApiDefinition>;
    configSegmentTuples: ConfigSegmentTuple[];
  }): Promise<AlgoliaSearchRecord[]> {
    return [];
  }

  async uploadSearchRecords(_records: AlgoliaSearchRecord[]): Promise<void> {
    return;
  }
}