import * as fs from 'fs/promises'
import * as path from 'path'
import Sinon from 'sinon'
import {
  createFlatListOfTimestamps,
  datesOverlap,
  earliestAnyFree,
  latestAnyFree,
  loadInput,
  sortDates,
} from '../lib.js'

const testData = [
  { toMillis: () => 300 },
  { toMillis: () => 100 },
  { toMillis: () => 600 },
]

describe('src/lib', () => {
  xit('loadInput', async () => {
    global.__dirname = '.'
    const readFileStub = Sinon.stub(fs, 'readFile').resolves()
    await loadInput('path')
    console.log(readFileStub)
    expect(readFileStub.calledOnce).toBeTruthy()
    expect(true).toBeTruthy()
  })

  test('sortDates', () => {
    const sorted = sortDates(testData).map((ts) => ts.toMillis())
    expect(sorted).toEqual([100, 300, 600])
  })

  test('earliestAnyFree', () => {
    const workers = [
      { timestamps: [{ start: { toMillis: () => 300 } }] },
      { timestamps: [{ start: { toMillis: () => 100 } }] },
      { timestamps: [{ start: { toMillis: () => 600 } }] },
    ]
    expect(earliestAnyFree(workers).toMillis()).toEqual(100)
  })

  test('latestAnyFree', () => {
    const workers = [
      { timestamps: [{ end: { toMillis: () => 900 } }] },
      { timestamps: [{ end: { toMillis: () => 100 } }] },
      { timestamps: [{ end: { toMillis: () => 600 } }] },
    ]
    expect(latestAnyFree(workers).toMillis()).toEqual(900)
  })

  describe('datesOverlap', () => {
    it('returns the overlapping times if dates overlap', () => {
      const a = { start: 10, end: 15 }
      const b = { start: 12, end: 13 }
      const overlap = datesOverlap(a, b)
      expect(overlap).toBeDefined()
      expect(overlap.start).toBe(10)
      expect(overlap.end).toBe(13)
    })
    it('returns null if dates do not overlap', () => {
      const a = { start: 10, end: 15 }
      const b = { start: 16, end: 18 }
      const overlap = datesOverlap(a, b)
      expect(overlap).toBeNull()
    })
  })

  test('createFlatListOfTimestamps', () => {
    const workers = [
      {
        timestamps: [
          { start: { toMillis: () => 400 }, end: { toMillis: () => 900 } },
        ],
      },
      {
        timestamps: [
          { start: { toMillis: () => 400 }, end: { toMillis: () => 900 } },
        ],
      },
    ]
    const result = createFlatListOfTimestamps(workers)
    expect(result.length).toBe(2)
  })
})
