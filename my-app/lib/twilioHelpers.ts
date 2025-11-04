export async function readFormData(req: Request) {
  const text = await req.text();
  const params = new URLSearchParams(text);
  const obj: Record<string,string> = {};
  for (const [k,v] of params.entries()) obj[k] = v;
  return obj;
}
