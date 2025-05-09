"use client";
import { useState } from "react";
import * as motion from "motion/react-client";
import Image from "next/image";
import "photoswipe/dist/photoswipe.css";
import { Badge } from "@/components/ui/badge";
import SpinnerCircle2 from "@/components/spinner";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsContents,
} from "@/components/animate-ui/radix-tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { duptimes } from "@/prisma/DBClient";
import { useQuery } from "@tanstack/react-query";
import { FileDownloadDialog } from "./file-download-dialog";
import type { FormattedNode } from "../(action)/alistFIleGet";
import type { ScreenshotData } from "@/types/dataClass";
import { ArrowDownToLine, Workflow } from "lucide-react";
import Fancybox from "@/components/image-Fancybox";
import Link from "next/link";

// Path color map to render corresponding icons and labels
const pathColorMap: Record<string, React.ReactNode> = {
  PC: (
    <>
      <Image
        src="/plat/win.svg"
        height={25}
        width={25}
        alt="tyranor"
        loading="lazy"
        className="rounded-md items-center justify-center"
      />
      PC
    </>
  ),
  PSP: (
    <>
      <Image
        src="/plat/psp.svg"
        height={25}
        width={25}
        alt="PSP"
        loading="lazy"
        className="rounded-md items-center justify-center"
      />
      PSP
    </>
  ),
  TY: (
    <>
      <Image
        src="/tyranor.webp"
        height={25}
        width={25}
        alt="tyranor"
        loading="lazy"
        className="rounded-md items-center justify-center"
      />
      Tyranor
    </>
  ),
  KR: (
    <>
      <Image
        src="/Kkirikiri.webp"
        height={25}
        width={25}
        alt="Kkirikiri"
        loading="lazy"
        className="rounded-md items-center justify-center"
      />
      Kkirikiri
    </>
  ),
  双端: (
    <>
      <Workflow />
      双端
    </>
  ),
  APK: (
    <>
      <Image
        src="/plat/and.svg"
        height={25}
        width={25}
        alt="Android"
        loading="lazy"
        className="rounded-md items-center justify-center"
      />
      APK 安装
    </>
  ),
  ONS: (
    <>
      <Image
        src="/ONScripter.webp"
        height={25}
        width={25}
        alt="ONScripter"
        loading="lazy"
        className="rounded-md items-center justify-center"
      />
      ONScripter
    </>
  ),
  NDS: (
    <>
      <Image
        src="/plat/nds.svg"
        height={25}
        width={25}
        alt="NDS"
        loading="lazy"
        className="rounded-md items-center justify-center"
      />
      NDS
    </>
  ),
};

const pathColorMap2: Record<string, string> = {
  unk: "",
  win: "Windows",
  lin: "Linux",
  mac: "Mac OS",
  web: "Website",
  tdo: "3DO",
  ios: "Apple iProduct",
  and: "Android",
  bdp: "Blu-ray Player",
  dos: "DOS",
  dvd: "DVD Player",
  drc: "Dreamcast",
  nes: "Famicom",
  sfc: "Super Famicom",
  fm7: "FM-7",
  fm8: "FM-8",
  fmt: "FM Towns",
  gba: "Game Boy Advance",
  gbc: "Game Boy Color",
  msx: "MSX",
  nds: "Nintendo DS",
  swi: "Nintendo Switch",
  wii: "Nintendo Wii",
  wiu: "Nintendo Wii U",
  n3d: "Nintendo 3DS",
  p88: "PC-88",
  p98: "PC-98",
  pce: "PC Engine",
  pcf: "PC-FX",
  psp: "PlayStation Portable",
  ps1: "PlayStation 1",
  ps2: "PlayStation 2",
  ps3: "PlayStation 3",
  ps4: "PlayStation 4",
  ps5: "PlayStation 5",
  psv: "PlayStation Vita",
  smd: "Sega Mega Drive",
  scd: "Sega Mega-CD",
  sat: "Sega Saturn",
  vnd: "VNDS",
  x1s: "Sharp X1",
  x68: "Sharp X68000",
  xb1: "Xbox",
  xb3: "Xbox 360",
  xbo: "Xbox One",
  xxs: "Xbox X/S",
  mob: "mobile",
  oth: "",
};

