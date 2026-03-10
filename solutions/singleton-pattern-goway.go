package main

import (
	"fmt"
	"sync"
)

type Logger struct{}

var once sync.Once

var logInstance *Logger

func GetLogger() *Logger {
	once.Do(func() {
		logInstance = &Logger{}
		fmt.Println("Logger instance created.")
	})
	return logInstance
}

func main() {
	logger1 := GetLogger()
	logger2 := GetLogger()

	if logger1 == logger2 {
		println("Both instances are the same.")
	} else {
		println("Instances are different.")
	}
}
