# Appointedd Code Challenge

This repository contains the solution to the Appointedd code challenge.

## Specification from Appointedd

### Preface

This challenge is designed to allow you to showcase your Javascript programming skills. There are no requirements apart from the fact that you must use Javascript. You are welcome to use any libraries you see fit and any online or offline materials to help you program a solution.

In this challenge you are given a text file containing a number of workers, each with an ID and a random number of ISO 8601 date/time intervals that represents an interval of time where that worker is free. Each worker is separated by a newline.

Please ensure your solution reads the data from a file.

Don’t worry if you can’t create a perfect solution. If you write down any shortcomings of your code or if you describe how you would approach the problem we’ll take that into consideration!

There is no requirement as to how you output your solution. Common methods are a script executable by node.js or an html page that displays the solution when opened works.

### Example

```
1@[2019-12-31T23:45:00.000-03:00/2020-01-01T10:30:00.000+06:00,202 0-01-01T07:15:00.000+07:00/2019-12-31T16:00:00.000-10:00]
```

This is an example of an entry for one worker.

The @ (address) symbol is used as a divider between the worker’s ID and the data representing the intervals of time for that worker.

The characters on the left of the divider will always be numeric and represent the ID of the worker. For this worker their ID is 1.

The characters on the right are the intervals of time that the worker is free.
It is represented as an array that starts with the [ character and ends with the ] character. Each element in the array (if there is more than one) is separated by a comma character. In this example the worker has two intervals of time where they are free.

Each interval of time has a start and an end. Following the ISO 8601 the start date/time of the interval and the end date/time interval are separated by the / character. These intervals are given in a randomised order.

---

## Project setup

The project has been created using minimum Node Version 14.16.1. If you are using nvm you can run `nvm use`.

Once node is setup, install the required packages by using `yarn install`.

### Running the script

Run the script by executing `yarn start -f path/to/your/file` from the root directory of the project.

There two inputs in the `assets` folder that can also be used.

### Running tests

The project has partial test coverage. Run the tests using `yarn test`

&nbsp;

---

## Self retro

The input expects there to be at least two different intervals when outputting an answer to question 3. That means if you have X amount of workers and they all share the same start and end time, the script will simply crash. This is due to the way the `reduce` method compares the array to itself. This could be solved by checking array length early in the process.

Parsed data structure could be better, and typescript would have help me design a more uniform data structure (helps me with visualizing).

The two functions that answer question 3 have zero unit testing. I got so focused on a solution I lost track of it.

I could have spent more time refining the regex to capture repeating groups for the timestamp portion of the string.

I had quite a bit of trouble with question 3, mainly around the overlaps overwriting each other (swapping 1:30 for 2:00 for example) mid iteration. I should have sought some advice, or bounced my solution off someone rather than spend hours staring at the same code and expecting different results every time I run it
