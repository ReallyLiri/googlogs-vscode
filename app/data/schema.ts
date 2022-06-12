import { google } from "@google-cloud/logging/build/protos/protos";
import * as moment from "moment";
import * as objectPath from "object-path";
import ILogEntry = google.logging.v2.ILogEntry;

const OBFUSCATE = false;

const propertyRegexp = new RegExp("(\\.[a-z]+)+", "gis");

export type EntryFormatter = (entry: ILogEntry) => string;

function obfuscate(char: string) {
  let charCode = char.charCodeAt(0);
  if (charCode >= 97 && charCode <= 122) {
    charCode = 97 + (charCode + Math.random() * 26) % 26;
  }
  return String.fromCharCode(charCode);
}

function deserializeTextPayloadIfNeeded(entry: ILogEntry) {
  const {textPayload} = entry;
  if (textPayload && textPayload[0] === "{" && textPayload[textPayload.length - 1] === "}") {
    try {
      entry.textPayload = JSON.parse(textPayload);
    } catch (e) {
      console.debug("failed to parse textPayload", e);
    }
  }
}

export function buildFormatter(schema: string): EntryFormatter {
  let pathToLiteral: [string, string][] = [];
  const matches = schema.match(propertyRegexp);
  matches?.forEach(match => pathToLiteral.push([match.substring(1), match]));

  return (entry: ILogEntry) => {
    deserializeTextPayloadIfNeeded(entry);
    let result = schema;
    for (const [path, literal] of pathToLiteral) {
      const rawValue = objectPath.get(entry, path);
      let stringValue = "";
      if (rawValue) {
        if (typeof rawValue === "string") {
          if (path === "timestamp") {
            stringValue = moment(rawValue as string).format("YYYY-MM-DD HH:mm:ss");
          } else {
            stringValue = rawValue;
          }
        } else if (typeof rawValue === "object" || Array.isArray(rawValue)) {
          stringValue = JSON.stringify(rawValue);
        } else {
          stringValue = rawValue.toString();
        }
      }
      if (OBFUSCATE) {
        // for recording purposes
        stringValue = stringValue.split("").map(c => obfuscate(c)).join("");
      }
      result = result.replace(literal, stringValue);
    }
    return result.trim();
  };
}
