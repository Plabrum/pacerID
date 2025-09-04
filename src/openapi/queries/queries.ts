// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { DefaultService, SystemService } from "../requests/services.gen";
import { ImageForm } from "../requests/types.gen";
import * as Common from "./common";
export const useSystemServiceGetApi = <TData = Common.SystemServiceGetApiDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSystemServiceGetApiKeyFn(queryKey), queryFn: () => SystemService.getApi() as TData, ...options });
export const useDefaultServicePostApiClassify = <TData = Common.DefaultServicePostApiClassifyMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  formData: ImageForm;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  formData: ImageForm;
}, TContext>({ mutationFn: ({ formData }) => DefaultService.postApiClassify({ formData }) as unknown as Promise<TData>, ...options });
