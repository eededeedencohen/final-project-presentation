import {
  Input,
  Output,
  BlobSource,
  BufferTarget,
  Mp4OutputFormat,
  WebMOutputFormat,
  MP4,
  WEBM,
  MATROSKA,
  EncodedPacketSink,
  EncodedVideoPacketSource,
  EncodedAudioPacketSource,
} from "mediabunny";

/* MediaRecorder של כרום שומר קבצים "לא גמורים": WebM בלי משך ובלי אינדקס
   דילוגים (Cues), ו-MP4 במבנה מפורק (fragmented) שחלק מהנגנים לא קוראים.
   הפונקציה אורזת את ההקלטה מחדש לקובץ שלם ותקני — כמו שממיר וידאו מייצר —
   בהעתקת פקטות בלבד: בלי קידוד מחדש ובלי איבוד איכות.
   kind: "webm" | "mp4" לפי פורמט ההקלטה. */
export default async function normalizeRecording(blob, kind) {
  const input = new Input({
    source: new BlobSource(blob),
    formats: kind === "mp4" ? [MP4] : [WEBM, MATROSKA],
  });
  const output = new Output({
    format:
      kind === "mp4"
        ? new Mp4OutputFormat({ fastStart: "in-memory" })
        : new WebMOutputFormat(),
    target: new BufferTarget(),
  });

  const vTrack = await input.getPrimaryVideoTrack();
  const aTrack = await input.getPrimaryAudioTrack();
  const vSrc = vTrack ? new EncodedVideoPacketSource(vTrack.codec) : null;
  const aSrc = aTrack ? new EncodedAudioPacketSource(aTrack.codec) : null;
  if (vSrc) output.addVideoTrack(vSrc);
  if (aSrc) output.addAudioTrack(aSrc);
  await output.start();

  const copy = async (track, src) => {
    if (!track) return;
    const sink = new EncodedPacketSink(track);
    const decoderConfig = await track.getDecoderConfig();
    let first = true;
    for await (const packet of sink.packets()) {
      await src.add(packet, first ? { decoderConfig } : undefined);
      first = false;
    }
    src.close();
  };
  await copy(vTrack, vSrc);
  await copy(aTrack, aSrc);
  await output.finalize();

  return new Blob([output.target.buffer], {
    type: kind === "mp4" ? "video/mp4" : "video/webm",
  });
}
