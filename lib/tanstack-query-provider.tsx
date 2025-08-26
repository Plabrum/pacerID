"use client";

import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OpenAPI } from "@/src/openapi/requests";


OpenAPI.BASE = "";
// You can share this queryClient across your app
export const queryClient = new QueryClient();

export const TanstackQueryProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
