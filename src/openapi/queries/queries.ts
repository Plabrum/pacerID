// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { DevicesService } from "../requests/services.gen";
import * as Common from "./common";
export const useDevicesServicePostApiClassify = <TData = Common.DevicesServicePostApiClassifyMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: { [key: string]: unknown; };
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: { [key: string]: unknown; };
}, TContext>({ mutationFn: ({ requestBody }) => DevicesService.postApiClassify({ requestBody }) as unknown as Promise<TData>, ...options });
