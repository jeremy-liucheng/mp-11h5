export class SplitVendorChunkCache {
  cache: Map<any, any>;
  constructor() {
    this.cache = new Map();
  }
  reset() {
    this.cache = new Map();
  }
}

export function staticImportedByEntry(
  id: ConcatArray<never>,
  getModuleInfo: (arg0: any) => any,
  cache: {
    has: (arg0: any) => any;
    get: (arg0: any) => any;
    set: (arg0: any, arg1: boolean) => void;
  },
  importStack = <any>[]
) {
  if (cache.has(id)) {
    return !!cache.get(id);
  }
  if (importStack.includes(id)) {
    cache.set(id, false);
    return false;
  }
  const mod = getModuleInfo(id);
  if (!mod) {
    cache.set(id, false);
    return false;
  }
  if (mod.isEntry) {
    cache.set(id, true);
    return true;
  }
  const someImporterIs = mod.importers.some((importer: ConcatArray<never>) =>
    staticImportedByEntry(importer, getModuleInfo, cache, importStack.concat(id))
  );
  cache.set(id, someImporterIs);
  return someImporterIs;
}
