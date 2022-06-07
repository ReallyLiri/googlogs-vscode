import { DurationUnits, LogFilter } from "../common/filter";

export const DEFAULT_PAGE_SIZE = 100;

export const getDefaultOptions = (projectId: string): Options => ({
  filter: {
    projectId: projectId,
    fromAgo: {value: 0, unit: DurationUnits.none},
    untilAgo: {value: 0, unit: DurationUnits.none},
  },
  pageSize: DEFAULT_PAGE_SIZE
});

export type Options = {
  filter: LogFilter,
  pageSize: number
};
