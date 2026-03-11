---
title: Worker Pool 
difficulty: Easy
tags: [goroutine, concurrency, waitgroup, channels]
---


## Problem Description

Write a Go program that demonstrates a **Worker Pool pattern** using goroutines, channels, and `sync.WaitGroup`.

The program should process multiple jobs concurrently using a fixed number of worker goroutines.

Each worker should:

* Read jobs from a `jobs` channel
* Simulate processing the job
* Send the processed result to a `results` channel

The main function should:

* Create a fixed number of workers
* Send multiple jobs to the workers
* Wait for all workers to complete using `sync.WaitGroup`
* Print the results of each processed job.

## Examples

**Example 1:**

Input: NA

Output:

Job 1 succeeded with output: worker1 processed: task-1
Job 2 succeeded with output: worker2 processed: task-2
Job 3 succeeded with output: worker3 processed: task-3
Job 4 succeeded with output: worker1 processed: task-4
Job 5 succeeded with output: worker2 processed: task-5
...

Explanation:

* A fixed number of workers process jobs concurrently.
* Each worker picks jobs from the `jobChan`.
* Results are sent back through `resultChan`.
* `sync.WaitGroup` ensures the program waits until all workers finish before closing the results channel.

## Constraints

* Number of workers: `1 ≤ workers ≤ 10`
* Number of jobs: `1 ≤ jobs ≤ 100`
* Each job should be processed by **exactly one worker**
* Workers must run concurrently using **goroutines**


## Hint

* Use **goroutines** to start worker functions.
* Use `sync.WaitGroup` to track when workers finish.
* Close the `jobs` channel after sending all jobs.
* Close the `results` channel after all workers finish processing.

Example pattern:

```
go worker(id, jobs, results, &wg)
```

## Learning Objective

By solving this problem, you will learn:

* How to create **multiple goroutines**
* How to coordinate goroutines using **sync.WaitGroup**
* How to use **channels for communication**
* How to implement a simple **Worker Pool pattern**
* How to safely close channels after concurrent processing
