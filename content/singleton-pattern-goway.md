---
title: Singleton Logger
difficulty: Easy
tags: [golang, goroutine, design-pattern, singleton]
---

# Singleton Logger

## Problem Description

Implement a **thread-safe Singleton Logger** in Go.

The logger should ensure that **only one instance of the logger exists** throughout the entire application, even when accessed concurrently by multiple goroutines.

You must implement a function:

GetLogger() *Logger

Requirements

- Only one instance of Logger should ever be created.

- Multiple calls to GetLogger() must return the same instance.

- The implementation must be safe for concurrent goroutines.

## Examples
**Example 1 **

Input

logger1 := GetLogger()
logger2 := GetLogger()

Output

Logger initialized
true

Explanation

Both calls return the same logger instance.

** Example 2**

Input

Multiple goroutines calling GetLogger()

Output

Logger initialized

Explanation

Even if multiple goroutines call GetLogger(), the logger must be created only once.

# #Constraints

- Number of goroutines: 1 ≤ g ≤ 1000

- The logger instance must be created exactly once

- The solution must be thread-safe