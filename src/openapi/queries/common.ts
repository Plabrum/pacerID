// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { UseQueryResult } from "@tanstack/react-query";
import { DevicesService, SystemService } from "../requests/services.gen";
export type SystemServiceGetApiHealthDefaultResponse = Awaited<ReturnType<typeof SystemService.getApiHealth>>;
export type SystemServiceGetApiHealthQueryResult<TData = SystemServiceGetApiHealthDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSystemServiceGetApiHealthKey = "SystemServiceGetApiHealth";
export const UseSystemServiceGetApiHealthKeyFn = (queryKey?: Array<unknown>) => [useSystemServiceGetApiHealthKey, ...(queryKey ?? [])];
export type DevicesServicePostApiClassifyMutationResult = Awaited<ReturnType<typeof DevicesService.postApiClassify>>;
