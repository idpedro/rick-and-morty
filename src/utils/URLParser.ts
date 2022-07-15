type PageInfo = {
  nextPage: number | null;
  previosPage: number | null;
};

function extractValueOnUrl(url: string) {
  const value = url?.split("?")[1]?.split("=")[1];
  return value ?? null;
}

export const getPageInfo = (info: any): PageInfo => {
  const nextPage = extractValueOnUrl(info?.next);
  const previosPage = extractValueOnUrl(info.prev);
  return {
    nextPage: nextPage ? Number(nextPage) : null,
    previosPage: previosPage ? Number(previosPage) : null,
  };
};

export const parseParamsToQuery = (params: { [key: string]: any }) => {
  const query = [];
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const value = params[key];
      if (value) query.push(`${key}=${value}`);
    }
  }
  return query.join("&");
};
