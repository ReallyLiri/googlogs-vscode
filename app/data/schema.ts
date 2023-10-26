import { google } from "@google-cloud/logging/build/protos/protos";
import * as moment from "moment";
import * as objectPath from "object-path";
import ILogEntry = google.logging.v2.ILogEntry;

const OBFUSCATE = false;

const propertyRegexp = new RegExp("(\\.[a-z_-]+)+", "gis");

export interface EntryFormatter {
  asString: (entry: ILogEntry) => string;
  asRecord: (entry: ILogEntry) => Record<string, string>
}

const isObject = (value: any) => typeof value === "object";

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

function formatString(rawValue: any, path: string): string {
  if (!rawValue) {
    return "";
  }
  if (typeof rawValue === "string") {
    return path === "timestamp"
      ? moment(rawValue as string).format("YYYY-MM-DD HH:mm:ss")
      : rawValue;
  } else if (isObject(rawValue) || Array.isArray(rawValue)) {
    return JSON.stringify(rawValue);
  }
  return rawValue.toString();
}

function getStringValue(path: string, entry: ILogEntry) {
  const rawValue = objectPath.get(entry, path);
  let stringValue = formatString(rawValue, path);
  if (OBFUSCATE) {
    // for recording purposes
    stringValue = stringValue.split("").map(c => obfuscate(c)).join("");
  }
  return stringValue;
}

function getRawLogValue(entry: ILogEntry): string {
  if (entry.textPayload) {
    return entry.textPayload;
  }
  return formatString(entry, "");
}

export function buildFormatter(schema: string): EntryFormatter {
  let pathToLiteral: [string, string][] = [];
  const matches = schema.match(propertyRegexp);
  matches?.forEach(match => pathToLiteral.push([match.substring(1), match]));
  const schemaIsEmpty = !schema || schema === "";

  return {
    asString: (entry: ILogEntry) => {
      if (schemaIsEmpty) {
        return getRawLogValue(entry);
      }
      deserializeTextPayloadIfNeeded(entry);
      let result = schema;
      for (const [path, literal] of pathToLiteral) {
        const stringValue = getStringValue(path, entry);
        result = result.replace(literal, stringValue);
      }
      return result.trim();
    },
    asRecord: entry => {
      if (schemaIsEmpty) {
        return {message: getRawLogValue(entry)};
      }
      deserializeTextPayloadIfNeeded(entry);
      let result: Record<string, string> = {};
      for (const [path] of pathToLiteral) {
        const columnName = path.split(".").pop()!;
        if (columnName.toLowerCase() === "mdc") {
          const rawValue = objectPath.get(entry, path);
          if (isObject(rawValue)) {
            Object.keys(rawValue).forEach(key => {
              result[key] = formatString(rawValue[key], key);
            });
            continue;
          }
        }
        result[columnName] = getStringValue(path, entry);
      }
      return result;
    }
  };
}
