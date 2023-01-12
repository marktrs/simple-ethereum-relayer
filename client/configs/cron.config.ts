import dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({
  path: resolve(process.cwd(), ".env"),
});

export interface ICronConfig {
  jobSchedule: string;
}

export const cronConfig: ICronConfig = {
  jobSchedule: process.env.JOB_SCHEDULE || "* * * * * *",
};
