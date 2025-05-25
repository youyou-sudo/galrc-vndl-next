import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export default function AlertInfoDemo() {
  return (
    <Alert className="border-cyan-600/50 text-cyan-600 dark:border-cyan-600 [&>svg]:text-cyan-600">
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>Important Information</AlertTitle>
      <AlertDescription>
        Make sure to review the recent updates before proceeding.
      </AlertDescription>
    </Alert>
  );
}
