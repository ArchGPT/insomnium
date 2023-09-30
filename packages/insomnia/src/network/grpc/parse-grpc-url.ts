export const parseGrpcUrl = (grpcUrl: string): { url: string; enableTls: boolean } => {
/**** ><> ↑ --------- Function declaration and parameter typing ->  */
  if (!grpcUrl) {
    return { url: '', enableTls: false };
  }
/**** ><> ↑ --------- Empty input case ->  */
  const lower = grpcUrl.toLowerCase();
/**** ><> ↑ --------- Normalization of input URL ->  */
  if (lower.startsWith('grpc://')) {
    return { url: lower.slice(7), enableTls: false };
  }
/**** ><> ↑ --------- Non-TLS GRPC URL case ->  */
  if (lower.startsWith('grpcs://')) {
    return { url: lower.slice(8), enableTls: true };
  }
/**** ><> ↑ --------- TLS GRPC URL case ->  */
  return { url: lower, enableTls: false };
/**** ><> ↑ --------- Default case (assumption: non-TLS) ->  */
};
/**** ><> ↑ --------- End of function ->  */
