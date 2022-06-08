import { DurationUnits, LogFilter } from "../common/filter";

export const DEFAULT_PAGE_SIZE = 100;

export const getDefaultOptions = (projectId: string): Options => ({
  filter: {
    projectId: projectId,
    fromAgo: {value: 1, unit: DurationUnits.hour},
    untilAgo: {value: 0, unit: DurationUnits.none},
    namespaces: ["default"],
  },
  pageSize: DEFAULT_PAGE_SIZE,
  schema: ".timestamp [.severity] .jsonPayload.caller .jsonPayload.mdc - .jsonPayload.message - .jsonPayload.e",
});

export type Options = {
  filter: LogFilter,
  pageSize: number,
  schema: string,
};
