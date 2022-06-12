import { google } from "@google-cloud/logging/build/protos/protos";
import ILogEntry = google.logging.v2.ILogEntry;

export type ILogEntryWithCount = ILogEntry & { count?: number };

export const dedupIfNeeded = (entries: ILogEntry[], dedup: boolean): ILogEntryWithCount[] => {
  if (!dedup) {
    return entries;
  }
  const LIMIT = 1024;
  const limit = (text: string | null | undefined) => text?.slice(0, LIMIT) ?? "";
  const observed = new Map<string, ILogEntryWithCount>();
  return entries.map(entry => ({...entry, count: 1})).filter(entry => {
    const {jsonPayload, textPayload} = entry;
    const dedupKey = (jsonPayload ? limit(JSON.stringify(jsonPayload)) : "") + limit(textPayload);
    if (observed.has(dedupKey)) {
      observed.get(dedupKey)!.count!++;
      return false;
    }
    observed.set(dedupKey, entry);
    return true;
  });
};