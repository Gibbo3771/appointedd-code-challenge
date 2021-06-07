import { Command } from 'commander/esm.mjs'
const program = new Command()
import inquirer from 'inquirer'
import {
  loadInput,
  earliestAnyFree,
  latestAnyFree,
  allOverlappingWorkers,
  createTimestamps,
  createFlatListOfTimestamps,
} from './lib.js'

program.version('1.0.0')
program.requiredOption('-f, --file <path>', 'You must provide a file path')
program.parse()

export const run = async () => {
  const prompt = async (workers) => {
    try {
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'command',
          message: 'Pick your action',
          choices: [
            { name: 'Earliest available worker (Q1)', value: 'earliest' },
            { name: 'Latest available worker (Q2)', value: 'latest' },
            {
              name: 'At least two workers available (Q3)',
              value: 'atLeastTwo',
            },
            {
              name: 'Just print the answers and stop wasting my time',
              value: 'now',
            },
            {
              name: 'Exit',
              value: 'exit',
            },
          ],
        },
      ])
      switch (answers.command) {
        case 'earliest': {
          const result = earliestAnyFree(workers)
          console.log(
            `--------\n Earliest available: ${result
              .toUTC()
              .toISO()} \n--------`
          )
          return prompt(workers)
        }
        case 'latest': {
          const result = latestAnyFree(workers)
          console.log(
            `--------\n Latest available: ${result.toUTC().toISO()} \n--------`
          )
          return prompt(workers)
        }
        case 'atLeastTwo': {
          const all = allOverlappingWorkers(createFlatListOfTimestamps(workers))
          console.log(
            `--------\n Times where at least to workers are available:\n`
          )
          Object.entries(all).forEach(([_, ts], i) => {
            console.log(
              ` (${i + 1}) ${ts.start.toUTC().toISO()} -> ${ts.end
                .toUTC()
                .toISO()}`
            )
          })
          console.log(`\n--------`)

          return prompt(workers)
        }
        case 'now': {
          console.log('\n')
          const earliest = earliestAnyFree(workers)
          console.log(earliest.toUTC().toISO())
          const latest = latestAnyFree(workers)
          console.log(latest.toUTC().toISO())
          const all = allOverlappingWorkers(createFlatListOfTimestamps(workers))
          Object.entries(all).forEach(([_, ts], i) => {
            console.log(`${ts.start.toUTC().toISO()}/${ts.end.toUTC().toISO()}`)
          })
          console.log('\n')

          return prompt(workers)
        }
        case 'exit': {
          console.log('Bye!')
        }
      }
    } catch (error) {
      if (error.isTtyError) {
        console.log("Couldn't render prompt")
      } else {
        throw error
      }
    }
  }

  try {
    const workers = []
    const input = await loadInput(program.opts().file)
    const data = input.split('\n')
    data.forEach((line) => {
      const regex = new RegExp(/(?<id>\d+)@\[(?<timestamps>.*)]/gm)
      const {
        groups: { id, timestamps },
      } = regex.exec(line)
      const worker = {
        id,
        timestamps: createTimestamps(timestamps),
      }
      workers.push(worker)
    })
    prompt(workers)
  } catch (error) {
    console.log(error)
  }
}
