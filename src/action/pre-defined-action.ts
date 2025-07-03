"use server";

import { getAllPredefinedService } from "@/service/pre-defined-service";

interface DataType {
  dataType: {
    id: string;
    name: string;
  };
}

export const getAllPredefinedAction = async (): Promise<DataType[]> => {
  const data = await getAllPredefinedService();
  return data as DataType[];
};