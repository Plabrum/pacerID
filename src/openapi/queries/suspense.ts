// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { UseQueryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { SystemService } from "../requests/services.gen";
import * as Common from "./common";
export const useSystemServiceGetApiSuspense = <TData = Common.SystemServiceGetApiDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSystemServiceGetApiKeyFn(queryKey), queryFn: () => SystemService.getApi() as TData, ...options });
