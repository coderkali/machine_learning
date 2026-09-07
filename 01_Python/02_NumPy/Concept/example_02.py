import numpy as np
arr1 = np.array([1,2,3,4])

print("1D array : ", arr1)

arr2 = np.array([[1,2,3,4],[5,6,7,8]])

print("2D array : \n", arr2)

arr3 = np.array([[[1,2,3,4],[5,6,7,8]],[[12,6,7,8],[5,13,7,8]]])

print("3D array : \n", arr3)

print("------Array Attributes-----------")

print("Shape ",arr2.shape)
print("Dimensions ",arr2.ndim)
print("Data Type  ",arr2.dtype)
print("Total Elements ",arr2.size)

print("-------------------\n")

print("Creating Special Array ::")

zeros = np.zeros((2,3))

print(zeros)
print("-------------------\n")

ones = np.ones((3,2)) # 2 column and 3 rows

print(ones)
print("-------------------\n")

random_arr = np.random.rand(3,3)

print(random_arr)
print("-------------------\n")

eye = np.eye(3)

print(eye)
print("-------------------\n")

range_arr = np.arange(0,10)

print(range_arr)
print("-------------------\n")


print("-------Indexing and Slicing-----------\n")


arr = np.array([[10,20,30],[40,50,60],[70,80,90]])

print(arr[0,2]) # Individual elements 

print(arr[2])# row access

print(arr[:,1]) # Column access of 1


print("-------Array Operations-----------\n")


a = np.array([1,2,3])
b = np.array([4,5,6])

print("Addition ", a + b)
print("Substraction ", a - b)
print("Multiplication ", a * b)
print("Division ", a / b)
print("Dot Product ", np.dot(a,b))
print("Cross Product ", np.cross(a,b))


print("\n-------Reshaping and Flatteining-----------\n")



arr = np.arange(1,10)
reshaped = arr.reshape(3,3)
flatted = reshaped.flatten()

print(arr)
print("-------------------\n")
print(reshaped)
print("-------------------\n")
print(flatted)
