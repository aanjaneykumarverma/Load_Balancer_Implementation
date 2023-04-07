import numpy as np
a = np.zeros((4, 4))
A = np.zeros((4, 4))
B = np.zeros((4, 4))
result = a
print("Starting the task for Matrix Multiplication of 4 * 4")
for i in range(len(A)):
    for j in range(len(B[0])):
        for k in range(len(B)):
            result[i][j] += A[i][k] * B[k][j]
print(result.tolist())
