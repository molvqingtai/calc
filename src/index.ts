// const times = (...args: number[], base: number): number => {
//   return args.reduce((acc, cur) => acc * cur)
// }

// const floatBase = (...args: number[]): number => {
//   return (
//     10 **
//     Math.max(
//       ...args.map((number) => number.toString().split('.')[1]?.length ?? 0)
//     )
//   )
// }

// const floatToInt =
//   (number: number) =>
//   (base: number): number =>
//     number * base

type Formula = (
  ...args: number[]
) => (
  process: (number: number) => number
) => (ending: (number: number) => number) => number

const plus: Formula =
  (...args) =>
  (process) =>
  (ending) =>
    ending(
      args.reduce((acc, cur, index) =>
        index === 1 ? process(acc) + process(cur) : acc + process(cur)
      )
    )

const minus: Formula =
  (...args) =>
  (process) =>
  (ending) =>
    ending(
      args.reduce((acc, cur, index) =>
        index === 1 ? process(acc) - process(cur) : acc - process(cur)
      )
    )

const divide: Formula =
  (...args) =>
  (process) =>
  (ending) =>
    ending(
      args.reduce((acc, cur, index) =>
        index === 1 ? process(acc) / process(cur) : acc / process(cur)
      )
    )
const times: Formula =
  (...args) =>
  (process) =>
  (ending) =>
    ending(
      args.reduce((acc, cur, index) =>
        index === 1 ? process(acc) * process(cur) : acc * process(cur)
      )
    )

type Process = (number: number) => (number: number) => number
const process: Process = (factor: number) => (number: number) => {
  return Number.isInteger(number)
    ? number * factor
    : +(number * factor).toPrecision(number.toString().length - 1)
}

type Ending = (number: number) => (number: number) => number
const ending: Ending = (divisor) => (number) => {
  return Number.isInteger(number)
    ? number / divisor
    : +(number / divisor).toPrecision(number.toString().length - 1)
}

type Handler = (
  formula: Formula
) => (process: Process) => (ending: Ending) => (...args: number[]) => number
const handler: Handler = (formula) => (process) => (ending) => {
  return (...args) => {
    const base =
      10 **
      Math.max(
        ...args.map((number) => number.toString().split('.')[1]?.length ?? 0)
      )
    return formula(...args)(process(base))(ending(base))
  }
}

const calc = (...args: number[]): number => {
  const runs = new Map<string, Function>([
    ['+', handler(plus)(process)(ending)],
    ['-', handler(minus)(process)(ending)],
    ['*', handler(times)(process)(ending)],
    ['/', handler(divide)(process)((_) => (_) => _)]
  ])

  // return runs.get('*')?.(...args) // 35.41, 100
  // return runs.get('-')?.(...args)
  // return runs.get('+')?.(...args)
  return runs.get('/')?.(...args)
}

const res = calc(0.1, 10)
console.log(res)

export default calc
