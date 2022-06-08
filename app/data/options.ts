import { DurationUnits, LogFilter } from "../common/filter";

export const DEFAULT_PAGE_SIZE = 100;

export const getDefaultOptions = (projectId: string): Options => ({
  filter: {
    projectId: projectId,
    fromAgo: {value: 1, unit: DurationUnits.hour},
    untilAgo: {value: 0, unit: DurationUnits.none},
    namespaces: ["default"],
  },
  pageSize: DEFAULT_PAGE_SIZE
});

export type Options = {
  filter: LogFilter,
  pageSize: number
};
