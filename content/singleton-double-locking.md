---
title: Mutex Logger Singleton
difficulty: Easy
tags: [golang, goroutine, design-pattern, singleton, mutex]
-----------------------------------------------------------

# Mutex Logger Singleton

## Problem Description

Implement a **thread-safe Singleton Logger** in Go using a **Mutex**.

The logger should guarantee that **only one instance of the logger exists** throughout the entire application. Even if multiple goroutines try to access the logger simultaneously, the program must ensure that **only one instance is created**.

You must implement a function:

```go
GetLoggerInstance() *MutexLogger
```

This function should always return the **same instance of `MutexLogger`**.

The implementation should use **`sync.Mutex`** to ensure thread-safe initialization.

 Requirements

* Only **one instance** of `MutexLogger` should ever be created.
* Multiple calls to `GetLoggerInstance()` must return the **same instance**.
* The implementation must be **safe for concurrent goroutines**.
* Use **mutex locking** to prevent race conditions.

---

## Examples

### Example 1

**Input**

```go
logger1 := GetLoggerInstance()
logger2 := GetLoggerInstance()
```

**Output**

```
Mutex Logger instance created
Both instances are the same.
```

**Explanation**

Both calls return the **same logger instance**.

---

### Example 2

**Input**

```
Multiple goroutines calling GetLoggerInstance()
```

**Output**

```
Mutex Logger instance created
```

**Explanation**

Even when multiple goroutines attempt to get the logger instance, the logger should be **created only once**.

---

## Constraints

* Number of goroutines: `1 ≤ g ≤ 1000`
* Logger instance must be **created exactly once**
* The solution must be **thread-safe**

