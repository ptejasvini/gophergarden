package main

import (
	"fmt"
	"sync"
	"time"
)

type Job struct {
	ID      int
	Payload string
}

type Result struct {
	JobID  int
	Output string
	Err    error
}

func worker(id int, jobs <-chan Job, results chan<- Result, wg *sync.WaitGroup) {
	defer wg.Done()
	for job := range jobs {
		time.Sleep(time.Second * 1)
		results <- Result{JobID: job.ID,
			Output: fmt.Sprintf("worker%d processed: %s", id, job.Payload),
			Err:    nil,
		}
	}
}
func main() {
	noofjobs := 17
	numofworkers := 3

	jobChan := make(chan Job, noofjobs)
	resultChan := make(chan Result, noofjobs)

	var wg sync.WaitGroup

	for w := 1; w <= numofworkers; w++ {
		wg.Add(1)
		go worker(w, jobChan, resultChan, &wg)
	}

	for j := 1; j <= noofjobs; j++ {
		jobChan <- Job{
			ID:      j,
			Payload: fmt.Sprintf("task-%d", j),
		}
	}

	close(jobChan)

	go func() {
		wg.Wait()
		close(resultChan)
	}()

	for r := range resultChan {
		if r.Err != nil {
			fmt.Printf("Job %d failed with error: %v\n", r.JobID, r.Err)
		} else {
			fmt.Printf("Job %d succeeded with output: %s\n", r.JobID, r.Output)
		}
	}

}
