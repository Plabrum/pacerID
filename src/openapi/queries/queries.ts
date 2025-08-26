// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { DevicesService, SystemService } from "../requests/services.gen";
import * as Common from "./common";
export const useSystemServiceGetApiHealth = <TData = Common.SystemServiceGetApiHealthDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSystemServiceGetApiHealthKeyFn(queryKey), queryFn: () => SystemService.getApiHealth() as TData, ...options });
export const useDevicesServicePostApiClassify = <TData = Common.DevicesServicePostApiClassifyMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: { [key: string]: unknown; };
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: { [key: string]: unknown; };
}, TContext>({ mutationFn: ({ requestBody }) => DevicesService.postApiClassify({ requestBody }) as unknown as Promise<TData>, ...options });
