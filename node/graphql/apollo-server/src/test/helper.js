import Rx from 'rxjs'

export function itWithRx(description, fn) {
  return it(description, () => {
    const rstTestScheduler = new Rx.TestScheduler((a, b) => expect(a).toEqual(b))
    const hot = rstTestScheduler.createHotObservable.bind(rstTestScheduler)
    const cold = rstTestScheduler.createColdObservable.bind(rstTestScheduler)
    const expectObservable = rstTestScheduler.expectObservable.bind(rstTestScheduler)
    const expectSubscriptions = rstTestScheduler.expectSubscriptions.bind(rstTestScheduler)
    const result = fn({ rstTestScheduler, hot, cold, expectObservable, expectSubscriptions })
    rstTestScheduler.flush()
    return result
  })
}

export default {}
