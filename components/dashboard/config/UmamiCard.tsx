import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UmamiCardInput } from "./UmamiCard-Input";

export function UmamiCard() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Umami 配置</CardTitle>
          <CardDescription> Umami </CardDescription>
        </CardHeader>
        <CardContent>
          <UmamiCardInput />
        </CardContent>
      </Card>
    </div>
  );
}
