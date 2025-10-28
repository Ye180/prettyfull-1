export interface FormatResponse<T = any> {
  data: T[] | T;
  message: string;
}

type FormatResponseParameters<T> = {
  data?: FormatResponse<T>['data'];
  message?: FormatResponse['message'];
};

export const formatResponse = <T>({
  data,
  message,
}: FormatResponseParameters<T>): FormatResponse => {
  return { data, message: message as string };
};
