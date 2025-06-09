import { EndpointItem } from "@/types";

export interface RequestResponseTypes {
  path: any;
  requestId: string;
  name: any;
  details: any;
  method: any;
  map(arg0: (request: any) => { id: any; name: any; method: any; path: any; }): EndpointItem[] | PromiseLike<EndpointItem[]>;
  payload: {
    method: string;
    name: string;
    requestId: any;
    payload: EndpointItem[];
  };
}