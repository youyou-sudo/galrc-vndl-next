import { UmamiCard } from "@/components/dashboard/config";
import { umamiConfigGet } from "@/lib/dashboard/config/UmamiFormAc";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default function page() {
  const queryClient = new QueryClient();
  queryClient.prefetchQuery({
    queryKey: ["umamiConfig"],
    queryFn: async () => {
      const response = await umamiConfigGet();
      return response;
    },
  });
  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UmamiCard />
      </HydrationBoundary>
    </div>
  );
}
