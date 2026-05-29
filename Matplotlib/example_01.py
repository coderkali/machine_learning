import numpy as np
import pandas as pd

import matplotlib.pyplot as plt
import matplotlib

print(matplotlib.__version__)


print("\n--------Simple Line Plot-------\n")
x = np.linspace(0,10,50)
y = np.sin(x)

# print(x," :; ",y)

print(x[:5])
print(y[:5])

plt.plot(x,y)
# plt.title("Simple Line Plot")
# plt.xlabel("x- Axis")
# plt.ylabel("y=Sin(x)")
# plt.show()


plt.figure(figsize=(7,4))
plt.plot(x,y,color="red", linestyle="--", marker="o" ,label="sin(x)")
plt.title("Customizeed Line Port")
plt.xlabel("X Value")
plt.ylabel("Y Values")
plt.legend()
plt.grid(True)
plt.show()


print("\n-------------Bar Chart-----------\n")


student = ["Kali","Meeta","Rishi"]
scores = [85,79,88]

plt.bar(student,scores,color ="orange")
plt.title("Student Score ")
plt.xlabel("x label")
plt.ylabel("Y label")
plt.show()

print("\n---------Horizzontal Bar Chart---------\n")

plt.barh(student,scores,color ="orange")
plt.title("Student Score ")
plt.xlabel("x label")
plt.ylabel("Y label")
plt.show()


print("\n------------Scatter Plot--------------\n")

np.random.seed(42)
x = np.random.randn(50)
y = np.random.randn(50)

print(x[:5])
print(x[:5])

plt.scatter(x,y,color="Purple")
plt.title("Scatter Plot")
plt.xlabel("Feature 1")
plt.ylabel("Feature 2")
plt.show()


print("\n------------Histogram-------------\n")

data =np.random.randn(1000)

plt.hist(data,bins = 30, color= "blue", edgecolor = "black")
plt.title("Hitogram")
plt.xlabel("Value")
plt.ylabel("Frequency")
plt.show()

print("\n------------Pie Chart-------------\n")

lables = ["Python","Java","C++","Go"]
sizes = [45,60,34,13]

plt.pie(sizes,labels=lables,autopct="%1.1f%%")
plt.title("Programming language Popularity")
plt.show()

print("\n------------Multiple Plot-------------\n")

x = np.linspace(0,10,100)
plt.figure(figsize=(10,4))
plt.subplot(1,2,1)
plt.plot(x,np.sin(x),"r--")
plt.title("Sine")
plt.subplot(1,2,2)
plt.plot(x,np.cos(x),"r--")
plt.title("Cosine")

plt.show()
