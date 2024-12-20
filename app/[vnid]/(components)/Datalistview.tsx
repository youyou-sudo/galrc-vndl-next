"use client";

import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Link,
  Divider,
  Image,
  Skeleton,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { Gamepad, PersonalComputer, Risk, Android } from "grommet-icons";
import { useEffect, useState } from "react";
import { alistListGet } from "../(action)/alistGet";
import * as motion from "motion/react-client";
import { MdOutlinePageview } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Path color map to render corresponding icons and labels
const pathColorMap = {
  PC: (
    <>
      <PersonalComputer />
      PC
    </>
  ),
  PSP: (
    <>
      <Gamepad />
      PSP
    </>
  ),
  TY: (
    <>
      <Image src="/tyranor.webp" width={25} alt="tyranor" loading="lazy" />
      Tyranor
    </>
  ),
  KR: (
    <>
      <Image src="/Kkirikiri.webp" width={25} alt="Kkirikiri" loading="lazy" />
      Kkirikiri
    </>
  ),
  双端: (
    <>
      <Risk />
      双端
    </>
  ),
  APK: (
    <>
      <Android />
      APK 安装
    </>
  ),
  ONS: (
    <>
      <Image
        src="/ONScripter.webp"
        width={25}
        alt="ONScripter"
        loading="lazy"
      />
      ONScripter
    </>
  ),
};

function Modalfun({
  isOpen,
  onOpenChange,
  data,
  dlink,
  gfpath,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data: any;
  dlink?: string;
  gfpath: string;
}) {
  if (!data) return null;

  // Size 转换
  function formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return "0 字节";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["字节", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">文件详情</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-2">
              <p className="text-center text-lg">{data.name}</p>
              <p className="text-center">{formatBytes(Number(data.size))}</p>
            </div>
          </ModalBody>
          <ModalFooter className="flex justify-center gap-4">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              关闭
            </Button>
            <Button asChild>
              <Link
                target="_blank"
                href={`${dlink}/${gfpath}/${data.pathname}?sign=${data.sign}`}
              >
                下载
              </Link>
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}

// 文件列递归组件
const FileMap = ({
  filelist,
  level = 0,
  pathtmp,
  dlink,
  gfpath,
}: {
  filelist: any[];
  level?: number;
  pathtmp?: string;
  dlink?: string;
  gfpath: string;
}) => {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  if (!filelist || filelist.length === 0) return null;

  const handleFileClick = (file: any) => {
    setSelectedFile(file);
    onOpen();
  };

  return (
    <>
      <motion.div
        className="flex flex-col"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
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
                {item.is_dir === true ? (
                  <>
                    {pathColorMap[item.name as keyof typeof pathColorMap] ? (
                      <>
                        <div className="flex text-2xl font-extrabold gap-1 items-center">
                          {pathColorMap[item.name as keyof typeof pathColorMap]}
                        </div>
                        <Separator className="my-2" />
                      </>
                    ) : (
                      <>
                        <p>{item.name}</p>
                        <Divider />
                      </>
                    )}
                    <FileMap
                      filelist={item.filelist}
                      level={level + 1}
                      pathtmp={pathtmp || "" + "/" + item.name}
                      dlink={dlink}
                      gfpath={gfpath}
                    />
                  </>
                ) : (
                  <>
                    <div className="list-disc flex">
                      <Button
                        variant="link"
                        onClick={() => {
                          handleFileClick(item);
                        }}
                        className="block truncate"
                      >
                        {item.name}
                        <span className="inline-flex items-center">
                          <MdOutlinePageview />
                        </span>
                      </Button>
                    </div>
                  </>
                )}
              </li>
            </motion.div>
          ))}
        </ul>
      </motion.div>

      <Modalfun
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        data={selectedFile}
        dlink={dlink}
        gfpath={gfpath}
      />
    </>
  );
};

// 组件
export function Stview({ filedatas }: { filedatas: any }) {
  const [listtest, setListtest] = useState();
  useEffect(() => {
    const listac = async () => {
      if (filedatas) {
        const listtest = await alistListGet(filedatas);
        setListtest(listtest);
      }
    };
    listac();
  }, [filedatas]);
  return (
    <>
      <motion.div
        className="flex flex-col"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {listtest ? (
          <FileMap
            filelist={listtest.data}
            gfpath={filedatas.path}
            dlink={listtest.dlink}
          />
        ) : (
          <div className="w-full flex flex-col gap-2 mt-3">
            <Skeleton className="h-7 w-1/5 rounded-lg" />
            <Skeleton className="h-6 w-3/5 rounded-lg" />
          </div>
        )}
      </motion.div>
    </>
  );
}

export default function Datalistview({ filedatas }: { filedatas: any }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ damping: 1 }}
      >
        <Tabs aria-label="Options" className="mt-3" variant="light">
          <Tab key="download" title="下载">
            <Card>
              <CardBody>
                {filedatas.map((item: any, index) => (
                  <Stview key={index} filedatas={item} />
                ))}
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </motion.div>
    </>
  );
}