// 文件列递归组件
interface FileMapProps {
  filelist?: FormattedNode[];
  level?: number;
  pathtmp?: string;
  dlink: string;
  gfpath?: string;
}
const FileMap = ({ filelist, level = 0, pathtmp, dlink }: FileMapProps) => {
  const [selectedFile, setSelectedFile] = useState<
    FormattedNode[] | FormattedNode | undefined
  >(undefined);
  const [onOpen, onOpenChange] = useState(false);

  if (!filelist || filelist.length === 0) return null;

  // 跳过 [vnid-xxx] 层级
  if (
    level === 0 &&
    filelist.length === 1 &&
    filelist[0].is_dir &&
    !pathColorMap[filelist[0].name]
  ) {
    return (
      <FileMap
        filelist={filelist[0].children}
        level={level}
        pathtmp={pathtmp}
        dlink={dlink}
      />
    );
  }

  const handleFileClick = (
    file: FormattedNode[] | FormattedNode | undefined
  ) => {
    setSelectedFile(file);
    onOpenChange(true);
  };

  return (
    <div className="flex flex-col">
      <ul style={{ marginLeft: `${level > 0 ? 25 : 0}px` }}>
        {filelist.map((item, index) => (
          <motion.div
            key={index}
            className="flex flex-col"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.02,
              duration: 0.1,
            }}
          >
            <li>
              {item.compressedFiles === true ? (
                <>
                  <div className="list-disc flex">
                    <button
                      onClick={() => {
                        handleFileClick(item.children);
                      }}
                      className="block truncate cursor-pointer h-6 p-0 underline hover:text-blue-300"
                    >
                      <Badge variant="secondary" className="mr-1">
                        分卷
                      </Badge>
                      {item.name}
                      <span className="inline-flex items-center align-middle">
                        <ArrowDownToLine className="h-4 w-4" />
                      </span>
                    </button>
                  </div>
                </>
              ) : item.is_dir ? (
                <>
                  {pathColorMap[item.name] ? (
                    <>
                      <div className="flex text-2xl font-extrabold gap-1 items-center">
                        {pathColorMap[item.name]}
                      </div>
                      <Separator className="mt-0 mb-1" />
                    </>
                  ) : (
                    <>
                      <p>{item.name}</p>
                      <Separator />
                    </>
                  )}
                  <FileMap
                    filelist={item.children}
                    level={level + 1}
                    pathtmp={pathtmp || "" + "/" + item.name}
                    dlink={dlink}
                  />
                </>
              ) : (
                <>
                  <div className="list-disc flex">
                    <button
                      onClick={() => {
                        handleFileClick(item);
                      }}
                      className="block truncate cursor-pointer h-6 p-0 underline hover:text-blue-300"
                    >
                      {item.name}
                    </button>
                    <span className="inline-flex items-center align-middle">
                      <ArrowDownToLine className="h-4 w-4" />
                    </span>
                  </div>
                </>
              )}
            </li>
          </motion.div>
        ))}
      </ul>

      <FileDownloadDialog
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        data={selectedFile}
        dlink={dlink}
      />
    </div>
  );
};

// 组件
export function Stview({
  filedatas,
  dlink,
}: {
  filedatas: any;
  dlink: string;
}) {
  return (
    <div className="w-full flex flex-col gap-2">
      <FileMap
        filelist={filedatas.children}
        gfpath={filedatas.path}
        dlink={dlink}
      />
    </div>
  );
}

