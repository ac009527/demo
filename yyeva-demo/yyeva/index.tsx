import { yyEva as YYEVA } from "yyeva";
import YYEVAType from "yyeva/types/player";
import { MixEvideoOptions } from "yyeva/types/type/mix";
import { forwardRef, useRef, useEffect, useImperativeHandle } from "react";
import { isEmpty } from "lodash";
import React from "react";
interface YyevaProps {
  videoUrl: string;
  options?: MixEvideoOptions;
  onProgress?: (v: number) => void;
  className?: string;
  style: React.CSSProperties;
}

const Yyeva = forwardRef((props: YyevaProps, ref) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const instance = useRef<YYEVAType | null>(null);

  const onProgress = () => {
    const node: HTMLVideoElement = (instance.current as any).video;
    const duration = node.duration;
    const currentTime = node.currentTime;
    let progress = Number(((currentTime / duration) * 100).toFixed(3));
    if (Number.isNaN(progress)) progress = 0;
    props.onProgress && props.onProgress(progress);
  };

  const init = async () => {
    const videoUrl = props.videoUrl;
    const container = boxRef.current;

    const options: MixEvideoOptions = {
      // 'AspectFill' | 'AspectFit' | 'Fill' | 'vertical' | 'horizontal' | 'contain' | 'cover'
      // mode: 'Fill',
      mode: "vertical",
      useMetaData: true,
      loop: true,
      useFrameCache: false,
      useVideoDBCache: false,
      mute: true,
      forceBlob: false,
      showVideo: false,
      showPlayerInfo: true,
      useAccurate: false,
      // 生产模式只能off 不然会error
      logLevel: "off",
      renderType: "webgl",
      hevcUrl: undefined,
      alphaDirection: "right",
      videoUrl,
      container: container as HTMLDivElement,
      endPause: true,
      ...props.options,
    };

    // @ts-ignore
    instance.current = await YYEVA(options);

    const node: HTMLVideoElement = (instance.current as any).video;
    node && props.onProgress && node.addEventListener("timeupdate", onProgress);
    node && props.onProgress && node.addEventListener("play", onProgress);
    node && props.onProgress && node.addEventListener("playing", onProgress);
    node &&
      props.onProgress &&
      node.addEventListener("loadedmetadata", onProgress);
    // node && node.addEventListener('pause', onProgress);
    // node && node.addEventListener('ended', onProgress);
  };

  useImperativeHandle(ref, () => ({
    instance,
  }));

  useEffect(() => {
    boxRef.current && !isEmpty(props.videoUrl) && !instance.current && init();

    return () => {
      instance.current && instance.current.destroy();
      instance.current = null;
    };
  }, [props.videoUrl]);
  return (
    <div className={props.className} ref={boxRef} style={props.style}></div>
  );
});

export default Yyeva;
