export default class ClassTransformUtil {
  static classToStringPlain<TClass>(instance: TClass): string {
    return JSON.stringify({ ...instance })
  }
}
