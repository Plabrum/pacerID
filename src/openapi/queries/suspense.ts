// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { UseQueryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { SystemService } from "../requests/services.gen";
import * as Common from "./common";
export const useSystemServiceGetApiHealthSuspense = <TData = Common.SystemServiceGetApiHealthDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSystemServiceGetApiHealthKeyFn(queryKey), queryFn: () => SystemService.getApiHealth() as TData, ...options });
