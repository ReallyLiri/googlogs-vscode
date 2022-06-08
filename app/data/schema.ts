import { google } from "@google-cloud/logging/build/protos/protos";
import * as moment from "moment";
import * as objectPath from "object-path";
import ILogEntry = google.logging.v2.ILogEntry;

const propertyRegexp = new RegExp("(\\.[a-z]+)+", "gis");

export type EntryFormatter = (entry: ILogEntry) => string;

export function buildFormatter(schema: string): EntryFormatter {
  let pathToLiteral: [string, string][] = [];
  const matches = schema.match(propertyRegexp);
  matches?.forEach(match => pathToLiteral.push([match.substring(1), match]));

  return (entry: ILogEntry) => {
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
      result = result.replace(literal, stringValue);
    }
    return result;
  };
}
