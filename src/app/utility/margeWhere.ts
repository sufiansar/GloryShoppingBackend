export const mergeWhere = (baseWhere: any, queryWhere: any) => {
  if (!queryWhere) return baseWhere;
  if (!baseWhere) return queryWhere;

  return {
    AND: [baseWhere, queryWhere],
  };
};
