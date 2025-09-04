// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { UseQueryResult } from "@tanstack/react-query";
import { DefaultService, SystemService } from "../requests/services.gen";
export type SystemServiceGetApiDefaultResponse = Awaited<ReturnType<typeof SystemService.getApi>>;
export type SystemServiceGetApiQueryResult<TData = SystemServiceGetApiDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSystemServiceGetApiKey = "SystemServiceGetApi";
export const UseSystemServiceGetApiKeyFn = (queryKey?: Array<unknown>) => [useSystemServiceGetApiKey, ...(queryKey ?? [])];
export type DefaultServicePostApiClassifyMutationResult = Awaited<ReturnType<typeof DefaultService.postApiClassify>>;
