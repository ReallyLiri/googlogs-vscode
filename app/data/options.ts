import { DurationUnits, LogFilter } from "../common/filter";

export const getDefaultOptions = (projectId: string): Options => ({
  filter: {
    projectId: projectId,
    fromAgo: {value: 0, unit: DurationUnits.none},
    untilAgo: {value: 0, unit: DurationUnits.none},
  },
  pageSize: 100
});

export type Options = {
  filter: LogFilter,
  pageSize: number
};
