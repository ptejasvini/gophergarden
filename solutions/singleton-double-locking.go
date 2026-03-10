package main

import (
	"fmt"
	"sync"
)

type MutexLogger struct {
}

var lock = &sync.Mutex{}

var mulogInstance *MutexLogger

func GetLoggerInstance() *MutexLogger {
	if mulogInstance == nil {
		lock.Lock()
		defer lock.Unlock()

		if mulogInstance == nil {
			mulogInstance = &MutexLogger{}
			fmt.Println("Mutex Logger instance created")
		}
	}
	return mulogInstance
}

func main() {
	logger1 := GetLoggerInstance()
	logger2 := GetLoggerInstance()

	if logger1 == logger2 {
		fmt.Println("Both instances are the same.")
	} else {
		fmt.Println("Instances are different.")
	}
}
