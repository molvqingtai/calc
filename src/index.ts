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

type Operator = (
  ...args: number[]
) => (
  process: (number: number) => number
) => (ending: (number: number) => number) => number

const plus: Operator =
  (...args) =>
  process =>
  ending =>
    ending(
      args.reduce((acc, cur, index) =>
        index === 1 ? process(acc) + process(cur) : acc + process(cur)
      )
    )

const minus: Operator =
  (...args) =>
  process =>
  ending =>
    ending(
      args.reduce((acc, cur, index) =>
        index === 1 ? process(acc) - process(cur) : acc - process(cur)
      )
    )

const times: Operator =
  (...args) =>
  process =>
  ending =>
    ending(
      args.reduce((acc, cur, index) =>
        index === 1 ? process(acc) * process(cur) : acc * process(cur)
      )
    )

const divide: Operator =
  (...args) =>
  process =>
  ending =>
    ending(
      args.reduce((acc, cur, index) =>
        index === 1 ? process(acc) / process(cur) : acc / process(cur)
      )
    )
// const power: Operator =
//   (...args) =>
//   (process) =>
//   (ending) =>
//     ending(
//       args.reduce((acc, cur, index) =>
//         index === 1 ? process(acc) ** process(cur) : acc ** process(cur)
//       )
//     )
type Process = (number: number) => (number: number) => number
const process: Process = (factor: number) => (number: number) => {
  return Number.isInteger(number)
    ? number * factor
    : +(number * factor).toPrecision(+number.toString().length - 1)
}

type Ending = (number: number) => (number: number) => number
const ending: Ending = divisor => number => {
  return Number.isInteger(number)
    ? number / divisor
    : +(number / divisor).toPrecision(+number.toString().length - 1)
}

type Handler = (
  Operator: Operator
) => (process: Process) => (ending: Ending) => (...args: number[]) => number
const handler: Handler = Operator => process => ending => {
  return (...args) => {
    const base =
      10 **
      Math.max(
        ...args.map(number => number.toString().split('.')[1]?.length ?? 0)
      )
    return Operator(...args)(process(base))(ending(base))
  }
}

const calc = (symbols: TemplateStringsArray, ...values: number[]): number => {
  const runs = new Map<string, Function>([
    ['+', handler(plus)(process)(ending)],
    ['-', handler(minus)(process)(ending)],
    ['*', handler(times)(process)(ending)],
    ['/', handler(divide)(process)(_ => _ => _)]
    // ['**', handler(power)(process)(ending)]
  ])

  // return runs.get('*')?.(...args) // 35.41, 100
  // return runs.get('-')?.(...args)
  // return runs.get('+')?.(...args)
  // TODO: parse
  return runs.get('+')?.()
}

const res = calc`${0.1}+${0.2}+${0.3}`
console.log(res)

export default calc
