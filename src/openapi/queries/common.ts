// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { UseQueryResult } from "@tanstack/react-query";
import { DevicesService, SystemService } from "../requests/services.gen";
export type SystemServiceGetApiDefaultResponse = Awaited<ReturnType<typeof SystemService.getApi>>;
export type SystemServiceGetApiQueryResult<TData = SystemServiceGetApiDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSystemServiceGetApiKey = "SystemServiceGetApi";
export const UseSystemServiceGetApiKeyFn = (queryKey?: Array<unknown>) => [useSystemServiceGetApiKey, ...(queryKey ?? [])];
export type DevicesServicePostApiClassifyMutationResult = Awaited<ReturnType<typeof DevicesService.postApiClassify>>;
