#!/usr/bin/env python
import numpy as np
from datetime import datetime
a = np.zeros((64, 64))
A = np.zeros((64, 64))
B = np.zeros((64, 64))
result = a
print("Starting the task for Matrix Multiplication of 64 * 64 at",datetime.now())
for i in range(len(A)):
    for j in range(len(B[0])):
        for k in range(len(B)):
            result[i][j] += A[i][k] * B[k][j]
print("Completed the task for Matrix Multiplication of 64 * 64 at",datetime.now())
