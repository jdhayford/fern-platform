/* eslint-disable unused-imports/no-unused-vars */
import { AuthService, OrgIdsResponse } from "./AuthService";



export class LocalAuthServiceImpl implements AuthService {
  orgIds: string[];

  constructor({ orgIds }: { orgIds: string[] }) {
    this.orgIds = orgIds;
  }

async checkUserBelongsToOrg(): Promise<void> {
    return;
}

  async getOrgIdsFromAuthHeader(_authHeader: {
    authHeader: string | undefined;
  }): Promise<OrgIdsResponse> {
    return {
      type: "success",
      orgIds: new Set<string>(this.orgIds),
    };
  }

  checkOrgHasSnippetsApiAccess({
    authHeader,
    orgId,
    failHard,
  }: {
    authHeader: string | undefined;
    orgId: string;
    failHard?: boolean | undefined;
  }): Promise<boolean> {
    return Promise.resolve(false);
  }

  checkOrgHasSnippetTemplateAccess({
    authHeader,
    orgId,
    failHard,
  }: {
    authHeader: string | undefined;
    orgId: string;
    failHard?: boolean | undefined;
  }): Promise<boolean> {
    return Promise.resolve(false);
  }

  async getWorkOSOrganization(_orgId: {
    orgId: string;
  }): Promise<string | undefined> {
    return undefined;
  }
}
