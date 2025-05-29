"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  umamiConfigGet,
  umamiConfigPut,
} from "@/lib/dashboard/config/UmamiFormAc";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export const umamiFormSchema = z.object({
  key: z.string(),
  scripturl: z.string().url(),
  datawebsiteid: z.string(),
});

export function UmamiCardInput() {
  const [scripturlPatchLoading, setScripturlPatchLoading] = useState(false);
  const [datawebsiteidPatchLoading, setDatawebsiteidPatchLoading] =
    useState(false);

  const { data: umamiConfig } = useQuery({
    queryKey: ["umamiConfig"],
    queryFn: async () => {
      const response = await umamiConfigGet();
      return response;
    },
  });
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof umamiFormSchema>>({
    resolver: zodResolver(umamiFormSchema),
    defaultValues: {
      key: "umami",
      scripturl: "",
      datawebsiteid: "",
    },
  });

  useEffect(() => {
    if (umamiConfig?.data) {
      form.reset({
        scripturl: umamiConfig.data.config.scripturl,
        datawebsiteid: umamiConfig.data.config.datawebsiteid,
      });
    }
  }, [umamiConfig, form]);
  async function onSubmit(values: z.infer<typeof umamiFormSchema>) {
    setSubmitError(null);
    try {
      await umamiConfigPut(values);
    } catch (error) {
      console.error("提交失败:", error);
      setSubmitError("提交失败，请稍后重试");
    }
  } 

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          {/* 隐藏字段 key */}
          <FormField
            control={form.control}
            name="key"
            render={({ field }) => (
              <FormItem>
                <Input {...field} type="hidden" />
              </FormItem>
            )}
          />
          {/* scripturl 输入框 */}
          <FormField
            control={form.control}
            name="scripturl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>统计脚本</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="script.js url"
                      {...field}
                      onBlur={async () => {
                        field.onBlur?.();
                        if (form.formState.dirtyFields.scripturl) {
                          await setScripturlPatchLoading(true);
                          await form.handleSubmit(onSubmit)();
                          await setScripturlPatchLoading(false);
                        }
                      }}
                    />
                    {scripturlPatchLoading && (
                      <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                        <Loader2 className="animate-spin" />
                      </span>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* datawebsiteid 输入框 */}
          <FormField
            control={form.control}
            name="datawebsiteid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>网站 ID</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="data-website-id"
                      {...field}
                      onBlur={async () => {
                        field.onBlur?.();
                        if (form.formState.dirtyFields.datawebsiteid) {
                          await setDatawebsiteidPatchLoading(true);
                          await form.handleSubmit(onSubmit)();
                          await setDatawebsiteidPatchLoading(false);
                        }
                      }}
                    />
                    {datawebsiteidPatchLoading && (
                      <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                        <Loader2 className="animate-spin" />
                      </span>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* 提交错误信息展示 */}
          {submitError && (
            <div className="text-red-600 text-sm">{submitError}</div>
          )}
        </form>
      </Form>
    </div>
  );
}
