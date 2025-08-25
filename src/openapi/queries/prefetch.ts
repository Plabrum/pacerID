// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { type QueryClient } from "@tanstack/react-query";
import { SystemService } from "../requests/services.gen";
import * as Common from "./common";
export const prefetchUseSystemServiceGetApi = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseSystemServiceGetApiKeyFn(), queryFn: () => SystemService.getApi() });
