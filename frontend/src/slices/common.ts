import { SerializedError } from "@reduxjs/toolkit";

export type ActionStatus = "idle" | "loading" | "succeeded" | "failed";

export function createInitialState<T>(data: T | T[]) {
  return {
    data,
    status: "idle",
    error: null,
  } as {
    data: T;
    status: ActionStatus;
    error: SerializedError | null;
  };
}