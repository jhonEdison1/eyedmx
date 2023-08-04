import { SetMetadata } from "@nestjs/common";

export const PLAN = "plan";
export const Plan = (plan: string ) => SetMetadata(PLAN, plan);