export default function Datalistview({
  filedatas,
  vid,
  dlink,
}: {
  filedatas: FormattedNode[] | undefined;
  vid: string;
  dlink: duptimes;
}) {
  const fetcher = async ([url, vid]: [string, string]) => {
    const raw = JSON.stringify({
      filters: ["id", "=", `${vid}`],
      fields:
        "id,screenshots.release.title,screenshots.release.id,screenshots.url,screenshots.dims,screenshots.thumbnail_dims,screenshots.thumbnail,screenshots.release.languages.lang,screenshots.release.platforms",
    });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Host: "api.vndb.org",
      },
      body: raw,
      next: {
        revalidate: 21600,
      },
    });

    const datas = await response.json();

    // Group the VNDB image data by release ID
    const grouped: ScreenshotData = {};
    datas.results.forEach((result: any) => {
      result.screenshots.forEach((screenshot: any) => {
        const releaseId = screenshot.release.id;
        if (!grouped[releaseId]) {
          grouped[releaseId] = [];
        }
        grouped[releaseId].push(screenshot);
      });
    });

    return grouped;
  };

  const { data: vndbImagesData } = useQuery<ScreenshotData>({
    queryKey: ["vnImages", vid],
    queryFn: () => fetcher(["https://api.vndb.org/kana/vn", vid]),
    staleTime: 1000 * 60 * 60,
  });
  const dltap = !!vndbImagesData;

  return (
    <>
      <Tabs className="mt-2" defaultValue="download">
        <TabsList>
          <TabsTrigger value="download">下载</TabsTrigger>
          <TabsTrigger value="phtot">图片</TabsTrigger>
        </TabsList>
        <TabsContents className="mx-1 mb-1 -mt-2 rounded-sm h-full">
          <TabsContent value="download">
            <div className="flex ml-2 flex-col gap-2 mt-2">
              {filedatas ? (
                filedatas.map((item, index) => (
                  <Stview
                    key={index}
                    dlink={dlink.timeVersion}
                    filedatas={item}
                  />
                ))
              ) : (
                <>文件找不到啦～</>
              )}
            </div>
          </TabsContent>
          <TabsContent value="phtot">
            <div>
              {dltap ? (
                <div className="flex flex-col gap-2">
                  {Object.keys(vndbImagesData).map((rid) => {
                    const release = vndbImagesData[rid];
                    const firstItem = release[0]; // 获取当前 releaseId 下的第一项
                    const { title, platforms, languages } = firstItem.release;
                    return (
                      <div key={rid}>
                        <h2 className="flex items-center gap-1 justify-center">
                          {languages.map((languages, index) => (
                            <Image
                              unoptimized
                              key={index}
                              height={20}
                              width={20}
                              alt={languages.lang}
                              src={`/lang/${languages.lang}.png`}
                            />
                          ))}
                          {platforms.map((platform, index) => (
                            <TooltipProvider key={index}>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Image
                                    unoptimized
                                    key={index}
                                    height={20}
                                    width={20}
                                    alt={pathColorMap2[platform]}
                                    src={`/plat/${platform}.svg`}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{pathColorMap2[platform]}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                          {title}
                        </h2>

                        <Fancybox
                          className="grid grid-cols-2 gap-2 max-w-5xl mx-auto sm:grid-cols-4 md:grid-cols-5"
                          options={{
                            Toolbar: {
                              display: {
                                left: ["infobar"],
                                middle: [],
                                right: [
                                  "slideshow",
                                  "download",
                                  "thumbs",
                                  "close",
                                ],
                              },
                            },
                            Thumbs: {
                              type: "modern",
                            },
                          }}
                        >
                          {vndbImagesData[rid].map((screenshot, index) => (
                            <Link
                              data-fancybox="gallery"
                              key={index}
                              href={screenshot.url}
                              data-download-src={screenshot.url}
                            >
                              <Image
                                unoptimized
                                src={screenshot.thumbnail}
                                width={screenshot.thumbnail_dims[0] * 1.8}
                                height={screenshot.thumbnail_dims[1] * 1.8}
                                alt={`游戏图片 ${index}`}
                                className="rounded-lg object-cover hover:opacity-80 transition-opacity border bg-background/50 shadow"
                              />
                            </Link>
                          ))}
                        </Fancybox>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <SpinnerCircle2 />
              )}
            </div>
          </TabsContent>
        </TabsContents>
      </Tabs>
    </>
  );
}
