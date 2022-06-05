import { LogFilter } from "../common/filter";

export const getDefaultOptions = (projectId: string): Options => ({
  filter: {
    projectId: projectId
  },
  pageSize: 100
});

export type Options = {
  filter: LogFilter,
  pageSize: number
};
