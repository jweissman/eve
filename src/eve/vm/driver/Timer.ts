export class Timer {
  static measureMillis<T>(instrumentedMethod: () => T): [number, T] {
    const startTime = new Date().getTime()
    const result: T = instrumentedMethod()
    const timeElapsed = new Date().getTime() - startTime
    return [timeElapsed as number, result]
  }
}
