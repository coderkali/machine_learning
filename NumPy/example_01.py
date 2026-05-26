import numpy as np
import time

print(np.__version__)

n = 1_000_000
py_list = list(range(n))
np_array = np.arange(n)

print(len(py_list))
print(len(np_array))

print(py_list[0:5])

print(np_array[0:5])

t1 = time.time()
py_result = [x * 2 for x in py_list]
t2 = time.time()

t3 = time.time()
np_result = np_array * 2
t4 = time.time()


print("List Time ", t2-t1)
print("Numpy time ", t4-t3)


