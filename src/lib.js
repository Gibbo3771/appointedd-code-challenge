import { readFile } from 'fs/promises'
import path from 'path'
import { DateTime } from 'luxon'

export const loadInput = async (filePath) => {
  try {
    return await readFile(path.resolve(__dirname, '..', filePath), 'utf-8')
  } catch (error) {
    throw error
  }
}

export const sortDates = (dates) =>
  dates.sort((tsA, tsB) => tsA.toMillis() - tsB.toMillis())

// Question 1
export const earliestAnyFree = (workers) =>
  sortDates(
    workers.map((worker) => worker.timestamps.map((ts) => ts.start)).flat(1)
  )[0]

// Question 2
export const latestAnyFree = (workers) =>
  sortDates(
    workers.map((worker) => worker.timestamps.map((ts) => ts.end)).flat(1)
  ).reverse()[0]

/**
 * Checks if a and b overlap
 *
 * @param { startId, endId, start, end } a
 * @param { startId, endId, start, end } b
 * @returns a new constructed object with the overlapping dates and the worker ids they came from
 */
export const datesOverlap = (a, b) => {
  const { startId: startIdaA, endId: endIdA, start: startA, end: endA } = a
  const { startId: startIdB, endId: endIdB, start: startB, end: endB } = b
  if (endA < startB || startA > endB) return null
  const isStartABeforeStartB = startA <= startB
  const isEndABeforeEndB = endA <= endB
  return {
    startId: isStartABeforeStartB ? startIdaA : startIdB,
    endId: isEndABeforeEndB ? endIdA : endIdB,
    start: isStartABeforeStartB ? startA : startB,
    end: isEndABeforeEndB ? endA : endB,
  }
}

export const createFlatListOfTimestamps = (workers) => {
  return (
    workers
      .map(({ timestamps, id }) =>
        timestamps.map((ts) => ({
          startId: id,
          endId: id,
          start: ts.start,
          end: ts.end,
        }))
      )
      .flat(1)
      // Sort to get correct output order
      .sort((a, b) => a.start.toMillis() - b.start.toMillis())
  )
}

/**
 * Covers question 3
 * @param {*} timestampsList
 * @returns
 */
export const allOverlappingWorkers = (timestampsList) => {
  const all = timestampsList.reduce((result, tsA, index, originalArray) => {
    for (const tsB of originalArray) {
      if (originalArray.indexOf(tsB) === index) continue
      const overlaps = datesOverlap(tsA, tsB)
      if (!overlaps) continue
      const { startId, endId, start, end } = overlaps

      const existingOverlap = result[start.toUTC()]
      if (existingOverlap) {
        // Prevents existing overlaps from being constantly
        // overwritten despite their end dates not matching the criteria
        if (existingOverlap.end > end)
          result[start.toUTC()] = {
            startId,
            endId,
            start,
            end: existingOverlap.end,
          }
      } else result[start.toUTC()] = overlaps
    }
    return result
  }, {})

  return removeOverlappingExtraWorkers(Object.values(all))
}

/**
 * Removes all overlapping timestamps where more than 2 workers
 * are available (because we don't care about 3+)
 * @param timestampsList an array of timestamps
 * @returns
 */
const removeOverlappingExtraWorkers = (timestampsList) => {
  return timestampsList
    .reduce((result, tsA, index, originalArray) => {
      let toAdd = null
      for (const tsB of originalArray) {
        if (originalArray.indexOf(tsB) === index) continue
        if (tsA.end.toMillis() !== tsB.end.toMillis()) {
          toAdd = tsA
        } else {
          toAdd = tsA.start > tsB.start ? tsA : tsB
        }
      }
      result.push(toAdd)
      return result
    }, [])
    .reduce((obj, ts) => {
      obj[ts.start.toUTC().toISO()] = ts
      return obj
    }, {})
}

export const createTimestamps = (value) =>
  value.split(',').map((pair) => {
    const [start, end] = pair.split('/')
    return { start: DateTime.fromISO(start), end: DateTime.fromISO(end) }
  })
