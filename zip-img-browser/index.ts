import Compressor from "compressorjs";

export const compressorImageAsync = (
  file: File | Blob,
  options: Compressor.Options
): Promise<File> => {
  return new Promise((res, rej) => {
    new Compressor(file, {
      quality: 0.6,
      ...options,
      success(result) {
        options?.success?.(result);
        res(result as File);
      },
      error(err) {
        options?.error?.(err);
        rej(err);
      },
    });
  });
};

const myCompress = async (file: File | Blob) => {
  if (file.type !== "image/jpeg" && file.type !== "image/png") {
    throw new Error("只支持jpg和png格式图片");
  }
  if (file.size < 1024 * 500) {
    // 不压缩
    return file;
  }
  let newFile = file;
  let isNeedMaxCompress = false;
  if (file.size > 1024 * 1024 * 5) {
    newFile = await compressorImageAsync(file, {
      quality: 0.5,
      convertSize: 1024 * 500,
      maxWidth: 1024,
      maxHeight: 1024,
    });
  }
  while (newFile.size > 1024 * 500) {
    console.log('压缩中' ,file.size)
    let tplFile;
    if (isNeedMaxCompress) {
      tplFile = (await compressorImageAsync(newFile, {
        quality: 0.5,
        convertSize: 1024 * 500,
      })) as File;
    } else {
      tplFile = (await compressorImageAsync(newFile, {
        quality: 0.8,
        convertSize: 1024 * 500,
      })) as File;
    }
    if (tplFile.size > newFile.size * 0.9) {
      isNeedMaxCompress = true;
    }
    newFile = tplFile
  }
  return newFile;
};

document.querySelector("#file")?.addEventListener("change", async (e) => {
  console.log("开始压缩");
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const newFile = await myCompress(file);
  console.log(newFile);
  document.querySelector("#result")!.innerHTML = `
  <div>
  <div>原始图片 ${fomatSize(file.size)}</div>
  <img src="${URL.createObjectURL(file)}" id="img" width='300' />
  </div>
  <div>
  <div>压缩后图片 ${fomatSize(newFile.size)}</div>
  <img src="${URL.createObjectURL(newFile)}" id="img" width='300'/>
  </div>
  `;
  console.log("压缩完成");
});
const fomatSize = (size: number) => {
  if (size < 1024) {
    return size + "B";
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + "KB";
  } else {
    return (size / 1024 / 1024).toFixed(2) + "MB";
  }
};
